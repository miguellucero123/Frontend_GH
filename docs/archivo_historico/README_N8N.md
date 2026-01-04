# 🤖 n8n - Automatización del Sistema ERP

## 📖 ¿Qué es n8n?

**n8n** es una herramienta de automatización de flujos de trabajo (workflow automation) que permite:
- Conectar diferentes servicios y APIs
- Automatizar tareas repetitivas
- Procesar datos entre sistemas
- Crear workflows visuales sin código

## 🐳 Instalación con Docker

### Requisitos
- Docker Desktop instalado y corriendo

### Inicio Rápido
```bash
# Iniciar n8n
iniciar-n8n.bat

# O manualmente
docker-compose -f docker-compose.n8n.yml up -d
```

### Acceso
- **URL**: http://localhost:5678
- **Usuario**: `admin`
- **Contraseña**: `admin123` (cambiar en producción)

## 🔗 Integración con el Sistema

### Backend
El backend ya está configurado para trabajar con n8n:
- Endpoints en `/automation/*`
- Webhooks para recibir datos
- Disparo de eventos

### Frontend
El frontend tiene un servicio de automatización:
- `js/automation-service.js`
- Métodos para procesar archivos
- Verificar estado de n8n

## 📝 Workflows Principales

### 1. Procesar Excel de Proyecto
- Recibe archivo Excel desde el sistema
- Valida estructura y datos
- Transforma a formato JSON del proyecto
- Actualiza proyecto en la base de datos

### 2. Notificaciones Automáticas
- Recibe eventos del sistema (tarea completada, mensaje nuevo)
- Determina destinatarios según el evento
- Envía notificaciones personalizadas

### 3. Sincronización de Datos
- Sincroniza con sistemas externos
- Actualiza indicadores automáticamente
- Genera reportes programados

## 🛠️ Comandos Útiles

```bash
# Iniciar
iniciar-n8n.bat
# o
docker-compose -f docker-compose.n8n.yml up -d

# Ver logs
docker-compose -f docker-compose.n8n.yml logs -f

# Detener
detener-n8n.bat
# o
docker-compose -f docker-compose.n8n.yml down

# Reiniciar
docker-compose -f docker-compose.n8n.yml restart
```

## 📚 Documentación

- **Guía completa**: `n8n-docker-guide.md`
- **Setup**: `SETUP_N8N_DOCKER.md`
- **Workflows ejemplo**: `n8n-workflows-ejemplo.json`

## 🎯 Uso en FASE 6

n8n procesará automáticamente los archivos Excel/Word:
1. Usuario sube archivo en el sistema
2. Sistema envía archivo a n8n
3. n8n procesa y valida
4. n8n actualiza proyecto en backend
5. Sistema notifica al usuario

## ✅ Estado

- ✅ Docker Compose configurado
- ✅ Scripts de inicio creados
- ✅ Backend integrado
- ✅ Frontend preparado
- ✅ Documentación completa

## 🚀 Próximos Pasos

1. Iniciar n8n con `iniciar-n8n.bat`
2. Acceder a http://localhost:5678
3. Crear workflows según necesidades
4. Integrar con FASE 6

