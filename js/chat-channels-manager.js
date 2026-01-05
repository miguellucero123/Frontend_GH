/**
 * ============================================================
 * SISTEMA DE CANALES DE COMUNICACIÓN - FASE 3
 * ============================================================
 * 
 * Sistema de chat con canales separados:
 * - Canal Cliente-Gerencia: Solo Cliente y Gerencia
 * - Canal Trabajador-Gerencia: Solo Trabajador y Gerencia
 * - Sin comunicación directa entre Cliente y Trabajador
 * 
 * Gerencia tiene vista unificada con pestañas
 */

class ChatChannelsManager {
    constructor() {
        this.currentProjectId = null;
        this.currentUserRole = null;
        this.currentChannel = null; // 'cliente-gerencia' | 'trabajador-gerencia'
        this.channels = {
            'cliente-gerencia': {
                id: 'cliente-gerencia',
                nombre: 'Canal Cliente',
                participantes: [],
                mensajes: [],
                no_leidos: 0,
                ultimo_mensaje: null
            },
            'trabajador-gerencia': {
                id: 'trabajador-gerencia',
                nombre: 'Canal Trabajadores',
                participantes: [],
                mensajes: [],
                no_leidos: 0,
                ultimo_mensaje: null
            }
        };
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Inicializar sistema de canales
     */
    init(projectId, containerId, userRole) {
        this.currentProjectId = projectId;
        this.currentUserRole = userRole || this.getUserRole();
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('Container de chat no encontrado');
            return;
        }

        // Determinar canal según rol
        if (this.currentUserRole === 'cliente') {
            this.currentChannel = 'cliente-gerencia';
            this.renderClientChat();
        } else if (this.currentUserRole === 'trabajador') {
            this.currentChannel = 'trabajador-gerencia';
            this.renderWorkerChat();
        } else if (this.currentUserRole === 'jefe' || this.currentUserRole === 'admin') {
            // Gerencia: vista unificada con pestañas
            this.renderManagementChat();
        } else {
            console.warn('Rol no reconocido para chat:', this.currentUserRole);
        }

        // Cargar mensajes
        this.loadChannelMessages();

        // Conectar WebSocket
        this.connectWebSocket();
    }

    /**
     * Obtener rol del usuario
     */
    getUserRole() {
        if (typeof auth !== 'undefined' && auth.getCurrentUser) {
            const user = auth.getCurrentUser();
            return user?.role || user?.rol || 'cliente';
        }
        return 'cliente';
    }

    /**
     * Renderizar chat para Cliente
     */
    renderClientChat() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="chat-channel-container" data-channel="cliente-gerencia">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <i class="fas fa-user-tie chat-channel-icon" style="color: #8b5cf6;"></i>
                        <div>
                            <h3>Chat con Gerencia</h3>
                            <p class="chat-subtitle">Comunicación directa con el equipo de gestión</p>
                        </div>
                    </div>
                    <button class="btn-icon btn-minimize-chat" id="btnMinimizeChat">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessagesCliente">
                    <div class="chat-loading">
                        <i class="fas fa-spinner fa-spin"></i> Cargando mensajes...
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chatInputCliente" 
                        class="chat-input" 
                        placeholder="Escribe un mensaje a la gerencia..."
                        maxlength="500"
                    >
                    <button class="btn-icon btn-send" id="btnSendCliente">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="chat-badge" id="chatBadgeCliente" style="display: none;">0</div>
            </div>
        `;

        this.setupClientEventListeners();
    }

    /**
     * Renderizar chat para Trabajador
     */
    renderWorkerChat() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="chat-channel-container" data-channel="trabajador-gerencia">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <i class="fas fa-hard-hat chat-channel-icon" style="color: #f59e0b;"></i>
                        <div>
                            <h3>Chat con Gerencia</h3>
                            <p class="chat-subtitle">Comunicación con el equipo de obra</p>
                        </div>
                    </div>
                    <button class="btn-icon btn-minimize-chat" id="btnMinimizeChat">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessagesTrabajador">
                    <div class="chat-loading">
                        <i class="fas fa-spinner fa-spin"></i> Cargando mensajes...
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chatInputTrabajador" 
                        class="chat-input" 
                        placeholder="Escribe un mensaje a la gerencia..."
                        maxlength="500"
                    >
                    <button class="btn-icon btn-send" id="btnSendTrabajador">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="chat-badge" id="chatBadgeTrabajador" style="display: none;">0</div>
            </div>
        `;

