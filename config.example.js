/**
 * Archivo de Configuración de Ejemplo
 * Copiar este archivo a config.js y ajustar según tu entorno
 */

const CONFIG = {
    // URL base de la API backend
    API_BASE_URL: 'http://localhost:8002/api',  // Puerto 8002 según run_server.py

    // URL del WebSocket para chat en tiempo real
    WS_URL: 'ws://localhost:8002/ws/chat',  // Puerto 8002 según run_server.py

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
        'video/mp4',
        'application/acad', // .dwg
        'application/x-dwg'
    ],

    // Configuración de paginación
    ITEMS_PER_PAGE: 20,

    // Configuración de notificaciones
    NOTIFICATION_DURATION: 5000, // 5 segundos

    // Modo de desarrollo (muestra logs adicionales)
    DEBUG: false,

    // Configuración de automatización (n8n)
    N8N_BASE_URL: 'http://localhost:5678',
    AUTOMATION_ENABLED: true
};

// Si estás usando este archivo como config.js, descomenta la siguiente línea:
// window.CONFIG = CONFIG;

