/**
 * Script para generar iconos PWA desde SVG
 * Ejecutar con: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Tamaños de iconos requeridos
const ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Rutas
const SVG_PATH = path.join(__dirname, '../assets/logo-constructora.svg');
const OUTPUT_DIR = path.join(__dirname, '../assets/icons');

// Crear directorio si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateIcons() {
    console.log('🎨 Generando iconos PWA...\n');

    try {
        // Leer SVG
        const svgContent = fs.readFileSync(SVG_PATH, 'utf8');
        console.log('✅ SVG leído correctamente');

        // Convertir SVG a imagen usando canvas
        for (const size of ICON_SIZES) {
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');

            // Crear imagen desde SVG
            const img = await loadImage(`data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`);
            
            // Dibujar en canvas
            ctx.drawImage(img, 0, 0, size, size);

            // Guardar como PNG
            const buffer = canvas.toBuffer('image/png');
            const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
            fs.writeFileSync(outputPath, buffer);

            console.log(`✅ Generado: icon-${size}x${size}.png`);
        }

        console.log('\n✨ ¡Todos los iconos generados exitosamente!');
        console.log(`📁 Ubicación: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error('❌ Error al generar iconos:', error);
        console.log('\n💡 Alternativa: Usa generate-icons.html en el navegador');
        process.exit(1);
    }
}

// Ejecutar
generateIcons();

