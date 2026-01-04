# 🏗️ ERP Constructora - Sistema de Gestión Empresarial

Sistema de Gestión Documental y Comunicación (EDMS + CRM) para empresas constructoras.

## 🏢 Sistema Modular Recursivo

**Versión 6.0.0** - Arquitectura empresarial profesional con:
- ✅ Sistema de assets modular y recursivo
- ✅ Bootstrap 5.3.3 integrado profesionalmente
- ✅ Arquitectura CSS 7-1 organizada
- ✅ Módulos con carga automática de dependencias
- ✅ Build system optimizado

## 🚀 Inicio Rápido

### Frontend HTML/JS (ACTIVO - Proyecto Principal)

**Opción 1: Usando http-server (Recomendado)**
```bash
# Desde la raíz del proyecto
npm start
# O directamente
npx http-server -p 8080 -c-1 -o
```

Abre: `http://localhost:8080`

**Opción 2: Abrir directamente**
Abre `index.html` en tu navegador

### Backend FastAPI

```bash
cd backend
python run_server.py
```

Backend en: `http://localhost:8002`

### Nota sobre `app/`
La carpeta `frontend/app/` contiene una versión alternativa en React/Vite que **NO está en uso**. El proyecto activo es el HTML/JS vanilla directamente en `frontend/`. Ver `ANALISIS_CARPETA_APP.md` para más detalles.

## 📁 Estructura del Proyecto

```
frontend/
├── index.html              # Página de login (HTML/JS Vanilla) - ACTIVO
├── index-enterprise.html   # Template empresarial con nuevo sistema
├── panel-jefe.html         # Dashboard de gerencia
├── dashboard-cliente.html  # Dashboard de cliente (FASE 4)
├── dashboard-trabajador.html # Dashboard de trabajador (FASE 5)
│
├── assets/                 # 🆕 Sistema de Assets Empresarial
│   ├── config/
│   │   └── asset-manager.js    # Gestor centralizado de assets
│   ├── css/
│   │   ├── core/
│   │   │   ├── variables.css           # Variables del sistema
│   │   │   └── bootstrap-integration.css  # Bootstrap 5.3.3
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   └── typography.css
│   │   ├── components/
│   │   │   ├── buttons.css
│   │   │   └── cards.css
│   │   └── main.css        # CSS principal (importa todo)
│   └── js/
│       └── core/
│           └── app.js      # Inicialización centralizada
│
├── css/                    # Estilos legacy (compatibilidad)
│   ├── main.css            # CSS principal compilado
│   ├── login.css           # Estilos de login
│   ├── main.scss           # Fuente SCSS
│   └── ...
│
├── js/                     # Scripts JavaScript vanilla
│   ├── auth.js             # Autenticación
│   ├── login.js            # Lógica de login
│   ├── panel-jefe.js       # Dashboard gerencia
│   └── ...
│
├── app/              # ⚠️ Frontend React (Vite) - NO EN USO
│   ├── src/         # Código fuente React (alternativo)
│   └── ...
│
├── backend/          # Backend FastAPI
│   ├── main.py
│   └── routers/
│
├── docs/             # 📚 Documentación completa
│   ├── guias/
│   ├── arquitectura/
│   └── troubleshooting/
│
├── scripts/          # 🛠️ Scripts organizados
│   ├── build/
│   └── utils/
│
├── tools/            # 🔧 Herramientas
│   └── crear-qr.html
│
└── logs/             # 📝 Logs (gitignored)
```

## 📚 Documentación

Toda la documentación está en la carpeta [`docs/`](docs/README.md):

- **Fases del Proyecto:**
  - [`FASES_PROYECTO.md`](docs/FASES_PROYECTO.md) - Descripción completa de las 6 fases
  - [`FASES_IMPLEMENTACION.md`](docs/FASES_IMPLEMENTACION.md) - Guía técnica de implementación
  - [`FASES_ROADMAP.md`](docs/FASES_ROADMAP.md) - Roadmap y evolución
  - [`FASES_INDICE.md`](docs/FASES_INDICE.md) - Índice de documentación
