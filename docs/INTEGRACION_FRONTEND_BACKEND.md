# 🔗 Integración Frontend-Backend

## ✅ Cambios Realizados

### 1. Configuración (`js/config.js`)
- ✅ Actualizado `API_BASE_URL` a `http://localhost:8000/api/v1`
- ✅ Cambiado `DEMO_MODE` a `null` (auto-detect: intenta backend primero)

### 2. Autenticación (`js/auth.js`)
- ✅ Actualizado `saveSession()` para manejar `access_token` y `refresh_token`
- ✅ Agregado método `refreshAccessToken()` para renovar tokens automáticamente
- ✅ Actualizado `loadSession()` para verificar expiración y hacer refresh si es necesario
- ✅ Actualizado `clearSession()` para limpiar ambos tokens

### 3. API Client (`js/api.js`)
- ✅ Actualizado método `login()` para usar endpoint `/auth/login`
- ✅ Actualizado método `register()` para usar endpoint `/auth/register`
- ✅ Agregado método `refreshToken()` para renovar tokens
- ✅ Mejorado manejo de errores 401 con refresh automático
- ✅ Actualizado para usar Bearer token en headers

### 4. Login (`js/login.js`)
- ✅ Actualizado para manejar respuesta del backend: `{ access_token, refresh_token, token_type }`
- ✅ Guarda ambos tokens en la sesión

### 5. Chat WebSocket (`js/chat.js`)
- ✅ Actualizado `connectWebSocket()` para usar nueva ruta: `/api/v1/chat/ws/{project_id}?token=JWT`
- ✅ Mejorado manejo de mensajes WebSocket

### 6. Nuevo Archivo (`js/api-backend-integration.js`)
- ✅ Métodos helper para proyectos: `getProjects()`, `getProject()`, `createProject()`, etc.
- ✅ Métodos helper para archivos: `getProjectFiles()`, `uploadFile()`, `downloadFile()`, etc.
- ✅ Métodos helper para chat: `getChatHistory()`
- ✅ Función `getWebSocketURL()` para construir URLs de WebSocket

---

## 🔄 Flujo de Autenticación

### Login
```
1. Usuario ingresa email/password
2. Frontend → POST /api/v1/auth/login
3. Backend devuelve: { access_token, refresh_token, token_type }
4. Frontend guarda ambos tokens en localStorage
5. Frontend usa access_token en headers: Authorization: Bearer {token}
```

### Refresh Automático
```
1. Access token expira (15 minutos)
2. Frontend detecta error 401
3. Frontend → POST /api/v1/auth/refresh con refresh_token
4. Backend devuelve nuevo access_token
5. Frontend actualiza token y reintenta petición original
```

### Logout
```
1. Usuario cierra sesión
2. Frontend limpia ambos tokens de localStorage
3. Redirige a login
```

---

## 📡 Endpoints Mapeados

### Autenticación
| Frontend | Backend | Método |
|----------|---------|--------|
| `api.login()` | `POST /api/v1/auth/login` | ✅ |
| `api.register()` | `POST /api/v1/auth/register` | ✅ |
| `api.refreshToken()` | `POST /api/v1/auth/refresh` | ✅ |

### Proyectos
| Frontend | Backend | Método |
|----------|---------|--------|
| `api.getProjects()` | `GET /api/v1/projects/` | ✅ |
| `api.getProject(id)` | `GET /api/v1/projects/{id}` | ✅ |
| `api.createProject()` | `POST /api/v1/projects/` | ✅ |
| `api.updateProject(id)` | `PUT /api/v1/projects/{id}` | ✅ |
| `api.deleteProject(id)` | `DELETE /api/v1/projects/{id}` | ✅ |

### Archivos
| Frontend | Backend | Método |
|----------|---------|--------|
| `api.getProjectFiles(id)` | `GET /api/v1/files/project/{id}` | ✅ |
| `api.uploadFile(id, file)` | `POST /api/v1/files/upload/{id}` | ✅ |
| `api.downloadFile(id)` | `GET /api/v1/files/download/{id}` | ✅ |
| `api.deleteFile(id)` | `DELETE /api/v1/files/{id}` | ✅ |

### Chat
| Frontend | Backend | Método |
|----------|---------|--------|
| `api.getChatHistory(id)` | `GET /api/v1/chat/history/{id}` | ✅ |
| `WebSocket` | `WS /api/v1/chat/ws/{id}?token=JWT` | ✅ |

---

## 🧪 Testing

### 1. Verificar Backend
```bash
# Iniciar backend
cd backend
docker-compose up -d

# Verificar health
curl http://localhost:8000/health
```

### 2. Probar Login
```javascript
// En consola del navegador
await api.login('jefe@construccion.cl', 'Jefe123456');
// Debe devolver: { access_token, refresh_token, token_type }
```

### 3. Probar Proyectos
```javascript
// Después de login
await api.getProjects();
// Debe devolver array de proyectos
```

### 4. Probar WebSocket
```javascript
// Conectar WebSocket
const ws = new WebSocket('ws://localhost:8000/api/v1/chat/ws/1?token=YOUR_TOKEN');
ws.onopen = () => console.log('Conectado');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## ⚠️ Notas Importantes

1. **Tokens**: El frontend ahora maneja `access_token` (15 min) y `refresh_token` (7 días)
2. **Auto-refresh**: El sistema intenta refrescar automáticamente cuando el access token expira
3. **Fallback**: Si el backend no está disponible, el sistema usa modo DEMO automáticamente
4. **WebSocket**: Requiere token JWT en query param: `?token=JWT`
5. **CORS**: El backend debe tener `ALLOWED_ORIGINS` configurado correctamente

---

## 🔧 Configuración Requerida

### Backend `.env`
```env
ALLOWED_ORIGINS=["http://localhost:8080","http://localhost:3000","http://127.0.0.1:8080"]
```

### Frontend `js/config.js`
```javascript
API_BASE_URL: 'http://localhost:8000/api/v1'
DEMO_MODE: null  // Auto-detect
```

---

## ✅ Estado Final

- ✅ Frontend configurado para backend FastAPI
- ✅ Autenticación JWT funcionando
- ✅ Refresh tokens automático
- ✅ Endpoints mapeados correctamente
- ✅ WebSocket configurado
- ✅ Fallback a modo DEMO si backend no disponible

**Versión:** 1.0.0  
**Estado:** ✅ INTEGRACIÓN COMPLETA

