# 🔗 Conexión de HTML y Fases - Sistema Completo

## ✅ Estado: TODOS LOS HTML CONECTADOS

---

## 📋 Mapa de Navegación Completo

### Páginas Principales

| HTML | Rol | Fase | Ruta Router | Estado |
|------|-----|------|-------------|--------|
| `index.html` | Todos | - | `login` | ✅ Conectado |
| `panel-jefe.html` | Jefe/Admin | FASE 1, 2, 6 | `dashboard-jefe` | ✅ Conectado |
| `dashboard-cliente.html` | Cliente | FASE 4 | `dashboard-cliente` | ✅ Conectado |
| `dashboard-trabajador.html` | Trabajador | FASE 5 | `dashboard-trabajador` | ✅ Conectado |
| `panel-usuario.html` | Cliente/Trabajador | FASE 2, 3 | `panel-usuario` | ✅ Conectado |
| `mensajeria.html` | Jefe/Admin | FASE 3 | `mensajeria` | ✅ Conectado |
| `gestion-archivos.html` | Jefe/Admin | FASE 2 | `gestion-archivos` | ✅ Conectado |

### Chats (FASE 3)

| HTML | Roles | Ruta Router | Estado |
|------|-------|-------------|--------|
| `chats/chat_gerencia_trabajadores.html` | Jefe, Admin, Trabajador | `chat-gerencia-trabajadores` | ✅ Conectado |
| `chats/chat_cliente_gerencia.html` | Jefe, Admin, Cliente | `chat-cliente-gerencia` | ✅ Conectado |

---

## 🔄 Flujo de Navegación

### 1. Login → Dashboard por Rol

```
index.html (login)
    ↓
[Autenticación exitosa]
    ↓
┌─────────────────────────────────┐
│ Router detecta rol y redirige: │
└─────────────────────────────────┘
    │
    ├─→ Jefe/Admin → panel-jefe.html
    ├─→ Cliente → dashboard-cliente.html
    └─→ Trabajador → dashboard-trabajador.html
```

### 2. Navegación entre Secciones

**panel-jefe.html** (FASE 1):
- `#dashboard` → Dashboard principal
- `#proyectos` → Gestión de proyectos
- `#usuarios` → Gestión de usuarios
- `#mensajeria` → Sistema de mensajería (FASE 3)
- `#configuracion` → Configuración

**panel-jefe.html** (FASE 2):
- `#documentos` → Gestor documental

**panel-jefe.html** (FASE 6):
- `#excel-upload` → Carga de Excel/Word

### 3. Navegación entre Páginas

Todas las páginas están conectadas mediante:
- ✅ Router centralizado (`js/core/router.js`)
- ✅ Navegación unificada (`js/core/navigation.js`)
- ✅ Gestor de fases (`js/core/phase-manager.js`)
- ✅ Auth con redirección automática

---

## 🎯 Sistema de Fases Implementado

### FASE 1: Datos de Gerencia ✅
- **HTML:** `panel-jefe.html`
- **Secciones:** `#dashboard`, `#proyectos`, `#usuarios`
- **Módulos:** GestorGerencia, DashboardInteractive, PredictiveAnalysis
- **Estado:** ✅ COMPLETADO

### FASE 2: Gestor Documental ✅
- **HTML:** `panel-jefe.html#documentos`, `gestion-archivos.html`, `panel-usuario.html`
- **Módulos:** FileSystemManager, DocumentService
- **Estado:** ✅ IMPLEMENTADO

### FASE 3: Canales de Comunicación ✅
- **HTML:** `mensajeria.html`, `chats/chat_gerencia_trabajadores.html`, `chats/chat_cliente_gerencia.html`
- **Módulos:** ChatChannelsManager, ChatManager
- **Estado:** ✅ IMPLEMENTADO

### FASE 4: UX Cliente Gamificada ✅
- **HTML:** `dashboard-cliente.html`
- **Módulos:** ClientDashboard, GamificationSystem
- **Estado:** ✅ IMPLEMENTADO

### FASE 5: UX Trabajador Operativa ✅
- **HTML:** `dashboard-trabajador.html`
- **Módulos:** WorkerDashboard, TaskManager
- **Estado:** ✅ IMPLEMENTADO

