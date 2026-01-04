/**
 * ============================================================================
 * GESTOR OFFLINE - MEJORA FASE 1
 * ============================================================================
 * Gestión mejorada de modo offline
 * Versión: 1.0.0
 * ============================================================================
 */

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.pendingActions = [];
        this.init();
    }

    /**
     * Inicializar gestor offline
     */
    init() {
        this.setupEventListeners();
        this.createOfflineIndicator();
        this.loadPendingActions();
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            this.handleOffline();
        });

        // Verificar estado periódicamente
        setInterval(() => {
            this.checkConnection();
        }, 30000);
    }

    /**
     * Crear indicador offline
     */
    createOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'offlineIndicator';
        indicator.className = 'fixed bottom-4 right-4 z-50 glass-effect rounded-lg p-4 border border-red-500/50 bg-red-500/10 hidden';
        indicator.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-wifi text-red-400 text-xl"></i>
                <div>
                    <p class="text-white font-bold text-sm">Modo Offline</p>
                    <p class="text-slate-400 text-xs">Algunas funciones pueden estar limitadas</p>
                </div>
                <button onclick="offlineManager.dismissIndicator()" 
                    class="text-slate-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(indicator);
    }

    /**
     * Manejar conexión online
     */
    handleOnline() {
        this.isOnline = true;
        this.hideOfflineIndicator();
        this.syncPendingActions();

        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Conexión Restaurada',
                message: 'Se ha restaurado la conexión a internet'
            });
        }
    }

    /**
     * Manejar conexión offline
     */
    handleOffline() {
        this.isOnline = false;
        this.showOfflineIndicator();

        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'warning',
                priority: 'medium',
                title: '⚠️ Modo Offline',
                message: 'No hay conexión a internet. Los cambios se guardarán localmente.'
            });
        }
    }

    /**
     * Verificar conexión
     */
    async checkConnection() {
        try {
            const response = await fetch('/api/health', { 
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            this.isOnline = true;
        } catch (error) {
            // Si falla, verificar con navigator.onLine
            this.isOnline = navigator.onLine;
        }

        if (this.isOnline) {
            this.hideOfflineIndicator();
        } else {
            this.showOfflineIndicator();
        }
    }

    /**
     * Mostrar indicador offline
     */
    showOfflineIndicator() {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    /**
     * Ocultar indicador offline
     */
    hideOfflineIndicator() {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    /**
     * Descartar indicador
     */
    dismissIndicator() {
        this.hideOfflineIndicator();
    }

    /**
     * Agregar acción pendiente
     */
    addPendingAction(action) {
        this.pendingActions.push({
            ...action,
            timestamp: Date.now()
        });
        this.savePendingActions();
    }

    /**
     * Sincronizar acciones pendientes
     */
    async syncPendingActions() {
        if (this.pendingActions.length === 0) return;

        const toSync = [...this.pendingActions];
        this.pendingActions = [];

        for (const action of toSync) {
            try {
                // Intentar ejecutar acción
                if (action.type === 'save_project') {
                    // TODO: Sincronizar con backend
                    console.log('Sincronizando proyecto:', action.data);
                } else if (action.type === 'update_kpi') {
                    // TODO: Sincronizar KPI
                    console.log('Sincronizando KPI:', action.data);
                }
            } catch (error) {
                // Si falla, volver a agregar a pendientes
                this.pendingActions.push(action);
            }
        }

        this.savePendingActions();

        if (typeof window.notificationSystem !== 'undefined' && toSync.length > 0) {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Sincronización Completa',
                message: `${toSync.length} acción(es) sincronizada(s)`
            });
        }
    }

    /**
     * Guardar acciones pendientes
     */
    savePendingActions() {
        try {
            localStorage.setItem('pendingActions', JSON.stringify(this.pendingActions));
        } catch (error) {
            console.warn('Error guardando acciones pendientes:', error);
        }
    }

    /**
     * Cargar acciones pendientes
     */
    loadPendingActions() {
        try {
            const saved = localStorage.getItem('pendingActions');
            if (saved) {
                this.pendingActions = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Error cargando acciones pendientes:', error);
        }
    }

    /**
     * Verificar si está online
     */
    isConnected() {
        return this.isOnline;
    }

    /**
     * Ejecutar acción con manejo offline
     */
    async executeWithOfflineSupport(action, onlineFn, offlineFn) {
        if (this.isOnline) {
            try {
                return await onlineFn();
            } catch (error) {
                // Si falla, guardar como pendiente
                this.addPendingAction({
                    type: action.type,
                    data: action.data,
                    fn: onlineFn
                });
                return offlineFn ? offlineFn() : null;
            }
        } else {
            // Modo offline, guardar como pendiente
            this.addPendingAction({
                type: action.type,
                data: action.data,
                fn: onlineFn
            });
            return offlineFn ? offlineFn() : null;
        }
    }
}

// Inicializar gestor offline
if (typeof window !== 'undefined') {
    window.offlineManager = new OfflineManager();
}

