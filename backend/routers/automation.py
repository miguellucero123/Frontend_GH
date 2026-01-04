"""
Router para integración con n8n y automatización
"""

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import Optional
import httpx
import os
from datetime import datetime

import database
from auth import get_current_active_user
from models import User

router = APIRouter(prefix="/automation", tags=["automation"])
security = HTTPBearer()

# Configuración de n8n
N8N_BASE_URL = os.getenv("N8N_BASE_URL", "http://localhost:5678")
N8N_ENABLED = os.getenv("N8N_ENABLED", "true").lower() == "true"


@router.get("/status")
async def get_automation_status(
    current_user: User = Depends(get_current_active_user)
):
    """
    Verificar estado de n8n y automatización
    Solo para gerencia
    """
    if current_user.rol.value != "jefe":
        raise HTTPException(status_code=403, detail="Solo gerencia puede ver estado de automatización")
    
    if not N8N_ENABLED:
        return {
            "enabled": False,
            "reason": "Automation disabled in configuration"
        }
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{N8N_BASE_URL}/health")
            return {
                "enabled": True,
                "n8n_available": response.status_code == 200,
                "n8n_url": N8N_BASE_URL
            }
    except Exception as e:
        return {
            "enabled": True,
            "n8n_available": False,
            "error": str(e)
        }


@router.post("/trigger/{event_type}")
async def trigger_automation_event(
    event_type: str,
    data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """
    Disparar evento para automatización en n8n
    """
    if not N8N_ENABLED:
        raise HTTPException(status_code=503, detail="Automation is disabled")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{N8N_BASE_URL}/webhook/trigger-event",
                json={
                    "event": event_type,
                    "data": data,
                    "user_id": current_user.id,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
            response.raise_for_status()
            return {"success": True, "message": "Event triggered successfully"}
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Error connecting to n8n: {str(e)}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"n8n error: {e.response.text}")


@router.post("/webhook/n8n/project-update")
async def n8n_project_update(webhook_data: dict):
    """
    Webhook para recibir actualizaciones de proyectos desde n8n
    """
    # Validar que viene de n8n (usar token secreto en producción)
    # Por ahora, aceptar todas las peticiones
    
    try:
        project_id = webhook_data.get("project_id")
        updates = webhook_data.get("updates", {})
        
        # Aquí se actualizaría el proyecto en la base de datos
        # Por ahora, solo retornar éxito
        
        return {
            "success": True,
            "message": "Project updated from n8n",
            "project_id": project_id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing webhook: {str(e)}")


@router.post("/process-excel")
async def process_excel_automation(
    file: UploadFile = File(...),
    project_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user)
):
    """
    Procesar archivo Excel a través de n8n
    Solo para gerencia
    """
    if current_user.rol.value != "jefe":
        raise HTTPException(status_code=403, detail="Solo gerencia puede procesar archivos")
    
    if not N8N_ENABLED:
        raise HTTPException(status_code=503, detail="Automation is disabled")
    
    try:
        # Leer archivo
        file_content = await file.read()
        
        # Enviar a n8n para procesamiento
        async with httpx.AsyncClient(timeout=30.0) as client:
            files = {"file": (file.filename, file_content, file.content_type)}
            data = {"project_id": project_id} if project_id else {}
            
            response = await client.post(
                f"{N8N_BASE_URL}/webhook/process-excel",
                files=files,
                data=data
            )
            response.raise_for_status()
            
            result = response.json()
            return {
                "success": True,
                "message": "File processed successfully",
                "data": result
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Error connecting to n8n: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

