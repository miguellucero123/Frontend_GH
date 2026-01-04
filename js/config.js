/**
 * Configuración del Sistema
 * Ajustar según tu entorno de desarrollo/producción
 */

// Detectar si estamos en GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io') || 
                      window.location.hostname.includes('github.com');

// Detectar si estamos en localhost
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

const CONFIG = {
    // URL base de la API backend (FastAPI)
    // En GitHub Pages, usar null para activar modo demo automáticamente
    API_BASE_URL: isGitHubPages ? null : 'http://localhost:8000/api/v1',
    API_VERSION: 'v1', // FastAPI v1
    OFFLINE_SUPPORT: true, // Fase 4: Soporte Offline Activado

    // URL del WebSocket para chat en tiempo real
    // Se construye automáticamente basado en la URL actual si no se especifica
    // Para desarrollo, usar el mismo host que la API
    WS_BASE_URL: null, // null = usar misma URL que la página actual, o construir desde API_BASE_URL

    // Configuración de timeout para peticiones HTTP (en milisegundos)
    API_TIMEOUT: 30000,

    // Configuración de reconexión WebSocket
    WS_MAX_RECONNECT_ATTEMPTS: 5,
    WS_RECONNECT_DELAY: 1000, // Base delay en milisegundos

    // Configuración de archivos
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB en bytes
    ALLOWED_FILE_TYPES: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'video/mp4',
        'application/acad', // .dwg
        'application/x-dwg',
        'image/x-dwg'
    ],

    // Configuración de paginación
    ITEMS_PER_PAGE: 20,

    // Configuración de notificaciones
    NOTIFICATION_DURATION: 5000, // 5 segundos

    // Modo de desarrollo (muestra logs adicionales en consola)
    DEBUG: false,

    // Modo DEMO - Permite probar el sistema sin backend
    // En GitHub Pages, activar automáticamente modo demo
    // true = forzar modo demo (siempre funciona)
    // false = forzar backend (requiere servidor corriendo)
    // null = auto-detect (intenta backend, si falla usa demo)
    DEMO_MODE: isGitHubPages ? true : null, // Auto-activar en GitHub Pages

    // Error Reporting
    ERROR_REPORTING_ENABLED: false, // Activar para producción
    ERROR_REPORTING_URL: null, // URL del servicio de error tracking

    // Retry Configuration
    RETRY_MAX_ATTEMPTS: 3,
    RETRY_INITIAL_DELAY: 1000,
    RETRY_MAX_DELAY: 10000,

    // Timeout Configuration
    API_TIMEOUT_SHORT: 10000, // 10 segundos para operaciones rápidas
    API_TIMEOUT_LONG: 60000,  // 60 segundos para operaciones largas (upload)

    // Configuración de almacenamiento
    STORAGE_PREFIX: 'erp_constructora_',

    // Configuración de idioma
    LOCALE: 'es-ES',
    CURRENCY: 'CLP'
};

// Hacer configuración disponible globalmente
window.CONFIG = CONFIG;

