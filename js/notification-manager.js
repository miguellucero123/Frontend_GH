/**
 * ============================================================
 * GESTOR DE NOTIFICACIONES MEJORADO
 * ============================================================
 * 
 * Sistema de notificaciones toast mejorado con múltiples tipos
 */

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    /**
     * Inicializar contenedor de notificaciones
     */
    init() {
        // Crear contenedor si no existe
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.getElementById('notificationContainer');
        }
    }

    /**
     * Mostrar notificación
     */
    show(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            duration
        };

        this.notifications.push(notification);
        this.render(notification);

        // Auto-remover después de la duración
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, duration);
        }

        return notification.id;
    }

    /**
     * Renderizar notificación
     */
    render(notification) {
        if (!this.container) return;

        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.dataset.notificationId = notification.id;

        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };

        notificationEl.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[notification.type] || icons.info}"></i>
                <span class="notification-message">${this.escapeHtml(notification.message)}</span>
                <button class="notification-close" onclick="notificationManager.remove(${notification.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.appendChild(notificationEl);

        // Animación de entrada
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 10);
    }

    /**
     * Remover notificación
     */
    remove(id) {
        const notificationEl = this.container?.querySelector(`[data-notification-id="${id}"]`);
        if (notificationEl) {
            notificationEl.classList.add('hide');
            setTimeout(() => {
                notificationEl.remove();
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    /**
     * Limpiar todas las notificaciones
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.notifications = [];
    }

    /**
     * Métodos de conveniencia
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Utilidades
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instancia global
const notificationManager = new NotificationManager();

