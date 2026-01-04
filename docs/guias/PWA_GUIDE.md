# Guía Completa de Progressive Web App (PWA)

Esta guía explica cómo funciona la PWA y cómo usarla.

## 🎯 ¿Qué es una PWA?

Una Progressive Web App (PWA) es una aplicación web que se comporta como una aplicación nativa. Puede:

- ✅ Instalarse en el dispositivo
- ✅ Funcionar offline
- ✅ Enviar notificaciones push
- ✅ Acceder a funciones del dispositivo
- ✅ Publicarse en tiendas de aplicaciones

## 📱 Instalación

### En Android (Chrome/Edge)

1. Abre la aplicación en Chrome o Edge
2. Verás un banner o menú con "Instalar aplicación"
3. Toca "Instalar"
4. La app aparecerá en tu pantalla de inicio

### En iOS (Safari)

1. Abre la aplicación en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma el nombre y toca "Añadir"

### En Desktop (Chrome/Edge)

1. Abre la aplicación en Chrome o Edge
2. Verás un icono de instalación en la barra de direcciones
3. Haz clic en "Instalar"
4. La app se abrirá en su propia ventana

## 🔧 Características Implementadas

### 1. Service Worker

El Service Worker permite:

- **Cache de archivos:** Los archivos se guardan localmente
- **Funcionamiento offline:** La app funciona sin internet (limitado)
- **Actualizaciones automáticas:** Se actualiza cuando hay nueva versión

**Ubicación:** `sw.js`

### 2. Web App Manifest

Define cómo se ve la app cuando está instalada:

- **Nombre y descripción**
- **Iconos en diferentes tamaños**
- **Colores del tema**
- **Orientación de pantalla**

**Ubicación:** `manifest.json`

### 3. Instalación Programática

El botón "Instalar App" aparece automáticamente cuando:

- La app cumple los criterios de instalación
- El usuario no la ha instalado aún
- El navegador soporta instalación

**Módulo:** `js/pwa.js`

## 📲 Funcionalidades Móviles

### Modo Standalone

Cuando la app está instalada, se abre en modo standalone:

- Sin barra de direcciones
- Sin botones del navegador
- Experiencia similar a app nativa

### Safe Area

La app respeta las áreas seguras de dispositivos con notch:

- Padding automático en áreas no seguras
- Contenido visible en toda la pantalla

### Touch Optimizations

Optimizaciones para pantallas táctiles:

- Áreas táctiles mínimas de 44x44px
- Feedback visual al tocar
- Scroll suave

## 🔄 Actualizaciones

### Actualización Automática

1. El Service Worker verifica actualizaciones cada minuto
2. Si hay nueva versión, se muestra notificación
3. El usuario puede actualizar tocando el botón

### Actualización Manual

```javascript
// Forzar actualización
pwaManager.checkForUpdates();
pwaManager.reloadApp();
```

## 📊 Estado de la PWA

Puedes verificar el estado de la PWA:

```javascript
const info = pwaManager.getAppInfo();
console.log(info);
// {
//   isInstalled: true/false,
//   isStandalone: true/false,
//   canInstall: true/false,
//   platform: 'android' | 'ios' | 'other'
// }
```

## 🎨 Personalización

### Cambiar Colores del Tema

Edita `manifest.json`:

```json
{
  "theme_color": "#2563eb",      // Color de la barra de estado
  "background_color": "#ffffff"   // Color de fondo al cargar
}
```

### Cambiar Iconos

1. Genera iconos en diferentes tamaños (usa `generate-icons.html`)
2. Coloca en `assets/icons/`
3. Actualiza referencias en `manifest.json`

### Cambiar Nombre

Edita `manifest.json`:

```json
{
  "name": "Tu Nombre de App",
  "short_name": "App"
}
```

## 🐛 Solución de Problemas

### La app no se puede instalar

**Causas comunes:**
- No está en HTTPS (requerido)
- Falta el manifest.json
- El Service Worker no está registrado
- No cumple criterios de instalación

**Solución:**
1. Verifica que estés en HTTPS
2. Abre DevTools → Application → Manifest
3. Revisa errores en la consola

### No funciona offline

**Causas:**
- Service Worker no registrado
- Archivos no cacheados
- Peticiones a API externa

**Solución:**
1. Verifica Service Worker en DevTools → Application → Service Workers
2. Revisa Cache Storage
3. Las peticiones API siempre requieren conexión

### Los iconos no aparecen

**Causas:**
- Rutas incorrectas
- Tamaños faltantes
- Formato incorrecto

**Solución:**
1. Verifica rutas en `manifest.json`
2. Asegúrate de tener icono de 192x192 y 512x512
3. Usa formato PNG

### La app no se actualiza

**Causas:**
- Cache del navegador
- Service Worker no actualizado
- Versión del cache no cambió

**Solución:**
1. Cambia `CACHE_NAME` en `sw.js`
2. Limpia cache en DevTools
3. Recarga forzando (Ctrl+Shift+R)

## 📱 Publicación en Tiendas

### Google Play Store

Ver `GOOGLE_PLAY.md` para guía completa.

**Resumen:**
1. Crea TWA con Bubblewrap
2. Verifica dominio con Digital Asset Links
3. Sube a Google Play Console

### Apple App Store

Para iOS, necesitas:

1. Crear app nativa con WKWebView
2. Configurar en Xcode
3. Subir a App Store Connect

**Nota:** Apple no soporta PWA directas en App Store, necesitas wrapper nativo.

## 🔐 Seguridad

### HTTPS Requerido

Las PWA requieren HTTPS para:

- Service Worker
- Instalación
- Funciones avanzadas

**Excepción:** `localhost` para desarrollo

### Permisos

La app puede solicitar permisos:

- **Notificaciones:** Para notificaciones push
- **Ubicación:** Si es necesario
- **Cámara:** Para subir fotos

## 📈 Métricas y Analytics

### Lighthouse Score

Verifica tu PWA con Lighthouse:

1. Abre DevTools
2. Ve a Lighthouse
3. Selecciona "Progressive Web App"
4. Ejecuta auditoría

**Objetivo:** Score > 90

### Core Web Vitals

Métricas importantes:

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

## 🚀 Mejores Prácticas

1. **Iconos:** Usa tamaños correctos y formato PNG
2. **Offline:** Implementa estrategia de cache adecuada
3. **Performance:** Optimiza carga inicial
4. **UX:** Proporciona feedback visual
5. **Testing:** Prueba en diferentes dispositivos

## 📚 Recursos

- [MDN - Progressive Web Apps](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Última actualización:** 2024

