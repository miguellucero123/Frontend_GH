# 🌐 Guía de Hosts y Puertos - Configuración Completa

## 📍 Resumen Rápido

| Componente | Host | Puerto | URL Completa |
|------------|------|--------|--------------|
| **Backend (FastAPI)** | `localhost` o `0.0.0.0` | `8002` | `http://localhost:8002` |
| **Frontend Vite (React)** | `localhost` | `5174` | `http://localhost:5174` |
| **Frontend Vanilla JS** | `localhost` | `8080` (opcional) | `http://localhost:8080` |

---

## 🎯 Configuración por Escenario

### Escenario 1: Desarrollo Local (Recomendado)

#### Backend
```python
# frontend/backend/run_server.py
uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
```
- **Host:** `0.0.0.0` (acepta conexiones de cualquier interfaz)
- **Puerto:** `8002`
- **URL:** `http://localhost:8002`
- **API Docs:** `http://localhost:8002/docs`

#### Frontend React/Vite
```bash
cd frontend/app
npm run dev
```
- **Host:** `localhost` (automático con Vite)
- **Puerto:** `5174` (configurado, o siguiente disponible si está ocupado)
- **URL:** `http://localhost:5174`

#### Frontend Vanilla JS
```bash
cd frontend
python -m http.server 8080
```
- **Host:** `localhost`
- **Puerto:** `8080` (o cualquier puerto disponible)
- **URL:** `http://localhost:8080`

---

### Escenario 2: Desarrollo con IP Local (Acceso desde otros dispositivos)

#### Backend
```python
# Ya configurado con host="0.0.0.0"
# Accesible desde:
# - http://localhost:8002
# - http://192.168.1.X:8002 (tu IP local)
```

#### Frontend Vite
```bash
cd frontend/app
npm run dev -- --host
# O específicamente:
npm run dev -- --host 0.0.0.0
```
- **Host:** `0.0.0.0` (accesible desde red local)
- **Puerto:** `5174` (o el que Vite asigne)
- **URL:** `http://localhost:5174` o `http://192.168.1.X:5174`

---

### Escenario 3: Producción

#### Backend
```python
# En producción, usar servidor web (nginx, etc.)
# O directamente:
uvicorn.run("main:app", host="0.0.0.0", port=8002)
```
- **Host:** `0.0.0.0` o IP del servidor
- **Puerto:** `8002` (o el que configure tu servidor)
- **URL:** `https://api.tudominio.com` (con dominio)

#### Frontend
```bash
# Build para producción
cd frontend/app
npm run build
# Servir con nginx, Apache, o servidor estático
```
- **Host:** Dominio de producción
- **Puerto:** `80` (HTTP) o `443` (HTTPS)
- **URL:** `https://tudominio.com`

---

## ⚙️ Configuración en Código

### Frontend Vanilla JS

**Archivo:** `frontend/js/config.js`
```javascript
const CONFIG = {
    // Desarrollo local
    API_BASE_URL: 'http://localhost:8002/api',
    
    // Producción (cambiar cuando despliegues)
    // API_BASE_URL: 'https://api.tudominio.com/api',
    
    WS_BASE_URL: null, // null = construir desde API_BASE_URL
};
```

### Frontend React/Vite

**Archivo:** `frontend/app/src/services/apiClient.ts`
```typescript
// Desarrollo local
const API_URL = 'http://localhost:8002/api';

// Producción (usar variable de entorno)
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api';
```

**Archivo:** `frontend/app/src/services/api.ts`
```typescript
// Desarrollo local
export const API_URL = 'http://localhost:8002/api';
```

**Archivo:** `frontend/app/src/services/chatService.ts`
```typescript
// Desarrollo local
const host = 'localhost:8002';

// Producción (usar variable de entorno)
// const host = import.meta.env.VITE_WS_HOST || 'localhost:8002';
```

### Backend

**Archivo:** `frontend/backend/main.py`
```python
# CORS - Agregar tus hosts aquí
origins = [
    "http://localhost:5173",      # Vite dev (original)
    "http://localhost:5174",      # Vite dev (actual)
    "http://localhost:5175",      # Vite dev alternativo
    "http://localhost:3000",      # Otros servidores dev
    "http://localhost:8080",     # Vanilla JS
    # Producción
    # "https://tudominio.com",
    # "https://www.tudominio.com",
]
```

