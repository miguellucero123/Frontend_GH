/**
 * ============================================================
 * DASHBOARD CLIENTE - VERSIÓN STANDALONE (SIN DEPENDENCIAS)
 * ============================================================
 * 
 * Versión completamente independiente que NO depende de nada
 * Se ejecuta de forma aislada y funciona siempre
 */

// Verificar si ya se ejecutó (evitar duplicados)
if (window.dashboardClienteStandaloneLoaded) {
    console.warn('⚠️ dashboard-cliente-standalone.js ya se cargó, ignorando...');
} else {
    window.dashboardClienteStandaloneLoaded = true;

    // Función para mostrar mensajes (sin depender de nada)
    function showDebug(message, type = 'info') {
        // Crear panel si no existe
        let debugPanel = document.getElementById('debugPanel');
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'debugPanel';
            debugPanel.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 10px;
                z-index: 99999;
                font-family: monospace;
                font-size: 11px;
                max-height: 200px;
                overflow-y: auto;
                display: none;
            `;
            debugPanel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <strong>🔍 DEBUG PANEL</strong>
                    <button onclick="document.getElementById('debugPanel').style.display='none'" style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Cerrar</button>
                </div>
                <div id="debugLog" style="line-height: 1.4;"></div>
            `;
            document.body.appendChild(debugPanel);
            
            // Crear botón
            const debugBtn = document.createElement('button');
            debugBtn.innerHTML = '🔍 DEBUG';
            debugBtn.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 99998;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            `;
            debugBtn.onclick = function() {
                const panel = document.getElementById('debugPanel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            };
            document.body.appendChild(debugBtn);
        }
        
        const debugLog = document.getElementById('debugLog');
        if (debugLog) {
            const time = new Date().toLocaleTimeString();
            const color = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `color: ${color}; margin: 2px 0;`;
            logEntry.textContent = `[${time}] ${message}`;
            debugLog.appendChild(logEntry);
            debugPanel.scrollTop = debugPanel.scrollHeight;
            
            // Mantener solo últimos 50 mensajes
            while (debugLog.children.length > 50) {
                debugLog.removeChild(debugLog.firstChild);
            }
        }
        
        // También en consola
        try {
            if (type === 'error') console.error(message);
            else if (type === 'success') console.log('✅', message);
            else console.log('ℹ️', message);
        } catch (e) {
            // Ignorar si console no está disponible
        }
    }

    // Asegurar visibilidad del contenido
    function ensureVisible() {
        const clientMain = document.getElementById('clientMain');
        if (clientMain) {
            clientMain.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                min-height: 100vh !important;
                position: relative !important;
                z-index: 1 !important;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fce7f3 100%) !important;
            `;
            showDebug('✅ Contenido forzado a ser visible', 'success');
            return true;
        } else {
            showDebug('❌ No se encontró clientMain', 'error');
            return false;
        }
    }

    // Renderizar progreso
    function renderProgress(progress = 45) {
        try {
            const progressCircle = document.getElementById('mainProgressCircle');
            const progressPercentage = document.getElementById('mainProgressPercentage');
            
            if (progressCircle && progressPercentage) {
                const circumference = 2 * Math.PI * 90;
                const offset = circumference - (progress / 100) * circumference;
                
                progressCircle.style.strokeDasharray = circumference;
                progressCircle.style.strokeDashoffset = offset;
                progressPercentage.textContent = `${progress}%`;
                
                showDebug(`✅ Progreso renderizado: ${progress}%`, 'success');
                return true;
            } else {
                showDebug('⚠️ Elementos de progreso no encontrados', 'error');
                return false;
            }
        } catch (error) {
            showDebug('❌ Error renderizando progreso: ' + error.message, 'error');
            return false;
        }
    }

    // Inicializar dashboard (versión ultra simple)
    function initDashboard() {
        showDebug('🚀 Iniciando dashboard standalone...', 'info');
        
        // Paso 1: Asegurar visibilidad
        if (!ensureVisible()) {
            showDebug('❌ No se pudo hacer visible el contenido', 'error');
            return;
        }
        
        // Paso 2: Renderizar progreso (con datos demo)
        renderProgress(45);
        
        // Paso 3: Verificar autenticación (opcional, no bloquea)
        try {
            if (typeof auth !== 'undefined' && auth.isAuthenticated && auth.isAuthenticated()) {
                const user = auth.getCurrentUser();
                if (user) {
                    showDebug(`✅ Usuario autenticado: ${user.name || user.username}`, 'success');
                }
            } else {
                showDebug('⚠️ No autenticado (modo demo)', 'info');
            }
        } catch (error) {
            showDebug('⚠️ Error verificando auth: ' + error.message, 'error');
        }
        
        showDebug('✅ Dashboard inicializado correctamente', 'success');
    }

    // EJECUTAR INMEDIATAMENTE
    showDebug('📄 Script standalone cargado', 'info');
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            showDebug('📄 DOM cargado - Inicializando...', 'info');
            initDashboard();
        });
    } else {
        showDebug('📄 DOM ya listo - Inicializando...', 'info');
        initDashboard();
    }
    
    // También ejecutar después de un momento por si acaso
    setTimeout(function() {
        showDebug('⏰ Verificación tardía...', 'info');
        ensureVisible();
        renderProgress(45);
    }, 1000);
    
    // Asegurar visibilidad cada 2 segundos
    setInterval(function() {
        ensureVisible();
    }, 2000);
}

