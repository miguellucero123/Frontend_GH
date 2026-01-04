/**
 * Sistema de Reintentos Inteligente
 * Maneja reintentos automáticos con backoff exponencial
 */

class RetryManager {
    constructor() {
        this.defaultConfig = {
            maxRetries: 3,
            initialDelay: 1000,
            maxDelay: 10000,
            backoffMultiplier: 2,
            retryableStatuses: [408, 429, 500, 502, 503, 504],
            retryableErrors: ['NETWORK_ERROR', 'TIMEOUT']
        };
    }

    /**
     * Ejecutar con reintentos
     */
    async executeWithRetry(operation, config = {}) {
        const retryConfig = { ...this.defaultConfig, ...config };
        let lastError = null;
        
        for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
            try {
                const result = await this.executeWithTimeout(
                    operation,
                    retryConfig.timeout
                );
                
                // Éxito en el primer intento
                if (attempt === 0) {
                    return result;
                }
                
                // Éxito después de reintentos
                Utils.showNotification(
                    'Operación completada después de reintentos',
                    'success',
                    3000
                );
                
                return result;
                
            } catch (error) {
                lastError = error;
                
                // Verificar si el error es recuperable
                if (!this.shouldRetry(error, attempt, retryConfig)) {
                    throw error;
                }
                
                // Calcular delay para el siguiente intento
                const delay = this.calculateDelay(attempt, retryConfig);
                
                // Mostrar notificación de reintento
                if (attempt < retryConfig.maxRetries) {
                    Utils.showNotification(
                        `Reintentando... (${attempt + 1}/${retryConfig.maxRetries})`,
                        'info',
                        2000
                    );
                }
                
                // Esperar antes del siguiente intento
                await this.sleep(delay);
            }
        }
        
        // Todos los reintentos fallaron
        throw lastError;
    }

    /**
     * Ejecutar con timeout
     */
    async executeWithTimeout(operation, timeout = 30000) {
        return Promise.race([
            operation(),
            new Promise((_, reject) => {
                setTimeout(() => {
                    reject({
                        type: 'network',
                        code: 'TIMEOUT',
                        message: 'La operación excedió el tiempo límite',
                        recoverable: true
                    });
                }, timeout);
            })
        ]);
    }

    /**
     * Verificar si se debe reintentar
     */
    shouldRetry(error, attempt, config) {
        // No más intentos disponibles
        if (attempt >= config.maxRetries) {
            return false;
        }
        
        // Error de red - siempre reintentar
        if (error.type === 'network' && 
            config.retryableErrors.includes(error.code)) {
            return true;
        }
        
        // Error de API - verificar status
        if (error.type === 'api' && error.status) {
            return config.retryableStatuses.includes(error.status);
        }
        
        // Errores no recuperables
        if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 404) {
            return false;
        }
        
        return false;
    }

    /**
     * Calcular delay con backoff exponencial
     */
    calculateDelay(attempt, config) {
        const delay = Math.min(
            config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
            config.maxDelay
        );
        
        // Agregar jitter aleatorio (±20%)
        const jitter = delay * 0.2 * (Math.random() * 2 - 1);
        
        return Math.floor(delay + jitter);
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Crear operación con retry wrapper
     */
    createRetryableOperation(operation, config = {}) {
        return async (...args) => {
            return this.executeWithRetry(
                () => operation(...args),
                config
            );
        };
    }
}

// Instancia global
const retryManager = new RetryManager();

// Wrapper para API calls con retry
const apiWithRetry = {
    get: (endpoint, options = {}) => {
        return retryManager.executeWithRetry(
            () => api.get(endpoint, options),
            options.retry || {}
        );
    },
    
    post: (endpoint, data, options = {}) => {
        return retryManager.executeWithRetry(
            () => api.post(endpoint, data, options),
            options.retry || {}
        );
    },
    
    put: (endpoint, data, options = {}) => {
        return retryManager.executeWithRetry(
            () => api.put(endpoint, data, options),
            options.retry || {}
        );
    },
    
    delete: (endpoint, options = {}) => {
        return retryManager.executeWithRetry(
            () => api.delete(endpoint, options),
            options.retry || {}
        );
    }
};

