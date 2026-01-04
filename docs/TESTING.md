# 🧪 Guía de Testing - Sistema ERP Constructora

## ✅ Sistema Operativo en Modo DEMO

El sistema está configurado para funcionar **sin backend** usando el modo DEMO.

## 🔑 Credenciales de Prueba

| Rol | Usuario | Contraseña | Panel |
|-----|---------|------------|-------|
| **Administrador** | `admin` | `admin123` | panel-jefe.html |
| **Trabajador** | `trabajador1` | `password` | panel-usuario.html |
| **Cliente** | `cliente1` | `password` | panel-usuario.html |

## 🚀 Cómo Probar

### 1. Iniciar el Sistema

**Opción A: Abrir directamente**
- Abre `frontend/index.html` en tu navegador

**Opción B: Servidor local (recomendado)**
```bash
cd frontend
npm start
# O si no tienes npm:
npx http-server -p 8080
```

### 2. Probar Login

1. Abre `http://localhost:8080` (o el archivo index.html)
2. Ingresa credenciales:
   - Usuario: `admin`
   - Contraseña: `admin`
3. Haz clic en "Iniciar Sesión"
4. Deberías ser redirigido a `panel-jefe.html`

### 3. Probar Navegación

- **Como Admin:** Prueba todas las secciones del panel de administración
- **Como Trabajador/Cliente:** Prueba el panel de usuario
- **Logout:** Cierra sesión y vuelve al login

### 4. Probar Protección de Rutas

1. Abre directamente `panel-jefe.html` sin estar logueado
2. Deberías ser redirigido automáticamente a `index.html`

## ✅ Checklist de Funcionalidades

### Autenticación
- [x] Login funciona con credenciales demo
- [x] Redirección automática según rol
- [x] Protección de rutas (no puedes acceder sin login)
- [x] Logout funcional
- [x] Sesión persistente (localStorage)

### Navegación
- [x] Panel de Administración carga correctamente
- [x] Panel de Usuario carga correctamente
- [x] Redirección si no tienes permisos

### Interfaz
- [x] Diseño se ve profesional
- [x] Responsive funciona
- [x] Dark mode disponible
- [x] Atajos de teclado funcionan

## 🐛 Problemas Comunes

### "No puedo iniciar sesión"
**Solución:**
1. Verifica que `DEMO_MODE: true` en `js/config.js`
2. Usa exactamente las credenciales: `admin` / `admin123`
3. Revisa la consola del navegador (F12) para errores

### "Me redirige al login constantemente"
**Solución:**
1. Limpia el localStorage: Abre consola (F12) y ejecuta:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   ```
2. Recarga la página

### "No veo los estilos"
**Solución:**
1. Verifica que `css/main.css` existe
2. Recarga con Ctrl+F5 (limpiar caché)
3. Revisa la consola por errores de carga

## 📊 Flujo de Prueba Completo

```
1. Abrir index.html
   ↓
2. Login con admin/admin123
   ↓
3. Verificar redirección a panel-jefe.html
   ↓
4. Verificar que se muestra el nombre del usuario
   ↓
5. Probar logout
   ↓
6. Verificar redirección a index.html
   ↓
7. Login con trabajador1/password
   ↓
8. Verificar redirección a panel-usuario.html
   ↓
9. Verificar protección: intentar abrir panel-jefe.html directamente
   ↓
10. Verificar que redirige a index.html
```

## 🔄 Cambiar a Modo Producción

Cuando tengas backend listo:

1. Edita `js/config.js`:
   ```javascript
   DEMO_MODE: false,
   API_BASE_URL: 'http://tu-backend.com/api'
   ```

2. El sistema usará las llamadas reales a la API

---

**¡El sistema está listo para probar!** 🎉