**Archivo:** `frontend/backend/run_server.py`
```python
# Desarrollo
uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

# Producción (sin reload)
# uvicorn.run("main:app", host="0.0.0.0", port=8002)
```

---

## 🔧 Variables de Entorno (Recomendado para Producción)

### Frontend React/Vite

Crear archivo: `frontend/app/.env.development`
```env
VITE_API_URL=http://localhost:8002/api
VITE_WS_HOST=localhost:8002
```

Crear archivo: `frontend/app/.env.production`
```env
VITE_API_URL=https://api.tudominio.com/api
VITE_WS_HOST=api.tudominio.com
```

Luego en el código:
```typescript
// frontend/app/src/services/apiClient.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api';
```

---

## 📋 Checklist de Configuración

### Para Desarrollo Local

- [ ] Backend corriendo en `http://localhost:8002`
- [ ] Frontend Vite corriendo en `http://localhost:5174` (o puerto asignado)
- [ ] CORS configurado en backend para múltiples puertos (5173, 5174, 5175, etc.)
- [ ] `API_BASE_URL` apunta a `http://localhost:8002/api`
- [ ] WebSocket apunta a `localhost:8002`

### Para Acceso desde Red Local

- [ ] Backend con `host="0.0.0.0"`
- [ ] Frontend Vite con `--host` flag
- [ ] Firewall permite puertos 8002 y 5173
- [ ] CORS incluye IPs de la red local

### Para Producción

- [ ] Backend en servidor con dominio
- [ ] Frontend build generado (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] CORS solo permite dominios de producción
- [ ] HTTPS configurado (SSL/TLS)

---

## 🚀 Comandos Rápidos

### Desarrollo Local (Recomendado)
```bash
# Terminal 1: Backend
cd frontend/backend
python run_server.py
# Backend en: http://localhost:8002

# Terminal 2: Frontend
cd frontend/app
npm run dev
# Frontend en: http://localhost:5174 (o el puerto que Vite muestre)
```

### Desarrollo con Acceso desde Red
```bash
# Terminal 1: Backend (ya usa 0.0.0.0)
cd frontend/backend
python run_server.py
# Accesible desde: http://TU_IP:8002

# Terminal 2: Frontend
cd frontend/app
npm run dev -- --host
# Accesible desde: http://TU_IP:5174 (o el puerto que Vite muestre)
```

### Verificar IP Local
```bash
# Windows
ipconfig
# Buscar "IPv4 Address"

# Linux/Mac
ifconfig
# O
ip addr show
```

---

## ⚠️ Notas Importantes

### Host `0.0.0.0` vs `localhost`

- **`0.0.0.0`**: Acepta conexiones de cualquier interfaz de red
  - Útil para desarrollo con acceso desde otros dispositivos
  - Útil para producción en servidores
  
- **`localhost` o `127.0.0.1`**: Solo acepta conexiones locales
  - Más seguro para desarrollo local
  - No accesible desde otros dispositivos

### Puertos Comunes

- **8002**: Backend FastAPI (configurado)
- **5174**: Vite dev server (configurado, o siguiente disponible)
- **8080**: Servidor HTTP simple (opcional)
- **3000**: Otros servidores dev (React, Next.js, etc.)

### CORS

El backend debe tener configurado CORS para aceptar requests del frontend:
- Desarrollo: `http://localhost:5174` (o el puerto que Vite asigne)
- Producción: `https://tudominio.com`

---

## 🎯 Resumen: Qué Host Usar

### **Desarrollo Local (Recomendado para empezar)**
- Backend: `0.0.0.0:8002` (ya configurado)
- Frontend: `localhost:5174` (configurado en vite.config.ts)
- **Usa:** `http://localhost:8002` y `http://localhost:5174`

### **Producción**
- Backend: Dominio de producción (ej: `api.tudominio.com`)
- Frontend: Dominio de producción (ej: `tudominio.com`)
- **Usa:** Variables de entorno para configurar

---

**Para desarrollo local, usa `localhost` en ambos. El backend ya está configurado con `0.0.0.0` para flexibilidad.**

