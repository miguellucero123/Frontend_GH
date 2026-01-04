# 🏢 Arquitectura Empresarial - Sistema Modular Recursivo

## 📋 Estructura de Assets Profesional

```
frontend/
├── assets/
│   ├── config/
│   │   └── asset-manager.js      # Gestor centralizado de assets
│   ├── css/
│   │   ├── core/
│   │   │   ├── variables.css     # Variables del sistema de diseño
│   │   │   └── bootstrap-integration.css  # Integración Bootstrap 5.3.3
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   └── typography.css
│   │   ├── layout/
│   │   │   ├── header.css
│   │   │   ├── sidebar.css
│   │   │   └── footer.css
│   │   ├── components/
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   └── forms.css
│   │   ├── pages/
│   │   │   ├── dashboard.css
│   │   │   └── login.css
│   │   ├── themes/
│   │   │   ├── dark.css
│   │   │   └── light.css
│   │   ├── utilities/
│   │   │   └── spacing.css
│   │   └── main.css              # Archivo principal (importa todo)
│   ├── js/
│   │   ├── core/
│   │   │   ├── app.js            # Inicialización centralizada
│   │   │   ├── auth.js
│   │   │   ├── api.js
│   │   │   └── state.js
│   │   ├── modules/              # Módulos recursivos
│   │   │   └── [module-name]/
│   │   │       ├── [module-name].js
│   │   │       └── [module-name].css
│   │   └── services/
│   │       └── [service-name].js
│   └── images/
│       ├── icons/
│       └── logos/
└── ...
```

## 🎯 Características Principales

### 1. Sistema de Assets Modular
- **AssetManager**: Gestión centralizada de CSS, JS e imágenes
- **Carga dinámica**: Assets se cargan bajo demanda
- **Cache inteligente**: Evita cargas duplicadas
- **Dependencias recursivas**: Los módulos cargan sus dependencias automáticamente

### 2. Bootstrap 5.3.3 Empresarial
- **Última versión**: Bootstrap 5.3.3 (estable más reciente)
- **Integración profesional**: Variables CSS personalizadas
- **Componentes customizados**: Estilo empresarial consistente
- **Glassmorphism**: Efectos de vidrio modernos
- **Dark mode nativo**: Soporte completo

### 3. Arquitectura CSS 7-1
- **Organización modular**: Separación clara de responsabilidades
- **Variables centralizadas**: Sistema de diseño consistente
- **Componentes reutilizables**: Estilos modulares
- **Temas intercambiables**: Dark/Light mode

### 4. Sistema de Módulos Recursivo
- **Carga automática**: Los módulos cargan sus dependencias
- **Registro centralizado**: Todos los módulos en un solo lugar
- **Inicialización ordenada**: Respeto de dependencias
- **Lazy loading**: Carga bajo demanda

## 🚀 Uso

### Inicialización Básica

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ERP Constructora</title>
    
    <!-- Asset Manager -->
    <script src="assets/config/asset-manager.js"></script>
    
    <!-- Core App -->
    <script src="assets/js/core/app.js"></script>
</head>
<body>
    <!-- Contenido -->
    
    <script>
        // La app se inicializa automáticamente
        document.addEventListener('app:ready', () => {
            console.log('Aplicación lista');
        });
    </script>
</body>
</html>
```

### Cargar Módulo Manualmente

```javascript
// Cargar módulo con dependencias
await assetManager.loadModule('dashboard', ['chart', 'api']);

// Verificar si está cargado
if (app.isModuleLoaded('dashboard')) {
    // Usar módulo
}
```

### Usar Asset Manager

```javascript
// Cargar Bootstrap
await assetManager.loadBootstrap({
    version: '5.3.3',
    css: true,
    js: true,
    icons: true
});

// Cargar CSS
await assetManager.loadCSS('assets/css/custom.css', 'custom-css');

// Cargar JS
await assetManager.loadJS('assets/js/plugin.js', 'plugin-js');

// Cargar múltiples assets
await assetManager.loadAssets([
    { type: 'css', href: 'style1.css' },
    { type: 'css', href: 'style2.css' },
    { type: 'js', src: 'script.js', defer: true }
]);
```

## 📦 Build System

### Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run watch:css        # Observar cambios CSS
npm run watch:js         # Observar cambios JS

# Producción
npm run build            # Build completo
npm run build:css        # Compilar CSS
npm run build:js         # Minificar JS
npm run build:assets     # Optimizar assets

# Calidad
npm run lint:css         # Linter CSS
npm run lint:js          # Linter JS
npm run validate         # Validar todo
```

## 🎨 Variables CSS Disponibles

Todas las variables están en `assets/css/core/variables.css`:

```css
/* Colores */
var(--color-primary)
var(--color-success)
var(--color-warning)
var(--color-danger)

/* Fondos */
var(--bg-primary)
var(--bg-secondary)
var(--bg-glass)

/* Texto */
var(--text-primary)
var(--text-secondary)

/* Espaciado */
var(--spacing-md)
var(--spacing-lg)

/* Y muchas más... */
```

## 🔧 Configuración

### Personalizar Bootstrap

Editar `assets/css/core/bootstrap-integration.css` para personalizar componentes Bootstrap.

### Agregar Nuevo Módulo

1. Crear carpeta en `assets/modules/[nombre-modulo]/`
2. Crear `[nombre-modulo].js` y `[nombre-modulo].css`
3. Registrar en `assets/js/core/app.js`:

```javascript
app.registerModule('miModulo', 'assets/modules/miModulo/miModulo.js', ['dependencia1']);
```

## ✅ Ventajas

1. **Modularidad**: Código organizado y reutilizable
2. **Performance**: Carga bajo demanda
3. **Mantenibilidad**: Fácil de mantener y escalar
4. **Profesional**: Estructura empresarial estándar
5. **Bootstrap actualizado**: Última versión estable
6. **Recursivo**: Dependencias automáticas

---

**Versión:** 6.0.0  
**Última actualización:** 2024

