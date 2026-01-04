/**
 * Módulo de Chat
 * Maneja la comunicación en tiempo real con el Jefe
 */

class ChatManager {
    constructor() {
        this.currentProjectId = null;
        this.receiverId = null; // ID del Jefe
        this.messages = [];
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Inicializar chat
     */
    init(projectId, receiverId) {
        this.currentProjectId = projectId;
        this.receiverId = receiverId;

        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const btnSend = document.getElementById('btnSendMessage');
        const btnMinimize = document.getElementById('btnMinimizeChat');
        const chatWidget = document.getElementById('chatWidget');

        if (!chatMessages || !chatInput || !btnSend) {
            console.warn('Elementos de chat no encontrados');
            return;
        }

        // Cargar mensajes existentes
        this.loadMessages();

        // Event listeners
        btnSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Minimizar chat
        if (btnMinimize && chatWidget) {
            btnMinimize.addEventListener('click', () => {
                chatWidget.classList.toggle('minimized');
            });
        }

        // Conectar WebSocket (si está disponible)
        this.connectWebSocket();
    }

    /**
     * Cargar mensajes del servidor
     */
    async loadMessages() {
        if (!this.currentProjectId) return;

        try {
            const data = await api.getMessages(this.currentProjectId);
            this.messages = data.messages || [];
            this.renderMessages();
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    }

    /**
     * Renderizar mensajes
     */
    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = '';

        if (this.messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="message-item">
                    <div class="message-bubble message-received">
                        <span class="message-text">Bienvenido al sistema. ¿En qué puedo ayudarte?</span>
                        <span class="message-time">${this.formatTime(new Date())}</span>
                    </div>
                </div>
            `;
            return;
        }

        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            chatMessages.appendChild(messageElement);
        });

        // Scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Crear elemento de mensaje
     */
    createMessageElement(message) {
        const currentUserId = auth.getCurrentUser()?.user_id;
        const isSent = message.sender_id === currentUserId;

        const div = document.createElement('div');
        div.className = 'message-item';

        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isSent ? 'message-sent' : 'message-received'}`;

        const text = document.createElement('span');
        text.className = 'message-text';
        text.textContent = message.content;

        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = this.formatTime(new Date(message.timestamp));

        bubble.appendChild(text);
        bubble.appendChild(time);
        div.appendChild(bubble);

        return div;
    }

    /**
     * Enviar mensaje
     */
    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput || !this.currentProjectId || !this.receiverId) return;

        const content = chatInput.value.trim();
        if (!content) return;

        // Limpiar input
        chatInput.value = '';

        try {
            // Enviar mensaje
            const response = await api.sendMessage(
                this.currentProjectId,
                this.receiverId,
                content
            );

            // Agregar mensaje a la lista local
            if (response.message) {
                this.messages.push(response.message);
                this.renderMessages();
            }

            // Enviar por WebSocket si está conectado
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'message',
                    project_id: this.currentProjectId,
                    receiver_id: this.receiverId,
                    content: content
                }));
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
            // Restaurar texto
            chatInput.value = content;
        }
    }

    /**
     * Conectar WebSocket para mensajes en tiempo real (Backend FastAPI)
     */
    connectWebSocket() {
        if (!auth.isAuthenticated() || !this.currentProjectId) return;

        // URL del WebSocket para Backend FastAPI
        // Formato: ws://localhost:8000/api/v1/chat/ws/{project_id}?token=JWT
        let wsURL;
        
        if (typeof window.getWebSocketURL === 'function') {
            // Usar función helper si está disponible
            wsURL = window.getWebSocketURL(this.currentProjectId);
        } else {
            // Construir manualmente
            const config = window.CONFIG || {};
            const apiURL = config.API_BASE_URL || 'http://localhost:8000/api/v1';
            const wsProtocol = apiURL.startsWith('https') ? 'wss:' : 'ws:';
            const apiHost = apiURL.replace(/^https?:\/\//, '').replace(/\/api.*$/, '');
            const token = auth.getToken();
            wsURL = `${wsProtocol}//${apiHost}/api/v1/chat/ws/${this.currentProjectId}?token=${token}`;
        }

        try {
            this.ws = new WebSocket(wsURL);

            this.ws.onopen = () => {
                console.log('WebSocket conectado');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };

            this.ws.onerror = (error) => {
                console.error('Error en WebSocket:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket desconectado');
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('Error al conectar WebSocket:', error);
        }
    }

    /**
     * Manejar mensaje de WebSocket
     */
    handleWebSocketMessage(data) {
        if (data.type === 'new_message') {
            // Agregar nuevo mensaje
            this.messages.push(data.message);
            this.renderMessages();
            this.updateBadge();
        } else if (data.type === 'message_read') {
            // Marcar mensaje como leído
            const message = this.messages.find(m => m.message_id === data.message_id);
            if (message) {
                message.is_read = true;
            }
        }
    }

    /**
     * Intentar reconectar WebSocket
     */
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Máximo de intentos de reconexión alcanzado');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        setTimeout(() => {
            console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.connectWebSocket();
        }, delay);
    }

    /**
     * Actualizar badge de notificaciones
     */
    updateBadge() {
        const badge = document.getElementById('chatBadge');
        if (!badge) return;

        const unreadCount = this.messages.filter(m => !m.is_read && m.sender_id !== auth.getCurrentUser()?.user_id).length;
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    /**
     * Formatear tiempo
     */
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) {
            return 'Ahora';
        } else if (minutes < 60) {
            return `Hace ${minutes} min`;
        } else if (hours < 24) {
            return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (days < 7) {
            return date.toLocaleDateString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        }
    }

    /**
     * Desconectar
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Instancia global
const chatManager = new ChatManager();