### FASE 6: Automatización Excel ✅
- **HTML:** `panel-jefe.html#excel-upload`
- **Módulos:** ExcelProcessor, DocumentUpload
- **Estado:** ✅ IMPLEMENTADO

---

## 🔧 Integración del Router

### En cada HTML:

```html
<!-- Router y Navegación -->
<script src="js/core/router.js"></script>
<script src="js/core/phase-manager.js"></script>
<script src="js/core/navigation.js"></script>
```

### Uso del Router:

```javascript
// Navegar a una ruta
window.router.navigate('dashboard-jefe', { section: 'proyectos' });

// Navegar a una fase
window.phaseManager.navigateToPhase('fase2');

// Obtener rutas disponibles
const routes = window.router.getAvailableRoutes();
```

---

## 🛡️ Protección de Rutas

Todas las páginas están protegidas:

```javascript
// En cada página HTML
document.addEventListener('DOMContentLoaded', () => {
    if (typeof auth !== 'undefined') {
        if (!auth.requireAuth()) {
            return; // Redirige automáticamente
        }
        
        // Verificar rol si es necesario
        const user = auth.getCurrentUser();
        const role = user?.role || user?.rol;
        
        // El router verifica permisos automáticamente
    }
});
```

---

## 📊 Matriz de Conexiones

| Desde | Hacia | Método | Estado |
|-------|-------|--------|--------|
| `index.html` | `panel-jefe.html` | Router (rol jefe) | ✅ |
| `index.html` | `dashboard-cliente.html` | Router (rol cliente) | ✅ |
| `index.html` | `dashboard-trabajador.html` | Router (rol trabajador) | ✅ |
| `panel-jefe.html` | `#dashboard` | Hash navigation | ✅ |
| `panel-jefe.html` | `#proyectos` | Hash navigation | ✅ |
| `panel-jefe.html` | `#documentos` | Hash navigation (FASE 2) | ✅ |
| `panel-jefe.html` | `#excel-upload` | Hash navigation (FASE 6) | ✅ |
| `panel-jefe.html` | `mensajeria.html` | Router | ✅ |
| `panel-jefe.html` | `gestion-archivos.html` | Router | ✅ |
| `dashboard-cliente.html` | `panel-usuario.html` | Router | ✅ |
| `dashboard-trabajador.html` | `panel-usuario.html` | Router | ✅ |

---

## ✅ Verificación de Conexiones

### Checklist:

- [x] `index.html` → Redirige según rol después de login
- [x] `panel-jefe.html` → Todas las secciones funcionan
- [x] `dashboard-cliente.html` → Conectado a panel-usuario
- [x] `dashboard-trabajador.html` → Conectado a panel-usuario
- [x] `panel-usuario.html` → Conectado desde cliente/trabajador
- [x] `mensajeria.html` → Accesible desde panel-jefe
- [x] `gestion-archivos.html` → Accesible desde panel-jefe
- [x] Chats FASE 3 → Conectados correctamente
- [x] Router centralizado → Funcionando
- [x] Gestor de fases → Implementado
- [x] Navegación unificada → Activa

---

## 🚀 Cómo Navegar

### Desde Código:

```javascript
// Usar router
window.router.navigate('dashboard-jefe', { section: 'proyectos' });

// Usar gestor de fases
window.phaseManager.navigateToPhase('fase2');

// Navegación directa (fallback)
window.location.href = 'panel-jefe.html#proyectos';
```

### Desde HTML:

```html
<!-- Con router -->
<a href="#" data-route="dashboard-jefe" data-section="proyectos">Proyectos</a>

<!-- Directo -->
<a href="panel-jefe.html#proyectos">Proyectos</a>
```

---

## 📝 Notas Importantes

1. **Router es opcional**: Si no está disponible, se usa navegación directa
2. **Protección automática**: Auth verifica permisos en cada página
3. **Hash navigation**: Para secciones dentro de la misma página
4. **Fases independientes**: Cada fase puede funcionar independientemente
5. **Dependencias**: El gestor de fases verifica dependencias antes de permitir acceso

---

**Versión:** 6.0.0  
**Estado:** ✅ TODOS LOS HTML CONECTADOS Y FUNCIONANDO

