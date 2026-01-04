/**
 * Validador de manifest.json
 * Ejecutar con: npm run validate-manifest
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../manifest.json');
const ICONS_DIR = path.join(__dirname, '../assets/icons');

console.log('🔍 Validando manifest.json...\n');

try {
    // Leer manifest
    const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(manifestContent);

    let errors = [];
    let warnings = [];

    // Validar campos requeridos
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    requiredFields.forEach(field => {
        if (!manifest[field]) {
            errors.push(`❌ Campo requerido faltante: ${field}`);
        }
    });

    // Validar icons
    if (manifest.icons && Array.isArray(manifest.icons)) {
        const requiredSizes = [192, 512];
        const foundSizes = manifest.icons.map(icon => {
            const match = icon.sizes.match(/(\d+)x\d+/);
            return match ? parseInt(match[1]) : null;
        }).filter(Boolean);

        requiredSizes.forEach(size => {
            if (!foundSizes.includes(size)) {
                errors.push(`❌ Icono requerido faltante: ${size}x${size}px`);
            }
        });

        // Verificar que los archivos existan
        manifest.icons.forEach(icon => {
            const iconPath = path.join(__dirname, '..', icon.src);
            if (!fs.existsSync(iconPath)) {
                warnings.push(`⚠️  Archivo de icono no encontrado: ${icon.src}`);
            }
        });
    } else {
        errors.push('❌ El campo "icons" debe ser un array');
    }

    // Validar display
    const validDisplays = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
    if (manifest.display && !validDisplays.includes(manifest.display)) {
        warnings.push(`⚠️  Valor de "display" no estándar: ${manifest.display}`);
    }

    // Validar theme_color
    if (!manifest.theme_color) {
        warnings.push('⚠️  "theme_color" no especificado (recomendado)');
    }

    // Validar background_color
    if (!manifest.background_color) {
        warnings.push('⚠️  "background_color" no especificado (recomendado)');
    }

    // Mostrar resultados
    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Manifest válido!\n');
        console.log(`📱 Nombre: ${manifest.name}`);
        console.log(`🔗 Start URL: ${manifest.start_url}`);
        console.log(`📐 Display: ${manifest.display}`);
        console.log(`🎨 Theme Color: ${manifest.theme_color || 'No especificado'}`);
        console.log(`🖼️  Iconos: ${manifest.icons.length}`);
    } else {
        if (errors.length > 0) {
            console.log('❌ Errores encontrados:\n');
            errors.forEach(error => console.log(error));
        }
        
        if (warnings.length > 0) {
            console.log('\n⚠️  Advertencias:\n');
            warnings.forEach(warning => console.log(warning));
        }
        
        if (errors.length > 0) {
            process.exit(1);
        }
    }

    // Validar estructura de iconos
    console.log('\n🖼️  Validando iconos...\n');
    const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
    let missingIcons = [];

    iconSizes.forEach(size => {
        const iconFile = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
        if (!fs.existsSync(iconFile)) {
            missingIcons.push(size);
        }
    });

    if (missingIcons.length > 0) {
        console.log('⚠️  Iconos faltantes:');
        missingIcons.forEach(size => {
            console.log(`   - icon-${size}x${size}.png`);
        });
        console.log('\n💡 Usa generate-icons.html para generar los iconos faltantes');
    } else {
        console.log('✅ Todos los iconos están presentes');
    }

} catch (error) {
    console.error('❌ Error al validar manifest:', error.message);
    process.exit(1);
}

