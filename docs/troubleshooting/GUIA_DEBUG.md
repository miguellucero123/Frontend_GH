# 🔍 Guía de Debug - Login No Funciona

## 🚨 Problema: El botón de login no inicia sesión

## ✅ Soluciones Implementadas

1. **Validaciones agregadas** - Verifica que todos los elementos existan
2. **Logs detallados** - Console.log en cada paso del proceso
3. **Manejo de errores mejorado** - Detecta y muestra errores específicos
4. **Script de debug** - `debug.js` para diagnosticar

## 🔍 Pasos para Diagnosticar

### 1. Abrir Consola del Navegador
- Presiona **F12** o **Ctrl+Shift+I** (Windows/Linux)
- O **Cmd+Option+I** (Mac)
- Ve a la pestaña **Console**

### 2. Verificar que los Scripts se Carguen

En la consola, deberías ver:
```
✅ Formulario de login inicializado correctamente
🎭 Modo DEMO activado - El sistema funcionará sin backend
```

Si NO ves estos mensajes, hay un problema de carga.

### 3. Ejecutar Debug

En la consola, escribe:
```javascript
debugLogin()
```

Esto mostrará el estado de todos los componentes.

### 4. Probar Login Manualmente

En la consola, ejecuta:
```javascript
// Simular click en el botón
document.getElementById('loginForm').dispatchEvent(new Event('submit'));
```

O directamente:
```javascript
// Probar modo demo
window.demoMode.handleLogin('admin', 'admin123').then(r => console.log(r));
```

## 🐛 Errores Comunes y Soluciones

### Error: "auth is not defined"
**Causa:** `auth.js` no se cargó o se cargó después de `login.js`

**Solución:**
- Verifica el orden de los scripts en `index.html`
- Debe ser: `auth.js` → `demo-mode.js` → `api.js` → `login.js`

### Error: "demoMode is not defined"
**Causa:** `demo-mode.js` no se cargó

**Solución:**
- Verifica que `DEMO_MODE: true` en `config.js`
- Verifica que `demo-mode.js` se cargue antes de `login.js`

### Error: "Cannot read property 'addEventListener'"
**Causa:** El formulario no se encontró

**Solución:**
- Verifica que `id="loginForm"` esté en el HTML
- Verifica que el script se ejecute después de `DOMContentLoaded`

### El botón no hace nada
**Posibles causas:**
1. JavaScript está deshabilitado
2. Hay un error que bloquea la ejecución
3. El formulario tiene `action` o `method` que interfiere

**Solución:**
- Verifica la consola por errores
- Asegúrate de que el formulario no tenga `action="..."` que redirija
- Verifica que el botón sea `type="submit"`

## 📋 Checklist de Verificación

- [ ] Consola abierta (F12)
- [ ] No hay errores en rojo en la consola
- [ ] Mensaje "✅ Formulario de login inicializado correctamente" aparece
- [ ] Mensaje "🎭 Modo DEMO activado" aparece
- [ ] `debugLogin()` muestra todo OK
- [ ] Credenciales correctas: `admin` / `admin123`
- [ ] Al hacer click, aparece "🔘 Botón de login presionado" en consola

## 🎯 Prueba Paso a Paso

1. **Abrir página:**
   - Abre `index.html`
   - Abre consola (F12)

2. **Verificar inicialización:**
   - Deberías ver: "✅ Formulario de login inicializado correctamente"
   - Si NO aparece, hay un error de carga

3. **Ejecutar debug:**
   ```javascript
   debugLogin()
   ```
   - Verifica que todo esté "true" o "OK"

4. **Probar login:**
   - Ingresa: `admin` / `admin123`
   - Haz click en "Iniciar Sesión"
   - Deberías ver en consola:
     ```
     🔘 Botón de login presionado
     🔐 Iniciando proceso de login...
     🎭 Usando modo DEMO para login
     🔐 Intentando login en modo DEMO: admin
     ✅ Login exitoso para: Administrador Rol: jefe
     ✅ Respuesta del login recibida: {...}
     ✅ Login exitoso. Usuario: Administrador Rol: jefe
     ✅ Sesión guardada
     🔄 Redirigiendo según rol...
     ```

5. **Si no funciona:**
   - Copia TODOS los errores de la consola
   - Verifica qué paso falla según los logs
   - Revisa la sección de errores comunes arriba

## 🔧 Solución Rápida

Si nada funciona, prueba esto en la consola:

```javascript
// Forzar login manual
const user = {
    user_id: 1,
    username: 'admin',
    name: 'Administrador',
    role: 'jefe'
};
auth.saveSession('demo_token', user);
auth.redirectByRole();
```

Esto debería redirigirte al panel de administración.

---

**Revisa la consola del navegador para ver exactamente qué está fallando.**

