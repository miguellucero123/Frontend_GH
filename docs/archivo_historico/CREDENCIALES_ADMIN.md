# 🔐 Credenciales de Acceso - Admin

## ✅ Credenciales Correctas

### Modo DEMO (Sin Backend)

**Opción 1 - Usuario:**
- Usuario: `admin`
- Contraseña: `admin123`

**Opción 2 - Email:**
- Email: `admin@constructora.com`
- Contraseña: `admin123`

**Ambas opciones funcionan** ✅

---

### Backend Real

**Email:**
- Email: `admin@constructora.com`
- Contraseña: `admin123`

---

## 🔍 Cómo Verificar el Modo

Abre la consola del navegador (F12) y escribe:

```javascript
console.log('DEMO_MODE:', window.CONFIG?.DEMO_MODE);
console.log('demoMode activo:', window.demoMode?.isActive);
```

- Si `DEMO_MODE: true` → Usa credenciales de Modo DEMO
- Si `DEMO_MODE: false` → Usa credenciales de Backend

---

## ⚠️ Problemas Comunes

### "Credenciales inválidas"

**Solución:**
1. Verifica que estés usando exactamente:
   - Usuario: `admin` (sin espacios)
   - Contraseña: `admin123` (8 caracteres)

2. Si usas email:
   - Email: `admin@constructora.com` (exacto)
   - Contraseña: `admin123`

3. Limpia el caché del navegador (Ctrl+Shift+Delete)

### El sistema no acepta el login

**Solución:**
1. Abre la consola (F12)
2. Intenta hacer login
3. Revisa los mensajes de error
4. Verifica que el modo DEMO esté activo:
   ```javascript
   window.CONFIG.DEMO_MODE = true
   ```

---

## 🧪 Prueba Rápida

1. Abre `http://localhost:5173` (o donde esté el frontend)
2. Usuario: `admin`
3. Contraseña: `admin123`
4. Debería funcionar inmediatamente ✅

---

**Última actualización:** Código mejorado para aceptar tanto `admin` como `admin@constructora.com` ✅

