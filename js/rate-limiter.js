/**
 * Rate Limiter del Lado del Cliente
 * Previene abuso y mejora la experiencia
 */

class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.defaultLimits = {
            login: { max: 5, window: 15 * 60 * 1000 }, // 5 intentos en 15 min
            api: { max: 100, window: 60 * 1000 }, // 100 peticiones por minuto
            search: { max: 30, window: 60 * 1000 }, // 30 búsquedas por minuto
            upload: { max: 10, window: 60 * 1000 }, // 10 uploads por minuto
            chat: { max: 20, window: 60 * 1000 } // 20 mensajes por minuto
        };
    }

    /**
     * Verificar si se puede realizar operación
     */
    canProceed(operation, customLimit = null) {
        const limit = customLimit || this.defaultLimits[operation];
        
        if (!limit) {
            return { allowed: true, remaining: Infinity };
        }

        const now = Date.now();
        const key = `rate_limit_${operation}`;
        
        // Obtener historial
        let history = this.requests.get(key) || [];
        
        // Filtrar requests fuera de la ventana de tiempo
        history = history.filter(timestamp => now - timestamp < limit.window);
        
        // Verificar límite
        if (history.length >= limit.max) {
            const oldestRequest = history[0];
            const waitTime = limit.window - (now - oldestRequest);
            
            return {
                allowed: false,
                remaining: 0,
                waitTime: Math.ceil(waitTime / 1000), // en segundos
                resetAt: new Date(now + waitTime)
            };
        }
        
        // Agregar request actual
        history.push(now);
        this.requests.set(key, history);
        
        return {
            allowed: true,
            remaining: limit.max - history.length,
            resetAt: new Date(now + limit.window)
        };
    }

    /**
     * Ejecutar con rate limiting
     */
    async execute(operation, fn, customLimit = null) {
        const check = this.canProceed(operation, customLimit);
        
        if (!check.allowed) {
            throw {
                type: 'rate_limit',
                message: `Demasiadas peticiones. Espera ${check.waitTime} segundos.`,
                waitTime: check.waitTime,
                resetAt: check.resetAt
            };
        }
        
        try {
            const result = await fn();
            return result;
        } catch (error) {
            // Si es error de rate limit del servidor, actualizar nuestro contador
            if (error.status === 429) {
                this.handleServerRateLimit(operation);
            }
            throw error;
        }
    }

    /**
     * Manejar rate limit del servidor
     */
    handleServerRateLimit(operation) {
        const key = `rate_limit_${operation}`;
        const history = this.requests.get(key) || [];
        
        // Agregar múltiples timestamps para reflejar el rate limit del servidor
        const now = Date.now();
        for (let i = 0; i < 5; i++) {
            history.push(now);
        }
        
        this.requests.set(key, history);
    }

    /**
     * Resetear límite para operación
     */
    reset(operation) {
        const key = `rate_limit_${operation}`;
        this.requests.delete(key);
    }

    /**
     * Obtener estado de rate limits
     */
    getStatus(operation = null) {
        if (operation) {
            const limit = this.defaultLimits[operation];
            const history = this.requests.get(`rate_limit_${operation}`) || [];
            const now = Date.now();
            const recent = history.filter(t => now - t < limit.window);
            
            return {
                operation,
                used: recent.length,
                limit: limit.max,
                remaining: limit.max - recent.length,
                resetAt: history.length > 0 
                    ? new Date(history[0] + limit.window)
                    : new Date()
            };
        }
        
        // Estado de todos los rate limits
        const status = {};
        for (const op in this.defaultLimits) {
            status[op] = this.getStatus(op);
        }
        return status;
    }
}

// Instancia global
const rateLimiter = new RateLimiter();

