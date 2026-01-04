import { chatService, Message } from './chatService';
import { authService } from './authService';

export interface Notification {
    id: number;
    type: 'message' | 'project_update' | 'requirement' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
    metadata?: any;
}

class NotificationService {
    private listeners: Set<(count: number) => void> = new Set();
    private unreadCount: number = 0;
    private notifications: Notification[] = [];
    private checkInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.loadNotifications();
        this.startPolling();
    }

    // Suscribirse a cambios en el contador de no leídos
    subscribe(callback: (count: number) => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Notificar a todos los suscriptores
    private notifyListeners() {
        this.listeners.forEach(callback => callback(this.unreadCount));
    }

    // Cargar notificaciones desde localStorage
    private loadNotifications() {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        const stored = localStorage.getItem(`notifications_${currentUser.id}`);
        if (stored) {
            this.notifications = JSON.parse(stored).map((n: any) => ({
                ...n,
                timestamp: new Date(n.timestamp)
            }));
            this.updateUnreadCount();
        }
    }

    // Guardar notificaciones en localStorage
    private saveNotifications() {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(this.notifications));
    }

    // Actualizar contador de no leídos
    private updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.notifyListeners();
    }

    // Agregar nueva notificación
    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
        const newNotification: Notification = {
            id: Date.now(),
            ...notification,
            timestamp: new Date(),
            read: false
        };

        this.notifications.unshift(newNotification);
        // Mantener solo las últimas 100 notificaciones
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }

        this.updateUnreadCount();
        this.saveNotifications();

        // Mostrar notificación del navegador si está permitido
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/logo.jpg',
                badge: '/logo.jpg',
                tag: `notification-${newNotification.id}`
            });
        }
    }

    // Marcar notificación como leída
    markAsRead(id: number) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateUnreadCount();
            this.saveNotifications();
        }
    }

    // Marcar todas como leídas
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateUnreadCount();
        this.saveNotifications();
    }

    // Obtener todas las notificaciones
    getNotifications(): Notification[] {
        return this.notifications;
    }

    // Obtener notificaciones no leídas
    getUnreadNotifications(): Notification[] {
        return this.notifications.filter(n => !n.read);
    }

    // Obtener contador de no leídos
    getUnreadCount(): number {
        return this.unreadCount;
    }

    // Solicitar permiso para notificaciones del navegador
    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Iniciar polling para verificar nuevos mensajes
    private startPolling() {
        // Verificar cada 30 segundos
        this.checkInterval = setInterval(async () => {
            await this.checkUnreadMessages();
        }, 30000);

        // Verificar inmediatamente
        this.checkUnreadMessages();
    }

    // Detener polling
    stopPolling() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Verificar mensajes no leídos
    private async checkUnreadMessages() {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) return;

            // Obtener todos los usuarios para verificar mensajes
            const users = await chatService.getUsers();
            let totalUnread = 0;

            for (const user of users) {
                try {
                    const history = await chatService.getHistory(user.id);
                    const unreadMessages = history.filter(
                        msg => msg.destinatario_id === currentUser.id && !msg.leido
                    );

                    if (unreadMessages.length > 0) {
                        totalUnread += unreadMessages.length;

                        // Crear notificación si hay mensajes nuevos
                        const lastUnread = unreadMessages[unreadMessages.length - 1];
                        const existingNotification = this.notifications.find(
                            n => n.type === 'message' && 
                            n.metadata?.userId === user.id &&
                            !n.read
                        );

                        if (!existingNotification) {
                            this.addNotification({
                                type: 'message',
                                title: `Nuevo mensaje de ${user.nombre}`,
                                message: lastUnread.contenido.substring(0, 100),
                                link: `/messages?userId=${user.id}`,
                                metadata: { userId: user.id, messageId: lastUnread.id }
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error checking messages for user ${user.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Error checking unread messages:', error);
        }
    }

    // Limpiar notificaciones antiguas (más de 30 días)
    cleanOldNotifications() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        this.notifications = this.notifications.filter(
            n => n.timestamp > thirtyDaysAgo
        );

        this.saveNotifications();
    }
}

export const notificationService = new NotificationService();

