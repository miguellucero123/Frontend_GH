/**
 * Sistema de Breadcrumbs para Debugging
 * Rastrea acciones del usuario para contexto en errores
 */

class Breadcrumbs {
    constructor() {
        this.breadcrumbs = [];
        this.maxBreadcrumbs = 50;
        this.init();
    }

    init() {
        // Rastrear clicks
        document.addEventListener('click', (e) => {
            this.add('click', {
                target: e.target.tagName,
                id: e.target.id,
                class: e.target.className,
                text: e.target.textContent?.substring(0, 50)
            });
        });

        // Rastrear cambios en formularios
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.add('form_change', {
                    field: e.target.name || e.target.id,
                    value: e.target.type === 'password' ? '***' : e.target.value?.substring(0, 50)
                });
            }
        });

        // Rastrear navegación
        window.addEventListener('popstate', () => {
            this.add('navigation', {
                url: window.location.href
            });
        });

        // Rastrear errores de API
        if (window.api) {
            const originalRequest = window.api.request.bind(window.api);
            window.api.request = async function(...args) {
                try {
                    const result = await originalRequest(...args);
                    window.getBreadcrumbs().add('api_success', {
                        endpoint: args[0]
                    });
                    return result;
                } catch (error) {
                    window.getBreadcrumbs().add('api_error', {
                        endpoint: args[0],
                        status: error.status,
                        message: error.message
                    });
                    throw error;
                }
            };
        }
    }

    /**
     * Agregar breadcrumb
     */
    add(category, data = {}) {
        this.breadcrumbs.push({
            category,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            user: auth.getCurrentUser()?.user_id || 'anonymous'
        });

        // Limitar tamaño
        if (this.breadcrumbs.length > this.maxBreadcrumbs) {
            this.breadcrumbs.shift();
        }
    }

    /**
     * Obtener breadcrumbs
     */
    get(limit = 20) {
        return this.breadcrumbs.slice(-limit);
    }

    /**
     * Limpiar breadcrumbs
     */
    clear() {
        this.breadcrumbs = [];
    }
}

// Instancia global
const breadcrumbs = new Breadcrumbs();

// Función global para obtener breadcrumbs
window.getBreadcrumbs = () => breadcrumbs;

