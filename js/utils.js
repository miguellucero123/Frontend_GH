/**
 * Utilidades Generales
 * Funciones auxiliares para el sistema
 */

class Utils {
    /**
     * Formatear fecha
     */
    static formatDate(dateString, options = {}) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        const locale = window.CONFIG?.LOCALE || 'es-ES';
        
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
    }

    /**
     * Formatear fecha y hora
     */
    static formatDateTime(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        const locale = window.CONFIG?.LOCALE || 'es-ES';
        
        return date.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Formatear tiempo relativo
     */
    static formatRelativeTime(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (seconds < 60) {
            return 'Hace un momento';
        } else if (minutes < 60) {
            return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (hours < 24) {
            return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else if (days < 7) {
            return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
        } else {
            return this.formatDate(dateString);
        }
    }

    /**
     * Formatear moneda
     */
    static formatCurrency(amount) {
        if (amount === null || amount === undefined) return '-';
        
        const currency = window.CONFIG?.CURRENCY || 'CLP';
        const locale = window.CONFIG?.LOCALE || 'es-ES';
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Formatear tamaño de archivo
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Validar email
     */
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validar tipo de archivo
     */
    static isValidFileType(file) {
        const config = window.CONFIG || {};
        const allowedTypes = config.ALLOWED_FILE_TYPES || [];
        
        if (allowedTypes.length === 0) return true; // Si no hay restricciones
        
        return allowedTypes.includes(file.type);
    }

    /**
     * Validar tamaño de archivo
     */
    static isValidFileSize(file) {
        const config = window.CONFIG || {};
        const maxSize = config.MAX_FILE_SIZE || 100 * 1024 * 1024; // 100 MB por defecto
        
        return file.size <= maxSize;
    }

    /**
     * Obtener extensión de archivo
     */
    static getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Obtener tipo de archivo desde extensión
     */
    static getFileTypeFromExtension(filename) {
        const extension = this.getFileExtension(filename);
        const typeMap = {
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'txt': 'text/plain',
            'dwg': 'application/acad',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'mp4': 'video/mp4'
        };
        
        return typeMap[extension] || 'application/octet-stream';
    }

    /**
     * Debounce function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Copiar texto al portapapeles
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            }
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error);
            return false;
        }
    }

    /**
     * Mostrar notificación
     */
    static showNotification(message, type = 'info', duration = null) {
        const config = window.CONFIG || {};
        const notificationDuration = duration || config.NOTIFICATION_DURATION || 5000;
        
        // Asegurar que message sea siempre un string
        let messageText = 'Notificación';
        if (typeof message === 'string') {
            messageText = message;
        } else if (message && typeof message === 'object') {
            // Intentar extraer mensaje del objeto
            if (message.message && typeof message.message === 'string') {
                messageText = message.message;
            } else if (message.detail && typeof message.detail === 'string') {
                messageText = message.detail;
            } else if (message.error && typeof message.error === 'string') {
                messageText = message.error;
            } else {
                // Fallback: convertir a JSON string
                try {
                    messageText = JSON.stringify(message);
                } catch (e) {
                    messageText = 'Error desconocido';
                }
            }
        } else if (message !== null && message !== undefined) {
            messageText = String(message);
        }
        
        // Escapar HTML para prevenir XSS
        const escapedMessage = messageText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${escapedMessage}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 300px;
            max-width: 500px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Agregar animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-close {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
        `;
        if (!document.getElementById('notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Cerrar notificación
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-cerrar después de la duración especificada
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, notificationDuration);
    }

    /**
     * Obtener icono de notificación
     */
    static getNotificationIcon(type) {
        const icons = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };
        return icons[type] || 'ℹ';
    }

    /**
     * Obtener color de notificación
     */
    static getNotificationColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    /**
     * Log en modo debug
     */
    static debug(...args) {
        const config = window.CONFIG || {};
        if (config.DEBUG) {
            console.log('[DEBUG]', ...args);
        }
    }

    /**
     * Generar ID único
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Sanitizar HTML
     */
    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Obtener parámetros de URL
     */
    static getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }
}

// Hacer utilidades disponibles globalmente
window.Utils = Utils;

