from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.database import get_db, SessionLocal
from app.dependencies import get_current_user
from app.core.websockets import manager
from app.core.security import decode_token
from app.models.message import Message
from app.models.user import User
from app.models.project import Project
from app.schemas.message import MessageResponse

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)

# Endpoint REST para obtener historial
@router.get("/history/{project_id}", response_model=list[MessageResponse])
async def get_chat_history(
    project_id: int,
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener historial de mensajes de un proyecto"""
    # Verificar acceso al proyecto
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    if current_user.role.value == "cliente" and project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a este proyecto")
    
    messages = (
        db.query(Message)
        .filter(Message.project_id == project_id)
        .order_by(Message.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    
    # Enriquecer con nombre de usuario
    result = []
    for msg in messages:
        user = db.query(User).filter(User.id == msg.user_id).first()
        result.append({
            "id": msg.id,
            "content": msg.content,
            "user_id": msg.user_id,
            "user_name": user.full_name if user else "Usuario desconocido",
            "project_id": msg.project_id,
            "is_read": msg.is_read,
            "created_at": msg.created_at
        })
    
    return list(reversed(result))  # Orden cronológico

# Endpoint WebSocket
@router.websocket("/ws/{project_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    project_id: int,
    token: str = Query(...)  # JWT en query param
):
    """
    WebSocket para chat en tiempo real
    
    Formato de mensajes enviados por el cliente:
    {
        "type": "message" | "typing" | "read",
        "content": "texto del mensaje",
        "metadata": {}
    }
    
    Formato de mensajes recibidos del servidor:
    {
        "type": "message" | "system" | "error",
        "content": "texto",
        "user_id": 123,
        "user_name": "Juan Pérez",
        "timestamp": "2024-01-04T10:30:00",
        "message_id": 456
    }
    """
    
    # Autenticar usuario
    try:
        payload = decode_token(token)
        user_email = payload.get("sub")
        user = db.query(User).filter(User.email == user_email).first()
        
        if not user:
            await websocket.close(code=1008, reason="Usuario no autorizado")
            return
        
        # Verificar acceso al proyecto
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            await websocket.close(code=1008, reason="Proyecto no encontrado")
            return
        
        if user.role.value == "cliente" and project.client_id != user.id:
            await websocket.close(code=1008, reason="Sin acceso a este proyecto")
            return
        
    except Exception as e:
        logger.error(f"Error de autenticación WebSocket: {e}")
        await websocket.close(code=1008, reason=f"Error de autenticación: {str(e)}")
        return
    
    # Conectar al manager
    await manager.connect(websocket, project_id, user.id)
    
    try:
        while True:
            # Recibir mensaje del cliente
            data = await websocket.receive_json()
            message_type = data.get("type", "message")
            
            if message_type == "message":
                # Guardar mensaje en DB
                new_message = Message(
                    content=data["content"],
                    user_id=user.id,
                    project_id=project_id,
                    created_at=datetime.utcnow()
                )
                db.add(new_message)
                db.commit()
                db.refresh(new_message)
                
                # Preparar payload para broadcast
                message_payload = {
                    "type": "message",
                    "content": data["content"],
                    "user_id": user.id,
                    "user_name": user.full_name or user.email,
                    "timestamp": new_message.created_at.isoformat(),
                    "message_id": new_message.id
                }
                
                # Broadcast a todos en el proyecto (incluyendo remitente)
                await manager.broadcast(project_id, message_payload)
            
            elif message_type == "typing":
                # Notificar a otros que el usuario está escribiendo
                await manager.broadcast(
                    project_id,
                    {
                        "type": "typing",
                        "user_id": user.id,
                        "user_name": user.full_name or user.email,
                        "is_typing": data.get("is_typing", True)
                    },
                    exclude_ws=websocket
                )
            
            elif message_type == "read":
                # Marcar mensajes como leídos
                message_ids = data.get("message_ids", [])
                db.query(Message).filter(
                    Message.id.in_(message_ids),
                    Message.project_id == project_id
                ).update({"is_read": True}, synchronize_session=False)
                db.commit()
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast_system_message(
            project_id,
            f"{user.full_name or user.email} se desconectó"
        )
    
    except Exception as e:
        logger.error(f"Error en WebSocket: {e}")
        manager.disconnect(websocket)
    finally:
        db.close()

