/**
 * Gestor de Estado de la Aplicación
 * Maneja el estado global de forma consistente
 */

class StateManager {
    constructor() {
        this.state = {
            user: null,
            project: null,
            files: [],
            messages: [],
            loading: {},
            errors: {},
            ui: {
                sidebarOpen: false,
                currentView: 'grid',
                theme: 'light'
            }
        };
        this.listeners = new Map();
        this.history = [];
        this.maxHistorySize = 50;
    }

    /**
     * Obtener estado
     */
    getState(path = null) {
        if (!path) return { ...this.state };
        
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    /**
     * Actualizar estado
     */
    setState(path, value, silent = false) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;
        
        // Navegar al objeto objetivo
        for (const key of keys) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        // Guardar estado anterior
        const previousValue = target[lastKey];
        
        // Actualizar
        target[lastKey] = value;
        
        // Guardar en historial
        this.addToHistory(path, previousValue, value);
        
        // Notificar listeners
        if (!silent) {
            this.notifyListeners(path, value, previousValue);
        }
        
        return this.state;
    }

    /**
     * Actualizar múltiples valores
     */
    setStateMultiple(updates, silent = false) {
        const previousState = JSON.parse(JSON.stringify(this.state));
        
        for (const [path, value] of Object.entries(updates)) {
            this.setState(path, value, true);
        }
        
        if (!silent) {
            this.notifyListeners('*', this.state, previousState);
        }
    }

    /**
     * Agregar al historial
     */
    addToHistory(path, oldValue, newValue) {
        this.history.push({
            path,
            oldValue,
            newValue,
            timestamp: Date.now()
        });
        
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }

    /**
     * Suscribirse a cambios
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        
        this.listeners.get(path).push(callback);
        
        // Retornar función de unsubscribe
        return () => {
            const callbacks = this.listeners.get(path);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Notificar listeners
     */
    notifyListeners(path, newValue, oldValue) {
        // Notificar listeners específicos
        const specificListeners = this.listeners.get(path) || [];
        specificListeners.forEach(callback => {
            try {
                callback(newValue, oldValue, path);
            } catch (error) {
                console.error('Error en listener de estado:', error);
            }
        });
        
        // Notificar listeners globales
        const globalListeners = this.listeners.get('*') || [];
        globalListeners.forEach(callback => {
            try {
                callback(this.state, path);
            } catch (error) {
                console.error('Error en listener global de estado:', error);
            }
        });
    }

    /**
     * Resetear estado
     */
    reset() {
        const previousState = this.state;
        this.state = {
            user: null,
            project: null,
            files: [],
            messages: [],
            loading: {},
            errors: {},
            ui: {
                sidebarOpen: false,
                currentView: 'grid',
                theme: 'light'
            }
        };
        
        this.notifyListeners('*', this.state, previousState);
    }

    /**
     * Obtener historial
     */
    getHistory(limit = 20) {
        return this.history.slice(-limit);
    }

    /**
     * Deshacer último cambio
     */
    undo() {
        if (this.history.length === 0) return false;
        
        const lastChange = this.history.pop();
        this.setState(lastChange.path, lastChange.oldValue, false);
        
        return true;
    }
}

// Instancia global
const stateManager = new StateManager();