        this.setupWorkerEventListeners();
    }

    /**
     * Renderizar chat para Gerencia (con pestañas)
     */
    renderManagementChat() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="chat-management-container">
                <div class="chat-tabs">
                    <button class="chat-tab active" data-channel="cliente-gerencia" id="tabClienteGerencia">
                        <i class="fas fa-user-tie"></i>
                        <span>Canal Cliente</span>
                        <span class="tab-badge" id="badgeCliente">0</span>
                    </button>
                    <button class="chat-tab" data-channel="trabajador-gerencia" id="tabTrabajadorGerencia">
                        <i class="fas fa-hard-hat"></i>
                        <span>Canal Trabajadores</span>
                        <span class="tab-badge" id="badgeTrabajador">0</span>
                    </button>
                </div>

                <!-- Canal Cliente-Gerencia -->
                <div class="chat-channel-panel active" data-channel="cliente-gerencia" id="panelClienteGerencia">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <i class="fas fa-user-tie chat-channel-icon" style="color: #8b5cf6;"></i>
                            <div>
                                <h3>Canal Cliente</h3>
                                <p class="chat-subtitle">Comunicación con clientes del proyecto</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessagesClienteGerencia">
                        <div class="chat-loading">
                            <i class="fas fa-spinner fa-spin"></i> Cargando mensajes...
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="chatInputClienteGerencia" 
                            class="chat-input" 
                            placeholder="Escribe un mensaje a los clientes..."
                            maxlength="500"
                        >
                        <button class="btn-icon btn-send" id="btnSendClienteGerencia">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>

                <!-- Canal Trabajador-Gerencia -->
                <div class="chat-channel-panel" data-channel="trabajador-gerencia" id="panelTrabajadorGerencia">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <i class="fas fa-hard-hat chat-channel-icon" style="color: #f59e0b;"></i>
                            <div>
                                <h3>Canal Trabajadores</h3>
                                <p class="chat-subtitle">Comunicación con el equipo de obra</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessagesTrabajadorGerencia">
                        <div class="chat-loading">
                            <i class="fas fa-spinner fa-spin"></i> Cargando mensajes...
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="chatInputTrabajadorGerencia" 
                            class="chat-input" 
                            placeholder="Escribe un mensaje a los trabajadores..."
                            maxlength="500"
                        >
                        <button class="btn-icon btn-send" id="btnSendTrabajadorGerencia">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupManagementEventListeners();
    }

    /**
     * Setup event listeners para Cliente
     */
    setupClientEventListeners() {
        const input = document.getElementById('chatInputCliente');
        const btnSend = document.getElementById('btnSendCliente');
        const btnMinimize = document.getElementById('btnMinimizeChat');

        if (btnSend) {
            btnSend.addEventListener('click', () => this.sendMessage('cliente-gerencia', input));
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage('cliente-gerencia', input);
                }
            });
        }

        if (btnMinimize) {
            btnMinimize.addEventListener('click', () => {
                this.container.closest('.chat-widget')?.classList.toggle('minimized');
            });
        }
    }

    /**
     * Setup event listeners para Trabajador
     */
    setupWorkerEventListeners() {
        const input = document.getElementById('chatInputTrabajador');
        const btnSend = document.getElementById('btnSendTrabajador');
        const btnMinimize = document.getElementById('btnMinimizeChat');

        if (btnSend) {
            btnSend.addEventListener('click', () => this.sendMessage('trabajador-gerencia', input));
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage('trabajador-gerencia', input);
                }
            });
        }

        if (btnMinimize) {
            btnMinimize.addEventListener('click', () => {
                this.container.closest('.chat-widget')?.classList.toggle('minimized');
            });
        }
    }

    /**
     * Setup event listeners para Gerencia
     */
    setupManagementEventListeners() {
        // Pestañas
        const tabs = document.querySelectorAll('.chat-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const channel = tab.dataset.channel;
                this.switchChannel(channel);
            });
        });

        // Inputs y botones de envío
        const channels = ['cliente-gerencia', 'trabajador-gerencia'];
        channels.forEach(channel => {
            const inputId = `chatInput${channel === 'cliente-gerencia' ? 'ClienteGerencia' : 'TrabajadorGerencia'}`;
            const btnId = `btnSend${channel === 'cliente-gerencia' ? 'ClienteGerencia' : 'TrabajadorGerencia'}`;
            
            const input = document.getElementById(inputId);
            const btnSend = document.getElementById(btnId);

            if (btnSend) {
                btnSend.addEventListener('click', () => this.sendMessage(channel, input));
            }

            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage(channel, input);
                    }
                });
            }
        });
    }

    /**
     * Cambiar canal (solo para Gerencia)
     */
    switchChannel(channel) {
        if (this.currentUserRole !== 'jefe' && this.currentUserRole !== 'admin') {
            return;
        }

        this.currentChannel = channel;

        // Actualizar pestañas
        document.querySelectorAll('.chat-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.channel === channel) {
                tab.classList.add('active');
            }
        });

        // Actualizar paneles
        document.querySelectorAll('.chat-channel-panel').forEach(panel => {
            panel.classList.remove('active');
            if (panel.dataset.channel === channel) {
                panel.classList.add('active');
            }
        });

        // Cargar mensajes del canal
        this.loadChannelMessages(channel);
    }

    /**
     * Cargar mensajes del canal
     */
    async loadChannelMessages(channel = null) {
        const targetChannel = channel || this.currentChannel;
        if (!targetChannel || !this.currentProjectId) return;

        try {
            // Intentar cargar desde API
            if (typeof api !== 'undefined' && api.getChannelMessages) {
                const data = await api.getChannelMessages(this.currentProjectId, targetChannel);
                this.channels[targetChannel].mensajes = data.messages || [];
            } else {
                // Datos demo
                this.channels[targetChannel].mensajes = this.getDemoMessages(targetChannel);
            }

            this.renderChannelMessages(targetChannel);
        } catch (error) {
            console.error('Error al cargar mensajes del canal:', error);
            this.channels[targetChannel].mensajes = this.getDemoMessages(targetChannel);
            this.renderChannelMessages(targetChannel);
        }
    }

    /**
     * Obtener mensajes demo
     */
    getDemoMessages(channel) {
        const currentUser = auth.getCurrentUser();
        const userId = currentUser?.user_id || 1;

        if (channel === 'cliente-gerencia') {
            return [
                {
                    message_id: 1,
                    sender_id: userId,
                    sender_name: currentUser?.name || 'Cliente',
                    content: 'Buenos días, tengo una consulta sobre el avance del proyecto.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    is_read: true
                },
                {
                    message_id: 2,
                    sender_id: 999, // Gerencia
                    sender_name: 'Gerencia',
                    content: 'Hola, con gusto te ayudo. ¿Cuál es tu consulta?',
                    timestamp: new Date(Date.now() - 3300000).toISOString(),
                    is_read: true
                }
            ];
        } else {
            return [
                {
                    message_id: 3,
                    sender_id: userId,
                    sender_name: currentUser?.name || 'Trabajador',
                    content: 'Necesito los planos actualizados para la siguiente etapa.',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    is_read: true
                },
                {
                    message_id: 4,
                    sender_id: 999, // Gerencia
                    sender_name: 'Gerencia',
                    content: 'Los planos están en la carpeta de obra. Revisa la última versión.',
                    timestamp: new Date(Date.now() - 6900000).toISOString(),
                    is_read: true
                }
            ];
        }
    }

    /**
     * Renderizar mensajes del canal
     */
    renderChannelMessages(channel) {
        const messages = this.channels[channel].mensajes || [];
        let messagesContainer;

        if (this.currentUserRole === 'jefe' || this.currentUserRole === 'admin') {
            // Gerencia: buscar contenedor según canal
            const panelId = channel === 'cliente-gerencia' 
                ? 'chatMessagesClienteGerencia' 
                : 'chatMessagesTrabajadorGerencia';
            messagesContainer = document.getElementById(panelId);
        } else if (this.currentUserRole === 'cliente') {
            messagesContainer = document.getElementById('chatMessagesCliente');
        } else if (this.currentUserRole === 'trabajador') {
            messagesContainer = document.getElementById('chatMessagesTrabajador');
        }

        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';

        if (messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="chat-empty-state">
                    <i class="fas fa-comments"></i>
                    <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                </div>
            `;
            return;
        }

        messages.forEach(message => {
            const messageElement = this.createMessageElement(message, channel);
            messagesContainer.appendChild(messageElement);
        });

        // Scroll al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Actualizar badges
        this.updateBadges();
    }

    /**
     * Crear elemento de mensaje
     */
    createMessageElement(message, channel) {
        const currentUser = auth.getCurrentUser();
        const currentUserId = currentUser?.user_id;
        const isSent = message.sender_id === currentUserId;

        const div = document.createElement('div');
        div.className = 'message-item';

        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isSent ? 'message-sent' : 'message-received'}`;

        if (!isSent) {
            const senderName = document.createElement('div');
            senderName.className = 'message-sender';
            senderName.textContent = message.sender_name || 'Usuario';
            bubble.appendChild(senderName);
        }

        const text = document.createElement('span');
        text.className = 'message-text';
        text.textContent = message.content || message.contenido || '';

        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = this.formatTime(new Date(message.timestamp || message.fecha_envio));

        bubble.appendChild(text);
        bubble.appendChild(time);

        if (message.is_read && isSent) {
            const readIndicator = document.createElement('span');
            readIndicator.className = 'message-read';
            readIndicator.innerHTML = '<i class="fas fa-check-double"></i>';
            bubble.appendChild(readIndicator);
        }

        div.appendChild(bubble);
        return div;
    }

    /**
     * Enviar mensaje
     */
    async sendMessage(channel, inputElement) {
        if (!inputElement || !this.currentProjectId) return;

        const content = inputElement.value.trim();
        if (!content) return;

        // Validar que el usuario puede enviar a este canal
        if (!this.canSendToChannel(channel)) {
            alert('⚠️ No tienes permiso para enviar mensajes a este canal');
            return;
        }

        // Limpiar input
        inputElement.value = '';

        const currentUser = auth.getCurrentUser();
        const newMessage = {
            message_id: Date.now(),
            sender_id: currentUser?.user_id,
            sender_name: currentUser?.name || currentUser?.nombre,
            content: content,
            timestamp: new Date().toISOString(),
            is_read: false
        };

        // Agregar mensaje localmente (optimistic update)
        this.channels[channel].mensajes.push(newMessage);
        this.renderChannelMessages(channel);

        try {
            // Enviar a API
            if (typeof api !== 'undefined' && api.sendChannelMessage) {
                await api.sendChannelMessage(this.currentProjectId, channel, content);
            }

            // Enviar por WebSocket
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'channel_message',
                    project_id: this.currentProjectId,
                    channel: channel,
                    content: content
                }));
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
            // Remover mensaje fallido
            this.channels[channel].mensajes = this.channels[channel].mensajes.filter(
                m => m.message_id !== newMessage.message_id
            );
            this.renderChannelMessages(channel);
            // Restaurar texto
            inputElement.value = content;
        }
    }

    /**
     * Validar si el usuario puede enviar a un canal
     */
    canSendToChannel(channel) {
        if (this.currentUserRole === 'jefe' || this.currentUserRole === 'admin') {
            return true; // Gerencia puede enviar a cualquier canal
        }

        if (this.currentUserRole === 'cliente' && channel === 'cliente-gerencia') {
            return true;
        }

        if (this.currentUserRole === 'trabajador' && channel === 'trabajador-gerencia') {
            return true;
        }

        return false;
    }

    /**
     * Verificar si estamos en modo DEMO
     */
    isDemoMode() {
        // Detectar GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io') || 
                              window.location.hostname.includes('github.com');
        
        // Verificar configuración
        const config = window.CONFIG || {};
        const isDemoConfig = config.DEMO_MODE === true || config.API_BASE_URL === null;
        
        return isDemoConfig || isGitHubPages;
    }

    /**
     * Conectar WebSocket
     */
    connectWebSocket() {
        if (!auth.isAuthenticated()) return;

        // NO intentar conectar WebSocket en modo DEMO
        if (this.isDemoMode()) {
            console.log('[DEMO] WebSocket deshabilitado - Modo DEMO activo');
            // Cargar mensajes de ejemplo en modo DEMO
            this.loadDemoMessages();
            return;
        }

        const config = window.CONFIG || {};
        const apiURL = config.API_BASE_URL || 'http://localhost:8002/api';
        
        // Si no hay API_BASE_URL, no intentar conectar
        if (!apiURL) {
            console.log('[DEMO] No hay backend configurado - Usando modo DEMO');
            this.loadDemoMessages();
            return;
        }

        const wsProtocol = apiURL.startsWith('https') ? 'wss:' : 'ws:';
        const apiHost = apiURL.replace(/^https?:\/\//, '').replace(/\/api.*$/, '');
        const wsURL = `${wsProtocol}//${apiHost}/ws/chat?token=${auth.getToken()}&project_id=${this.currentProjectId}`;

        try {
            this.ws = new WebSocket(wsURL);

            this.ws.onopen = () => {
                console.log('✅ WebSocket de canales conectado');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };

            this.ws.onerror = (error) => {
                // Solo mostrar error si no es un error de conexión esperado (modo DEMO)
                if (!this.isDemoMode()) {
                    console.warn('⚠️ Error en WebSocket (puede ser normal si el backend no está disponible):', error);
                }
            };

            this.ws.onclose = (event) => {
                // Solo intentar reconectar si no estamos en modo DEMO y no fue un cierre normal
                if (!this.isDemoMode() && event.code !== 1000) {
                    console.log('WebSocket desconectado, intentando reconectar...');
                    this.attemptReconnect();
                } else if (!this.isDemoMode()) {
                    console.log('WebSocket desconectado');
                }
            };
        } catch (error) {
            // En modo DEMO, no mostrar errores
            if (!this.isDemoMode()) {
                console.error('Error al conectar WebSocket:', error);
            } else {
                console.log('[DEMO] WebSocket no disponible - Usando modo DEMO');
                this.loadDemoMessages();
            }
        }
    }

    /**
     * Cargar mensajes de ejemplo en modo DEMO
     */
    loadDemoMessages() {
        // Mensajes de ejemplo para modo DEMO
        const demoMessages = {
            'cliente-gerencia': [
                {
                    message_id: 'demo-1',
                    sender: 'Administrador',
                    sender_id: 1,
                    content: 'Bienvenido al sistema de mensajería. Este es el canal de comunicación con clientes.',
                    timestamp: new Date().toISOString(),
                    channel: 'cliente-gerencia'
                }
            ],
            'trabajador-gerencia': [
                {
                    message_id: 'demo-2',
                    sender: 'Administrador',
                    sender_id: 1,
                    content: 'Necesito los planos actualizados para la siguiente etapa.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // Hace 1 hora
                    channel: 'trabajador-gerencia'
                }
            ]
        };

        // Cargar mensajes en los canales correspondientes
        Object.keys(demoMessages).forEach(channelId => {
            if (this.channels[channelId]) {
                this.channels[channelId].mensajes = demoMessages[channelId];
            }
        });

        // Renderizar mensajes si hay un canal activo
        if (this.currentChannel) {
            this.renderChannelMessages(this.currentChannel);
        }
    }

    /**
     * Manejar mensaje de WebSocket
     */
    handleWebSocketMessage(data) {
        if (data.type === 'channel_message') {
            const channel = data.channel;
            if (this.channels[channel]) {
                // Verificar que el usuario tenga acceso a este canal
                if (this.canReceiveFromChannel(channel)) {
                    this.channels[channel].mensajes.push(data.message);
                    this.renderChannelMessages(channel);
                    this.updateBadges();
                }
            }
        }
    }

    /**
     * Validar si el usuario puede recibir de un canal
     */
    canReceiveFromChannel(channel) {
        if (this.currentUserRole === 'jefe' || this.currentUserRole === 'admin') {
            return true;
        }

        if (this.currentUserRole === 'cliente' && channel === 'cliente-gerencia') {
            return true;
        }

        if (this.currentUserRole === 'trabajador' && channel === 'trabajador-gerencia') {
            return true;
        }

        return false;
    }

    /**
     * Intentar reconectar WebSocket
     */
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        setTimeout(() => {
            this.connectWebSocket();
        }, delay);
    }

    /**
     * Actualizar badges de notificaciones
     */
    updateBadges() {
        if (this.currentUserRole === 'jefe' || this.currentUserRole === 'admin') {
            // Gerencia: actualizar badges de pestañas
            const badgeCliente = document.getElementById('badgeCliente');
            const badgeTrabajador = document.getElementById('badgeTrabajador');

            const unreadCliente = this.channels['cliente-gerencia'].mensajes.filter(
                m => !m.is_read && m.sender_id !== auth.getCurrentUser()?.user_id
            ).length;

            const unreadTrabajador = this.channels['trabajador-gerencia'].mensajes.filter(
                m => !m.is_read && m.sender_id !== auth.getCurrentUser()?.user_id
            ).length;

            if (badgeCliente) {
                if (unreadCliente > 0) {
                    badgeCliente.textContent = unreadCliente;
                    badgeCliente.style.display = 'inline-flex';
                } else {
                    badgeCliente.style.display = 'none';
                }
            }

            if (badgeTrabajador) {
                if (unreadTrabajador > 0) {
                    badgeTrabajador.textContent = unreadTrabajador;
                    badgeTrabajador.style.display = 'inline-flex';
                } else {
                    badgeTrabajador.style.display = 'none';
                }
            }
        } else {
            // Cliente o Trabajador: actualizar badge único
            const channel = this.currentChannel;
            const badgeId = this.currentUserRole === 'cliente' 
                ? 'chatBadgeCliente' 
                : 'chatBadgeTrabajador';
            const badge = document.getElementById(badgeId);

            if (badge && this.channels[channel]) {
                const unread = this.channels[channel].mensajes.filter(
                    m => !m.is_read && m.sender_id !== auth.getCurrentUser()?.user_id
                ).length;

                if (unread > 0) {
                    badge.textContent = unread;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
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
            return `Hoy, ${date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (days < 7) {
            return date.toLocaleDateString('es-CL', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
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
const chatChannelsManager = new ChatChannelsManager();

