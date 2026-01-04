/**
 * ============================================================
 * DASHBOARD CLIENTE - VERSIÓN SIMPLIFICADA
 * ============================================================
 * 
 * Versión que funciona sin depender del layout manager
 */

// Función para mostrar mensajes de debugging
function showDebug(message, type = 'info') {
    const debugPanel = document.getElementById('debugPanel');
    const debugLog = document.getElementById('debugLog');
    
    if (debugPanel && debugLog) {
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
    
    // También en consola si está disponible
    if (typeof console !== 'undefined') {
        if (type === 'error') console.error(message);
        else if (type === 'success') console.log('✅', message);
        else console.log('ℹ️', message);
    }
}

// Asegurar que el contenido sea visible
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
    } else {
        showDebug('❌ No se encontró clientMain', 'error');
    }
}

// Inicializar dashboard
function initDashboardSimple() {
    showDebug('🚀 Inicializando dashboard (modo simple)...', 'info');
    
    // Asegurar visibilidad PRIMERO
    ensureVisible();
    
    // Verificar autenticación (con timeout para que auth se cargue)
    let authCheckAttempts = 0;
    const maxAuthChecks = 20; // 2 segundos
    
    const checkAuth = setInterval(() => {
        authCheckAttempts++;
        
        if (typeof auth !== 'undefined') {
            clearInterval(checkAuth);
            
            if (!auth.isAuthenticated()) {
                showDebug('❌ No autenticado - Redirigiendo...', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }
            
            const currentUser = auth.getCurrentUser();
            if (!currentUser) {
                showDebug('❌ Usuario no encontrado - Redirigiendo...', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }
            
            showDebug(`✅ Usuario: ${currentUser.name || currentUser.username}`, 'success');
            
            // Verificar rol
            const userRole = currentUser.role || currentUser.rol;
            if (userRole !== 'cliente') {
                showDebug(`⚠️ Rol incorrecto: ${userRole} - Redirigiendo...`, 'error');
                if (userRole === 'jefe' || userRole === 'admin') {
                    window.location.href = 'panel-jefe.html';
                } else {
                    window.location.href = 'panel-usuario.html';
                }
                return;
            }
            
            showDebug('✅ Rol correcto: cliente', 'success');
            continueInit();
        } else if (authCheckAttempts >= maxAuthChecks) {
            clearInterval(checkAuth);
            showDebug('⚠️ auth no disponible después de 2 segundos - Continuando sin verificación...', 'error');
            continueInit();
        } else {
            showDebug(`⏳ Esperando auth... (${authCheckAttempts}/${maxAuthChecks})`, 'info');
        }
    }, 100);
    
    function continueInit() {
        // NO usar layout manager - mostrar contenido directamente
        showDebug('📦 Usando modo simple (sin layout manager)', 'info');
        ensureVisible();
        
        // Cargar datos del dashboard INMEDIATAMENTE
        loadDashboardData();
    }
}

// Cargar datos del dashboard
function loadDashboardData() {
    showDebug('📥 Cargando datos del dashboard...', 'info');
    
    // Usar datos demo SIEMPRE (más simple y confiable)
    const demoData = {
        nombre: 'Proyecto Demo',
        progreso: 45,
        presupuesto_inicial: 1000000,
        costo_actual: 550000,
        fecha_inicio: new Date().toISOString(),
        fecha_estimada_fin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Intentar cargar desde modelo si está disponible
    if (typeof PROJECT_DATA_MODEL !== 'undefined' && PROJECT_DATA_MODEL.proyectos && PROJECT_DATA_MODEL.proyectos.length > 0) {
        const projectData = PROJECT_DATA_MODEL.proyectos[0] || demoData;
        showDebug('✅ Datos cargados desde modelo', 'success');
        renderMainProgress(projectData);
    } else {
        showDebug('⚠️ Usando datos demo', 'info');
        renderMainProgress(demoData);
    }
    
    showDebug('✅ Dashboard inicializado correctamente', 'success');
}

// Renderizar progreso principal
function renderMainProgress(projectData) {
    showDebug('🎨 Renderizando progreso...', 'info');
    
    const progressCircle = document.getElementById('mainProgressCircle');
    const progressPercentage = document.getElementById('mainProgressPercentage');
    
    if (progressCircle && progressPercentage) {
        const progress = projectData.progreso || 0;
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (progress / 100) * circumference;
        
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressPercentage.textContent = `${progress}%`;
        
        showDebug(`✅ Progreso renderizado: ${progress}%`, 'success');
    } else {
        showDebug('⚠️ Elementos de progreso no encontrados', 'error');
    }
}

// EJECUTAR INMEDIATAMENTE - No esperar nada
showDebug('🚀 Script cargado - Ejecutando inmediatamente...', 'info');

// Asegurar visibilidad INMEDIATAMENTE
ensureVisible();

// Ejecutar inicialización inmediatamente
(function() {
    // Intentar ejecutar ahora
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        showDebug('📄 DOM listo - Inicializando...', 'info');
        initDashboardSimple();
    } else {
        showDebug('📄 Esperando DOM...', 'info');
        // Ejecutar cuando el DOM esté listo
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', () => {
                showDebug('📄 DOM cargado - Inicializando...', 'info');
                initDashboardSimple();
            });
        } else {
            // Fallback para IE
            document.attachEvent('onreadystatechange', () => {
                if (document.readyState === 'complete') {
                    showDebug('📄 DOM cargado (IE) - Inicializando...', 'info');
                    initDashboardSimple();
                }
            });
        }
    }
    
    // También ejecutar después de un momento por si acaso
    setTimeout(() => {
        showDebug('⏰ Timeout - Verificando estado...', 'info');
        if (!document.getElementById('mainProgressCircle') || document.getElementById('mainProgressPercentage')?.textContent === '0%') {
            showDebug('⚠️ Dashboard no inicializado - Reintentando...', 'error');
            initDashboardSimple();
        }
    }, 2000);
    
    // Asegurar visibilidad cada segundo
    setInterval(() => {
        ensureVisible();
    }, 1000);
})();

