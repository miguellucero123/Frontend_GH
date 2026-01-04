# 🗃️ Inventario y Organización del Proyecto - ERP Constructora G&H

Este documento sirve como guía para la nueva estructura organizada del proyecto. Se ha realizado una limpieza profunda de la raíz para mejorar la mantenibilidad.

## 📁 Estructura Principal

### 🌐 Frontend (Raíz) - Enterprise Ready
- `index.html`: Acceso principal (Login).
- `panel-jefe.html`: Dashboard administrativo central (Gerencia - Fase 1 Refactorizado).
- `dashboard-cliente.html`: Interfaz para clientes.
- `dashboard-trabajador.html`: Interfaz para trabajadores de obra.
- `js/services/`: **Core Enterprise Services** (StateManager, ProjectService, UserService).
- `js/`: Lógica modular del sistema.
- `css/`: Estilos centralizados y diseño responsivo.
- `assets/`: Recursos visuales y logotipos.

### ⚙️ Backend
- `backend/`: API construida con FastAPI, modelos de base de datos y lógica de automatización.
- `erp_construction.db`: Base de datos SQLite del sistema.

### 📚 Documentación (`docs/`)
La documentación se ha categorizado para facilitar su consulta:
- `docs/guias_usuario/`: Manuales de uso, instalación y ejecución.
- `docs/reportes_sesion/`: Historial de avances, revisiones y diarios de desarrollo.
- `docs/soluciones_errores/`: Guías de debugging y correcciones aplicadas.
- `docs/verificaciones/`: Checklist de pruebas y estado de funcionalidades.
- `docs/archivo_historico/`: Versiones anteriores, notas técnicas y documentación de fases completadas.

### 🛠️ Herramientas y Scripts
- `EJECUTAR.bat`: Script principal para iniciar el sistema (Vite + Backend).
- `scripts/bat/`: Todos los auxiliares de inicio, detención y configuración.
- `tools/`: Herramientas de generación de iconos y diagnósticos.

## 🚀 Cómo Iniciar
1. Use `EJECUTAR.bat` en la raíz para iniciar el entorno de desarrollo.
2. Consulte `docs/guias_usuario/GUIA_INICIO_RAPIDO.md` para más detalles.

---
**Nota**: Se ha mantenido la integridad de los archivos HTML principales sin modificar sus rutas internas para asegurar la compatibilidad con el sistema actual.
