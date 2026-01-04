# ⚙️ Configuración Backend - Solución de Problemas

## 🐛 Problema: "Conectando..." o Error de Login

### Diagnóstico

El problema más común es un **desajuste de puertos** entre frontend y backend:

- **Backend:** Corre en puerto **8002** (según `run_server.py`)
- **Frontend:** Está configurado para puerto **8000** (según `config.js`)

## ✅ Solución Implementada

### 1. Configuración Actualizada

He actualizado `frontend/js/config.js` para usar el puerto correcto:

```javascript
API_BASE_URL: 'http://localhost:8002/api',  // ✅ Puerto 8002
DEMO_MODE: false,  // ✅ Desactivado para usar backend real
```

### 2. Verificar que el Backend Esté Corriendo

```bash
# En la carpeta backend
cd frontend/backend
python run_server.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8002
INFO:     Application startup complete.
```

### 3. Verificar Conectividad

Abre en tu navegador:
- **API Docs:** http://localhost:8002/docs
- **Health Check:** http://localhost:8002/

Si no carga, el servidor no está corriendo.

### 4. Resetear Contraseña de Admin

Si el login falla, ejecuta:

```bash
cd frontend/backend
python reset_admin_password.py
```

Esto asegura que:
- El usuario `admin@constructora.com` existe
- La contraseña es `admin123`
- El estado es `APPROVED`

## 🔧 Configuración Completa

### Frontend (`frontend/js/config.js`)

```javascript
API_BASE_URL: 'http://localhost:8002/api',
DEMO_MODE: false,  // false = usar backend real
```

### Backend (`frontend/backend/run_server.py`)

```python
uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
```

## 🚀 Pasos para Iniciar el Sistema

### 1. Iniciar Backend

```bash
cd frontend/backend
python run_server.py
```

Espera a ver: `INFO: Application startup complete.`

### 2. Abrir Frontend

Abre `frontend/index.html` en tu navegador.

### 3. Iniciar Sesión

- **Email:** `admin@constructora.com`
- **Contraseña:** `admin123`

## 🐛 Solución de Problemas

### Error: "Network Error" o "Conectando..."

**Causa:** Backend no está corriendo o puerto incorrecto

**Solución:**
1. Verifica que el backend esté corriendo en puerto 8002
2. Verifica que `config.js` tenga `API_BASE_URL: 'http://localhost:8002/api'`
3. Verifica que `DEMO_MODE: false`

### Error: "401 Unauthorized"

**Causa:** Credenciales incorrectas o usuario no aprobado

**Solución:**
1. Ejecuta `python reset_admin_password.py`
2. Verifica que uses `admin@constructora.com` / `admin123`

### Error: "CORS Error"

**Causa:** Backend no permite requests del frontend

**Solución:**
Verifica que `main.py` tenga CORS configurado:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, usar dominio específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error: "Database Error"

**Causa:** Base de datos no inicializada o corrupta

**Solución:**
```bash
cd frontend/backend
python -c "from database import init_db; init_db()"
python reset_admin_password.py
```

## 📝 Checklist de Verificación

- [ ] Backend corriendo en puerto 8002
- [ ] `config.js` tiene `API_BASE_URL: 'http://localhost:8002/api'`
- [ ] `config.js` tiene `DEMO_MODE: false`
- [ ] Usuario admin existe y está aprobado
- [ ] Contraseña de admin es `admin123`
- [ ] CORS configurado en backend
- [ ] Base de datos inicializada

## 🔄 Cambiar de Puerto

Si necesitas cambiar el puerto del backend:

### 1. Actualizar `run_server.py`:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)  # Nuevo puerto
```

### 2. Actualizar `config.js`:
```javascript
API_BASE_URL: 'http://localhost:8003/api',  // Mismo puerto
```

---

**Última actualización:** Configuración sincronizada - Frontend puerto 8002, DEMO_MODE desactivado

