# 🚀 Guía Rápida - Iniciar Servidor Backend

## Pasos para Iniciar el Servidor

### 1. Abrir Terminal en la Carpeta Backend
```bash
cd C:\Users\Alicia_Piero\Documents\Repo_AIEP\ERP_Costructora\frontend\backend
```

### 2. Verificar que las Dependencias Estén Instaladas
```bash
pip list | findstr fastapi
pip list | findstr jose
pip list | findstr passlib
```

Si falta alguna, instalar:
```bash
pip install -r requirements.txt
```

### 3. Iniciar el Servidor
```bash
uvicorn main:app --reload
```

O con Python:
```bash
python -m uvicorn main:app --reload
```

### 4. Verificar que Esté Funcionando
Deberías ver algo como:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXX] using WatchFiles
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 5. Acceder a la Documentación
Abre en tu navegador:
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## ⚠️ Solución de Problemas

### Error: "ModuleNotFoundError"
```bash
# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "Address already in use"
```bash
# Usar otro puerto
uvicorn main:app --reload --port 8001
```

### Error: "No module named 'routers'"
```bash
# Verificar que estés en la carpeta correcta
cd backend
```

---

## 📊 Endpoints Disponibles

Una vez iniciado, tendrás acceso a:

### Autenticación:
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/approve` - Aprobar usuario (JEFE)
- `GET /api/auth/pending` - Usuarios pendientes (JEFE)
- `GET /api/auth/users` - Listar usuarios (JEFE)

### Proyectos (Legacy):
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/{id}/tasks` - Tareas de proyecto

---

## 🧪 Probar con Postman/Thunder Client

### 1. Registrar Usuario:
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "nombre": "Admin Principal",
  "email": "admin@constructoragyh.cl",
  "password": "admin123",
  "telefono": "+56912345678",
  "rol": "jefe"
}
```

### 2. Aprobar Usuario (necesitas crear un JEFE primero):
Primero crea el usuario JEFE directamente en la base de datos o apruébalo manualmente.

### 3. Login:
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@constructoragyh.cl&password=admin123
```

Respuesta:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "nombre": "Admin Principal",
    "email": "admin@constructoragyh.cl",
    "rol": "jefe",
    "estado": "approved"
  }
}
```

### 4. Usar el Token:
```http
GET http://localhost:8000/api/auth/me
Authorization: Bearer eyJ...
```

---

## 📝 Notas Importantes

1. **Base de Datos**: Las tablas se crean automáticamente al iniciar el servidor
2. **CORS**: Ya está configurado para localhost:5173, 5174, 3000
3. **Puerto**: Por defecto usa el 8000
4. **Reload**: El servidor se recarga automáticamente al guardar cambios

---

## ✅ Checklist de Inicio

- [ ] Terminal abierta en carpeta `backend`
- [ ] Dependencias instaladas
- [ ] Servidor iniciado sin errores
- [ ] Documentación accesible en /docs
- [ ] Frontend corriendo en localhost:5173

---

**Última actualización**: 23/12/2025 - 22:11 hrs
