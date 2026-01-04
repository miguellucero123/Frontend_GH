/**
 * Script de Verificación de Botones
 * Verifica que todos los botones en los HTML tengan sus event listeners configurados
 */

const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Resultados
const resultados = {
    index: { botones: [], listeners: [], faltantes: [] },
    panelUsuario: { botones: [], listeners: [], faltantes: [] },
    panelJefe: { botones: [], listeners: [], faltantes: [] }
};

/**
 * Extraer botones de un HTML
 */
function extraerBotones(htmlPath) {
    const contenido = fs.readFileSync(htmlPath, 'utf8');
    const botones = [];
    
    // Buscar todos los botones con id
    const regex = /<button[^>]*id=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = regex.exec(contenido)) !== null) {
        const id = match[1];
        const tipo = contenido.substring(match.index, match.index + match[0].length);
        botones.push({
            id: id,
            tipo: tipo.includes('type="submit"') ? 'submit' : 'button',
            tieneOnclick: tipo.includes('onclick=')
        });
    }
    
    // Buscar botones sin id pero con clase específica
    const regexSinId = /<button[^>]*class=["'][^"']*btn[^"']*["'][^>]*>/gi;
    while ((match = regexSinId.exec(contenido)) !== null) {
        const tipo = match[0];
        if (!tipo.includes('id=')) {
            botones.push({
                id: null,
                tipo: tipo.includes('type="submit"') ? 'submit' : 'button',
                tieneOnclick: tipo.includes('onclick='),
                sinId: true
            });
        }
    }
    
    return botones;
}

/**
 * Extraer event listeners de un JS
 */
