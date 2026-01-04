# 🧪 Guía de Pruebas en Localhost

## 🚀 Iniciar el Sistema

### Paso 1: Iniciar Frontend

**Opción A: Usando npm (Recomendado)**
```bash
cd frontend
npm start
```
Esto iniciará el servidor en `http://localhost:8080` y abrirá el navegador automáticamente.

**Opción B: Usando script .bat**
```bash
# Desde la raíz del proyecto
INICIAR_SERVIDOR.bat
```

**Opción C: Manual**
```bash
cd frontend
npx http-server -p 8080 -c-1
```
Luego abre manualmente: `http://localhost:8080`

### Paso 2: Iniciar Backend (Opcional)

Si quieres probar con el backend real:
```bash
cd frontend/backend
python run_server.py
```
Backend estará en: `http://localhost:8002`

**Nota:** El sistema funciona en modo DEMO si el backend no está disponible.

## 🔐 Credenciales de Prueba

### Admin (Jefe)
- **Email:** `admin@constructora.com`
- **Contraseña:** `admin123`
- **Acceso:** Panel completo con todas las funcionalidades

### Trabajador
- **Email:** `trabajador@constructora.com`
- **Contraseña:** `trabajador123`
- **Acceso:** Dashboard operativo, registro de horas, tareas

### Cliente
- **Email:** `cliente@constructora.com`
- **Contraseña:** `cliente123`
- **Acceso:** Dashboard gamificado, encuesta, sugerencias

## ✅ Checklist de Pruebas

### 1. Login (`index.html`)

#### Diseño:
- [ ] Fondo oscuro (slate-900) con efectos blur animados
- [ ] Card con glassmorphism (transparente con blur)
- [ ] Inputs con fondo semitransparente (slate-800/50)
- [ ] Botón con gradiente azul/indigo
- [ ] Logo con efecto glow
- [ ] Indicador de estado del backend (ONLINE/OFFLINE/CHECKING)

#### Funcionalidad:
- [ ] Login con credenciales de admin funciona
- [ ] Login con credenciales de trabajador funciona
- [ ] Login con credenciales de cliente funciona
- [ ] Redirección según rol funciona
- [ ] Credenciales de prueba aparecen cuando backend está offline
- [ ] Toggle de contraseña (mostrar/ocultar) funciona
- [ ] Validación de campos funciona

### 2. Panel Jefe (`panel-jefe.html`)

#### Layout:
- [ ] Sidebar oscuro (slate-900) visible a la izquierda
- [ ] Sidebar tiene logo y nombre de empresa
- [ ] Sidebar tiene navegación: Dashboard, Proyectos, Usuarios, Mensajes
- [ ] Sidebar se colapsa al hacer click en botón del header
- [ ] Header con glassmorphism visible arriba
- [ ] Header muestra nombre y avatar del usuario
- [ ] Avatar tiene gradiente azul/indigo (jefe)
- [ ] Botón de notificaciones visible en header
- [ ] Contenido principal tiene fondo claro (slate-50)

#### Navegación:
- [ ] Click en "Dashboard" muestra sección dashboard
- [ ] Click en "Proyectos" muestra sección proyectos
- [ ] Click en "Usuarios" muestra sección usuarios
- [ ] Click en "Mensajes" muestra sección mensajes
- [ ] Item activo se resalta en azul

#### FASE 1 - Dashboard:
- [ ] Métricas financieras se muestran
- [ ] Gráficos se renderizan correctamente
- [ ] KPIs editables funcionan (solo jefe)
- [ ] Cálculos dinámicos funcionan

#### FASE 2 - Sistema de Archivos:
- [ ] Sección de archivos visible
- [ ] Carpetas separadas: Cliente, Obra, Gerencia
- [ ] Solo se muestran carpetas permitidas según rol
- [ ] Navegación de carpetas funciona
- [ ] Breadcrumb funciona

#### FASE 3 - Canales de Comunicación:
- [ ] Sección de mensajes visible
- [ ] Tabs para Cliente-Gerencia y Trabajador-Gerencia
- [ ] Chat funciona en ambos canales
- [ ] Mensajes se envían y reciben
- [ ] Badges de mensajes no leídos funcionan

