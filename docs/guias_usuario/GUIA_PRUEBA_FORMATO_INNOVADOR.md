# 🧪 Guía de Prueba - Formato Innovador Restaurado

## 🚀 Servidor Activo

El servidor debería estar corriendo en: **`http://localhost:8080`**

Si no está activo, ejecuta:
```bash
cd frontend
npm start
```

## ✅ Checklist de Verificación del Formato Innovador

### 1. Login (`index.html`) - Formato React Restaurado

#### Diseño Visual:
- [ ] **Fondo oscuro** (`bg-slate-900`) visible
- [ ] **Efectos de fondo animados**: Dos círculos grandes con blur (azul e indigo) que pulsan
- [ ] **Card con glassmorphism**: Fondo semitransparente blanco (`bg-white/10`) con blur
- [ ] **Bordes redondeados**: `rounded-3xl` en el card
- [ ] **Sombra moderna**: `shadow-2xl` con efecto hover azul

#### Elementos:
- [ ] **Badge de estado del backend**: 
  - Verde (ONLINE) / Rojo (OFFLINE) / Gris con pulse (CHECKING)
  - Muestra "API: ONLINE/OFFLINE/CHECKING"
- [ ] **Logo**: 
  - Tamaño `w-20 h-20`
  - Bordes redondeados `rounded-2xl`
  - Borde blanco semitransparente
  - Sombra
- [ ] **Título**: "Bienvenido" en blanco, grande y bold
- [ ] **Subtítulo**: "Sistema ERP - G y H Construcciones SPA" en gris claro

#### Inputs:
- [ ] **Input Usuario**:
  - Fondo oscuro semitransparente (`bg-slate-800/50`)
  - Borde gris (`border-slate-700`)
  - Icono de usuario a la izquierda
  - Icono cambia a azul cuando está enfocado
  - Placeholder: "admin@constructora.com"
- [ ] **Input Contraseña**:
  - Mismo estilo que usuario
  - Icono de candado a la izquierda
  - Botón de mostrar/ocultar a la derecha
  - Placeholder: "••••••••"

#### Botón:
- [ ] **Botón "Ingresar"**:
  - Gradiente azul a indigo (`from-blue-600 to-indigo-600`)
  - Sombra azul (`shadow-blue-900/50`)
  - Icono de flecha a la derecha
  - Efecto de escala al hacer click (`active:scale-95`)
  - Deshabilitado inicialmente (hasta que se verifique el backend)

#### Credenciales de Prueba:
- [ ] **Aparece cuando backend está OFFLINE**:
  - Fondo oscuro semitransparente
  - Borde gris
  - Texto con colores: azul (Admin), verde (Trabajador), púrpura (Cliente)

### 2. Verificar Funcionalidad

#### Estado del Backend:
- [ ] Badge muestra "CHECKING" inicialmente (gris con pulse)
- [ ] Después de 3 segundos, cambia a:
  - **ONLINE** (verde) si el backend está activo
  - **OFFLINE** (rojo) si el backend no está activo
- [ ] Credenciales de prueba aparecen solo cuando está OFFLINE

#### Login:
- [ ] Botón se habilita después de verificar backend
- [ ] Al hacer click, muestra "Iniciando..." y deshabilita el botón
- [ ] Si hay error, muestra alerta roja
- [ ] Si es exitoso, redirige según el rol

### 3. Dashboards - Verificar Layout Manager

#### Panel Jefe (`panel-jefe.html`):
- [ ] **Sidebar oscuro** (`bg-slate-900`) visible a la izquierda
- [ ] **Sidebar colapsable**: Click en botón del header colapsa/expande
- [ ] **Header con glassmorphism**: `bg-white/80 backdrop-blur-md`
- [ ] **Navegación**: Dashboard, Proyectos, Usuarios, Mensajes
- [ ] **Avatar**: Gradiente azul/indigo con inicial del usuario
- [ ] **Contenido**: Se muestra en el área principal

#### Dashboard Cliente (`dashboard-cliente.html`):
- [ ] **Sidebar oscuro** visible
- [ ] **Header con glassmorphism**
- [ ] **Avatar**: Gradiente púrpura/rosa
- [ ] **Navegación**: Dashboard, Proyectos, Mensajes (sin Configuración)
- [ ] **Diseño gamificado**: Colores vibrantes, animaciones

#### Dashboard Trabajador (`dashboard-trabajador.html`):
- [ ] **Sidebar oscuro** visible
- [ ] **Header con glassmorphism**
- [ ] **Avatar**: Gradiente verde/teal
- [ ] **Navegación**: Dashboard, Proyectos, Mensajes, Configuración
- [ ] **Diseño operativo**: Claro y funcional

## 🐛 Problemas Comunes y Soluciones

### Problema: El fondo no se ve oscuro
**Solución:** Verificar que Tailwind CSS CDN se cargue correctamente. Revisar consola del navegador.

### Problema: Los efectos de fondo no se ven
**Solución:** Verificar que las clases `animate-pulse` y `blur-3xl` funcionen. Puede requerir recargar la página.

### Problema: El glassmorphism no se ve
**Solución:** Verificar que `backdrop-blur-lg` funcione. Algunos navegadores antiguos no lo soportan.

### Problema: El badge de estado no cambia
**Solución:** Verificar consola del navegador por errores. Verificar que `login.js` se cargue correctamente.

### Problema: El layout no se crea en dashboards
**Solución:** Verificar que `layout-manager.js` se cargue antes que los scripts de página. Verificar consola por errores.

## 📊 Comparación con React

### Login.tsx (React) vs index.html (Vanilla):
- ✅ Mismo fondo oscuro
- ✅ Mismos efectos de fondo
- ✅ Mismo glassmorphism
- ✅ Mismo badge de estado
- ✅ Mismos inputs con iconos
- ✅ Mismo botón con gradiente
- ✅ Mismas credenciales de prueba

### Layout.tsx (React) vs layout-manager.js (Vanilla):
- ✅ Mismo sidebar oscuro
- ✅ Mismo header con glassmorphism
- ✅ Misma navegación por roles
- ✅ Mismo avatar con gradiente
- ✅ Misma estructura de layout

## 🎯 Resultado Esperado

**El login debe verse exactamente igual que el proyecto React en `frontend/app/`**, con:
- Fondo oscuro elegante
- Efectos visuales modernos
- Glassmorphism
- Animaciones suaves
- Diseño profesional e innovador

---

**¡Listo para probar!** 🚀

Abre `http://localhost:8080` y verifica que el formato innovador esté restaurado.

