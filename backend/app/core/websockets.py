from typing import Dict, List
from fastapi import WebSocket
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Gestiona conexiones WebSocket por proyecto (room-based)"""
    
    def __init__(self):
        # Estructura: {project_id: [WebSocket1, WebSocket2, ...]}
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # Mapeo inverso: {websocket: (project_id, user_id)}
        self.connection_metadata: Dict[WebSocket, tuple[int, int]] = {}
    
    async def connect(self, websocket: WebSocket, project_id: int, user_id: int):
        """Conectar usuario a una sala de proyecto"""
        await websocket.accept()
        
        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
        
        self.active_connections[project_id].append(websocket)
        self.connection_metadata[websocket] = (project_id, user_id)
        
        logger.info(f"Usuario {user_id} conectado al proyecto {project_id}")
        
        # Notificar a otros usuarios que alguien se conectó
        await self.broadcast_system_message(
            project_id, 
            f"Usuario conectado",
            exclude_ws=websocket
        )
    
    def disconnect(self, websocket: WebSocket):
        """Desconectar usuario"""
        if websocket not in self.connection_metadata:
            return
        
        project_id, user_id = self.connection_metadata[websocket]
        
        if project_id in self.active_connections:
            try:
                self.active_connections[project_id].remove(websocket)
            except ValueError:
                pass
            
            # Limpiar sala vacía
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]
        
        del self.connection_metadata[websocket]
        logger.info(f"Usuario {user_id} desconectado del proyecto {project_id}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Enviar mensaje a un websocket específico"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error enviando mensaje personal: {e}")
    
    async def broadcast(self, project_id: int, message: dict, exclude_ws: WebSocket = None):
        """Enviar mensaje a todos en un proyecto (excepto remitente si se especifica)"""
        if project_id not in self.active_connections:
            return
        
        disconnected = []
        
        for connection in self.active_connections[project_id]:
            if exclude_ws and connection == exclude_ws:
                continue
            
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error en broadcast: {e}")
                disconnected.append(connection)
        
        # Limpiar conexiones muertas
        for ws in disconnected:
            self.disconnect(ws)
    
    async def broadcast_system_message(
        self, 
        project_id: int, 
        content: str, 
        exclude_ws: WebSocket = None
    ):
        """Enviar mensaje del sistema"""
        await self.broadcast(
            project_id,
            {
                "type": "system",
                "content": content,
                "timestamp": datetime.utcnow().isoformat()
            },
            exclude_ws
        )
    
    def get_active_users(self, project_id: int) -> int:
        """Contar usuarios activos en un proyecto"""
        return len(self.active_connections.get(project_id, []))

# Instancia global
manager = ConnectionManager()

