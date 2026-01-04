# 🔍 Guía de Debugging para Dashboard

## 🎯 Problema: El Dashboard Se Ve Como Una Imagen

Si el dashboard se muestra solo como una imagen estática después del login, sigue estos pasos:

## 📋 Pasos de Debugging

### 1. Abrir DevTools

1. Presiona `F12` o `Ctrl + Shift + I`
2. Ve a la pestaña **"Console"**

### 2. Verificar Logs

Deberías ver estos mensajes en orden:

```
✅ Usuario autenticado: {user_id: X, name: "...", role: "cliente"}
🎨 Inicializando layout manager...
✅ Layout creado correctamente
📦 Moviendo X elementos al layout...
  ✅ Elemento 1 movido: SECTION ...
  ✅ Elemento 2 movido: SECTION ...
✅ Contenido movido al layout correctamente
✅ Contenido visible
🚀 Inicializando dashboard cliente...
✅ Nombre del cliente actualizado: ...
🔧 Configurando event listeners...
📊 Cargando datos del dashboard...
📥 Iniciando carga de datos del dashboard...
✅ Dashboard inicializado correctamente
```

### 3. Verificar Elementos en DOM

En la consola, ejecuta:

```javascript
// Verificar que el layout existe
document.getElementById('layoutContainer')
document.getElementById('mainContent')
document.getElementById('layoutSidebar')

// Verificar que el contenido está en mainContent
document.getElementById('mainContent').children.length

// Verificar elementos específicos
document.getElementById('clientName')
document.querySelector('.progress-section')
```

### 4. Verificar CSS

En DevTools:
1. Ve a la pestaña **"Elements"**
2. Selecciona `#mainContent`
3. Verifica que tenga estos estilos:
   - `display: block` o `display: flex`
   - `background: linear-gradient(...)`
   - `padding: 1.5rem` (o similar)

### 5. Verificar Errores

Busca en la consola:
- ❌ Errores en rojo
- ⚠️ Advertencias en amarillo
- Mensajes que digan "No se encontró" o "undefined"

## 🔧 Soluciones Comunes

### Problema: "Layout no se creó después de 5 segundos"

**Causa:** El layout manager no se está cargando correctamente.

**Solución:**
1. Verifica que `layout-manager.js` se esté cargando:
   ```javascript
   typeof layoutManager !== 'undefined'
   ```
2. Verifica que no haya errores de sintaxis en `layout-manager.js`
3. Recarga la página con caché limpio (`Ctrl + Shift + R`)

### Problema: "clientMain no encontrado"

**Causa:** El HTML no tiene el elemento `clientMain` o tiene un ID diferente.

**Solución:**
1. Verifica en el HTML que exista:
   ```html
   <div class="client-main" id="clientMain">
   ```
2. Si no existe, verifica qué ID tiene el contenedor principal

### Problema: "Contenido movido pero no visible"

**Causa:** El CSS está ocultando el contenido o hay un problema de z-index.

**Solución:**
1. En DevTools, selecciona `#mainContent`
2. Verifica que `display` no sea `none`
3. Verifica que `opacity` no sea `0`
4. Verifica que `visibility` no sea `hidden`
5. Verifica que `z-index` sea adecuado

### Problema: "Dashboard inicializado pero no muestra datos"

**Causa:** Los datos no se están cargando correctamente.

**Solución:**
1. Verifica en la consola los mensajes de carga de datos
2. Verifica que `PROJECT_DATA_MODEL` esté definido:
   ```javascript
   typeof PROJECT_DATA_MODEL !== 'undefined'
   ```
3. Verifica que haya datos en el modelo:
   ```javascript
   PROJECT_DATA_MODEL?.proyectos?.length
   ```

## 📝 Comandos Útiles en Consola

```javascript
// Verificar estado de autenticación
auth.isAuthenticated()
auth.getCurrentUser()

// Verificar layout
document.getElementById('layoutContainer')
document.getElementById('mainContent')
document.getElementById('layoutSidebar')

// Verificar contenido
document.getElementById('mainContent').innerHTML.length
document.querySelectorAll('#mainContent > *').length

// Forzar re-renderizado
location.reload()

// Limpiar localStorage y recargar
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## 🚀 Próximos Pasos

Si después de seguir estos pasos el problema persiste:

1. **Comparte los logs de la consola** (copia todo lo que aparece)
2. **Comparte una captura de pantalla** de:
   - La consola completa
   - El panel "Elements" con `#mainContent` seleccionado
3. **Indica qué mensajes ves** de los listados arriba

---

**Con esta información podremos identificar exactamente dónde está el problema.** 🔍

