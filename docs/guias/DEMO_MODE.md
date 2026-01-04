# 🎭 Modo DEMO - Sistema Operativo Sin Backend

## ✅ Sistema Ahora Operativo

El sistema ahora funciona en **Modo DEMO** que permite probar todas las funcionalidades sin necesidad de un backend.

## 🔑 Credenciales de Prueba

### Administrador (Jefe)
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Redirige a:** `panel-jefe.html`

### Trabajador
- **Usuario:** `trabajador1`
- **Contraseña:** `password`
- **Redirige a:** `panel-usuario.html`

### Cliente
- **Usuario:** `cliente1`
- **Contraseña:** `password`
- **Redirige a:** `panel-usuario.html`

## 🚀 Cómo Usar

1. **Abrir `index.html`** en el navegador
2. **Ingresar credenciales** de cualquiera de los usuarios demo
3. **El sistema redirigirá** automáticamente según el rol
4. **Navegar** por las diferentes secciones

## ⚙️ Configuración

Para activar/desactivar el modo demo, edita `js/config.js`:

```javascript
DEMO_MODE: true,  // true = Modo demo activo
                 // false = Conecta al backend real
```

## 📋 Funcionalidades Disponibles en Demo

- ✅ **Login funcional** con redirección automática
- ✅ **Navegación** entre páginas según rol
- ✅ **Protección de rutas** (redirige si no estás autenticado)
- ✅ **Logout** funcional
- ✅ **Gestión de sesión** (localStorage)

## 🔄 Cuando Tengas Backend

1. Cambia `DEMO_MODE: false` en `config.js`
2. Configura `API_BASE_URL` con tu URL del backend
3. El sistema usará las llamadas reales a la API

## 🎯 Próximos Pasos

Para hacer el sistema completamente funcional:

1. **Backend API** - Implementar endpoints:
   - `POST /api/auth/login`
   - `GET /api/projects`
   - `GET /api/users`
   - etc.

2. **Datos Reales** - Conectar con base de datos

3. **WebSocket** - Para chat en tiempo real

---

**El sistema ahora es completamente operativo en modo demo!** 🎉

