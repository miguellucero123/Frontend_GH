# Iconos de la Aplicación

Este directorio debe contener los iconos de la aplicación en diferentes tamaños para soportar PWA y publicación en Google Play.

## Tamaños Requeridos

Los siguientes iconos deben estar presentes:

- `icon-16x16.png` - Favicon
- `icon-32x32.png` - Favicon
- `icon-72x72.png` - Android
- `icon-96x96.png` - Android
- `icon-128x128.png` - Android
- `icon-144x144.png` - Android
- `icon-152x152.png` - iOS
- `icon-192x192.png` - Android (requerido)
- `icon-384x384.png` - Android
- `icon-512x512.png` - Android (requerido)

## Generación de Iconos

### Opción 1: Usando herramientas online
1. Visita https://realfavicongenerator.net/ o https://www.pwabuilder.com/imageGenerator
2. Sube tu logo (recomendado: 512x512px o mayor)
3. Genera todos los tamaños necesarios
4. Descarga y coloca en este directorio

### Opción 2: Usando ImageMagick
```bash
# Si tienes ImageMagick instalado
convert logo.png -resize 16x16 icon-16x16.png
convert logo.png -resize 32x32 icon-32x32.png
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

### Opción 3: Script de generación
Puedes usar el script `generate-icons.html` en la raíz del proyecto para generar todos los iconos desde un archivo fuente.

## Requisitos

- **Formato:** PNG con transparencia
- **Tamaño mínimo:** 512x512px para el icono fuente
- **Estilo:** Debe verse bien en fondos claros y oscuros
- **Contenido:** Logo de la empresa o icono representativo

## Nota

Los iconos son esenciales para:
- Instalación como PWA
- Publicación en Google Play Store
- Identificación visual de la app
- Notificaciones push

