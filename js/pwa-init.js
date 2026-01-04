/**
 * PWA & Service Worker Initialization
 * Enterprise Phase 4: Offline-first Capability
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('[PWA] Service Worker registrado con éxito:', registration.scope);
            })
            .catch((error) => {
                console.error('[PWA] Error en el registro del Service Worker:', error);
            });
    });
}

// Escuchar cambios de conectividad
window.addEventListener('online', () => {
    showNotification('Conexión restaurada. Sincronizando datos...', 'success');
    if (typeof coreState !== 'undefined') {
        coreState.setState('ui.isOffline', false);
    }
});

window.addEventListener('offline', () => {
    showNotification('Sin conexión. Trabajando en modo local.', 'warning');
    if (typeof coreState !== 'undefined') {
        coreState.setState('ui.isOffline', true);
    }
});

function showNotification(message, type) {
    if (typeof notificationManager !== 'undefined') {
        notificationManager.show(message, type);
    } else {
        console.log(`[PWA Notification] ${type}: ${message}`);
    }
}
