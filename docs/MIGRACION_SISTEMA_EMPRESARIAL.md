# 🚀 Guía de Migración al Sistema Empresarial

## 📋 Resumen de Cambios

Se ha implementado un **sistema modular recursivo** con arquitectura empresarial profesional:

### ✅ Implementado

1. **Sistema de Assets Profesional**
   - `assets/config/asset-manager.js` - Gestor centralizado
   - Carga dinámica de CSS, JS e imágenes
   - Cache inteligente
   - Dependencias recursivas

2. **Bootstrap 5.3.3 Empresarial**
   - Última versión estable
   - Integración profesional con variables CSS
   - Componentes customizados
   - Dark mode nativo

3. **Arquitectura CSS 7-1**
   - Estructura modular organizada
   - Variables centralizadas
   - Componentes reutilizables
   - Temas intercambiables

4. **Sistema de Módulos Recursivo**
   - Carga automática de dependencias
   - Registro centralizado
   - Inicialización ordenada
   - Lazy loading

5. **Build System Profesional**
   - Scripts de build optimizados
   - Minificación automática
   - Linters configurados
   - Validación de código

## 🔄 Migración Paso a Paso

### Paso 1: Actualizar HTML Principal

**Antes:**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="css/styles.css">
```

**Después:**
```html
<!-- Asset Manager primero -->
<script src="assets/config/asset-manager.js"></script>
<script src="assets/js/core/app.js"></script>

<!-- CSS Principal -->
<link rel="stylesheet" href="assets/css/main.css">
```

### Paso 2: Usar Asset Manager para Bootstrap

El Bootstrap ahora se carga automáticamente a través del Asset Manager:

```javascript
// Se carga automáticamente al inicializar la app
// O manualmente:
await assetManager.loadBootstrap({
    version: '5.3.3',
    css: true,
    js: true,
    icons: true
});
```

### Paso 3: Migrar Estilos CSS

Los estilos antiguos en `css/styles.css` se mantienen por compatibilidad, pero se recomienda migrar a la nueva estructura:

**Antes:**
```css
/* En css/styles.css */
.my-button {
    background: #3b82f6;
    color: white;
}
```

**Después:**
```css
/* En assets/css/components/buttons.css */
.my-button {
    background: var(--color-primary);
    color: var(--text-primary);
}
```

### Paso 4: Usar Variables CSS

Todas las variables están disponibles globalmente:

```css
/* Usar variables en lugar de valores hardcodeados */
.card {
    background: var(--bg-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    color: var(--text-primary);
}
```

### Paso 5: Registrar Módulos

Para módulos nuevos, registrarlos en `assets/js/core/app.js`:

```javascript
app.registerModule('miModulo', 'assets/modules/miModulo/miModulo.js', ['dependencia1', 'dependencia2']);
```

## 📁 Estructura de Archivos

### Nueva Estructura

```
assets/
├── config/
│   └── asset-manager.js
├── css/
│   ├── core/
│   │   ├── variables.css
│   │   └── bootstrap-integration.css
│   ├── base/
│   │   ├── reset.css
│   │   └── typography.css
│   ├── components/
│   │   ├── buttons.css
│   │   └── cards.css
│   └── main.css
└── js/
    └── core/
        └── app.js
```

### Archivos Antiguos (Mantener por Compatibilidad)

```
css/
├── styles.css          # Mantener
├── main.css            # Mantener
└── mobile.css          # Mantener

js/
└── [archivos existentes]  # Mantener
```

## 🎯 Ejemplo de Uso Completo

### HTML Template Empresarial

Ver `index-enterprise.html` para un ejemplo completo de cómo usar el nuevo sistema.

### Cargar Módulo con Dependencias

```javascript
// El módulo carga automáticamente sus dependencias
await assetManager.loadModule('dashboard', ['chart', 'api', 'state']);

// Verificar si está cargado
if (app.isModuleLoaded('dashboard')) {
    // Usar módulo
    window.dashboard.init();
}
```

### Usar Variables CSS

```html
<div class="card" style="background: var(--bg-glass); border-color: var(--border-color);">
    <h3 style="color: var(--text-primary);">Título</h3>
    <p style="color: var(--text-secondary);">Contenido</p>
</div>
```

## ⚙️ Configuración

### Personalizar Bootstrap

Editar `assets/css/core/bootstrap-integration.css`:

```css
/* Personalizar botones Bootstrap */
.btn-primary {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    /* ... más estilos ... */
}
```

### Agregar Nuevo Tema

1. Crear `assets/css/themes/[nombre-tema].css`
2. Definir variables del tema
3. Importar en `assets/css/main.css`

## 🔧 Build Commands

```bash
# Desarrollo
npm run dev              # Servidor con hot reload
npm run watch:css        # Observar cambios CSS
npm run watch:js         # Observar cambios JS

# Producción
npm run build            # Build completo optimizado
npm run build:css        # Compilar y minificar CSS
npm run build:js         # Minificar JavaScript

# Calidad
npm run lint:css         # Validar CSS
npm run lint:js          # Validar JavaScript
npm run validate         # Validar todo
```

## ✅ Checklist de Migración

- [ ] Actualizar HTML principal con Asset Manager
- [ ] Reemplazar referencias a Bootstrap CDN
- [ ] Migrar estilos a nueva estructura CSS
- [ ] Usar variables CSS en lugar de valores hardcodeados
- [ ] Registrar módulos en app.js
- [ ] Probar carga de módulos recursivos
- [ ] Verificar que Bootstrap 5.3.3 se carga correctamente
- [ ] Probar build de producción
- [ ] Validar con linters

## 🚨 Notas Importantes

1. **Compatibilidad**: Los archivos antiguos se mantienen para compatibilidad
2. **Migración Gradual**: Puedes migrar página por página
3. **Bootstrap**: Ahora se carga vía Asset Manager, no CDN directo
4. **Variables**: Usar variables CSS para consistencia
5. **Módulos**: Registrar todos los módulos en app.js

## 📚 Documentación Adicional

- `docs/ARQUITECTURA_EMPRESARIAL.md` - Arquitectura completa
- `assets/css/core/variables.css` - Todas las variables disponibles
- `assets/config/asset-manager.js` - API del Asset Manager

---

**Versión:** 6.0.0  
**Fecha:** 2024

