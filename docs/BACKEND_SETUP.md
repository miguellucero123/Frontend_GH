# 🚀 Guía de Configuración del Backend

## 📋 Estructura Creada

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── config.py            # Configuración con Pydantic Settings
│   ├── database.py          # SQLAlchemy setup
│   ├── dependencies.py       # Dependencies para autenticación
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py          # Endpoints de autenticación
│   │   ├── projects.py      # CRUD de proyectos
│   │   ├── files.py          # Gestión de archivos
│   │   └── chat.py          # WebSockets y chat
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py      # JWT, bcrypt, tokens
│   │   └── websockets.py    # ConnectionManager
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # Modelo User
│   │   ├── project.py       # Modelo Project
│   │   ├── file.py          # Modelo File
│   │   └── message.py       # Modelo Message
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py          # Schemas de autenticación
│   │   ├── project.py       # Schemas de proyectos
│   │   └── message.py       # Schemas de mensajes
│   └── utils/
│       ├── __init__.py
│       └── file_handler.py  # Manejo de archivos
├── scripts/
│   ├── __init__.py
│   └── seed_db.py           # Script para poblar BD
├── alembic/                 # Migraciones
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## 🔧 Instalación

### Opción 1: Docker (Recomendado)

```bash
cd backend

# Crear archivo .env
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar con Docker Compose
docker-compose up -d

# Ejecutar migraciones
docker-compose exec backend alembic upgrade head

# Sembrar datos de prueba
docker-compose exec backend python -m scripts.seed_db
```

### Opción 2: Local (Desarrollo)

```bash
cd backend

# Crear entorno virtual
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar PostgreSQL
# Crear base de datos: erp_construccion
# Usuario: erp_user
# Password: erp_password_2024

# Crear archivo .env
cp .env.example .env
# Editar .env con DATABASE_URL

# Ejecutar migraciones
alembic upgrade head

# Sembrar datos
python -m scripts.seed_db

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📝 Endpoints Disponibles

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Refrescar token

### Proyectos
- `GET /api/v1/projects/` - Listar proyectos
- `GET /api/v1/projects/{id}` - Obtener proyecto
- `POST /api/v1/projects/` - Crear proyecto (solo jefe)
- `PUT /api/v1/projects/{id}` - Actualizar proyecto (solo jefe)
- `DELETE /api/v1/projects/{id}` - Eliminar proyecto (solo jefe)

### Archivos
- `GET /api/v1/files/project/{project_id}` - Listar archivos
- `POST /api/v1/files/upload/{project_id}` - Subir archivo
- `GET /api/v1/files/download/{file_id}` - Descargar archivo
- `DELETE /api/v1/files/{file_id}` - Eliminar archivo

### Chat
- `GET /api/v1/chat/history/{project_id}` - Historial de mensajes
- `WS /api/v1/chat/ws/{project_id}?token=JWT` - WebSocket para chat

## 🔐 Credenciales de Prueba

Después de ejecutar `seed_db.py`:

- **Jefe:** `jefe@construccion.cl` / `Jefe123456`
- **Cliente 1:** `cliente1@gmail.com` / `Cliente123456`
- **Cliente 2:** `cliente2@gmail.com` / `Cliente123456`

## 🧪 Testing

```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jefe@construccion.cl", "password": "Jefe123456"}'

# Listar proyectos (requiere token)
curl http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Documentación API

Con el servidor corriendo, visita:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🐳 Docker Commands

```bash
# Ver logs
docker-compose logs -f backend

# Detener
docker-compose down

# Reconstruir
docker-compose build --no-cache

# Acceder al contenedor
docker-compose exec backend bash
```

## ⚠️ Notas Importantes

1. **SECRET_KEY**: Cambiar en producción (usar `openssl rand -hex 32`)
2. **DATABASE_URL**: Configurar correctamente en `.env`
3. **ALLOWED_ORIGINS**: Agregar URLs del frontend
4. **Uploads**: Los archivos se guardan en `/app/uploads` (Docker) o `./uploads` (local)

