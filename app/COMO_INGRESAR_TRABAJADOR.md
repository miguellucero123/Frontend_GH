# 👷 Cómo Ingresar como Usuario Trabajador

## 🔐 Credenciales

**Email:** `trabajador@constructora.com`  
**Contraseña:** `trabajador123`

## 📋 Pasos para Ingresar

1. **Abre el sistema**
   - Ve a `http://localhost:5173` (React App)
   - O abre `frontend/index.html` (Vanilla JS)

2. **Ingresa las credenciales**
   - En el campo "Usuario" o "Email": `trabajador@constructora.com`
   - En el campo "Contraseña": `trabajador123`

3. **Haz clic en "Ingresar"**

4. **Serás redirigido al Dashboard** con permisos de trabajador

## ✅ Lo que Verás como Trabajador

### ✅ Páginas Disponibles:
- **Dashboard** - Panel de control personalizado
- **Proyectos** - Solo los proyectos asignados a ti
- **Mensajes** - Sistema de mensajería completo
- **Configuración** - Ajustes personales

### ❌ Lo que NO Verás:
- **Usuarios** - Esta página está oculta (solo para jefes)
- **Botón "Nuevo Proyecto"** - No puedes crear proyectos

## 🔄 Si el Usuario No Existe

Si necesitas crear el usuario trabajador manualmente:

### Opción 1: Automático (Recomendado)
El backend crea automáticamente el usuario trabajador al iniciar el servidor:
```bash
cd frontend/backend
python run_server.py
```
El usuario se crea automáticamente en el startup.

### Opción 2: Script Manual
```bash
cd frontend/backend
python create_worker_user.py
```

### Opción 3: Desde la Interfaz (Como Jefe)
1. Inicia sesión como administrador (`admin@constructora.com` / `admin123`)
2. Ve a la pestaña "Usuarios"
3. Haz clic en "Nuevo Usuario"
4. Completa el formulario:
   - **Rol:** Selecciona "Trabajador"
   - **Email:** (ejemplo: `nuevo.trabajador@constructora.com`)
   - **Contraseña:** (mínimo 8 caracteres)
   - **Nombre:** Nombre completo del trabajador
   - Otros campos requeridos

## 🎯 Verificación Rápida

Después de iniciar sesión, verifica:
- ✅ El header muestra tu nombre y "Trabajador"
- ✅ El menú lateral NO muestra "Usuarios"
- ✅ En "Proyectos" el título dice "Mis Proyectos"
- ✅ No hay botón "Nuevo Proyecto"

## 📝 Notas Importantes

- El usuario trabajador solo puede ver proyectos asignados a él
- No puede gestionar otros usuarios
- Puede usar todas las funciones de mensajería
- Tiene acceso completo a su configuración personal

