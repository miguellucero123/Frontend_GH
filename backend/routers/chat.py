from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, auth
from ws_manager import manager
from datetime import datetime

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"]
)

# --- REST Endpoints (Historial y Usuarios) ---

@router.get("/users", response_model=List[schemas.User])
def get_chat_users(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(database.get_db)
):
    """Obtiene lista de usuarios para chatear (excluyendo al usuario actual)"""
    users = db.query(models.User).filter(
        models.User.id != current_user.id,
        models.User.estado == models.UserStatus.APPROVED
    ).all()
    return users

@router.get("/history/{other_user_id}", response_model=List[schemas.Message])
def get_chat_history(
    other_user_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(database.get_db)
):
    """Obtiene el historial de mensajes entre el usuario actual y otro usuario"""
    messages = db.query(models.Message).filter(
        ((models.Message.remitente_id == current_user.id) & (models.Message.destinatario_id == other_user_id)) |
        ((models.Message.remitente_id == other_user_id) & (models.Message.destinatario_id == current_user.id))
    ).order_by(models.Message.fecha_envio).all()
    return messages

# --- WebSocket Endpoint ---

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(database.get_db)
):
    # 1. Autenticación manual del WebSocket
    try:
        user = auth.get_user_from_token(token, db)
        if not user:
            await websocket.close(code=4003) # Forbidden
            return
    except Exception:
        await websocket.close(code=4003)
        return

    # 2. Conexión
    await manager.connect(websocket, user.id)
    
    try:
        while True:
            # 3. Recibir mensaje
            data = await websocket.receive_text()
            # Formato esperado: {"to_user_id": 123, "content": "Hola"}
            import json
            message_data = json.loads(data)
            
            to_user_id = message_data.get("to_user_id")
            content = message_data.get("content")
            
            if to_user_id and content:
                # 4. Guardar en BD
                new_msg = models.Message(
                    remitente_id=user.id,
                    destinatario_id=to_user_id,
                    contenido=content,
                    # proyecto_id es obligatorio en el modelo actual, 
                    # para chat directo 'global' podríamos necesitar un proyecto dummy o hacer el campo opcional.
                    # Por ahora, asignaremos al proyecto '1' o manejaremos chat por proyecto.
                    # REVISIÓN: El modelo Message tiene proyecto_id nullable=False?
                    # models.py Line 160: proyecto_id = Column(..., nullable=False)
                    # Esto es un problema para chat directo entre usuarios no ligado a proyectos.
                    # Solución temporal: Asignar a un proyecto "General" (ID 1) si existe, o cambiar modelo.
                    # Vamos a asumir que el chat es "Global" por ahora y usaremos proyecto_id=1.
                    # Idealmente deberíamos hacer proyecto_id nullable para DMs.
                    proyecto_id=1 
                )
                db.add(new_msg)
                db.commit()
                db.refresh(new_msg)
                
                # 5. Enviar al destinatario (si está conectado)
                response_data = {
                    "type": "new_message",
                    "message": {
                        "id": new_msg.id,
                        "remitente_id": new_msg.remitente_id,
                        "destinatario_id": new_msg.destinatario_id,
                        "contenido": new_msg.contenido,
                        "fecha_envio": new_msg.fecha_envio.isoformat(),
                        "leido": new_msg.leido
                    }
                }
                await manager.send_personal_message(json.dumps(response_data), to_user_id)
                
                # Confirmación al remitente (para actualizar UI instantáneamente si se quiere doble check)
                # await manager.send_personal_message(json.dumps({"type": "message_sent", "temp_id": ...}), user.id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)
    except Exception as e:
        print(f"Error en websocket: {e}")
        try:
            manager.disconnect(websocket, user.id)
        except:
            pass
