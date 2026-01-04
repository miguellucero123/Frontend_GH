/**
 * ============================================================================
 * CACHE INTELIGENTE - MEJORA FASE 1
 * ============================================================================
 * Sistema de cache para optimizar rendimiento
 * Versión: 1.0.0
 * ============================================================================
 */

class SmartCache {
    constructor() {
        this.cache = new Map();
        this.maxAge = {
            dashboard: 5 * 60 * 1000,      // 5 minutos
            financial: 2 * 60 * 1000,     // 2 minutos
            projects: 10 * 60 * 1000,     // 10 minutos
            kpis: 1 * 60 * 1000,          // 1 minuto
            predictions: 5 * 60 * 1000    // 5 minutos
        };
        this.init();
    }

    /**
     * Inicializar cache
     */
    init() {
        // Cargar cache persistente
        this.loadPersistentCache();
        
        // Limpiar cache expirado cada minuto
        setInterval(() => {
            this.cleanExpired();
        }, 60000);
    }

    /**
     * Obtener del cache
     */
    get(key, type = 'default') {
        const cacheKey = `${type}_${key}`;
        const item = this.cache.get(cacheKey);

        if (!item) {
            return null;
        }

        // Verificar si está expirado
        const maxAge = this.maxAge[type] || this.maxAge.dashboard;
        if (Date.now() - item.timestamp > maxAge) {
            this.cache.delete(cacheKey);
            return null;
        }

        return item.data;
    }

    /**
     * Guardar en cache
     */
    set(key, data, type = 'default') {
        const cacheKey = `${type}_${key}`;
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            type
        });

        // Guardar en localStorage si es importante
        if (type === 'projects' || type === 'financial') {
            this.savePersistentCache();
        }
    }

    /**
     * Invalidar cache
     */
    invalidate(pattern) {
        const keysToDelete = [];
        this.cache.forEach((value, key) => {
            if (key.includes(pattern)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));
    }

    /**
     * Limpiar cache expirado
     */
    cleanExpired() {
        const now = Date.now();
        const keysToDelete = [];

        this.cache.forEach((item, key) => {
            const maxAge = this.maxAge[item.type] || this.maxAge.dashboard;
            if (now - item.timestamp > maxAge) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));
    }

    /**
     * Limpiar todo el cache
     */
    clear() {
        this.cache.clear();
        localStorage.removeItem('smartCache');
    }

    /**
     * Obtener estadísticas del cache
     */
    getStats() {
        const stats = {
            total: this.cache.size,
            byType: {},
            oldest: null,
            newest: null
        };

        let oldestTime = Date.now();
        let newestTime = 0;

        this.cache.forEach((item, key) => {
            const type = item.type || 'default';
            stats.byType[type] = (stats.byType[type] || 0) + 1;

            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                stats.oldest = { key, age: Date.now() - item.timestamp };
            }

            if (item.timestamp > newestTime) {
                newestTime = item.timestamp;
                stats.newest = { key, age: Date.now() - item.timestamp };
            }
        });

        return stats;
    }

    /**
     * Cargar cache persistente
     */
    loadPersistentCache() {
        try {
            const saved = localStorage.getItem('smartCache');
            if (saved) {
                const data = JSON.parse(saved);
                const now = Date.now();

                Object.entries(data).forEach(([key, item]) => {
                    // Solo cargar si no está expirado
                    const maxAge = this.maxAge[item.type] || this.maxAge.dashboard;
                    if (now - item.timestamp < maxAge) {
                        this.cache.set(key, item);
                    }
                });
            }
        } catch (error) {
            console.warn('Error cargando cache persistente:', error);
        }
    }

    /**
     * Guardar cache persistente
     */
    savePersistentCache() {
        try {
            const toSave = {};
            this.cache.forEach((item, key) => {
                // Solo guardar tipos importantes
                if (item.type === 'projects' || item.type === 'financial') {
                    toSave[key] = item;
                }
            });

            localStorage.setItem('smartCache', JSON.stringify(toSave));
        } catch (error) {
            console.warn('Error guardando cache persistente:', error);
        }
    }

    /**
     * Wrapper para funciones con cache
     */
    cached(key, fn, type = 'default', forceRefresh = false) {
        // Si no se fuerza refresh, intentar obtener del cache
        if (!forceRefresh) {
            const cached = this.get(key, type);
            if (cached !== null) {
                return Promise.resolve(cached);
            }
        }

        // Ejecutar función y guardar resultado
        return Promise.resolve(fn()).then(result => {
            this.set(key, result, type);
            return result;
        });
    }
}

// Inicializar cache global
if (typeof window !== 'undefined') {
    window.smartCache = new SmartCache();
}