#### FASE 6 - Carga de Datos:
- [ ] Sección de carga de Excel/Word visible
- [ ] Input de archivo funciona
- [ ] Progreso de carga se muestra
- [ ] Archivos se procesan correctamente

### 3. Dashboard Cliente (`dashboard-cliente.html`)

#### Layout:
- [ ] Sidebar oscuro visible
- [ ] Header con glassmorphism
- [ ] Avatar con gradiente púrpura/rosa (cliente)
- [ ] Navegación: Dashboard, Proyectos, Mensajes (sin Configuración)

#### FASE 4 - UX Gamificada:
- [ ] Progreso general con círculo animado
- [ ] Partidas del proyecto se muestran
- [ ] Animaciones de progreso funcionan
- [ ] Encuesta de satisfacción visible
- [ ] Botón "Responder Encuesta" abre modal
- [ ] Buzón de sugerencias funciona
- [ ] Colores vibrantes y diseño lúdico visible

#### Funcionalidad:
- [ ] Progreso se calcula dinámicamente
- [ ] Encuesta se puede completar
- [ ] Sugerencias se pueden enviar
- [ ] Datos se guardan correctamente

### 4. Dashboard Trabajador (`dashboard-trabajador.html`)

#### Layout:
- [ ] Sidebar oscuro visible
- [ ] Header con glassmorphism
- [ ] Avatar con gradiente verde/teal (trabajador)
- [ ] Navegación: Dashboard, Proyectos, Mensajes, Configuración

#### FASE 5 - UX Operativa:
- [ ] Registro de horas visible
- [ ] Botón "Registrar Entrada" funciona
- [ ] Botón "Registrar Salida" aparece cuando hay entrada activa
- [ ] Tareas asignadas se muestran
- [ ] Filtros de tareas funcionan (Todas, Pendientes, En Progreso, Completadas)
- [ ] Recursos de apoyo se muestran
- [ ] Click en recursos abre modal con video/imagen
- [ ] Estadísticas rápidas se muestran

#### Funcionalidad:
- [ ] Registro de horas funciona
- [ ] Tareas se pueden filtrar
- [ ] Recursos se pueden visualizar
- [ ] Estadísticas se calculan correctamente

## 🐛 Problemas Comunes y Soluciones

### Problema: Sidebar no aparece
**Solución:**
1. Verificar que `layout-manager.js` se cargue antes que los scripts de página
2. Verificar consola del navegador por errores JavaScript
3. Verificar que `auth.js` esté cargado antes de `layout-manager.js`

### Problema: Estilos de Tailwind no se aplican
**Solución:**
1. Verificar que el CDN de Tailwind se cargue correctamente
2. Verificar consola por errores de carga
3. Verificar que las clases de Tailwind estén escritas correctamente

### Problema: Contenido no se muestra en mainContent
**Solución:**
1. Verificar que el ID del contenedor sea correcto (`adminContent`, `clientMain`, `workerMain`)
2. Verificar que `layout-manager.js` se ejecute después de que el DOM esté listo
3. Verificar consola por errores JavaScript

### Problema: Navegación no funciona
**Solución:**
1. Verificar que `handleNavClick` esté implementado correctamente
2. Verificar que las secciones tengan los IDs correctos
3. Verificar que `showSection` funcione si existe

### Problema: Backend no responde
**Solución:**
1. Verificar que el backend esté corriendo en `http://localhost:8002`
2. El sistema funciona en modo DEMO si el backend no está disponible
3. Verificar credenciales de prueba que aparecen cuando backend está offline

## 📊 Resultados Esperados

### Login:
- ✅ Diseño moderno tipo React
- ✅ Indicador de estado del backend
- ✅ Credenciales de prueba visibles cuando backend offline
- ✅ Redirección correcta según rol

### Dashboards:
- ✅ Sidebar oscuro colapsable
- ✅ Header con glassmorphism
- ✅ Navegación por roles
- ✅ Avatar con gradiente según rol
- ✅ Todas las funcionalidades de las 6 fases funcionan

## 🎯 Próximos Pasos Después de las Pruebas

1. **Corregir bugs encontrados**
2. **Ajustar estilos si es necesario**
3. **Optimizar performance**
4. **Mejorar responsive design**
5. **Agregar funcionalidades adicionales**

---

**¡Listo para probar!** 🚀

Abre `http://localhost:8080` y verifica todas las funcionalidades.

