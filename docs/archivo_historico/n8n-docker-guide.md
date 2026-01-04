# 🐳 Guía de n8n con Docker

## 📦 Requisitos Previos

1. **Docker Desktop** instalado y corriendo
   - Descargar desde: https://www.docker.com/products/docker-desktop
   - Verificar instalación: `docker --version`
   - Verificar que está corriendo: `docker info`

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Windows)
```bash
# Iniciar n8n
iniciar-n8n.bat

# Detener n8n
detener-n8n.bat
```

### Opción 2: Comandos Docker Manuales
```bash
# Iniciar n8n
docker-compose -f docker-compose.n8n.yml up -d

# Ver logs
docker-compose -f docker-compose.n8n.yml logs -f

# Detener n8n
docker-compose -f docker-compose.n8n.yml down

# Detener y eliminar datos
docker-compose -f docker-compose.n8n.yml down -v
```

## 🌐 Acceso a n8n

Una vez iniciado, accede a:
- **URL**: http://localhost:5678
- **Usuario**: `admin`
- **Contraseña**: `admin123` (cambiar en producción)

## 🔧 Configuración

### Variables de Entorno

Puedes crear un archivo `.env` en el mismo directorio que `docker-compose.n8n.yml`:

```env
# Contraseña de n8n
N8N_PASSWORD=tu_password_seguro

# Contraseña de PostgreSQL
N8N_DB_PASSWORD=tu_password_db_seguro

# Clave de encriptación (generar una aleatoria)
N8N_ENCRYPTION_KEY=tu_clave_encriptacion_aleatoria
```

### Generar Clave de Encriptación

```bash
# En Linux/Mac
openssl rand -base64 32

# En Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## 📊 Estructura de Contenedores

```
erp-n8n (n8n)
    ├── Puerto: 5678
    ├── Depende de: postgres, redis
    └── Volúmenes: n8n_data, n8n_workflows, n8n_temp

erp-n8n-db (PostgreSQL)
    ├── Puerto: 5432 (interno)
    └── Volumen: n8n_postgres_data

erp-n8n-redis (Redis)
    ├── Puerto: 6379 (interno)
    └── Volumen: n8n_redis_data
```

## 🔍 Verificar Estado

### Verificar que los contenedores están corriendo
```bash
docker ps
```

Deberías ver:
- `erp-n8n`
- `erp-n8n-db`
- `erp-n8n-redis`

### Ver logs de n8n
```bash
docker-compose -f docker-compose.n8n.yml logs -f n8n
```

### Verificar salud de los servicios
```bash
# n8n
curl http://localhost:5678/healthz

# PostgreSQL
docker exec erp-n8n-db pg_isready -U n8n

# Redis
docker exec erp-n8n-redis redis-cli ping
```

## 🔗 Integración con Backend

### Configurar Backend para conectar con n8n

En `backend/.env` o variables de entorno:
```env
N8N_BASE_URL=http://localhost:5678
N8N_ENABLED=true
```

### Probar Conexión

```bash
# Desde el backend
curl http://localhost:5678/healthz
```

## 📝 Workflows Básicos

### 1. Webhook para Procesar Excel
- Crear workflow en n8n
- Agregar nodo "Webhook" (POST)
- Agregar nodo "Read Binary File"
- Agregar nodo "Parse Excel"
- Agregar nodo "HTTP Request" → Backend API

### 2. Notificaciones Automáticas
- Crear workflow en n8n
- Agregar nodo "Webhook" (POST)
- Agregar nodo "Switch" (tipo de evento)
- Agregar nodo "Send Email" o "HTTP Request"

## 🛠️ Solución de Problemas

### Problema: Puerto 5678 ya en uso
```bash
# Cambiar puerto en docker-compose.n8n.yml
ports:
  - "5679:5678"  # Cambiar 5678 por 5679
```

### Problema: Contenedores no inician
```bash
# Ver logs detallados
docker-compose -f docker-compose.n8n.yml logs

# Reiniciar contenedores
docker-compose -f docker-compose.n8n.yml restart
```

### Problema: Perdí mi contraseña
```bash
# Acceder al contenedor
docker exec -it erp-n8n sh

# Reiniciar n8n sin autenticación (temporal)
# Editar docker-compose.n8n.yml y cambiar:
# N8N_BASIC_AUTH_ACTIVE=false
```

### Problema: Datos no persisten
```bash
# Verificar volúmenes
docker volume ls | grep n8n

# Verificar montaje
docker inspect erp-n8n | grep -A 10 Mounts
```

## 🔒 Seguridad en Producción

1. **Cambiar contraseña por defecto**
   ```env
   N8N_PASSWORD=contraseña_segura_compleja
   ```

2. **Generar clave de encriptación**
   ```env
   N8N_ENCRYPTION_KEY=clave_aleatoria_32_caracteres
   ```

3. **Usar HTTPS** (configurar reverse proxy)

4. **Restringir acceso** (firewall, VPN)

5. **Backup regular** de volúmenes
   ```bash
   docker run --rm -v erp-n8n-data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz /data
   ```

6. **Habilitar protección CSRF**
   - Configurar el middleware de CSRF en el backend.
   - Asegurarse de que todas las solicitudes POST incluyan un token CSRF válido.

7. **Auditoría de Seguridad**
   - Implementar logs de auditoría para rastrear accesos y cambios críticos.

## 📦 Backup y Restauración

### Backup
```bash
# Backup de datos de n8n
docker run --rm -v erp-n8n-data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-data-backup.tar.gz /data

# Backup de base de datos
docker exec erp-n8n-db pg_dump -U n8n n8n > n8n-db-backup.sql
```

### Restauración
```bash
# Restaurar datos
docker run --rm -v erp-n8n-data:/data -v $(pwd):/backup alpine tar xzf /backup/n8n-data-backup.tar.gz -C /

# Restaurar base de datos
docker exec -i erp-n8n-db psql -U n8n n8n < n8n-db-backup.sql
```

## 🎯 Próximos Pasos

1. ✅ Iniciar n8n con Docker
2. ✅ Acceder a http://localhost:5678
3. ✅ Crear primer workflow
4. ✅ Configurar webhooks
5. ✅ Integrar con backend

## 📚 Recursos Adicionales

- Documentación oficial: https://docs.n8n.io
- Comunidad: https://community.n8n.io
- Workflows de ejemplo: https://n8n.io/workflows

