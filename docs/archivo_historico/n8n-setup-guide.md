# Guía de Setup de n8n para ERP Constructora

## 📦 Instalación de n8n

### Opción 1: Docker (Recomendado)
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Opción 2: npm
```bash
npm install n8n -g
n8n start
```

### Opción 3: Docker Compose (Producción)
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:
```

## 🔗 Integración con Backend FastAPI

### Endpoint para Webhooks
```python
# backend/routers/automation.py
from fastapi import APIRouter, Webhook
from pydantic import BaseModel

router = APIRouter()

@router.post("/webhooks/n8n/project-update")
async def n8n_project_update(webhook: Webhook):
    # Procesar actualización desde n8n
    pass
```

### Endpoint para Enviar a n8n
```python
@router.post("/automation/trigger")
async def trigger_automation(event: str, data: dict):
    # Enviar evento a n8n
    import httpx
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://n8n:5678/webhook/erp-event",
            json={"event": event, "data": data}
        )
```

## 🔄 Workflows Propuestos

### Workflow 1: Procesar Excel de Proyecto
```
1. Webhook Trigger (recibe archivo)
2. Read Binary File
3. Parse Excel (usar node ExcelJS)
4. Validate Data
5. Transform to JSON
6. HTTP Request → Backend API
7. Send Notification
```

### Workflow 2: Notificaciones Automáticas
```
1. Webhook Trigger (evento del sistema)
2. Switch (tipo de evento)
3. Get Users (filtrar destinatarios)
4. Format Message
5. Send Email/SMS/Push
6. Log Result
```

## 📡 Configuración de Webhooks

### En n8n
1. Crear workflow
2. Agregar "Webhook" node
3. Configurar método POST
4. Copiar URL del webhook
5. Usar en backend para enviar eventos

### En Backend
```python
WEBHOOK_N8N_URL = "http://localhost:5678/webhook/procesar-excel"
```

## 🎯 Casos de Uso Inmediatos

1. **Procesar Excel de Proyectos**: Automatizar carga masiva
2. **Notificaciones**: Email/SMS automáticos
3. **Sincronización**: Con sistemas externos
4. **Reportes**: Generación automática
5. **Validación**: Validar datos antes de guardar

