# 🐳 Setup Completo de n8n con Docker

## ✅ Archivos Creados

### 1. Configuración Docker
- ✅ `docker-compose.n8n.yml` - Configuración completa con PostgreSQL y Redis
- ✅ `.env.n8n.example` - Ejemplo de variables de entorno

### 2. Scripts de Inicio
- ✅ `iniciar-n8n.bat` - Script para iniciar n8n (Windows)
- ✅ `detener-n8n.bat` - Script para detener n8n (Windows)

### 3. Documentación
- ✅ `n8n-docker-guide.md` - Guía completa de uso
- ✅ `n8n-workflows-ejemplo.json` - Ejemplos de workflows
- ✅ `SETUP_N8N_DOCKER.md` - Este archivo

## 🚀 Inicio Rápido

### Paso 1: Verificar Docker
```bash
docker --version
docker info
```

### Paso 2: Iniciar n8n
```bash
# Opción A: Script automático (Windows)
iniciar-n8n.bat

# Opción B: Comando manual
docker-compose -f docker-compose.n8n.yml up -d
```

### Paso 3: Acceder a n8n
- URL: http://localhost:5678
- Usuario: `admin`
- Contraseña: `admin123`

## 📋 Estructura de Servicios

```
n8n (Puerto 5678)
    ├── PostgreSQL (Base de datos)
    └── Redis (Cola de trabajos)
```

## 🔧 Configuración Inicial

### 1. Cambiar Contraseña
1. Acceder a http://localhost:5678
2. Ir a Settings → Users
3. Cambiar contraseña del usuario admin

### 2. Configurar Variables de Entorno
Crear archivo `.env.n8n`:
```env
N8N_PASSWORD=tu_password_seguro
N8N_DB_PASSWORD=tu_password_db
N8N_ENCRYPTION_KEY=clave_aleatoria_32_chars
```

### 3. Crear Primer Workflow
1. Click en "Add workflow"
2. Agregar nodo "Webhook"
3. Configurar método POST
4. Guardar workflow
5. Copiar URL del webhook

## 🔗 Integración con Backend

### Backend ya está configurado
- ✅ Router de automatización creado (`backend/routers/automation.py`)
- ✅ Endpoints listos para n8n
- ✅ Integrado en `main.py`

### Variables de Entorno del Backend
```env
N8N_BASE_URL=http://localhost:5678
N8N_ENABLED=true
```

## 📝 Workflows Recomendados

### 1. Procesar Excel de Proyecto
- Recibe archivo Excel
- Valida estructura
- Transforma a JSON
- Actualiza proyecto en backend

### 2. Notificaciones Automáticas
- Recibe eventos del sistema
- Determina destinatarios
- Envía notificaciones (Email/SMS)

### 3. Sincronización de Datos
- Sincroniza con sistemas externos
- Actualiza indicadores
- Genera reportes

## 🎯 Próximos Pasos

1. ✅ Iniciar n8n con Docker
2. ✅ Acceder y configurar
3. ✅ Crear workflows básicos
4. ✅ Integrar con backend
5. ✅ Probar procesamiento de Excel

## 🛠️ Comandos Útiles

```bash
# Ver logs
docker-compose -f docker-compose.n8n.yml logs -f

# Reiniciar
docker-compose -f docker-compose.n8n.yml restart

# Detener
docker-compose -f docker-compose.n8n.yml down

# Ver estado
docker ps | grep n8n

# Backup
docker run --rm -v erp-n8n-data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz /data
```

## ✅ Estado Actual

- ✅ Docker Compose configurado
- ✅ Scripts de inicio creados
- ✅ Documentación completa
- ✅ Backend integrado
- ✅ Listo para usar

## 🎉 ¡Listo!

n8n está configurado y listo para usar. Puedes:
1. Iniciar con `iniciar-n8n.bat`
2. Acceder a http://localhost:5678
3. Crear workflows
4. Integrar con el sistema ERP

¿Necesitas ayuda con algún paso específico?

