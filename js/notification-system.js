/**
 * ============================================================================
 * SISTEMA DE NOTIFICACIONES INTELIGENTES - MEJORA FASE 1
 * ============================================================================
 * Notificaciones priorizadas, push, y gestión completa
 * Versión: 1.0.0
 * ============================================================================
 */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.history = [];
        this.preferences = {
            sound: true,
            desktop: true,
            email: false,
            critical: true,
            high: true,
            medium: true,
            low: false
        };
        this.init();
    }

    /**
     * Inicializar sistema de notificaciones
     */
    init() {
        this.loadPreferences();
        this.createNotificationContainer();
        this.requestPermission();
        this.loadHistory();
        this.startMonitoring();
    }

    /**
     * Crear contenedor de notificaciones
     */
    createNotificationContainer() {
        if (document.getElementById('notificationContainer')) return;

        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'fixed top-20 right-4 z-50 space-y-2 max-w-md';
        container.style.cssText = 'pointer-events: none;';
        document.body.appendChild(container);

        // Botón de historial
        const historyBtn = document.createElement('button');
        historyBtn.id = 'btnNotificationHistory';
        historyBtn.className = 'fixed top-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all';
        historyBtn.innerHTML = '<i class="fas fa-bell"></i>';
        historyBtn.style.cssText = 'pointer-events: auto;';
        historyBtn.addEventListener('click', () => this.showHistory());
        document.body.appendChild(historyBtn);
    }

    /**
     * Solicitar permiso para notificaciones
     */
    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.preferences.desktop = true;
                    this.savePreferences();
                }
            } catch (error) {
                console.warn('Error solicitando permiso de notificaciones:', error);
            }
        }
    }

    /**
     * Agregar notificación
     */
    add(notification) {
        const notif = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: notification.type || 'info',
            priority: notification.priority || 'medium',
            title: notification.title,
            message: notification.message,
            timestamp: new Date(),
            read: false,
            action: notification.action || null,
            data: notification.data || null
        };

        this.notifications.push(notif);
        this.history.push(notif);

        // Mostrar notificación
        this.show(notif);

        // Notificación push del navegador
        if (this.preferences.desktop && this.shouldShow(notif.priority)) {
            this.showDesktopNotification(notif);
        }

        // Sonido
        if (this.preferences.sound && this.shouldShow(notif.priority)) {
            this.playSound(notif.priority);
        }

        // Guardar historial
        this.saveHistory();

        return notif;
    }

    /**
     * Mostrar notificación en UI
     */
    show(notification) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notifElement = this.createNotificationElement(notification);
        container.appendChild(notifElement);

        // Animar entrada
        setTimeout(() => {
            notifElement.style.opacity = '1';
            notifElement.style.transform = 'translateX(0)';
        }, 10);

        // Auto-ocultar después de 5 segundos (excepto críticas)
        if (notification.priority !== 'critical') {
            setTimeout(() => {
                this.hide(notification.id);
            }, 5000);
        }

        // Actualizar badge
        this.updateBadge();
    }

    /**
     * Crear elemento de notificación
     */
    createNotificationElement(notification) {
        const div = document.createElement('div');
        div.id = `notif_${notification.id}`;
        div.className = `notification-item glass-effect rounded-lg p-4 border-l-4 shadow-lg transition-all transform translate-x-full opacity-0`;
        div.style.cssText = 'pointer-events: auto; transition: all 0.3s ease;';
        
        // Color según prioridad
        const colors = {
            critical: 'border-red-500 bg-red-500/10',
            high: 'border-orange-500 bg-orange-500/10',
            medium: 'border-blue-500 bg-blue-500/10',
            low: 'border-slate-500 bg-slate-500/10'
        };
        div.className += ` ${colors[notification.priority] || colors.medium}`;

        const icon = this.getIcon(notification.type, notification.priority);
        
        div.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 text-2xl ${this.getIconColor(notification.priority)}">
                    ${icon}
                </div>
                <div class="flex-grow min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <h4 class="font-bold text-white text-sm">${this.escapeHtml(notification.title)}</h4>
                        <button onclick="notificationSystem.hide('${notification.id}')" 
                            class="text-slate-400 hover:text-white flex-shrink-0">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                    <p class="text-slate-300 text-xs mt-1">${this.escapeHtml(notification.message)}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-xs text-slate-500">${this.formatTime(notification.timestamp)}</span>
                        ${notification.action ? `
                            <button onclick="notificationSystem.handleAction('${notification.id}')" 
                                class="text-xs text-blue-400 hover:text-blue-300 font-medium">
                                Ver detalles
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Click para marcar como leída
        div.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.markAsRead(notification.id);
            }
        });

        return div;
    }

    /**
     * Ocultar notificación
     */
    hide(id) {
        const element = document.getElementById(`notif_${id}`);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateX(100%)';
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        // Marcar como leída
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }

        this.updateBadge();
    }

    /**
     * Mostrar notificación del sistema
     */
    showDesktopNotification(notification) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        const options = {
            body: notification.message,
            icon: '/assets/logo.jpg',
            badge: '/assets/logo.jpg',
            tag: notification.id,
            requireInteraction: notification.priority === 'critical',
            data: notification.data
        };

        const notif = new Notification(notification.title, options);

        notif.onclick = () => {
            window.focus();
            if (notification.action) {
                this.handleAction(notification.id);
            }
            notif.close();
        };

        // Auto-cerrar después de 5 segundos (excepto críticas)
        if (notification.priority !== 'critical') {
            setTimeout(() => notif.close(), 5000);
        }
    }

    /**
     * Reproducir sonido
     */
    playSound(priority) {
        const sounds = {
            critical: '🔔',
            high: '🔔',
            medium: '🔔',
            low: '🔔'
        };
        // En producción, usar archivos de audio reales
        console.log('Sonido:', sounds[priority]);
    }

    /**
     * Monitorear cambios y generar notificaciones automáticas
     */
    startMonitoring() {
        // Monitorear cambios en datos cada 30 segundos
        setInterval(() => {
            this.checkForAlerts();
        }, 30000);
    }

    /**
     * Verificar alertas automáticas
     */
    checkForAlerts() {
        // Verificar variación de costos
        if (typeof window.gestorGerencia !== 'undefined') {
            const resumen = window.gestorGerencia.obtenerResumenFinanciero();
            
            if (resumen.variacionPorcentaje > 15) {
                this.add({
                    type: 'warning',
                    priority: 'critical',
                    title: '⚠️ Variación de Costos Crítica',
                    message: `La variación de costos es del ${resumen.variacionPorcentaje.toFixed(2)}%, supera el umbral del 15%`,
                    action: () => {
                        // Navegar a sección financiera
                        const navItem = document.querySelector('[data-section="financiero"]');
                        if (navItem) navItem.click();
                    }
                });
            }

            // Verificar retrasos en hitos
            const hitos = window.gestorGerencia.obtenerHitos();
            const hitosRetrasados = hitos.filter(h => {
                if (h.estado === 'completado') return false;
                const retraso = window.gestorGerencia.calcularRetrasoHito(h.id);
                return retraso > 7;
            });

            if (hitosRetrasados.length > 0) {
                this.add({
                    type: 'warning',
                    priority: 'high',
                    title: '⏰ Hitos con Retraso',
                    message: `${hitosRetrasados.length} hito(s) con más de 7 días de retraso`,
                    action: () => {
                        const navItem = document.querySelector('[data-section="cronograma"]');
                        if (navItem) navItem.click();
                    }
                });
            }
        }
    }

    /**
     * Mostrar historial
     */
    showHistory() {
        this.createHistoryModal();
        const modal = document.getElementById('notificationHistoryModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.renderHistory();
        }
    }

    /**
     * Crear modal de historial
     */
    createHistoryModal() {
        if (document.getElementById('notificationHistoryModal')) return;

        const modal = document.createElement('div');
        modal.id = 'notificationHistoryModal';
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="notificationSystem.closeHistory()"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="glass-effect rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/10 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                            <i class="fas fa-history text-blue-400"></i>
                            Historial de Notificaciones
                        </h2>
                        <button onclick="notificationSystem.closeHistory()" 
                            class="text-slate-400 hover:text-white transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    
                    <div class="flex gap-2 mb-4">
                        <button id="btnFilterAll" class="filter-btn active px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
                            Todas
                        </button>
                        <button id="btnFilterUnread" class="filter-btn px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium">
                            No Leídas
                        </button>
                        <button id="btnFilterCritical" class="filter-btn px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium">
                            Críticas
                        </button>
                    </div>
                    
                    <div id="historyContent" class="flex-grow overflow-y-auto space-y-2 pr-2">
                        <!-- Contenido dinámico -->
                    </div>
                    
                    <div class="mt-6 flex justify-between items-center pt-4 border-t border-slate-700">
                        <button onclick="notificationSystem.clearHistory()" 
                            class="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium transition-all">
                            <i class="fas fa-trash mr-2"></i>Limpiar Historial
                        </button>
                        <button onclick="notificationSystem.closeHistory()" 
                            class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners para filtros
        document.getElementById('btnFilterAll')?.addEventListener('click', () => this.filterHistory('all'));
        document.getElementById('btnFilterUnread')?.addEventListener('click', () => this.filterHistory('unread'));
        document.getElementById('btnFilterCritical')?.addEventListener('click', () => this.filterHistory('critical'));
    }

    /**
     * Renderizar historial
     */
    renderHistory(filter = 'all') {
        const container = document.getElementById('historyContent');
        if (!container) return;

        let filtered = [...this.history].reverse(); // Más recientes primero

        if (filter === 'unread') {
            filtered = filtered.filter(n => !n.read);
        } else if (filter === 'critical') {
            filtered = filtered.filter(n => n.priority === 'critical');
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-slate-400">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No hay notificaciones ${filter === 'all' ? '' : filter === 'unread' ? 'no leídas' : 'críticas'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(notif => `
            <div class="notification-history-item glass-effect rounded-lg p-4 border-l-4 ${
                notif.read ? 'opacity-60' : ''
            } ${
                notif.priority === 'critical' ? 'border-red-500 bg-red-500/10' :
                notif.priority === 'high' ? 'border-orange-500 bg-orange-500/10' :
                notif.priority === 'medium' ? 'border-blue-500 bg-blue-500/10' :
                'border-slate-500 bg-slate-500/10'
            }">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 text-xl ${this.getIconColor(notif.priority)}">
                        ${this.getIcon(notif.type, notif.priority)}
                    </div>
                    <div class="flex-grow min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <h4 class="font-bold text-white text-sm">${this.escapeHtml(notif.title)}</h4>
                                <p class="text-slate-300 text-xs mt-1">${this.escapeHtml(notif.message)}</p>
                            </div>
                            ${!notif.read ? `
                                <button onclick="notificationSystem.markAsRead('${notif.id}'); notificationSystem.renderHistory('${filter}')" 
                                    class="text-slate-400 hover:text-white flex-shrink-0">
                                    <i class="fas fa-check-circle"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-slate-500">${this.formatTime(notif.timestamp)}</span>
                            <span class="text-xs px-2 py-1 rounded ${
                                notif.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                notif.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                notif.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-slate-500/20 text-slate-400'
                            }">
                                ${notif.priority}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Filtrar historial
     */
    filterHistory(filter) {
        // Actualizar botones activos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600');
            btn.classList.add('bg-slate-700');
        });

        const btn = document.getElementById(`btnFilter${filter.charAt(0).toUpperCase() + filter.slice(1)}`);
        if (btn) {
            btn.classList.add('active', 'bg-blue-600');
            btn.classList.remove('bg-slate-700');
        }

        this.renderHistory(filter);
    }

    /**
     * Cerrar historial
     */
    closeHistory() {
        const modal = document.getElementById('notificationHistoryModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    /**
     * Limpiar historial
     */
    clearHistory() {
        if (confirm('¿Estás seguro de que deseas limpiar todo el historial de notificaciones?')) {
            this.history = [];
            this.notifications = [];
            localStorage.removeItem('notificationHistory');
            this.renderHistory();
            this.updateBadge();
            
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.add({
                    type: 'success',
                    priority: 'low',
                    title: '✅ Historial Limpiado',
                    message: 'El historial de notificaciones ha sido eliminado'
                });
            }
        }
    }

    /**
     * Marcar como leída
     */
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
        this.updateBadge();
    }

    /**
     * Manejar acción de notificación
     */
    handleAction(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && notification.action) {
            if (typeof notification.action === 'function') {
                notification.action();
            }
            this.markAsRead(id);
        }
    }

    /**
     * Actualizar badge
     */
    updateBadge() {
        const unread = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('btnNotificationHistory');
        if (badge) {
            if (unread > 0) {
                badge.innerHTML = `<i class="fas fa-bell"></i><span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">${unread}</span>`;
            } else {
                badge.innerHTML = '<i class="fas fa-bell"></i>';
            }
        }
    }

    /**
     * Verificar si debe mostrarse según preferencias
     */
    shouldShow(priority) {
        return this.preferences[priority] !== false;
    }

    /**
     * Obtener icono según tipo
     */
    getIcon(type, priority) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    /**
     * Obtener color de icono
     */
    getIconColor(priority) {
        const colors = {
            critical: 'text-red-400',
            high: 'text-orange-400',
            medium: 'text-blue-400',
            low: 'text-slate-400'
        };
        return colors[priority] || colors.medium;
    }

    /**
     * Formatear tiempo
     */
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Hace ${hours} h`;
        return date.toLocaleDateString('es-ES');
    }

    /**
     * Escapar HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Cargar preferencias
     */
    loadPreferences() {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) {
            this.preferences = { ...this.preferences, ...JSON.parse(saved) };
        }
    }

    /**
     * Guardar preferencias
     */
    savePreferences() {
        localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    }

    /**
     * Cargar historial
     */
    loadHistory() {
        const saved = localStorage.getItem('notificationHistory');
        if (saved) {
            this.history = JSON.parse(saved).map(n => ({
                ...n,
                timestamp: new Date(n.timestamp)
            }));
        }
    }

    /**
     * Guardar historial
     */
    saveHistory() {
        // Mantener solo últimos 100
        const toSave = this.history.slice(-100);
        localStorage.setItem('notificationHistory', JSON.stringify(toSave));
    }
}

// Inicializar sistema global
if (typeof window !== 'undefined') {
    window.notificationSystem = new NotificationSystem();
}

