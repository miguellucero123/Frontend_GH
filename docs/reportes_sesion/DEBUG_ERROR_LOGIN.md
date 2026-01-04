# 🐛 Debug: Error "[object Object]" en Login

## 🔍 Pasos para Diagnosticar

### 1. Abrir Consola del Navegador
- Presiona `F12` o `Ctrl+Shift+I`
- Ve a la pestaña "Console"

### 2. Intentar Login
- Ingresa credenciales (correctas o incorrectas)
- Observa los mensajes en la consola

### 3. Buscar Estos Mensajes

Deberías ver:
```
🔘 Botón de login presionado
📝 Datos del formulario: {...}
🔐 Iniciando proceso de login...
❌ Error completo en login: {...}
📋 Mensaje de error extraído: "..."
🔴 Mostrando error: "..."
```

### 4. Copiar Información

Copia y comparte:
- Todos los mensajes que empiezan con ❌
- El mensaje que dice "Error completo en login"
- El mensaje que dice "Mensaje de error extraído"

## 🔧 Verificación Rápida

Abre la consola y ejecuta:

```javascript
// Verificar elementos del DOM
console.log('errorMessage:', document.getElementById('errorMessage'));
console.log('errorAlert:', document.getElementById('errorAlert'));

// Verificar función showError
console.log('showError disponible:', typeof showError);
```

## 🎯 Posibles Causas

1. **Error no está siendo capturado correctamente**
   - Verifica que el catch esté funcionando

2. **El error es un objeto complejo**
   - Revisa la consola para ver la estructura del error

3. **El mensaje se está pasando como objeto**
   - Verifica que showError reciba un string

## 📝 Información Necesaria

Para diagnosticar mejor, necesito:
1. Mensajes completos de la consola
2. Qué credenciales usaste
3. Si el backend está corriendo
4. Si estás en modo DEMO o con backend

---

**Última actualización:** Manejo de errores mejorado con múltiples niveles de extracción ✅

