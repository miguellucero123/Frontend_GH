# 🚀 Iniciar Backend - Guía Rápida

## ✅ Problema Resuelto

El error de uvicorn con `reload=True` ha sido corregido.

## 🚀 Cómo Iniciar

### Opción 1: Script Python (Recomendado)

```bash
cd frontend/backend
python run_server.py
```

**Deberías ver:**
```
Starting server on port 8002...
Backend API: http://localhost:8002
API Docs: http://localhost:8002/docs
Press CTRL+C to stop
--------------------------------------------------
INFO:     Uvicorn running on http://0.0.0.0:8002 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXX] using WatchFiles
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Opción 2: Comando Directo

```bash
cd frontend/backend
python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

## ✅ Verificar que Funciona

1. **Abre en navegador:**
   - API Docs: `http://localhost:8002/docs`
   - Health: `http://localhost:8002/health`

2. **Deberías ver:**
   - Documentación de la API (Swagger UI)
   - Endpoint `/health` devuelve `{"status": "online"}`

## 🔧 Configuración

- **Host:** `0.0.0.0` (accesible desde red local)
- **Puerto:** `8002`
- **Reload:** Activado (auto-recarga en cambios)

## 📝 Notas

- El servidor se queda corriendo hasta que presiones `CTRL+C`
- Los cambios en el código se recargan automáticamente
- El admin se crea automáticamente al iniciar si no existe

---

**Backend listo para usar:** ✅

