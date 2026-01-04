# Guía de Uso del Sistema CSS 7-1

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Compilar CSS

```bash
# Compilar una vez
npm run build:css

# Compilar y observar cambios (desarrollo)
npm run watch:css
```

Esto generará:
- `css/main.css` - Versión expandida (desarrollo)
- `css/main.min.css` - Versión minificada (producción)

### 3. Usar en HTML

Reemplaza los enlaces a CSS antiguos con:

```html
<!-- Para desarrollo -->
<link rel="stylesheet" href="css/main.css">

<!-- Para producción -->
<link rel="stylesheet" href="css/main.min.css">
```

## 📁 Estructura de Archivos

```
css/
├── main.scss              # ⚠️ NO EDITAR DIRECTAMENTE (solo imports)
│
├── abstracts/             # Configuración
│   ├── _variables.scss   # Variables (colores, tipografía, etc.)
│   ├── _functions.scss   # Funciones SASS
│   ├── _mixins.scss      # Mixins reutilizables
│   └── _utilities.scss   # Clases de utilidad
│
├── base/                  # Fundamentos
│   ├── _reset.scss       # Reset CSS
│   ├── _typography.scss  # Tipografía
│   └── _base.scss        # Estilos base
│
├── components/            # Componentes
│   ├── _buttons.scss
│   ├── _forms.scss
│   ├── _cards.scss
│   └── ...
│
├── layout/               # Layout
│   ├── _grid.scss
│   ├── _header.scss
│   └── ...
│
├── pages/                # Páginas específicas
│   ├── _login.scss
│   └── ...
│
├── themes/               # Temas
│   └── _default.scss
│
└── vendors/              # Librerías externas
    └── _fontawesome.scss
```

## 🎨 Personalización

### Cambiar Colores

Edita `css/abstracts/_variables.scss`:

```scss
$color-primary: #0066cc;        // Color principal
$color-primary-dark: #0052a3;   // Color principal oscuro
$color-success: #28a745;        // Color de éxito
// ... más colores
```

### Agregar Nuevo Componente

1. Crea `css/components/_mi-componente.scss`
2. Agrega estilos
3. Importa en `css/main.scss`:
   ```scss
   @import 'components/mi-componente';
   ```
4. Compila: `npm run build:css`

### Usar Mixins

```scss
// En tu componente
.mi-boton {
    @include button-variant($color-primary, $color-primary);
    @include border-radius($border-radius-lg);
}
```

### Usar Variables

```scss
.mi-elemento {
    color: $color-primary;
    padding: $spacer;
    font-size: $font-size-lg;
}
```

## 📚 Componentes Disponibles

### Botones

```html
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-success">Éxito</button>
<button class="btn btn-outline-primary">Outline</button>
<button class="btn btn-lg">Grande</button>
<button class="btn btn-sm">Pequeño</button>
```

### Formularios

```html
<div class="form-group">
    <label class="form-label">Nombre</label>
    <input type="text" class="form-control" placeholder="Ingresa tu nombre">
</div>
```

### Cards

```html
<div class="card">
    <div class="card-header">Título</div>
    <div class="card-body">
        <h5 class="card-title">Card Title</h5>
        <p class="card-text">Contenido...</p>
    </div>
    <div class="card-footer">Footer</div>
</div>
```

### Grid System

```html
<div class="container">
    <div class="row">
        <div class="col-md-6">Columna 1</div>
        <div class="col-md-6">Columna 2</div>
    </div>
</div>
```

## 🔧 Utilidades

### Espaciado

```html
<div class="mt-3 mb-4 p-2">Margin top 3, margin bottom 4, padding 2</div>
```

### Display

```html
<div class="d-flex justify-content-between align-items-center">
    Flexbox con espacio entre y centrado vertical
</div>
```

### Texto

```html
<p class="text-center text-primary font-weight-bold">
    Texto centrado, color primario, negrita
</p>
```

## ⚠️ Notas Importantes

1. **NO edites `main.css` directamente** - Se regenera al compilar
2. **Siempre edita archivos `.scss`** en las carpetas correspondientes
3. **Compila después de cambios** - `npm run build:css`
4. **Usa variables y mixins** - Mantén consistencia
5. **Sigue la estructura 7-1** - Organiza bien tu código

## 🐛 Solución de Problemas

### Error: "sass no encontrado"

```bash
npm install sass --save-dev
```

### Error: "Archivo no encontrado"

Verifica que los imports en `main.scss` sean correctos y que los archivos existan.

### Los estilos no se aplican

1. Verifica que compilaste: `npm run build:css`
2. Verifica que el HTML apunta al CSS correcto
3. Limpia la caché del navegador (Ctrl+F5)

## 📖 Recursos

- [Documentación SASS](https://sass-lang.com/documentation)
- [Arquitectura 7-1](https://sass-guidelin.es/#architecture)
- [CSS_ARCHITECTURE.md](CSS_ARCHITECTURE.md) - Documentación detallada

---

**Última actualización:** 2024

