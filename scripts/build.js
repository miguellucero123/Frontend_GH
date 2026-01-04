/**
 * Script de Build para producción
 * Ejecutar con: npm run build
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build de producción...\n');

// Directorios
const BUILD_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '..');

// Archivos y directorios a copiar
const FILES_TO_COPY = [
    'index.html',
    'panel-usuario.html',
    'panel-jefe.html',
    'manifest.json',
    'sw.js',
    '.htaccess'
];

const DIRS_TO_COPY = [
    'css',
    'js',
    'assets'
];

// Limpiar directorio de build
if (fs.existsSync(BUILD_DIR)) {
    console.log('🧹 Limpiando directorio de build...');
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}

// Crear directorio de build
fs.mkdirSync(BUILD_DIR, { recursive: true });
console.log('✅ Directorio de build creado\n');

// Función para copiar archivo
function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`✅ Copiado: ${path.relative(SRC_DIR, src)}`);
}

// Función para copiar directorio
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    });
}

// Copiar archivos
console.log('📋 Copiando archivos...\n');
FILES_TO_COPY.forEach(file => {
    const src = path.join(SRC_DIR, file);
    const dest = path.join(BUILD_DIR, file);
    
    if (fs.existsSync(src)) {
        copyFile(src, dest);
    } else {
        console.log(`⚠️  Archivo no encontrado: ${file}`);
    }
});

// Copiar directorios
console.log('\n📁 Copiando directorios...\n');
DIRS_TO_COPY.forEach(dir => {
    const src = path.join(SRC_DIR, dir);
    const dest = path.join(BUILD_DIR, dir);
    
    if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log(`✅ Copiado directorio: ${dir}/`);
    } else {
        console.log(`⚠️  Directorio no encontrado: ${dir}`);
    }
});

// Actualizar versión en Service Worker
console.log('\n🔧 Actualizando Service Worker...');
const swPath = path.join(BUILD_DIR, 'sw.js');
if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    const version = new Date().getTime();
    swContent = swContent.replace(
        /const CACHE_NAME = 'erp-constructora-v[\d.]+';/,
        `const CACHE_NAME = 'erp-constructora-v${version}';`
    );
    fs.writeFileSync(swPath, swContent);
    console.log('✅ Service Worker actualizado');
}

// Crear archivo de información de build
const buildInfo = {
    version: '1.0.1',
    buildDate: new Date().toISOString(),
    files: FILES_TO_COPY.length + DIRS_TO_COPY.length
};

fs.writeFileSync(
    path.join(BUILD_DIR, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
);

console.log('\n✨ Build completado exitosamente!');
console.log(`📦 Directorio: ${BUILD_DIR}`);
console.log(`📊 Archivos procesados: ${buildInfo.files}`);
console.log('\n💡 Siguiente paso: Subir el contenido de /dist a tu servidor web');

