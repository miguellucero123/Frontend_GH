/**
 * ============================================================================
 * GESTOR DE ANALYTICS - MEJORA FASE 1
 * ============================================================================
 * Métricas de uso y analytics privado
 * Versión: 1.0.0
 * ============================================================================
 */

class AnalyticsManager {
    constructor() {
        this.events = [];
        this.metrics = {
            pageViews: 0,
            actions: {},
            timeSpent: {},
            errors: []
        };
        this.sessionStart = Date.now();
        this.init();
    }

    /**
     * Inicializar analytics
     */
    init() {
        this.trackPageView();
        this.setupEventTracking();
        this.setupErrorTracking();
        this.setupTimeTracking();
        this.saveMetrics();
    }

    /**
     * Track page view
     */
    trackPageView() {
        const page = window.location.pathname || 'dashboard';
        this.metrics.pageViews++;
        
        this.track('page_view', {
            page,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Configurar tracking de eventos
     */
    setupEventTracking() {
        // Track clicks en botones importantes
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a');
            if (target) {
                const action = target.dataset.action || target.id || target.className;
                if (action && !action.includes('fa-')) {
                    this.track('click', {
                        element: action,
                        text: target.textContent?.trim() || target.title || ''
                    });
                }
            }
        });

        // Track cambios en secciones
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('active') && target.id) {
                        this.track('section_change', {
                            section: target.id
                        });
                    }
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Configurar tracking de errores
     */
    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.track('error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.track('error', {
                type: 'promise_rejection',
                message: e.reason?.message || 'Unhandled promise rejection'
            });
        });
    }

    /**
     * Configurar tracking de tiempo
     */
    setupTimeTracking() {
        // Tiempo en página
        let lastActiveTime = Date.now();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const timeSpent = Date.now() - lastActiveTime;
                this.recordTimeSpent(timeSpent);
            } else {
                lastActiveTime = Date.now();
            }
        });

        // Al cerrar página
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.sessionStart;
            this.recordTimeSpent(timeSpent);
            this.saveMetrics();
        });
    }

    /**
     * Registrar tiempo gastado
     */
    recordTimeSpent(time) {
        const page = window.location.pathname || 'dashboard';
        if (!this.metrics.timeSpent[page]) {
            this.metrics.timeSpent[page] = 0;
        }
        this.metrics.timeSpent[page] += time;
    }

    /**
     * Track evento
     */
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            session: this.getSessionId()
        };

        this.events.push(event);

        // Actualizar métricas
        if (!this.metrics.actions[eventName]) {
            this.metrics.actions[eventName] = 0;
        }
        this.metrics.actions[eventName]++;

        // Mantener solo últimos 1000 eventos
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }

        // Guardar periódicamente
        if (this.events.length % 10 === 0) {
            this.saveMetrics();
        }
    }

    /**
     * Obtener ID de sesión
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Obtener métricas
     */
    getMetrics() {
        const sessionDuration = Date.now() - this.sessionStart;
        
        return {
            session: {
                id: this.getSessionId(),
                duration: sessionDuration,
                startTime: new Date(this.sessionStart).toISOString()
            },
            pageViews: this.metrics.pageViews,
            actions: this.metrics.actions,
            timeSpent: this.metrics.timeSpent,
            errors: this.metrics.errors.length,
            totalEvents: this.events.length
        };
    }

    /**
     * Obtener reporte
     */
    getReport() {
        const metrics = this.getMetrics();
        const topActions = Object.entries(metrics.actions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        return {
            resumen: {
                sesiones: 1,
                vistas: metrics.pageViews,
                duracion: this.formatDuration(metrics.session.duration),
                errores: metrics.errors
            },
            acciones: topActions.map(([action, count]) => ({
                accion: action,
                cantidad: count
            })),
            tiempoPorPagina: Object.entries(metrics.timeSpent).map(([page, time]) => ({
                pagina: page,
                tiempo: this.formatDuration(time)
            }))
        };
    }

    /**
     * Formatear duración
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Guardar métricas
     */
    saveMetrics() {
        try {
            const toSave = {
                metrics: this.metrics,
                lastUpdate: Date.now()
            };
            localStorage.setItem('analytics_data', JSON.stringify(toSave));
        } catch (error) {
            console.warn('Error guardando analytics:', error);
        }
    }

    /**
     * Cargar métricas
     */
    loadMetrics() {
        try {
            const saved = localStorage.getItem('analytics_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.metrics = { ...this.metrics, ...data.metrics };
            }
        } catch (error) {
            console.warn('Error cargando analytics:', error);
        }
    }

    /**
     * Exportar datos
     */
    exportData() {
        const report = this.getReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Inicializar analytics
if (typeof window !== 'undefined') {
    window.analyticsManager = new AnalyticsManager();
}

