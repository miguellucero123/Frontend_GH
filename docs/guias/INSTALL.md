# Guía de Instalación y Configuración

Esta guía te ayudará a configurar y poner en marcha el frontend del ERP Constructora.

## 📋 Requisitos Previos

- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Servidor web local (opcional, para desarrollo)
- Backend API funcionando (ver documentación del backend)

## 🚀 Instalación Rápida

### Opción 1: Servidor Web Local

#### Python
```bash
cd frontend
python -m http.server 8080
```

#### Node.js (http-server)
```bash
cd frontend
npx http-server -p 8080
```

#### PHP
```bash
cd frontend
php -S localhost:8080
```

Luego accede a: `http://localhost:8080`

### Opción 2: Abrir Directamente

Simplemente abre `index.html` en tu navegador. Nota: algunas funcionalidades pueden no funcionar sin un servidor web debido a las políticas CORS.

## ⚙️ Configuración

### 1. Configurar URL del Backend

Edita el archivo `js/config.js`:

```javascript
const CONFIG = {
    // Cambiar según tu entorno
    API_BASE_URL: 'http://localhost:8002/api',  // Desarrollo (puerto 8002)
    // API_BASE_URL: 'https://api.tudominio.com/api',  // Producción
    // ...
};
```

### 2. Configurar WebSocket (Opcional)

Si tu backend usa una URL diferente para WebSocket, edita `js/config.js`:

```javascript
const CONFIG = {
    WS_BASE_URL: 'ws://localhost:8002',  // Puerto 8002 según run_server.py
    // ...
};
```

Si dejas `WS_BASE_URL: null`, se usará automáticamente la misma URL de la página actual.

### 3. Personalizar Logo

Reemplaza el archivo `assets/logo-constructora.svg` con el logo de tu empresa.

**Requisitos del logo:**
- Formato: SVG (recomendado) o PNG
- Tamaño recomendado: 200x200px
- Nombre del archivo: `logo-constructora.svg` (o actualizar la referencia en HTML)

### 4. Personalizar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --color-primary: #2563eb;        /* Color principal */
    --color-primary-dark: #1e40af;    /* Color principal oscuro */
    --color-primary-light: #3b82f6;   /* Color principal claro */
    --color-secondary: #64748b;       /* Color secundario */
    --color-success: #10b981;         /* Color de éxito */
    --color-warning: #f59e0b;         /* Color de advertencia */
    --color-danger: #ef4444;           /* Color de error */
    /* ... más variables ... */
}
```

### 5. Configurar Límites de Archivos

En `js/config.js`:

```javascript
const CONFIG = {
    MAX_FILE_SIZE: 100 * 1024 * 1024,  // 100 MB (ajustar según necesidad)
    ALLOWED_FILE_TYPES: [
        'application/pdf',
        // Agregar más tipos según necesidad
    ],
    // ...
};
```

## 🔧 Configuración Avanzada

### Modo Debug

Para ver logs adicionales en la consola, edita `js/config.js`:

```javascript
const CONFIG = {
    DEBUG: true,  // Cambiar a true para activar logs
    // ...
};
```

### Configuración de Moneda

```javascript
const CONFIG = {
    LOCALE: 'es-ES',      // Formato de fecha/número
    CURRENCY: 'CLP',      // Moneda (CLP, USD, EUR, etc.)
    // ...
};
```

### Timeout de Peticiones

```javascript
const CONFIG = {
    API_TIMEOUT: 30000,  // 30 segundos (ajustar según necesidad)
    // ...
};
```

## 🧪 Verificación

### 1. Verificar Conexión con Backend

1. Abre la consola del navegador (F12)
2. Intenta hacer login
3. Revisa si hay errores de conexión en la consola

### 2. Verificar WebSocket

1. Abre el panel de usuario
2. Abre el widget de chat
3. Revisa la consola para ver si el WebSocket se conecta correctamente

### 3. Verificar Carga de Archivos

1. Como administrador, intenta subir un archivo
2. Verifica que se muestre en la lista
3. Intenta descargarlo

## 🐛 Solución de Problemas

### Error: "CORS policy"

**Problema:** El backend no permite peticiones desde tu origen.

**Solución:** Configura CORS en tu backend para permitir tu dominio, o usa un proxy.

### Error: "WebSocket connection failed"

**Problema:** El WebSocket no puede conectarse.

**Solución:** 
- Verifica que el backend tenga WebSocket habilitado
- Verifica la URL en `js/config.js`
- Revisa los logs del backend

### Los archivos no se cargan

**Problema:** Los archivos no aparecen en el gestor documental.

**Solución:**
- Verifica que el backend esté funcionando
- Revisa la consola del navegador para errores
- Verifica los permisos del usuario

### El diseño se ve roto

**Problema:** Los estilos no se cargan correctamente.

**Solución:**
- Verifica que todos los archivos CSS estén en su lugar
- Limpia la caché del navegador (Ctrl+F5)
- Verifica que estés usando un servidor web (no solo abriendo el HTML)

## 📝 Notas Adicionales

- **Desarrollo:** Usa `http://localhost` para desarrollo local
- **Producción:** Asegúrate de usar HTTPS y configurar las URLs correctas
- **Seguridad:** Nunca subas `config.js` con credenciales sensibles a repositorios públicos
- **Backup:** Mantén copias de seguridad de tus configuraciones

## 🆘 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Consulta la documentación del backend
4. Contacta al equipo de desarrollo

---

**Última actualización:** 2024

