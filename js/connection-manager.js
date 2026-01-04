/**
 * Gestor de Conexión
 * Detecta y maneja cambios en el estado de conexión
 */

class ConnectionManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];
        this.retryQueue = [];
        this.init();
    }

    init() {
        // Event listeners
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Verificar conexión periódicamente
        setInterval(() => this.checkConnection(), 30000); // Cada 30 segundos
        
        // Cargar queue de operaciones pendientes
        this.loadRetryQueue();
    }

    /**
     * Manejar conexión online
     */
    handleOnline() {
        this.isOnline = true;
        this.notifyListeners('online');
        
        Utils.showNotification(
            'Conexión restaurada. Sincronizando datos...',
            'success',
            3000
        );
        
        // Procesar queue de operaciones pendientes
        this.processRetryQueue();
    }

    /**
     * Manejar conexión offline
     */
    handleOffline() {
        this.isOnline = false;
        this.notifyListeners('offline');
        
        Utils.showNotification(
            'Sin conexión a internet. Algunas funciones pueden estar limitadas.',
            'warning',
            5000
        );
    }

    /**
     * Verificar si estamos en modo demo
     */
    isDemoMode() {
        // Detectar GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io') || 
                              window.location.hostname.includes('github.com');
        
        // Detectar localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        // Modo demo si:
        // 1. CONFIG.DEMO_MODE es explícitamente true
        // 2. Estamos en GitHub Pages
        // 3. API_BASE_URL es null y NO estamos en localhost
        return window.CONFIG?.DEMO_MODE === true || 
               isGitHubPages || 
               (window.CONFIG?.API_BASE_URL === null && !isLocalhost);
    }

    /**
     * Verificar conexión activamente
     */
    async checkConnection() {
        // No verificar conexión en modo demo (GitHub Pages)
        if (this.isDemoMode()) {
            // En modo demo, asumir que estamos online pero sin backend
            this.isOnline = navigator.onLine;
            return;
        }

        // Solo intentar conectar si hay un backend configurado
        const apiUrl = window.CONFIG?.API_BASE_URL;
        if (!apiUrl) {
            this.isOnline = navigator.onLine;
            return;
        }

        try {
            // Intentar primero /health (FastAPI)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            let response;
            try {
                response = await fetch('/health', {
                    method: 'HEAD',
                    cache: 'no-cache',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
            } catch (e) {
                clearTimeout(timeoutId);
                // Si falla, no intentar fallback en modo demo
                if (this.isDemoMode()) {
                    this.isOnline = navigator.onLine;
                    return;
                }
                // Fallback a /api/health solo si no estamos en modo demo
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 3000);
                try {
                    response = await fetch('/api/health', {
                        method: 'HEAD',
                        cache: 'no-cache',
                        signal: controller2.signal
                    });
                    clearTimeout(timeoutId2);
                } catch (e2) {
                    clearTimeout(timeoutId2);
                    // Si ambos fallan, usar navigator.onLine
                    this.isOnline = navigator.onLine;
                    return;
                }
            }
            
            const wasOffline = !this.isOnline;
            this.isOnline = response.ok;
            
            if (wasOffline && this.isOnline) {
                this.handleOnline();
            } else if (!wasOffline && !this.isOnline) {
                this.handleOffline();
            }
        } catch (error) {
            // En caso de error, usar navigator.onLine
            const wasOffline = !this.isOnline;
            this.isOnline = navigator.onLine;
            
            if (!wasOffline && !this.isOnline) {
                this.handleOffline();
            }
        }
    }

    /**
     * Agregar listener
     */
    onStatusChange(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remover listener
     */
    offStatusChange(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    /**
     * Notificar listeners
     */
    notifyListeners(status) {
        this.listeners.forEach(callback => {
            try {
                callback(status, this.isOnline);
            } catch (error) {
                console.error('Error en listener de conexión:', error);
            }
        });
    }

    /**
     * Agregar operación a la queue
     */
    addToRetryQueue(operation) {
        this.retryQueue.push({
            operation,
            timestamp: Date.now(),
            attempts: 0
        });
        this.saveRetryQueue();
    }

    /**
     * Procesar queue de reintentos
     */
    async processRetryQueue() {
        if (this.retryQueue.length === 0) return;
        
        Utils.showNotification(
            `Sincronizando ${this.retryQueue.length} operación(es) pendiente(s)...`,
            'info',
            3000
        );
        
        const queue = [...this.retryQueue];
        this.retryQueue = [];
        
        for (const item of queue) {
            try {
                await item.operation();
                item.attempts++;
            } catch (error) {
                // Si falla, volver a agregar a la queue
                if (item.attempts < 3) {
                    this.retryQueue.push(item);
                } else {
                    console.error('Operación falló después de múltiples intentos:', error);
                }
            }
        }
        
        this.saveRetryQueue();
    }

    /**
     * Guardar queue en localStorage
     */
    saveRetryQueue() {
        try {
            // Solo guardar metadatos, no las funciones
            const queueData = this.retryQueue.map(item => ({
                timestamp: item.timestamp,
                attempts: item.attempts
            }));
            localStorage.setItem('retry_queue', JSON.stringify(queueData));
        } catch (error) {
            console.warn('No se pudo guardar retry queue:', error);
        }
    }

    /**
     * Cargar queue desde localStorage
     */
    loadRetryQueue() {
        try {
            const saved = localStorage.getItem('retry_queue');
            if (saved) {
                const queueData = JSON.parse(saved);
                // Nota: Las operaciones no se pueden serializar, se perderán
                // Esto es solo para mostrar al usuario que hay operaciones pendientes
                console.log(`${queueData.length} operaciones pendientes encontradas`);
            }
        } catch (error) {
            console.warn('No se pudo cargar retry queue:', error);
        }
    }

    /**
     * Obtener estado de conexión
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            pendingOperations: this.retryQueue.length
        };
    }

    /**
     * Limpiar queue
     */
    clearRetryQueue() {
        this.retryQueue = [];
        this.saveRetryQueue();
    }
}

// Instancia global
const connectionManager = new ConnectionManager();

