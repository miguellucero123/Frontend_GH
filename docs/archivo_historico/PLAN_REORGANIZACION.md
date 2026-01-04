# 📋 Plan de Reorganización del Proyecto

## 🎯 Objetivo
Reorganizar el proyecto para mejorar la mantenibilidad, claridad y profesionalismo antes de generar el APK.

## 📁 Nueva Estructura

```
frontend/
├── vanilla/              # Frontend vanilla JS (HTML/CSS/JS puro)
│   ├── index.html
│   ├── panel-*.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── sw.js
│
├── app/                  # Frontend React (Vite) - PRINCIPAL
│   ├── src/
│   ├── public/
│   ├── android/         # Proyecto Android (Capacitor)
│   ├── dist/            # Build de producción
│   └── package.json
│
├── backend/              # Backend FastAPI
│   ├── main.py
│   ├── models.py
│   └── routers/
│
├── docs/                 # 📚 TODA la documentación
│   ├── guias/
│   │   ├── instalacion.md
│   │   ├── desarrollo.md
│   │   ├── apk.md
│   │   └── pwa.md
│   ├── api/
│   ├── arquitectura/
│   └── troubleshooting/
│
├── scripts/              # 🛠️ Scripts organizados
│   ├── build/
│   ├── deploy/
│   └── utils/
│
├── tools/                # 🔧 Herramientas
│   ├── crear-qr.html
│   ├── generate-icons.html
│   └── validators/
│
├── logs/                 # 📝 Logs (gitignored)
│   └── .gitkeep
│
└── README.md             # README principal
```

## 📝 Categorización de Documentación

### Guías (docs/guias/)
- Instalación y configuración
- Desarrollo
- Generación de APK
- PWA
- Uso del sistema

### API (docs/api/)
- Documentación de endpoints
- Ejemplos de uso
- Autenticación

### Arquitectura (docs/arquitectura/)
- Estructura del proyecto
- CSS 7-1
- Decisiones de diseño

### Troubleshooting (docs/troubleshooting/)
- Solución de problemas comunes
- Debug
- Errores conocidos

## 🗂️ Archivos a Mover

### Documentación → docs/
- Todos los `.md` excepto README.md principal
- Organizados por categoría

### Scripts → scripts/
- `.bat`, `.ps1`, `.py` organizados por función

### Herramientas → tools/
- `crear-qr.html`
- `generate-icons.html`
- Validadores

### Logs → logs/
- Todos los `.txt`, `.log` de debug/build

## ✅ Checklist de Reorganización

- [ ] Crear estructura de carpetas
- [ ] Mover documentación a docs/
- [ ] Mover scripts a scripts/
- [ ] Mover herramientas a tools/
- [ ] Mover logs a logs/
- [ ] Actualizar .gitignore
- [ ] Actualizar rutas en código
- [ ] Crear README principal
- [ ] Crear índice de documentación
- [ ] Verificar que todo funciona

## 🚀 Ejecución

Este plan se ejecutará paso a paso para no romper nada.

