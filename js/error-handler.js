/**
 * Sistema de Manejo de Errores Robusto
 * Captura, categoriza y maneja errores de forma inteligente
 */

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.init();
    }

    init() {
        // Capturar errores no manejados
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                stack: event.error?.stack,
                breadcrumbs: window.getBreadcrumbs?.()?.get() || []
            });
        });

        // Capturar promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                error: event.reason,
                stack: event.reason?.stack
            });
        });
    }

    /**
     * Manejar error
     */
    handleError(errorInfo) {
        const error = this.categorizeError(errorInfo);
        
        // Log del error
        this.logError(error);
        
        // Mostrar al usuario si es necesario
        if (error.shouldShowToUser) {
            this.showErrorToUser(error);
        }
        
        // Reportar error crítico
        if (error.severity === 'critical') {
            this.reportError(error);
        }
        
        return error;
    }

    /**
     * Categorizar error
     */
    categorizeError(errorInfo) {
        const error = {
            ...errorInfo,
            timestamp: new Date().toISOString(),
            user: auth.getCurrentUser()?.user_id || 'anonymous',
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Categorizar por tipo
        if (errorInfo.type === 'network') {
            error.category = 'network';
            error.severity = this.getNetworkErrorSeverity(errorInfo);
            error.shouldShowToUser = true;
            error.recoverable = this.isNetworkErrorRecoverable(errorInfo);
        } else if (errorInfo.type === 'api') {
            error.category = 'api';
            error.severity = this.getAPIErrorSeverity(errorInfo);
            error.shouldShowToUser = true;
            error.recoverable = this.isAPIErrorRecoverable(errorInfo);
        } else if (errorInfo.type === 'validation') {
            error.category = 'validation';
            error.severity = 'low';
            error.shouldShowToUser = true;
            error.recoverable = true;
        } else if (errorInfo.type === 'auth') {
            error.category = 'auth';
            error.severity = 'high';
            error.shouldShowToUser = true;
            error.recoverable = false;
        } else {
            error.category = 'unknown';
            error.severity = 'medium';
            error.shouldShowToUser = false;
            error.recoverable = false;
        }

        return error;
    }

    /**
     * Obtener severidad de error de red
     */
    getNetworkErrorSeverity(error) {
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Failed to fetch')) {
            return 'high';
        }
        if (error.code === 'TIMEOUT') {
            return 'medium';
        }
        return 'low';
    }

    /**
     * Obtener severidad de error de API
     */
    getAPIErrorSeverity(error) {
        const status = error.status || error.code;
        
        if (status >= 500) {
            return 'high';
        } else if (status === 401 || status === 403) {
            return 'critical';
        } else if (status >= 400) {
            return 'medium';
        }
        return 'low';
    }

    /**
     * Verificar si error de red es recuperable
     */
    isNetworkErrorRecoverable(error) {
        return error.code !== 'CORS_ERROR' && 
               !error.message.includes('CORS');
    }

    /**
     * Verificar si error de API es recuperable
     */
    isAPIErrorRecoverable(error) {
        const status = error.status || error.code;
        return status >= 500 || status === 408 || status === 429;
    }

    /**
     * Log del error
     */
    logError(error) {
        // Agregar al log
        this.errorLog.push(error);
        
        // Limitar tamaño del log
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }
        
        // Guardar en localStorage
        try {
            localStorage.setItem('error_log', JSON.stringify(this.errorLog.slice(-20)));
        } catch (e) {
            console.warn('No se pudo guardar error log:', e);
        }
        
        // Log en consola (solo en desarrollo)
        if (CONFIG?.DEBUG) {
            console.error('Error capturado:', error);
        }
    }

    /**
     * Mostrar error al usuario
     */
    showErrorToUser(error) {
        const message = this.getUserFriendlyMessage(error);
        const action = this.getRecoveryAction(error);
        
        // Asegurar que message sea string
        const messageStr = typeof message === 'string' ? message : String(message || 'Error desconocido');
        
        Utils.showNotification(messageStr, 'error', 8000);
        
        if (action) {
            // Mostrar acción de recuperación si está disponible
            setTimeout(() => {
                this.showRecoveryAction(action, error);
            }, 2000);
        }
    }

    /**
     * Obtener mensaje amigable para el usuario
     */
    getUserFriendlyMessage(error) {
        const messages = {
            network: {
                NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
                TIMEOUT: 'La operación tardó demasiado. Intenta nuevamente.',
                CORS_ERROR: 'Error de configuración del servidor.'
            },
            api: {
                400: 'Datos inválidos. Verifica la información.',
                401: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
                403: 'No tienes permisos para esta acción.',
                404: 'Recurso no encontrado.',
                429: 'Demasiadas peticiones. Espera un momento.',
                500: 'Error del servidor. Intenta más tarde.',
                503: 'Servicio no disponible. Intenta más tarde.'
            },
            validation: 'Por favor, verifica los datos ingresados.',
            auth: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
        
        if (error.category === 'network' && messages.network[error.code]) {
            return messages.network[error.code];
        }
        
        if (error.category === 'api' && error.status && messages.api[error.status]) {
            return messages.api[error.status];
        }
        
        if (messages[error.category]) {
            return typeof messages[error.category] === 'string' 
                ? messages[error.category] 
                : 'Ha ocurrido un error. Por favor, intenta nuevamente.';
        }
        
        return 'Ha ocurrido un error inesperado.';
    }

    /**
     * Obtener acción de recuperación
     */
    getRecoveryAction(error) {
        if (!error.recoverable) return null;
        
        if (error.category === 'network') {
            return {
                label: 'Reintentar',
                action: () => this.retryLastOperation()
            };
        }
        
        if (error.category === 'api' && error.status >= 500) {
            return {
                label: 'Reintentar',
                action: () => this.retryLastOperation()
            };
        }
        
        return null;
    }

    /**
     * Mostrar acción de recuperación
     */
    showRecoveryAction(action, error) {
        // Implementar UI para acción de recuperación
        const notification = document.createElement('div');
        notification.className = 'alert alert-info recovery-action';
        notification.innerHTML = `
            <span>${this.getUserFriendlyMessage(error)}</span>
            <button class="btn btn-sm btn-primary ml-2" onclick="errorHandler.retryLastOperation()">
                ${action.label}
            </button>
        `;
        
        // Insertar en la página (ajustar según necesidad)
        const container = document.querySelector('.main-content, .admin-content');
        if (container) {
            container.insertBefore(notification, container.firstChild);
            
            setTimeout(() => {
                notification.remove();
            }, 10000);
        }
    }

    /**
     * Reintentar última operación
     */
    retryLastOperation() {
        // Implementar lógica de retry
        if (window.lastFailedOperation) {
            window.lastFailedOperation();
        }
    }

    /**
     * Reportar error crítico
     */
    reportError(error) {
        // Enviar a servicio de tracking (Sentry, etc.)
        if (CONFIG?.ERROR_REPORTING_ENABLED) {
            this.sendToErrorService(error);
        }
        
        // Si es error de autenticación, redirigir
        if (error.category === 'auth' && (error.status === 401 || error.status === 403)) {
            setTimeout(() => {
                auth.logout();
            }, 2000);
        }
    }

    /**
     * Enviar a servicio de error tracking
     */
    sendToErrorService(error) {
        // Implementar integración con Sentry, LogRocket, etc.
        if (window.Sentry) {
            window.Sentry.captureException(error.error || new Error(error.message), {
                tags: {
                    category: error.category,
                    severity: error.severity
                },
                extra: error
            });
        }
        
        // Fallback: enviar a endpoint propio
        if (api && error.severity === 'critical') {
            api.post('/errors/report', {
                error: {
                    message: error.message,
                    category: error.category,
                    severity: error.severity,
                    stack: error.stack,
                    context: {
                        url: error.url,
                        user: error.user,
                        timestamp: error.timestamp
                    }
                }
            }).catch(() => {
                // Silenciar errores al reportar errores
            });
        }
    }

    /**
     * Obtener log de errores
     */
    getErrorLog(limit = 20) {
        return this.errorLog.slice(-limit);
    }

    /**
     * Limpiar log de errores
     */
    clearErrorLog() {
        this.errorLog = [];
        localStorage.removeItem('error_log');
    }

    /**
     * Exportar log de errores
     */
    exportErrorLog() {
        const log = this.getErrorLog();
        const dataStr = JSON.stringify(log, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `error-log-${new Date().toISOString()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Instancia global
const errorHandler = new ErrorHandler();

// Helper para manejar errores de forma consistente
window.handleError = (error, context = {}) => {
    return errorHandler.handleError({
        ...error,
        context,
        breadcrumbs: window.getBreadcrumbs?.() || []
    });
};

