/**
 * ERP Constructora - Service Worker (Enterprise Edition)
 * Implementa capacidades Offline-first y Caching Estratégico.
 */

const CACHE_NAME = 'erp-gh-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/panel-jefe.html',
    '/dashboard-trabajador.html',
    '/dashboard-cliente.html',
    '/css/mobile.css',
    '/css/styles.css',
    '/css/file-system-manager.css',
    '/css/chat-channels.css',
    '/js/config.js',
    '/js/utils.js',
    '/js/auth.js',
    '/js/api.js',
    '/js/pwa-init.js',
    '/js/file-system-manager.js',
    '/js/chat-channels-manager.js',
    '/js/services/CoreState.js',
    '/js/services/ProjectService.js',
    '/js/services/UserService.js',
    '/js/services/VisualService.js',
    '/js/services/DocumentService.js',
    '/js/services/ReportingService.js',
    '/js/panel-jefe.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalación: Cachear recursos críticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cacheando assets críticos');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
    // No cachear peticiones a la API o de tipo POST
    if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retornar desde cache si existe, si no ir a la red
            return response || fetch(event.request).then((fetchResponse) => {
                // Opcional: Cachear dinámicamente nuevos recursos GET
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // Fallback offline para navegación
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});