- **Guías:** Instalación, uso, APK, PWA
- **Arquitectura:** Estructura, CSS, diseño
- **Sistema Empresarial:** 
  - [`ARQUITECTURA_EMPRESARIAL.md`](docs/ARQUITECTURA_EMPRESARIAL.md) - Arquitectura completa
  - [`MIGRACION_SISTEMA_EMPRESARIAL.md`](docs/MIGRACION_SISTEMA_EMPRESARIAL.md) - Guía de migración
- **Backend:**
  - [`BACKEND_SETUP.md`](docs/BACKEND_SETUP.md) - Configuración del backend
  - [`INTEGRACION_FRONTEND_BACKEND.md`](docs/INTEGRACION_FRONTEND_BACKEND.md) - Integración completa
- **Troubleshooting:** Solución de problemas

Ver: [`docs/README.md`](docs/README.md) para el índice completo.

## 🛠️ Scripts Útiles

### Generar APK
```bash
scripts/build/generar-apk.bat
```

### Iniciar Servidor
```bash
scripts/utils/START_ERP.ps1
```

## 🔧 Tecnologías

- **Frontend Vanilla:** HTML5, CSS3 (Arquitectura 7-1), JavaScript ES6+
- **Bootstrap:** 5.3.3 (última versión estable)
- **Sistema de Assets:** Modular y recursivo
- **Backend:** FastAPI, Python, SQLAlchemy
- **Mobile:** Capacitor (Android/iOS)
- **PWA:** Service Worker, Web App Manifest
- **Build System:** PostCSS, Terser, SASS

## 📱 Generar APK

1. **Instalar Capacitor:**
   ```bash
   cd app
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Build y Sincronizar:**
   ```bash
   npm run build
   npx cap sync android
   ```

3. **Generar APK:**
   ```bash
   npx cap open android
   # En Android Studio: Build → Build APK(s)
   ```

Ver: [`docs/guias/GUIA_RAPIDA_APK.md`](docs/guias/GUIA_RAPIDA_APK.md) para guía completa.

## 🎯 Características

- ✅ Gestión de Proyectos
- ✅ Sistema de Archivos con Permisos
- ✅ Chat en Tiempo Real
- ✅ Control de Accesos por Roles
- ✅ PWA (Instalable)
- ✅ Responsive Design
- ✅ Modo Offline

## 📝 Credenciales Demo

**Administrador:**
- Email: `admin@constructora.com`
- Password: `admin123`

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) para detalles sobre nuestro código de conducta y el proceso para enviar pull requests.

- [Guía de Contribución](CONTRIBUTING.md)
- [Código de Conducta](CODE_OF_CONDUCT.md)
- [Política de Seguridad](SECURITY.md)

## 🔒 Seguridad

Si descubres una vulnerabilidad de seguridad, por favor **NO** abras un issue público. En su lugar, consulta nuestra [Política de Seguridad](SECURITY.md) para reportar vulnerabilidades de forma responsable.

## 🔗 Enlaces Útiles

- [Documentación Completa](docs/README.md)
- [Guía de Instalación](docs/guias/INSTALL.md)
- [Generar APK](docs/guias/GUIA_RAPIDA_APK.md)
- [Troubleshooting](docs/troubleshooting/SOLUCION_PROBLEMAS.md)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Versión:** 6.0.0  
**Última actualización:** Sistema empresarial modular recursivo implementado ✅

### 🆕 Nuevo en v6.0.0

- Sistema de assets modular y recursivo
- Bootstrap 5.3.3 integrado profesionalmente
- Arquitectura CSS 7-1 completa
- Build system optimizado
- 25 mejoras implementadas
- Sistema de módulos con carga automática de dependencias
