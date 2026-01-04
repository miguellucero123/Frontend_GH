# 🔐 Solución: "Verifica tus credenciales"

## ⚠️ Problema Identificado

El mensaje "Verifica tus credenciales" aparece cuando:
1. **Ni el frontend ni el backend están corriendo** ❌
2. El modo DEMO no se activa correctamente
3. Hay un error en la comunicación

## ✅ Solución Rápida

### Opción 1: Usar Modo DEMO (Sin Servidores)

El modo DEMO está configurado para funcionar **sin necesidad de servidores**.

**Pasos:**
1. Abre `frontend/index.html` **directamente en el navegador**
   - No necesitas servidor para modo DEMO
   - Doble clic en `index.html` o arrastra al navegador

2. Usa estas credenciales:
   - Usuario: `admin`
   - Contraseña: `admin123`

3. Debería funcionar inmediatamente ✅

### Opción 2: Iniciar Servidores

Si quieres usar el sistema completo con backend:

**Windows:**
```bash
# Ejecuta este archivo:
frontend/INICIAR_TODO.bat
```

O manualmente:

**Terminal 1 - Backend:**
```bash
cd frontend/backend
python run_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend/app
npm run dev
```

Luego abre: `http://localhost:5173`

---

## 🔍 Verificación

### Verificar Modo DEMO

Abre la consola del navegador (F12) y escribe:

```javascript
console.log('DEMO_MODE:', window.CONFIG?.DEMO_MODE);
console.log('demoMode activo:', window.demoMode?.isActive);
```

**Si `DEMO_MODE: true`**, debería funcionar sin servidores.

### Verificar Servidores

**Frontend:**
- Abre: `http://localhost:5173`
- Debería mostrar la página de login

**Backend:**
- Abre: `http://localhost:8002/docs`
- Debería mostrar la documentación de la API

---

## 🎯 Credenciales Correctas

### Modo DEMO
| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |
| `admin@constructora.com` | `admin123` |

### Backend Real
| Email | Contraseña |
|-------|------------|
| `admin@constructora.com` | `admin123` |

---

## 🚀 Solución Definitiva

### Para Probar Rápido (Modo DEMO):

1. **Abre directamente:**
   - Navega a: `frontend/index.html`
   - Doble clic para abrir en navegador

2. **Login:**
   - Usuario: `admin`
   - Contraseña: `admin123`

3. **Debería funcionar** ✅

### Para Usar con Backend:

1. **Inicia servidores:**
   ```bash
   # Ejecuta:
   frontend/INICIAR_TODO.bat
   ```

2. **Espera 5-10 segundos** a que inicien

3. **Abre:** `http://localhost:5173`

4. **Login:**
   - Email: `admin@constructora.com`
   - Contraseña: `admin123`

---

## ⚠️ Si Aún No Funciona

1. **Abre la consola (F12)**
2. **Intenta hacer login**
3. **Revisa los mensajes de error**
4. **Verifica:**
   ```javascript
   // En la consola:
   window.CONFIG.DEMO_MODE = true
   // Recarga la página (F5)
   ```

---

**Última actualización:** Servidores iniciados y modo DEMO verificado ✅

