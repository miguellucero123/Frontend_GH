# Estructura del Proyecto - Guía Técnica

## 📁 Organización de Archivos

```
frontend/
│
├── 📄 index.html              # Página principal de Login
├── 📄 panel-usuario.html      # Panel para Trabajador/Cliente
├── 📄 panel-jefe.html         # Panel de Administración
│
├── 📁 css/                    # Hojas de Estilo
│   ├── styles.css             # Estilos base, variables CSS, componentes comunes
│   ├── login.css              # Estilos específicos del login
│   ├── panel-usuario.css      # Estilos del panel de usuario
│   └── panel-jefe.css         # Estilos del panel de administración
│
├── 📁 js/                     # JavaScript
│   ├── config.js              # ⚙️ Configuración centralizada del sistema
│   ├── utils.js               # 🛠️ Utilidades generales (formateo, validación, etc.)
│   ├── auth.js                # 🔐 Gestión de autenticación y sesión
│   ├── api.js                 # 🌐 Cliente HTTP para comunicación con backend
│   ├── login.js               # 📝 Lógica del formulario de login
│   ├── file-manager.js        # 📁 Gestor de archivos y carpetas
│   ├── chat.js                # 💬 Sistema de chat en tiempo real
│   ├── panel-usuario.js       # 👤 Lógica del panel de usuario
│   └── panel-jefe.js          # 👑 Lógica del panel de administración
│
├── 📁 assets/                 # Recursos Estáticos
│   └── logo-constructora.svg  # Logo de la empresa
│
└── 📁 docs/                   # Documentación
    ├── README.md              # Documentación principal
    ├── INSTALL.md             # Guía de instalación detallada
    ├── QUICK_START.md         # Inicio rápido
    ├── CHANGELOG.md           # Historial de cambios
    └── ESTRUCTURA.md          # Este archivo
```

## 🔗 Dependencias entre Archivos

### Orden de Carga de Scripts

Los scripts deben cargarse en este orden:

1. **config.js** - Configuración (debe cargarse primero)
2. **utils.js** - Utilidades (usa CONFIG)
3. **auth.js** - Autenticación (usa Utils)
4. **api.js** - Cliente API (usa auth y CONFIG)
5. **file-manager.js** - Gestor de archivos (usa api)
6. **chat.js** - Chat (usa api y auth)
7. **login.js** / **panel-usuario.js** / **panel-jefe.js** - Lógica específica

### Dependencias de CSS

- `styles.css` debe cargarse primero (contiene variables CSS y estilos base)
- Los demás CSS pueden cargarse en cualquier orden

## 🎯 Responsabilidades de Cada Módulo

### config.js
- **Propósito:** Configuración centralizada
- **Contiene:** URLs, timeouts, límites de archivos, opciones de debug
- **Usado por:** Todos los módulos

### utils.js
- **Propósito:** Funciones auxiliares reutilizables
- **Contiene:** Formateo (fechas, monedas, archivos), validaciones, notificaciones
- **Usado por:** Todos los módulos

### auth.js
- **Propósito:** Gestión de autenticación
- **Contiene:** Login, logout, verificación de roles, redirección
- **Usado por:** Todos los módulos que requieren autenticación

### api.js
- **Propósito:** Comunicación con backend
- **Contiene:** Métodos HTTP (GET, POST, PUT, DELETE), upload de archivos
- **Usado por:** Módulos que necesitan datos del backend

### file-manager.js
- **Propósito:** Gestión de archivos y carpetas
- **Contiene:** Navegación, renderizado, vista previa, descarga
- **Usado por:** panel-usuario.js, panel-jefe.js

### chat.js
- **Propósito:** Sistema de chat
- **Contiene:** Envío/recepción de mensajes, WebSocket, notificaciones
- **Usado por:** panel-usuario.js, panel-jefe.js

### login.js
- **Propósito:** Lógica del formulario de login
- **Contiene:** Validación, envío de credenciales, manejo de errores
- **Usado por:** index.html

### panel-usuario.js
- **Propósito:** Lógica del panel de usuario
- **Contiene:** Carga de proyecto, inicialización de componentes
- **Usado por:** panel-usuario.html

### panel-jefe.js
- **Propósito:** Lógica del panel de administración
- **Contiene:** Dashboard, CRUD de proyectos, gestión de usuarios, mensajes
- **Usado por:** panel-jefe.html

## 🔄 Flujo de Datos

```
Usuario
  ↓
HTML (Interfaz)
  ↓
JavaScript (Lógica)
  ↓
api.js (Cliente HTTP)
  ↓
Backend API
  ↓
Base de Datos
```

## 🎨 Flujo de Estilos

```
styles.css (Base)
  ↓
login.css / panel-usuario.css / panel-jefe.css (Específicos)
  ↓
Variables CSS (--color-primary, etc.)
  ↓
Renderizado en Navegador
```

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales (index.html)
   ↓
2. login.js valida y envía a api.js
   ↓
3. api.js → Backend → Verifica credenciales
   ↓
4. auth.js guarda token y usuario
   ↓
5. auth.js redirige según rol
   ↓
6. Panel correspondiente carga datos
```

## 📦 Variables Globales

### window.CONFIG
Configuración del sistema (definida en `config.js`)

### window.Utils
Utilidades generales (definida en `utils.js`)

### window.auth
Instancia de AuthManager (definida en `auth.js`)

### window.api
Instancia de APIClient (definida en `api.js`)

### window.fileManager
Instancia de FileManager (definida en `file-manager.js`)

### window.chatManager
Instancia de ChatManager (definida en `chat.js`)

## 🚀 Extensibilidad

### Agregar Nueva Funcionalidad

1. **Nuevo módulo JS:**
   - Crear archivo en `js/`
   - Agregar script tag en HTML correspondiente
   - Usar `CONFIG`, `Utils`, `auth`, `api` según necesidad

2. **Nuevo estilo:**
   - Agregar CSS en archivo existente o crear nuevo
   - Usar variables CSS de `styles.css`
   - Agregar link tag en HTML

3. **Nueva página:**
   - Crear HTML
   - Incluir scripts necesarios en orden correcto
   - Agregar estilos correspondientes

## 📝 Notas de Desarrollo

- **Modo Debug:** Activar `CONFIG.DEBUG = true` para ver logs
- **Validación:** Usar `Utils` para validaciones comunes
- **Notificaciones:** Usar `Utils.showNotification()` para feedback al usuario
- **Formateo:** Usar `Utils.format*()` para datos consistentes
- **Errores:** Manejar errores con try/catch y mostrar notificaciones

---

**Última actualización:** 2024

