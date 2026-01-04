# 🔧 Solución de Problemas - Login No Funciona

## 🐛 Problema: El botón de login no inicia sesión

### ✅ Soluciones Implementadas

1. **Validaciones agregadas** - El código ahora verifica que todos los elementos existan
2. **Logs de debug** - Se agregaron console.log para diagnosticar problemas
3. **Manejo de errores mejorado** - Mejor detección y mensajes de error
4. **Script de debug** - `debug.js` para diagnosticar problemas

## 🔍 Cómo Diagnosticar

### 1. Abrir Consola del Navegador
- Presiona **F12** o **Ctrl+Shift+I**
- Ve a la pestaña **Console**

### 2. Ejecutar Debug
En la consola, escribe:
```javascript
debugLogin()
```

Esto mostrará:
- Si CONFIG está cargado
- Si DEMO_MODE está activo
- Si auth, api, demoMode están disponibles
- Si el formulario se encontró

### 3. Verificar Errores
Busca mensajes en rojo en la consola. Los más comunes:

- `auth is not defined` → auth.js no se cargó
- `api is not defined` → api.js no se cargó
- `demoMode is not defined` → demo-mode.js no se cargó
- `Cannot read property 'addEventListener'` → Elemento no encontrado

## ✅ Checklist de Verificación

### Verificar que los scripts se carguen:
1. Abre la pestaña **Network** en las DevTools (F12)
2. Recarga la página (F5)
3. Busca los archivos `.js` y verifica que todos carguen con status 200

### Verificar orden de scripts:
Los scripts deben cargarse en este orden:
1. `config.js`
2. `utils.js`
3. `auth.js`
4. `demo-mode.js`
5. `api.js`
6. `login.js`

### Verificar credenciales:
- Usuario: `admin` (exactamente, sin espacios)
- Contraseña: `admin123` (exactamente, sin espacios - mínimo 6 caracteres)

## 🔧 Soluciones Rápidas

### Si el botón no hace nada:
1. Abre la consola (F12)
2. Busca errores en rojo
3. Verifica que `loginForm` se encuentre:
   ```javascript
   document.getElementById('loginForm')
   ```

### Si aparece error de "auth is not defined":
- Verifica que `auth.js` se cargue antes de `login.js`
- Revisa la pestaña Network para ver si hay errores 404

### Si el login falla silenciosamente:
- Abre la consola y busca mensajes
- Verifica que DEMO_MODE esté en `true` en `config.js`
- Ejecuta `debugLogin()` para ver el estado

## 🎯 Prueba Rápida

1. Abre `index.html`
2. Abre consola (F12)
3. Ejecuta: `debugLogin()`
4. Verifica que todo esté "OK"
5. Ingresa: `admin` / `admin`
6. Haz clic en "Iniciar Sesión"
7. Revisa la consola para ver los logs

## 📝 Logs Esperados

Cuando funciona correctamente, deberías ver en la consola:
```
🎭 Modo DEMO activado - El sistema funcionará sin backend
🔐 Intentando login en modo DEMO: admin
✅ Login exitoso para: Administrador Rol: jefe
Respuesta del login: {success: true, data: {...}}
```

Si ves errores, cópialos y revisa la sección de soluciones arriba.

---

**Si el problema persiste, revisa la consola del navegador para ver el error específico.**