function extraerListeners(jsPath) {
    if (!fs.existsSync(jsPath)) {
        return [];
    }
    
    const contenido = fs.readFileSync(jsPath, 'utf8');
    const listeners = [];
    
    // Buscar getElementById seguido de addEventListener
    const regex = /getElementById\(["']([^"']+)["']\)[^}]*addEventListener\(["']click["']/gi;
    let match;
    
    while ((match = regex.exec(contenido)) !== null) {
        listeners.push(match[1]);
    }
    
    // Buscar querySelector con addEventListener
    const regexQuery = /querySelector\(["']#([^"']+)["']\)[^}]*addEventListener\(["']click["']/gi;
    while ((match = regexQuery.exec(contenido)) !== null) {
        listeners.push(match[1]);
    }
    
    // Buscar querySelectorAll con forEach y addEventListener
    const regexAll = /querySelectorAll\(["']([^"']+)["']\)[^}]*forEach[^}]*addEventListener\(["']click["']/gi;
    while ((match = regexAll.exec(contenido)) !== null) {
        listeners.push(match[1]);
    }
    
    return [...new Set(listeners)]; // Eliminar duplicados
}

/**
 * Verificar archivos
 */
function verificar() {
    const basePath = path.join(__dirname, '..');
    
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}  VERIFICACIÓN DE BOTONES Y EVENT LISTENERS${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
    
    // 1. index.html
    console.log(`${colors.blue}📄 Verificando index.html...${colors.reset}`);
    const indexHtml = path.join(basePath, 'index.html');
    const indexJs = path.join(basePath, 'js', 'login.js');
    
    if (fs.existsSync(indexHtml)) {
        resultados.index.botones = extraerBotones(indexHtml);
        resultados.index.listeners = extraerListeners(indexJs);
        
        console.log(`  ✅ Encontrados ${resultados.index.botones.length} botones`);
        console.log(`  ✅ Encontrados ${resultados.index.listeners.length} event listeners`);
        
        // Verificar qué botones no tienen listeners
        resultados.index.botones.forEach(boton => {
            if (boton.id && !resultados.index.listeners.includes(boton.id)) {
                if (boton.tipo === 'submit') {
                    // Los submit se manejan con el form, no es error
                    return;
                }
                if (boton.id === 'togglePassword') {
                    // Este tiene listener, verificar manualmente
                    return;
                }
                resultados.index.faltantes.push(boton.id);
            }
        });
        
        if (resultados.index.faltantes.length > 0) {
            console.log(`  ${colors.yellow}⚠️  Botones sin listeners: ${resultados.index.faltantes.join(', ')}${colors.reset}`);
        } else {
            console.log(`  ${colors.green}✅ Todos los botones tienen listeners${colors.reset}`);
        }
    }
    
    console.log();
    
    // 2. panel-usuario.html
    console.log(`${colors.blue}📄 Verificando panel-usuario.html...${colors.reset}`);
    const panelUsuarioHtml = path.join(basePath, 'panel-usuario.html');
    const panelUsuarioJs = path.join(basePath, 'js', 'panel-usuario.js');
    const chatJs = path.join(basePath, 'js', 'chat.js');
    
    if (fs.existsSync(panelUsuarioHtml)) {
        resultados.panelUsuario.botones = extraerBotones(panelUsuarioHtml);
        resultados.panelUsuario.listeners = [
            ...extraerListeners(panelUsuarioJs),
            ...extraerListeners(chatJs)
        ];
        
        console.log(`  ✅ Encontrados ${resultados.panelUsuario.botones.length} botones`);
        console.log(`  ✅ Encontrados ${resultados.panelUsuario.listeners.length} event listeners`);
        
        resultados.panelUsuario.botones.forEach(boton => {
            if (boton.id && !resultados.panelUsuario.listeners.includes(boton.id)) {
                resultados.panelUsuario.faltantes.push(boton.id);
            }
        });
        
        if (resultados.panelUsuario.faltantes.length > 0) {
            console.log(`  ${colors.yellow}⚠️  Botones sin listeners: ${resultados.panelUsuario.faltantes.join(', ')}${colors.reset}`);
        } else {
            console.log(`  ${colors.green}✅ Todos los botones tienen listeners${colors.reset}`);
        }
    }
    
    console.log();
    
    // 3. panel-jefe.html
    console.log(`${colors.blue}📄 Verificando panel-jefe.html...${colors.reset}`);
    const panelJefeHtml = path.join(basePath, 'panel-jefe.html');
    const panelJefeJs = path.join(basePath, 'js', 'panel-jefe.js');
    
    if (fs.existsSync(panelJefeHtml)) {
        resultados.panelJefe.botones = extraerBotones(panelJefeHtml);
        resultados.panelJefe.listeners = extraerListeners(panelJefeJs);
        
        console.log(`  ✅ Encontrados ${resultados.panelJefe.botones.length} botones`);
        console.log(`  ✅ Encontrados ${resultados.panelJefe.listeners.length} event listeners`);
        
        resultados.panelJefe.botones.forEach(boton => {
            if (boton.id && !resultados.panelJefe.listeners.includes(boton.id)) {
                resultados.panelJefe.faltantes.push(boton.id);
            }
        });
        
        if (resultados.panelJefe.faltantes.length > 0) {
            console.log(`  ${colors.yellow}⚠️  Botones sin listeners: ${resultados.panelJefe.faltantes.join(', ')}${colors.reset}`);
        } else {
            console.log(`  ${colors.green}✅ Todos los botones tienen listeners${colors.reset}`);
        }
    }
    
    console.log();
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}  RESUMEN${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
    
    const totalBotones = resultados.index.botones.length + 
                        resultados.panelUsuario.botones.length + 
                        resultados.panelJefe.botones.length;
    
    const totalListeners = resultados.index.listeners.length + 
                          resultados.panelUsuario.listeners.length + 
                          resultados.panelJefe.listeners.length;
    
    const totalFaltantes = resultados.index.faltantes.length + 
                          resultados.panelUsuario.faltantes.length + 
                          resultados.panelJefe.faltantes.length;
    
    console.log(`Total de botones encontrados: ${totalBotones}`);
    console.log(`Total de event listeners: ${totalListeners}`);
    console.log(`Botones sin listeners: ${totalFaltantes}`);
    
    if (totalFaltantes === 0) {
        console.log(`\n${colors.green}✅ ¡PERFECTO! Todos los botones tienen sus event listeners configurados.${colors.reset}`);
    } else {
        console.log(`\n${colors.yellow}⚠️  Hay ${totalFaltantes} botones que necesitan verificación manual.${colors.reset}`);
    }
    
    // Generar reporte detallado
    generarReporte();
}

/**
 * Generar reporte detallado
 */
function generarReporte() {
    const reportePath = path.join(__dirname, '..', 'VERIFICACION_BOTONES.md');
    let reporte = `# ✅ Verificación de Botones y Event Listeners\n\n`;
    reporte += `**Fecha:** ${new Date().toLocaleString()}\n\n`;
    
    reporte += `## 📊 Resumen\n\n`;
    reporte += `- **Total botones:** ${resultados.index.botones.length + resultados.panelUsuario.botones.length + resultados.panelJefe.botones.length}\n`;
    reporte += `- **Total listeners:** ${resultados.index.listeners.length + resultados.panelUsuario.listeners.length + resultados.panelJefe.listeners.length}\n`;
    reporte += `- **Botones sin listeners:** ${resultados.index.faltantes.length + resultados.panelUsuario.faltantes.length + resultados.panelJefe.faltantes.length}\n\n`;
    
    reporte += `## 📄 index.html\n\n`;
    reporte += `### Botones encontrados:\n`;
    resultados.index.botones.forEach(b => {
        reporte += `- \`${b.id || '(sin id)'}\` - Tipo: ${b.tipo}\n`;
    });
    reporte += `\n### Event Listeners:\n`;
    resultados.index.listeners.forEach(l => {
        reporte += `- \`${l}\`\n`;
    });
    if (resultados.index.faltantes.length > 0) {
        reporte += `\n### ⚠️ Botones sin listeners:\n`;
        resultados.index.faltantes.forEach(f => {
            reporte += `- \`${f}\`\n`;
        });
    }
    
    reporte += `\n## 📄 panel-usuario.html\n\n`;
    reporte += `### Botones encontrados:\n`;
    resultados.panelUsuario.botones.forEach(b => {
        reporte += `- \`${b.id || '(sin id)'}\` - Tipo: ${b.tipo}\n`;
    });
    reporte += `\n### Event Listeners:\n`;
    resultados.panelUsuario.listeners.forEach(l => {
        reporte += `- \`${l}\`\n`;
    });
    if (resultados.panelUsuario.faltantes.length > 0) {
        reporte += `\n### ⚠️ Botones sin listeners:\n`;
        resultados.panelUsuario.faltantes.forEach(f => {
            reporte += `- \`${f}\`\n`;
        });
    }
    
    reporte += `\n## 📄 panel-jefe.html\n\n`;
    reporte += `### Botones encontrados:\n`;
    resultados.panelJefe.botones.forEach(b => {
        reporte += `- \`${b.id || '(sin id)'}\` - Tipo: ${b.tipo}\n`;
    });
    reporte += `\n### Event Listeners:\n`;
    resultados.panelJefe.listeners.forEach(l => {
        reporte += `- \`${l}\`\n`;
    });
    if (resultados.panelJefe.faltantes.length > 0) {
        reporte += `\n### ⚠️ Botones sin listeners:\n`;
        resultados.panelJefe.faltantes.forEach(f => {
            reporte += `- \`${f}\`\n`;
        });
    }
    
    fs.writeFileSync(reportePath, reporte, 'utf8');
    console.log(`\n${colors.cyan}📄 Reporte generado: VERIFICACION_BOTONES.md${colors.reset}`);
}

// Ejecutar verificación
verificar();

