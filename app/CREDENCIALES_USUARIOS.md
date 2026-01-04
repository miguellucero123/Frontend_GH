# 🔐 Credenciales de Usuario

## Usuarios Disponibles

### 👨‍💼 Administrador (Jefe de Obra)
- **Email:** `admin@constructora.com`
- **Contraseña:** `admin123`
- **Rol:** Jefe de Obra
- **Permisos:** Acceso completo al sistema

### 👷 Trabajador
- **Email:** `trabajador@constructora.com`
- **Contraseña:** `trabajador123`
- **Rol:** Trabajador
- **Permisos:** 
  - Ver Dashboard
  - Ver proyectos asignados
  - Usar Mensajería
  - Acceder a Configuración
  - ❌ NO puede ver Usuarios
  - ❌ NO puede crear proyectos

### 👤 Cliente
- **Email:** `cliente@constructora.com`
- **Contraseña:** `cliente123`
- **Rol:** Cliente
- **Permisos:** Acceso limitado a proyectos asignados

## 📝 Cómo Crear un Usuario Trabajador

### Opción 1: Automático (Recomendado)
El backend crea automáticamente un usuario trabajador al iniciar:
- Email: `trabajador@constructora.com`
- Contraseña: `trabajador123`

### Opción 2: Script Manual
```bash
cd frontend/backend
python create_worker_user.py
```

### Opción 3: Desde la Interfaz (Solo Jefes)
1. Inicia sesión como administrador
2. Ve a la pestaña "Usuarios"
3. Haz clic en "Nuevo Usuario"
4. Completa el formulario:
   - Rol: Selecciona "Trabajador"
   - Email: (ejemplo: `nuevo.trabajador@constructora.com`)
   - Contraseña: (mínimo 8 caracteres)
   - Otros datos requeridos

## 🚀 Iniciar Sesión como Trabajador

1. Abre el sistema en `http://localhost:5173`
2. Ingresa las credenciales:
   - **Email:** `trabajador@constructora.com`
   - **Contraseña:** `trabajador123`
3. Haz clic en "Ingresar"
4. Serás redirigido al Dashboard con permisos de trabajador

## ✅ Verificación

Después de iniciar sesión como trabajador, deberías ver:
- ✅ Dashboard visible
- ✅ Proyectos (solo los asignados)
- ✅ Mensajes visible
- ✅ Configuración visible
- ❌ Usuarios NO visible (solo para jefes)
- ❌ Botón "Nuevo Proyecto" NO visible

## 🔄 Resetear Contraseña de Trabajador

Si necesitas resetear la contraseña:

```bash
cd frontend/backend
python create_worker_user.py
# Cuando pregunte, responde 's' para resetear
```

