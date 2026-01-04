/**
 * Script para compilar SASS a CSS
 * Ejecutar con: node scripts/compile-css.js
 */

const sass = require('sass');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../css/main.scss');
const outputFile = path.join(__dirname, '../css/main.css');
const outputFileMin = path.join(__dirname, '../css/main.min.css');

console.log('🎨 Compilando SASS a CSS...\n');

try {
    // Compilar versión normal
    console.log('📝 Compilando versión normal...');
    const result = sass.compile(inputFile, {
        style: 'expanded',
        sourceMap: false
    });
    
    fs.writeFileSync(outputFile, result.css);
    console.log(`✅ Creado: ${path.basename(outputFile)}`);
    
    // Compilar versión minificada
    console.log('📝 Compilando versión minificada...');
    const resultMin = sass.compile(inputFile, {
        style: 'compressed',
        sourceMap: false
    });
    
    fs.writeFileSync(outputFileMin, resultMin.css);
    console.log(`✅ Creado: ${path.basename(outputFileMin)}`);
    
    console.log('\n✨ Compilación completada exitosamente!');
    console.log(`📦 Archivos generados:`);
    console.log(`   - ${path.basename(outputFile)} (${(result.css.length / 1024).toFixed(2)} KB)`);
    console.log(`   - ${path.basename(outputFileMin)} (${(resultMin.css.length / 1024).toFixed(2)} KB)`);
    
} catch (error) {
    console.error('❌ Error al compilar:', error.message);
    process.exit(1);
}

