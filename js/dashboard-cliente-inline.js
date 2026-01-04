/**
 * DASHBOARD CLIENTE - VERSIÓN INLINE
 * Se ejecuta INMEDIATAMENTE sin depender de nada
 */

(function() {
    'use strict';
    
    // Crear panel de debugging INMEDIATAMENTE
    function createDebugPanel() {
        if (document.getElementById('debugPanel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        panel.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.9);color:white;padding:10px;z-index:99999;font-family:monospace;font-size:11px;max-height:200px;overflow-y:auto;display:none;';
        panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;"><strong>🔍 DEBUG</strong><button onclick="document.getElementById(\'debugPanel\').style.display=\'none\'" style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;">Cerrar</button></div><div id="debugLog" style="line-height:1.4;"></div>';
        document.body.appendChild(panel);
        
        const button = document.createElement('button');
        button.textContent = '🔍 DEBUG';
        button.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:99998;background:#3b82f6;color:white;border:none;padding:10px 15px;border-radius:5px;cursor:pointer;font-weight:bold;';
        button.onclick = function() {
            const panel = document.getElementById('debugPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(button);
    }
    
    // Función de logging
    function log(msg, type) {
        const logEl = document.getElementById('debugLog');
        if (logEl) {
            const time = new Date().toLocaleTimeString();
            const color = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
            const div = document.createElement('div');
            div.style.cssText = 'color:' + color + ';margin:2px 0;';
            div.textContent = '[' + time + '] ' + msg;
            logEl.appendChild(div);
            logEl.parentElement.scrollTop = logEl.parentElement.scrollHeight;
            while (logEl.children.length > 50) {
                logEl.removeChild(logEl.firstChild);
            }
        }
        if (typeof console !== 'undefined') {
            if (type === 'error') console.error(msg);
            else console.log(msg);
        }
    }
    
    // Forzar visibilidad del contenido
    function forceVisible() {
        const main = document.getElementById('clientMain');
        if (main) {
            main.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;min-height:100vh!important;position:relative!important;z-index:1!important;background:linear-gradient(135deg,#f0f9ff 0%,#e0e7ff 50%,#fce7f3 100%)!important;';
            log('✅ Contenido forzado visible', 'success');
            return true;
        }
        log('❌ clientMain no encontrado', 'error');
        return false;
    }
    
    // Inicializar
    function init() {
        log('🚀 Script inline cargado', 'info');
        
        // Crear panel de debug
        createDebugPanel();
        log('✅ Panel debug creado', 'success');
        
        // Forzar visibilidad
        forceVisible();
        
        // Verificar auth (con timeout)
        let attempts = 0;
        const checkAuth = setInterval(function() {
            attempts++;
            if (typeof auth !== 'undefined') {
                clearInterval(checkAuth);
                if (auth.isAuthenticated && auth.isAuthenticated()) {
                    const user = auth.getCurrentUser && auth.getCurrentUser();
                    if (user) {
                        log('✅ Usuario: ' + (user.name || user.username), 'success');
                        const role = user.role || user.rol;
                        if (role !== 'cliente') {
                            log('⚠️ Rol incorrecto: ' + role, 'error');
                            if (role === 'jefe' || role === 'admin') {
                                window.location.href = 'panel-jefe.html';
                            } else {
                                window.location.href = 'panel-usuario.html';
                            }
                            return;
                        }
                        log('✅ Rol correcto', 'success');
                    }
                } else {
                    log('⚠️ No autenticado - Continuando...', 'error');
                }
            } else if (attempts >= 20) {
                clearInterval(checkAuth);
                log('⚠️ auth no disponible - Continuando sin verificación', 'error');
            }
        }, 100);
        
        // Cargar datos
        setTimeout(function() {
            const progressCircle = document.getElementById('mainProgressCircle');
            const progressPercentage = document.getElementById('mainProgressPercentage');
            if (progressCircle && progressPercentage) {
                const progress = 45;
                const circumference = 2 * Math.PI * 90;
                const offset = circumference - (progress / 100) * circumference;
                progressCircle.style.strokeDasharray = circumference;
                progressCircle.style.strokeDashoffset = offset;
                progressPercentage.textContent = progress + '%';
                log('✅ Progreso renderizado: ' + progress + '%', 'success');
            } else {
                log('⚠️ Elementos de progreso no encontrados', 'error');
            }
            log('✅ Dashboard inicializado', 'success');
        }, 500);
        
        // Verificar visibilidad cada segundo
        setInterval(forceVisible, 1000);
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // También ejecutar después de un momento
    setTimeout(init, 1000);
})();

