/**
 * ============================================================
 * SINCRONIZADOR DE ESTADO
 * ============================================================
 * 
 * Sistema para sincronizar datos entre componentes y dashboards
 */

class StateSync {
    constructor() {
        this.state = {};
        this.listeners = new Map();
        this.storageKey = 'erp_state';
        this.loadFromStorage();
    }

    /**
     * Cargar estado desde localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.state = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error al cargar estado:', error);
            this.state = {};
        }
    }

    /**
     * Guardar estado en localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (error) {
            console.error('Error al guardar estado:', error);
        }
    }

    /**
     * Obtener valor del estado
     */
    get(key, defaultValue = null) {
        return this.state[key] !== undefined ? this.state[key] : defaultValue;
    }

    /**
     * Establecer valor en el estado
     */
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        this.saveToStorage();
        this.notifyListeners(key, value, oldValue);
    }

    /**
     * Actualizar múltiples valores
     */
    update(updates) {
        Object.keys(updates).forEach(key => {
            this.set(key, updates[key]);
        });
    }

    /**
     * Suscribirse a cambios
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);

        // Retornar función para desuscribirse
        return () => {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Notificar listeners
     */
    notifyListeners(key, newValue, oldValue) {
        const callbacks = this.listeners.get(key) || [];
        callbacks.forEach(callback => {
            try {
                callback(newValue, oldValue);
            } catch (error) {
                console.error('Error en listener:', error);
            }
        });
    }

    /**
     * Limpiar estado
     */
    clear() {
        this.state = {};
        this.listeners.clear();
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Obtener todo el estado
     */
    getAll() {
        return { ...this.state };
    }
}

// Instancia global
const stateSync = new StateSync();

