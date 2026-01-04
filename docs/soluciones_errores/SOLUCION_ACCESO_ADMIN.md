# 🔐 Solución: Problemas de Acceso con Admin

## 📋 Credenciales Correctas

### Modo DEMO (Sin Backend)
**Usuario:** `admin` o `admin@constructora.com`  
**Contraseña:** `admin123`

### Backend Real
**Email:** `admin@constructora.com`  
**Contraseña:** `admin123`

---

## 🔍 Verificación Paso a Paso

### 1. Verificar Modo DEMO

Abre la consola del navegador (F12) y verifica:

```javascript
// Verificar configuración
console.log('DEMO_MODE:', window.CONFIG?.DEMO_MODE);
console.log('demoMode activo:', window.demoMode?.isActive);
```

**Si DEMO_MODE es `true`**, usa estas credenciales:
- Usuario: `admin`
- Contraseña: `admin123`

### 2. Verificar Backend

Si el backend está corriendo:

```bash
cd frontend/backend
python run_server.py
```

Luego verifica en: `http://localhost:8002/docs`

**Si el backend está activo**, usa:
- Email: `admin@constructora.com`
- Contraseña: `admin123`

### 3. Resetear Password del Admin (Backend)

Si el backend está corriendo pero la contraseña no funciona:

```bash
cd frontend/backend
python reset_admin_password.py
```

Esto resetea la contraseña a `admin123`.

---

## ⚠️ Problemas Comunes

### Problema 1: "Credenciales inválidas" en Modo DEMO

**Solución:**
- Usa exactamente: `admin` (sin @constructora.com)
- Contraseña: `admin123` (8 caracteres, minúsculas y números)

### Problema 2: "Credenciales inválidas" con Backend

**Solución:**
1. Verifica que el backend esté corriendo:
   ```bash
   cd frontend/backend
   python run_server.py
   ```

2. Resetea la contraseña:
   ```bash
   python reset_admin_password.py
   ```

3. Usa exactamente:
   - Email: `admin@constructora.com`
   - Contraseña: `admin123`

### Problema 3: El sistema no detecta el modo DEMO

**Solución:**
1. Abre `frontend/js/config.js`
2. Verifica que `DEMO_MODE: true`
3. Recarga la página (Ctrl+F5)

### Problema 4: Error de red/CORS

**Solución:**
- Si el backend no está disponible, el sistema debería activar automáticamente el modo DEMO
- Si no se activa, fuerza el modo DEMO en `config.js`

---

## 🧪 Prueba Rápida

### Test 1: Modo DEMO
1. Abre `frontend/index.html`
2. Usuario: `admin`
3. Contraseña: `admin123`
4. Debería funcionar inmediatamente

### Test 2: Backend
1. Inicia el backend: `cd frontend/backend && python run_server.py`
2. Abre `http://localhost:5173` (o donde esté el frontend)
3. Email: `admin@constructora.com`
4. Contraseña: `admin123`
5. Debería funcionar

---

## 🔧 Solución Rápida

### Si NADA funciona:

1. **Forzar Modo DEMO:**
   ```javascript
   // En frontend/js/config.js
   DEMO_MODE: true
   ```

2. **Usar credenciales exactas:**
   - Usuario: `admin` (sin email)
   - Contraseña: `admin123`

3. **Limpiar caché del navegador:**
   - Ctrl+Shift+Delete
   - Limpiar caché y cookies
   - Recargar página (Ctrl+F5)

---

## 📝 Credenciales Completas

### Modo DEMO
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Jefe/Admin |
| `trabajador1` | `password` | Trabajador |
| `cliente1` | `password` | Cliente |

### Backend Real
| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@constructora.com` | `admin123` | Jefe/Admin |

---

## 🆘 Si Aún No Funciona

1. **Abre la consola del navegador (F12)**
2. **Intenta hacer login**
3. **Revisa los mensajes de error en la consola**
4. **Comparte los errores para diagnóstico**

---

**Última actualización:** Credenciales verificadas y funcionando ✅

