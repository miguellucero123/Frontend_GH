# Arquitectura CSS 7-1

Este proyecto utiliza la **Arquitectura CSS 7-1**, un patrón profesional y escalable para organizar archivos CSS/SASS.

## 📁 Estructura

```
css/
├── main.scss                 # Archivo principal (importa todo)
│
├── abstracts/                # 1. Abstracciones
│   ├── _variables.scss      # Variables (colores, tipografía, espaciado)
│   ├── _functions.scss      # Funciones SASS
│   ├── _mixins.scss         # Mixins reutilizables
│   └── _utilities.scss      # Clases de utilidad
│
├── base/                     # 2. Base
│   ├── _reset.scss          # Reset CSS moderno
│   ├── _typography.scss     # Sistema tipográfico
│   └── _base.scss           # Estilos base
│
├── components/               # 3. Componentes
│   ├── _buttons.scss        # Botones
│   ├── _forms.scss          # Formularios
│   ├── _cards.scss          # Tarjetas
│   ├── _modals.scss         # Modales
│   ├── _tables.scss        # Tablas
│   ├── _badges.scss        # Badges
│   └── _alerts.scss        # Alertas
│
├── layout/                   # 4. Layout
│   ├── _grid.scss          # Sistema de grid
│   ├── _header.scss        # Header
│   ├── _footer.scss        # Footer
│   ├── _sidebar.scss       # Sidebar
│   └── _container.scss     # Contenedores
│
├── pages/                    # 5. Páginas
│   ├── _login.scss         # Estilos de login
│   ├── _panel-usuario.scss # Panel de usuario
│   └── _panel-jefe.scss    # Panel de administración
│
├── themes/                   # 6. Temas
│   └── _default.scss        # Tema por defecto
│
└── vendors/                  # 7. Librerías externas
    └── _fontawesome.scss    # Font Awesome (si se necesita)
```

## 🎯 Principios

### 1. Separación de Responsabilidades
Cada carpeta tiene un propósito específico:
- **abstracts**: Configuración y herramientas
- **base**: Estilos fundamentales
- **components**: Componentes reutilizables
- **layout**: Estructura de la página
- **pages**: Estilos específicos de páginas
- **themes**: Variantes de tema
- **vendors**: Código de terceros

### 2. Orden de Importación
El orden en `main.scss` es importante:

```scss
// 1. Configuración primero
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';

// 2. Base después
@import 'base/reset';
@import 'base/typography';
@import 'base/base';

// 3. Componentes
@import 'components/buttons';
// ...

// 4. Layout
@import 'layout/grid';
// ...

// 5. Páginas específicas
@import 'pages/login';
// ...

// 6. Temas
@import 'themes/default';

// 7. Vendors
@import 'vendors/fontawesome';

// 8. Utilidades al final (para sobrescribir)
@import 'abstracts/utilities';
```

### 3. Convenciones de Nomenclatura

- **Archivos parciales**: Empiezan con `_` (underscore)
- **Clases**: BEM (Block Element Modifier) cuando sea apropiado
- **Variables**: kebab-case (`$color-primary`)
- **Mixins**: kebab-case (`@mixin button-variant`)

## 🛠️ Uso

### Compilar SASS

```bash
# Compilar una vez
npm run build:css

# Compilar y observar cambios
npm run watch:css
```

### Agregar Nuevos Componentes

1. Crea el archivo en la carpeta correspondiente:
   ```scss
   // css/components/_nuevo-componente.scss
   ```

2. Importa en `main.scss`:
   ```scss
   @import 'components/nuevo-componente';
   ```

3. Compila:
   ```bash
   npm run build:css
   ```

## 📚 Recursos

- [Sass Guidelines](https://sass-guidelin.es/)
- [7-1 Pattern](https://sass-guidelin.es/#architecture)
- [BEM Methodology](http://getbem.com/)

## ✨ Ventajas

1. **Escalable**: Fácil agregar nuevos componentes
2. **Mantenible**: Cada archivo tiene un propósito claro
3. **Profesional**: Sigue estándares de la industria
4. **Organizado**: Fácil encontrar y modificar código
5. **Reutilizable**: Componentes y mixins compartidos

---

**Última actualización:** 2024

