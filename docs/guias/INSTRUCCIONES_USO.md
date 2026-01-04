# 🚀 Instrucciones de Uso - Sistema ERP Constructora

## ✅ Sistema Operativo

El sistema ahora está **completamente funcional** en modo DEMO. Puedes probarlo sin necesidad de backend.

## 🔑 Credenciales de Prueba

### 👨‍💼 Administrador (Jefe)
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Acceso:** Panel de Administración completo

### 👷 Trabajador
- **Usuario:** `trabajador1`
- **Contraseña:** `password`
- **Acceso:** Panel de Usuario (solo su proyecto)

### 👤 Cliente
- **Usuario:** `cliente1`
- **Contraseña:** `password`
- **Acceso:** Panel de Usuario (solo su proyecto)

## 📋 Pasos para Probar

1. **Abrir el sistema:**
   - Abre `index.html` en tu navegador
   - O usa un servidor local: `npm start` (si tienes npm instalado)

2. **Iniciar sesión:**
   - Ingresa cualquiera de las credenciales de arriba
   - Haz clic en "Iniciar Sesión"
   - El sistema te redirigirá automáticamente según tu rol

3. **Navegar:**
   - **Admin:** Verás el panel de administración con Dashboard, Proyectos, Usuarios, Mensajes
   - **Trabajador/Cliente:** Verás tu panel con el proyecto asignado

4. **Cerrar sesión:**
   - Haz clic en el botón de logout
   - Serás redirigido al login

## 🎯 Funcionalidades Disponibles

### ✅ Autenticación
- Login funcional
- Redirección automática según rol
- Protección de rutas (no puedes acceder sin login)
- Logout funcional
- Sesión persistente

### ✅ Navegación
- Panel de Administración (Jefe)
- Panel de Usuario (Trabajador/Cliente)
- Redirección automática si no tienes permisos

### ✅ Interfaz
- Diseño profesional y moderno
- Responsive (funciona en móvil, tablet, desktop)
- Dark mode disponible
- Atajos de teclado

## ⚙️ Configuración

### Activar/Desactivar Modo Demo

Edita `js/config.js`:

```javascript
DEMO_MODE: true,  // true = Modo demo (sin backend)
                 // false = Conecta al backend real
```

### Cambiar URL del Backend

Cuando tengas backend, edita `js/config.js`:

```javascript
API_BASE_URL: 'http://localhost:8002/api',  // Puerto 8002 según run_server.py
DEMO_MODE: false,  // Desactivar modo demo
```

## 🔄 Flujo del Sistema

```
1. Usuario abre index.html
   ↓
2. Ingresa credenciales
   ↓
3. Sistema valida (modo demo o backend)
   ↓
4. Guarda sesión
   ↓
5. Redirige según rol:
   - Jefe/Admin → panel-jefe.html
   - Trabajador/Cliente → panel-usuario.html
   ↓
6. Panel carga y muestra datos
```

## 🐛 Solución de Problemas

### "No puedo iniciar sesión"
- Verifica que estés usando las credenciales correctas
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que `DEMO_MODE: true` en config.js

### "Me redirige al login"
- Limpia el localStorage: `localStorage.clear()` en consola
- Verifica que los scripts se estén cargando correctamente

### "No veo los cambios"
- Recarga la página con Ctrl+F5 (limpiar caché)
- Verifica que `main.css` se esté cargando

## 📝 Próximos Pasos

Para hacer el sistema completamente funcional con backend:

1. **Implementar Backend API:**
   - Endpoint de login: `POST /api/auth/login`
   - Endpoint de proyectos: `GET /api/projects`
   - Endpoint de usuarios: `GET /api/users`
   - etc.

2. **Conectar Base de Datos:**
   - PostgreSQL con las tablas definidas
   - Migraciones y seeders

3. **WebSocket para Chat:**
   - Implementar servidor WebSocket
   - Conectar con el frontend

4. **Desactivar Modo Demo:**
   - Cambiar `DEMO_MODE: false` en config.js
   - Configurar URL del backend

---

**¡El sistema está listo para usar!** 🎉

Prueba las diferentes credenciales para ver cómo funciona cada rol.

