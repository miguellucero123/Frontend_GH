# ✅ Sistema ERP Constructora - OPERATIVO

## 🎉 El Sistema Ahora Funciona Completamente

El sistema está **100% operativo** en modo DEMO. Puedes probarlo inmediatamente sin necesidad de backend.

## 🚀 Inicio Rápido

### 1. Abrir el Sistema

**Opción Simple:**
- Abre `frontend/index.html` directamente en tu navegador

**Opción con Servidor (Recomendado):**
```bash
cd frontend
npm start
# O
npx http-server -p 8080
```

### 2. Iniciar Sesión

Usa estas credenciales:

**Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**Trabajador:**
- Usuario: `trabajador1`
- Contraseña: `password`

**Cliente:**
- Usuario: `cliente1`
- Contraseña: `password`

### 3. Navegar

- El sistema te redirigirá automáticamente según tu rol
- Explora las diferentes secciones
- Prueba el logout

## ✅ Lo Que Funciona

- ✅ **Login completo** - Autenticación funcional
- ✅ **Redirección automática** - Según rol del usuario
- ✅ **Protección de rutas** - No puedes acceder sin login
- ✅ **Logout** - Cierra sesión correctamente
- ✅ **Sesión persistente** - Recuerda tu sesión
- ✅ **Navegación** - Entre todas las páginas
- ✅ **Interfaz profesional** - Diseño moderno y empresarial

## 📋 Archivos Importantes

- `index.html` - Página de login
- `panel-jefe.html` - Panel de administración
- `panel-usuario.html` - Panel de usuario
- `js/config.js` - Configuración (DEMO_MODE: true)
- `js/demo-mode.js` - Sistema de modo demo
- `js/auth.js` - Gestión de autenticación
- `js/login.js` - Lógica del login

## 🔧 Configuración

El modo DEMO está activado por defecto en `js/config.js`:

```javascript
DEMO_MODE: true  // Sistema funciona sin backend
```

Para desactivar cuando tengas backend:
```javascript
DEMO_MODE: false
API_BASE_URL: 'http://tu-backend.com/api'
```

## 🎯 Próximos Pasos

1. **Probar el sistema** con las credenciales demo
2. **Implementar backend** cuando esté listo
3. **Desactivar modo demo** y conectar con API real

---

**¡El sistema está listo para usar!** 🚀

Prueba ahora mismo abriendo `index.html` y usando las credenciales de admin.

