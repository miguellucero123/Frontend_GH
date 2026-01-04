# ⚡ Hosts Rápido - Referencia Rápida

## 🎯 Desarrollo Local (Usar Esto)

### Backend
```
Host: localhost
Puerto: 8002
URL: http://localhost:8002
```

### Frontend Vite
```
Host: localhost
Puerto: 5174 (o el siguiente disponible)
URL: http://localhost:5174
```

### Configuración en Código
```javascript
// frontend/js/config.js
API_BASE_URL: 'http://localhost:8002/api'

// frontend/app/src/services/apiClient.ts
const API_URL = 'http://localhost:8002/api'
```

---

## 🌐 Acceso desde Red Local

### Backend
```
Host: 0.0.0.0 (ya configurado)
Puerto: 8002
URL: http://TU_IP:8002
```

### Frontend Vite
```bash
npm run dev -- --host
```
```
Host: 0.0.0.0
Puerto: 5173
URL: http://TU_IP:5173
```

---

## 🚀 Producción

### Backend
```
Host: api.tudominio.com
Puerto: 443 (HTTPS)
URL: https://api.tudominio.com
```

### Frontend
```
Host: tudominio.com
Puerto: 443 (HTTPS)
URL: https://tudominio.com
```

### Variables de Entorno
```env
VITE_API_URL=https://api.tudominio.com/api
VITE_WS_HOST=api.tudominio.com
```

---

## ✅ Resumen: Qué Usar AHORA

**Para desarrollo local (lo más común):**
- ✅ Backend: `http://localhost:8002`
- ✅ Frontend: `http://localhost:5173`
- ✅ Ya está todo configurado así

**No necesitas cambiar nada si estás desarrollando localmente.**

---

Ver `GUIA_HOSTS.md` para más detalles.

