import { apiClient } from './apiClient';

export interface ChatUser {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    ultimo_acceso?: string;
    proyectos?: number[]; // IDs de proyectos asignados
}

export interface Message {
    id: number;
    remitente_id: number;
    destinatario_id: number;
    contenido: string;
    fecha_envio: string;
    leido: boolean;
    proyecto_id?: number; // ID del proyecto asociado
    tipo?: 'text' | 'project' | 'user' | 'file'; // Tipo de mensaje
    metadata?: {
        projectId?: number;
        userId?: number;
        fileName?: string;
        fileUrl?: string;
    };
}

export interface ProjectChat {
    id: number;
    nombre_mandante: string;
    ciudad: string;
    usuarios_asignados: ChatUser[];
}

// Clase para manejar WebSocket con reconexión automática
class WebSocketService {
    private ws: WebSocket | null = null;
    private messageCallback: ((msg: any) => void) | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private token: string | null = null;
    private isManualDisconnect = false;

    connect(token: string) {
        this.token = token;
        this.isManualDisconnect = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
        this.attemptConnection();
    }

    private attemptConnection() {
        if (this.isManualDisconnect) return;

        // Cambiar protocolo http/https a ws/wss
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = import.meta.env.VITE_WS_HOST || 'localhost:8002';
        const url = `${protocol}//${host}/api/chat/ws?token=${this.token}`;

        try {
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log('✅ WebSocket Connected');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                if (this.messageCallback) {
                    try {
                        const data = JSON.parse(event.data);
                        this.messageCallback(data);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket Disconnected');
                this.ws = null;
                
                // Reconectar automáticamente si no fue desconexión manual
                if (!this.isManualDisconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                    this.reconnectTimer = setTimeout(() => {
                        this.attemptConnection();
                    }, this.reconnectDelay);
                }
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
        }
    }

    onMessage(callback: (msg: any) => void) {
        this.messageCallback = callback;
    }

    sendMessage(toUserId: number, content: string, tipo: 'text' | 'project' | 'user' = 'text', metadata?: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                to_user_id: toUserId,
                content: content,
                tipo: tipo,
                metadata: metadata
            }));
        } else {
            console.error('WS not connected, attempting to reconnect...');
            if (this.token) {
                this.connect(this.token);
                // Reintentar después de un breve delay
                setTimeout(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.sendMessage(toUserId, content, tipo, metadata);
                    }
                }, 1000);
            }
        }
    }

    sendGroupMessage(projectId: number, content: string, tipo: 'text' | 'project' | 'user' = 'text', metadata?: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                project_id: projectId,
                content: content,
                tipo: tipo,
                metadata: metadata
            }));
        } else {
            console.error('WS not connected');
        }
    }

    disconnect() {
        this.isManualDisconnect = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}

export const wsService = new WebSocketService();

export const chatService = {
    getUsers: async () => {
        const response = await apiClient.get<ChatUser[]>('/chat/users');
        return response.data;
    },

    // Obtener usuarios de un proyecto específico
    getUsersByProject: async (projectId: number) => {
        try {
            const response = await apiClient.get<{ usuarios_asignados: ChatUser[] }>(`/projects/${projectId}/users`);
            // El endpoint devuelve ProjectWithUsers, necesitamos extraer usuarios_asignados
            return response.data.usuarios_asignados || [];
        } catch (error) {
            console.error('Error obteniendo usuarios del proyecto:', error);
            // Si falla (por ejemplo, si el usuario no es JEFE), intentar obtener todos los usuarios
            // y filtrar por proyectos asignados
            const allUsers = await chatService.getUsers();
            // Nota: Esto requiere que los usuarios tengan el campo proyectos
            return allUsers.filter(u => u.proyectos?.includes(projectId) || false);
        }
    },

    getHistory: async (otherUserId: number, projectId?: number) => {
        const params = projectId ? `?project_id=${projectId}` : '';
        const response = await apiClient.get<Message[]>(`/chat/history/${otherUserId}${params}`);
        return response.data;
    },

    // Obtener historial de chat grupal de un proyecto
    getProjectChatHistory: async (projectId: number) => {
        const response = await apiClient.get<Message[]>(`/chat/project/${projectId}/history`);
        return response.data;
    }
};
