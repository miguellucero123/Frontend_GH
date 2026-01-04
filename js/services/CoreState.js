/**
 * ============================================================
 * CORE STATE (Enterprise Edition)
 * ============================================================
 * El corazón reactivo de la aplicación. Maneja el estado global
 * con persistencia selectiva y notificaciones instantáneas.
 */

class CoreState {
    constructor() {
        this.state = this.getInitialState();
        this.listeners = new Map();
        this.persistenceKey = 'gh_enterprise_state';

        // Cargar estado persistente (solo partes seguras)
        this.loadPersistence();
    }

    getInitialState() {
        return {
            user: JSON.parse(localStorage.getItem('auth_user')) || null,
            projects: [],
            users: {
                pending: [],
                approved: []
            },
            stats: {
                projects: { total: 0, active: 0, totalCost: 0 },
                messages: { unread: 0 }
            },
            loading: {},
            errors: {},
            ui: {
                activeSection: 'dashboard',
                darkMode: true,
                sidebarOpen: true
            }
        };
    }

    /**
     * Obtener una ramificación del estado usando notación de puntos (ej: 'user.name')
     */
    getState(path) {
        if (!path) return this.state;
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, this.state);
    }

    /**
     * Actualizar el estado y disparar eventos
     */
    setState(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;

        for (const key of keys) {
            if (!(key in target)) target[key] = {};
            target = target[key];
        }

        const oldValue = target[lastKey];
        target[lastKey] = value;

        // Persistir si es UI o configuración básica
        if (path.startsWith('ui.')) {
            this.savePersistence();
        }

        this.notify(path, value, oldValue);
        return this.state;
    }

    /**
     * Suscribirse a cambios en un path específico o '*' para todo
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        this.listeners.get(path).push(callback);

        // Retornar desuscripción
        return () => {
            const list = this.listeners.get(path);
            const index = list.indexOf(callback);
            if (index > -1) list.splice(index, 1);
        };
    }

    notify(path, newValue, oldValue) {
        // Notificar al path exacto
        if (this.listeners.has(path)) {
            this.listeners.get(path).forEach(cb => cb(newValue, oldValue));
        }

        // Notificar a observadores globales
        if (this.listeners.has('*')) {
            this.listeners.get('*').forEach(cb => cb(this.state, path));
        }
    }

    savePersistence() {
        const toPersist = {
            ui: this.state.ui
        };
        localStorage.setItem(this.persistenceKey, JSON.stringify(toPersist));
    }

    loadPersistence() {
        const saved = localStorage.getItem(this.persistenceKey);
        if (saved) {
            const data = JSON.parse(saved);
            this.state.ui = { ...this.state.ui, ...data.ui };
        }
    }
}

// Inicializar singleton core
window.coreState = new CoreState();
