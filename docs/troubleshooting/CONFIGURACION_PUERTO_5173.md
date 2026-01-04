# ⚙️ Configuración para Puerto 5174 (Vite)

**Nota:** El puerto se cambió a 5174 porque 5173 puede estar ocupado.

## 🎯 Situación Actual

Estás usando la aplicación **React/Vite** que corre en `http://localhost:5174/` (o el puerto que Vite asigne automáticamente).

Esta es una aplicación diferente a la versión vanilla JS que está en `frontend/` (HTML puro).

## ✅ Configuración Actualizada

He actualizado los archivos de configuración de la API para usar el puerto correcto:

### Archivos Actualizados:

1. **`frontend/app/src/services/api.ts`**
   - Cambiado de `http://localhost:8000` → `http://localhost:8002`

2. **`frontend/app/src/services/apiClient.ts`**
   - Ya estaba configurado correctamente: `http://localhost:8002/api` ✅

3. **`frontend/app/src/services/chatService.ts`**
   - Ya estaba configurado correctamente: `localhost:8002` ✅

## 🔧 Configuración del Backend

El backend ya está configurado para aceptar CORS desde `localhost:5173`:

```python
# frontend/backend/main.py
origins = [
    "http://localhost:5173",  # ✅ Tu aplicación Vite
    "http://localhost:5174",
    "http://localhost:3000",
]
```

## 🚀 Cómo Usar

### 1. Iniciar Backend (Puerto 8002)

```bash
cd frontend/backend
python run_server.py
```

Deberías ver:
```
INFO: Uvicorn running on http://0.0.0.0:8002
```

### 2. Iniciar Frontend (Puerto 5173)

```bash
cd frontend/app
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 3. Probar Login

Abre: `http://localhost:5174/` (o el puerto que Vite muestre)

Credenciales:
- **Email:** `admin@constructora.com`
- **Contraseña:** `admin123`

## ⚠️ Nota Importante

La aplicación React **NO tiene modo DEMO** como la versión vanilla JS. Necesitas que el backend esté corriendo para que funcione.

Si el backend no está disponible, verás errores de conexión.

## 🔄 Si Necesitas Modo DEMO

Si quieres que la app React también tenga modo DEMO (para desarrollo sin backend), necesitarías:

1. Crear un servicio de modo DEMO similar a `frontend/js/demo-mode.js`
2. Interceptar las llamadas de `apiClient` cuando el backend no esté disponible
3. Proporcionar datos mock para desarrollo

## 📝 Verificación

Para verificar que todo está configurado correctamente:

1. **Backend corriendo:** http://localhost:8002/docs
2. **Frontend corriendo:** http://localhost:5174/ (o el puerto que Vite asigne)
3. **CORS configurado:** El backend acepta requests desde 5173, 5174, 5175, 3000, 8080 ✅
4. **API URL correcta:** Todos los servicios apuntan a puerto 8002 ✅

---

**Última actualización:** Configuración sincronizada para puerto 5173 (Vite) y 8002 (Backend)

