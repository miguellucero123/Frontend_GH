import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Send, Search, User as UserIcon, Circle, Paperclip, Smile, 
    MoreVertical, Phone, Video, Info, Check, CheckCheck, Clock,
    Image as ImageIcon, FileText, X, Download, Trash2, Edit2,
    Archive, Star, Filter, Settings as SettingsIcon, Bell, BellOff,
    MessageSquarePlus, Users, Building2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { wsService, chatService, ChatUser, Message } from '../services/chatService';
import { authService, User } from '../services/authService';
import { projectService, Project } from '../services/projectService';
import { notificationService } from '../services/notificationService';
import { NewChatModal } from '../components/NewChatModal';
import { SharedProjectCard } from '../components/SharedProjectCard';
import { SharedUserCard } from '../components/SharedUserCard';
import { ShareMenu } from '../components/ShareMenu';

interface GroupedMessage {
    date: string;
    messages: Message[];
}

interface ProjectChat {
    projectId: number;
    projectName: string;
    projectCity: string;
    lastMessage?: Message;
    unreadCount: number;
    isGroup: true;
}

export function Messages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [selectedProjectChat, setSelectedProjectChat] = useState<ProjectChat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchMessages, setSearchMessages] = useState('');
    const [messageDateFilter, setMessageDateFilter] = useState<string>('all'); // 'all', 'today', 'week', 'month'
    const [messageUserFilter, setMessageUserFilter] = useState<number | null>(null);
    const [currentUser] = useState<User | null>(authService.getCurrentUser());
    const [isTyping, setIsTyping] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
    const [projectUnreadCounts, setProjectUnreadCounts] = useState<Record<number, number>>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
    const [filterRole, setFilterRole] = useState<string>('all');
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectChats, setProjectChats] = useState<ProjectChat[]>([]);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Conectar WebSocket al montar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            wsService.connect(token);

            wsService.onMessage((data) => {
                if (data.type === 'new_message') {
                    const newMsg = data.message;
                    // Actualizar mensajes si es relevante para la conversación actual
                    setMessages(prev => {
                        if (selectedUser && (newMsg.remitente_id === selectedUser.id || newMsg.destinatario_id === selectedUser.id)) {
                            // Evitar duplicados
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        }
                        return prev;
                    });
                    
                    // Actualizar contador de no leídos
                    if (newMsg.destinatario_id === currentUser?.id && newMsg.remitente_id !== selectedUser?.id) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [newMsg.remitente_id]: (prev[newMsg.remitente_id] || 0) + 1
                        }));
                        
                        // Crear notificación
                        const sender = users.find(u => u.id === newMsg.remitente_id);
                        if (sender) {
                            notificationService.addNotification({
                                type: 'message',
                                title: `Nuevo mensaje de ${sender.nombre}`,
                                message: newMsg.contenido.substring(0, 100),
                                link: `/messages?userId=${sender.id}`,
                                metadata: { userId: sender.id, messageId: newMsg.id }
                            });
                        }
                    }
                } else if (data.type === 'typing') {
                    if (data.user_id === selectedUser?.id) {
                        setIsTyping(true);
                        setTimeout(() => setIsTyping(false), 3000);
                    }
                } else if (data.type === 'user_online') {
                    setOnlineUsers(prev => new Set([...prev, data.user_id]));
                } else if (data.type === 'user_offline') {
                    setOnlineUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(data.user_id);
                        return newSet;
                    });
                }
            });
        }

        return () => wsService.disconnect();
    }, [selectedUser, currentUser]);

    // Cargar proyectos y usuarios al inicio
    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar proyectos (el backend ya filtra por usuario asignado para clientes)
                let allProjects = await projectService.getAll({ activo: true });
                
                // Si es cliente, solo usar los proyectos que ya vienen filtrados del backend
                // No crear datos de ejemplo para clientes
                if (allProjects.length === 0 && currentUser?.rol !== 'cliente') {
                    console.log('No hay proyectos, creando datos de ejemplo...');
                    const exampleProjects: Project[] = [
                        {
                            id: 1,
                            nombre_mandante: 'Torre Residencial A',
                            direccion: 'Av. Principal 123',
                            ciudad: 'Santiago',
                            descripcion: 'Edificio residencial de 20 pisos',
                            fecha_inicio: new Date().toISOString().split('T')[0],
                            fecha_termino_estimado: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            costo_inicial: 500000000,
                            costos_adicionales: 0,
                            costos_extras: 0,
                            costo_final: 500000000,
                            creado_por_id: 1,
                            fecha_creacion: new Date().toISOString(),
                            activo: true
                        },
                        {
                            id: 2,
                            nombre_mandante: 'Centro Comercial',
                            direccion: 'Calle Comercial 456',
                            ciudad: 'Valparaíso',
                            descripcion: 'Centro comercial de 3 pisos',
                            fecha_inicio: new Date().toISOString().split('T')[0],
                            fecha_termino_estimado: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            costo_inicial: 300000000,
                            costos_adicionales: 0,
                            costos_extras: 0,
                            costo_final: 300000000,
                            creado_por_id: 1,
                            fecha_creacion: new Date().toISOString(),
                            activo: true
                        }
                    ];
                    allProjects = exampleProjects;
                }
                
                setProjects(allProjects);
                
                // Crear chats grupales solo para proyectos del usuario
                const chats: ProjectChat[] = allProjects.map(project => ({
                    projectId: project.id,
                    projectName: project.nombre_mandante,
                    projectCity: project.ciudad,
                    unreadCount: 0,
                    isGroup: true
                }));
                setProjectChats(chats);
                
                // Cargar usuarios (para clientes, loadUsers ya filtra por proyectos asignados)
                await loadUsers();
                
                // No crear datos de ejemplo para clientes - deben tener proyectos asignados
                // Los datos de ejemplo solo se usan para jefes/trabajadores en desarrollo
                
                // Verificar parámetros de URL para abrir chat automáticamente
                const projectIdParam = searchParams.get('projectId');
                if (projectIdParam) {
                    const projectId = parseInt(projectIdParam);
                    const projectChat = chats.find(c => c.projectId === projectId);
                    if (projectChat) {
                        setSelectedProjectChat(projectChat);
                        setSelectedProject(projectId);
                        // Limpiar parámetros de URL
                        setSearchParams({});
                    }
                }
            } catch (error) {
                console.error('Error cargando datos', error);
                // Para clientes, no crear datos de ejemplo - deben tener proyectos asignados
                if (currentUser?.rol !== 'cliente') {
                    // Solo crear datos de ejemplo para jefes/trabajadores en desarrollo
                    const exampleUsers: ChatUser[] = [
                        {
                            id: 1,
                            nombre: 'Carlos Mendoza',
                            email: 'cmendoza@constructora.com',
                            rol: 'jefe',
                            proyectos: [1, 2]
                        },
                        {
                            id: 2,
                            nombre: 'María González',
                            email: 'mgonzalez@constructora.com',
                            rol: 'trabajador',
                            proyectos: [1]
                        }
                    ];
                    setUsers(exampleUsers);
                } else {
                    // Clientes sin proyectos asignados no tienen usuarios para chatear
                    setUsers([]);
                }
            }
        };
        loadData();
    }, []);

    // Cargar usuarios del proyecto seleccionado
    useEffect(() => {
        loadUsers();
    }, [selectedProject]);

    // Marcar mensajes como leídos cuando se selecciona un usuario
    useEffect(() => {
        if (selectedUser && messages.length > 0) {
            // Marcar notificaciones relacionadas como leídas
            const relatedNotifications = notificationService.getNotifications()
                .filter(n => n.type === 'message' && n.metadata?.userId === selectedUser.id && !n.read);
            
            relatedNotifications.forEach(n => notificationService.markAsRead(n.id));
        }
    }, [selectedUser, messages]);

    // Manejar parámetros de URL cuando los usuarios se cargan
    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        if (userIdParam && users.length > 0) {
            const userId = parseInt(userIdParam);
            const user = users.find(u => u.id === userId);
            if (user) {
                setSelectedUser(user);
                setSearchParams({});
            }
        }
    }, [users, searchParams, setSearchParams]);

    // Cargar historial al seleccionar usuario o chat grupal
    useEffect(() => {
        if (selectedUser) {
            setSelectedProjectChat(null);
            loadHistory(selectedUser.id);
            // Limpiar contador de no leídos
            setUnreadCounts(prev => ({ ...prev, [selectedUser.id]: 0 }));
        } else if (selectedProjectChat) {
            setSelectedUser(null);
            loadProjectChatHistory(selectedProjectChat.projectId);
            // Limpiar contador de no leídos del proyecto
            setProjectUnreadCounts(prev => ({ ...prev, [selectedProjectChat.projectId]: 0 }));
        } else {
            setMessages([]);
        }
    }, [selectedUser, selectedProjectChat]);

    // Scroll automático al recibir mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Detectar escritura
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        
        // Notificar que está escribiendo
        if (selectedUser && !isTyping) {
            // Enviar señal de typing (simulado, se puede implementar en backend)
        }
        
        // Limpiar timeout anterior
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Detener typing después de 2 segundos sin escribir
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const loadUsers = async () => {
        try {
            let data: ChatUser[];
            
            // Si es cliente, solo cargar usuarios de sus proyectos
            if (currentUser?.rol === 'cliente') {
                // Obtener todos los proyectos del cliente
                const clientProjects = await projectService.getAll({ activo: true });
                const projectIds = clientProjects.map(p => p.id);
                
                if (projectIds.length === 0) {
                    setUsers([]);
                    return;
                }
                
                // Cargar usuarios de todos los proyectos del cliente
                const allUsersFromProjects: ChatUser[] = [];
                for (const projectId of projectIds) {
                    try {
                        const projectUsers = await chatService.getUsersByProject(projectId);
                        // Agregar usuarios únicos (evitar duplicados)
                        projectUsers.forEach(user => {
                            if (!allUsersFromProjects.find(u => u.id === user.id) && user.id !== currentUser?.id) {
                                allUsersFromProjects.push(user);
                            }
                        });
                    } catch (error) {
                        console.error(`Error cargando usuarios del proyecto ${projectId}:`, error);
                    }
                }
                
                data = allUsersFromProjects;
            } else if (selectedProject) {
                // Para jefes y trabajadores, cargar usuarios del proyecto seleccionado
                data = await chatService.getUsersByProject(selectedProject);
            } else {
                // Para jefes y trabajadores sin proyecto seleccionado, cargar todos los usuarios
                data = await chatService.getUsers();
            }
            
            setUsers(data);
            // Simular usuarios en línea (en producción vendría del backend)
            setOnlineUsers(new Set(data.slice(0, 3).map(u => u.id)));
        } catch (error) {
            console.error("Error cargando usuarios chat", error);
        }
    };

    const loadHistory = async (userId: number, projectId?: number) => {
        try {
            const data = await chatService.getHistory(userId, projectId);
            setMessages(data);
        } catch (error) {
            console.error("Error loading history", error);
        }
    };

    const loadProjectChatHistory = async (projectId: number) => {
        try {
            const history = await chatService.getProjectChatHistory(projectId);
            setMessages(history);
        } catch (error) {
            console.error('Error cargando historial del proyecto', error);
            setMessages([]);
        }
    };

    const handleSendMessage = (content?: string, tipo: 'text' | 'project' | 'user' = 'text', metadata?: any) => {
        if (!currentUser) return;
        if (!selectedUser && !selectedProjectChat) return;

        const messageContent = content || inputText.trim();
        if (!messageContent && tipo === 'text') return;

        // Validación para clientes: verificar que el usuario esté en sus proyectos
        if (currentUser.rol === 'cliente' && selectedUser) {
            const userProjects = selectedUser.proyectos || [];
            const clientProjectIds = projects.map(p => p.id);
            const hasCommonProject = userProjects.some(pid => clientProjectIds.includes(pid));
            
            if (!hasCommonProject) {
                alert('⚠️ No puedes enviar mensajes a este usuario. Solo puedes comunicarte con personas involucradas en tus proyectos.');
                return;
            }
        }

        setInputText('');
        setIsTyping(false);
        setShowShareMenu(false);

        if (selectedUser) {
            // Chat individual - usar proyecto en común si existe
            const commonProjectId = currentUser.rol === 'cliente' && selectedUser.proyectos 
                ? selectedUser.proyectos.find(pid => projects.some(p => p.id === pid))
                : selectedProject;
            
            wsService.sendMessage(selectedUser.id, messageContent, tipo, metadata);

            // Optimistic Update
            const tempMsg: Message = {
                id: Date.now(),
                remitente_id: currentUser.id,
                destinatario_id: selectedUser.id,
                contenido: messageContent,
                fecha_envio: new Date().toISOString(),
                leido: false,
                proyecto_id: commonProjectId || selectedProject || undefined,
                tipo: tipo,
                metadata: metadata
            };

            setMessages(prev => [...prev, tempMsg]);
        } else if (selectedProjectChat) {
            // Chat grupal - validar que el cliente tenga acceso al proyecto
            if (currentUser.rol === 'cliente') {
                const hasAccess = projects.some(p => p.id === selectedProjectChat.projectId);
                if (!hasAccess) {
                    alert('⚠️ No tienes acceso a este proyecto. Solo puedes chatear en proyectos donde estás asignado.');
                    return;
                }
            }
            
            wsService.sendGroupMessage(selectedProjectChat.projectId, messageContent, tipo, metadata);

            const tempMsg: Message = {
                id: Date.now(),
                remitente_id: currentUser.id,
                destinatario_id: 0,
                contenido: messageContent,
                fecha_envio: new Date().toISOString(),
                leido: false,
                proyecto_id: selectedProjectChat.projectId,
                tipo: tipo,
                metadata: metadata
            };

            setMessages(prev => [...prev, tempMsg]);
        }
    };

    const handleShareProject = async (project: Project) => {
        try {
            // Cargar información completa del proyecto si no está disponible
            let fullProject = project;
            if (!project.descripcion || !project.fecha_inicio) {
                try {
                    fullProject = await projectService.getById(project.id);
                } catch (error) {
                    console.error('Error cargando proyecto completo:', error);
                }
            }
            
            handleSendMessage(
                `📋 Proyecto: ${fullProject.nombre_mandante}`,
                'project',
                { 
                    projectId: fullProject.id,
                    project: fullProject // Incluir datos completos
                }
            );
        } catch (error) {
            console.error('Error compartiendo proyecto:', error);
        }
    };

    const handleShareUser = (user: ChatUser) => {
        handleSendMessage(
            `👤 Usuario: ${user.nombre}`,
            'user',
            { 
                userId: user.id,
                user: user // Incluir datos completos
            }
        );
    };

    const handleNewChat = (user: ChatUser, projectId?: number) => {
        console.log('📋 Creando nuevo chat con:', user, 'Proyecto:', projectId);
        
        // Verificar si el usuario ya está en la lista
        const existingUser = users.find(u => u.id === user.id);
        if (existingUser) {
            console.log('✅ Usuario ya existe, seleccionando...');
            setSelectedUser(existingUser);
        } else {
            console.log('➕ Agregando nuevo usuario a la lista...');
            // Agregar el usuario a la lista y seleccionarlo
            setUsers(prev => [user, ...prev]);
            setSelectedUser(user);
            // Cargar historial vacío para el nuevo chat
            setMessages([]);
        }
        
        // Si hay un proyecto seleccionado, actualizar el filtro
        if (projectId) {
            setSelectedProject(projectId);
        }
        
        // Cerrar el modal
        setShowNewChatModal(false);
    };

    const handleSettings = () => {
        setShowSettings(true);
        alert('⚙️ Configuración de Mensajería\n\n• Notificaciones de mensajes\n• Sonidos\n• Tema del chat\n• Privacidad\n\nFuncionalidad en desarrollo');
        setShowSettings(false);
    };

    const handleFilterOptions = () => {
        setShowFilterOptions(true);
        const options = [
            'Ver todos',
            'Solo no leídos',
            'Solo en línea',
            'Por rol',
            'Ordenar por fecha',
            'Ordenar por nombre'
        ];
        const selected = prompt(`🔍 Opciones de Filtro:\n\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nSelecciona una opción (1-6):`);
        if (selected) {
            alert(`✅ Filtro aplicado: ${options[parseInt(selected) - 1] || 'Opción inválida'}`);
        }
        setShowFilterOptions(false);
    };

    // Agrupar mensajes por fecha
    const groupMessagesByDate = (msgs: Message[]): GroupedMessage[] => {
        const grouped: Record<string, Message[]> = {};
        
        msgs.forEach(msg => {
            const date = new Date(msg.fecha_envio);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let dateKey: string;
            if (date.toDateString() === today.toDateString()) {
                dateKey = 'Hoy';
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateKey = 'Ayer';
            } else {
                dateKey = date.toLocaleDateString('es-CL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(msg);
        });
        
        return Object.entries(grouped).map(([date, messages]) => ({
            date,
            messages: messages.sort((a, b) => 
                new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime()
            )
        }));
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.rol === filterRole;
        return matchesSearch && matchesRole;
    });

    // Filtrar chats grupales
    const filteredProjectChats = projectChats.filter(chat => {
        const matchesSearch = chat.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.projectCity.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Obtener proyecto de un mensaje
    const getProjectFromMessage = (message: Message): Project | null => {
        if (!message.proyecto_id) return null;
        return projects.find(p => p.id === message.proyecto_id) || null;
    };

    // Obtener proyecto de un usuario (primer proyecto en común)
    const getProjectFromUser = (user: ChatUser): Project | null => {
        if (!selectedProject) return null;
        return projects.find(p => p.id === selectedProject) || null;
    };

    const filteredMessages = messages.filter(msg =>
        msg.contenido.toLowerCase().includes(searchMessages.toLowerCase())
    );

    const groupedMessages = groupMessagesByDate(filteredMessages);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Hoy';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Ayer';
        } else {
            return date.toLocaleDateString('es-CL', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    const getLastMessage = (userId: number) => {
        const userMessages = messages.filter(m => 
            (m.remitente_id === userId || m.destinatario_id === userId)
        );
        if (userMessages.length === 0) return null;
        return userMessages[userMessages.length - 1];
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Header */}
                <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {currentUser?.rol === 'cliente' ? 'Mensajería de Proyectos' : 'Mensajería'}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {currentUser?.rol === 'cliente' 
                                ? 'Comunícate con el equipo de tus proyectos' 
                                : 'Comunícate con tu equipo en tiempo real'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSettings}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Configuración de mensajería"
                        >
                            <SettingsIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleFilterOptions}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Opciones de filtro"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                {/* Selector de Proyecto - Oculto para clientes si solo tienen un proyecto */}
                {currentUser?.rol !== 'cliente' || projects.length > 1 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mt-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {currentUser?.rol === 'cliente' ? 'Mis Proyectos' : 'Filtrar por Proyecto'}
                        </label>
                        <select
                            value={selectedProject || ''}
                            onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">{currentUser?.rol === 'cliente' ? 'Todos mis proyectos' : 'Todos los proyectos'}</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.nombre_mandante} - {project.ciudad}
                                </option>
                            ))}
                        </select>
                        {selectedProject && (
                            <p className="text-xs text-slate-500 mt-2">
                                {currentUser?.rol === 'cliente' 
                                    ? 'Mostrando usuarios de este proyecto' 
                                    : 'Mostrando usuarios del proyecto seleccionado'}
                            </p>
                        )}
                    </div>
                ) : projects.length === 1 && (
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mt-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900">
                                    Proyecto: {projects[0].nombre_mandante}
                                </p>
                                <p className="text-xs text-blue-700">
                                    {projects[0].ciudad}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
                {/* Sidebar Users - Mejorado */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    {/* Search Header */}
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    placeholder="Buscar conversación..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    console.log('🔵 Botón Nuevo Chat clickeado');
                                    setShowNewChatModal(true);
                                }}
                                className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 flex-shrink-0"
                                title="Nuevo chat"
                            >
                                <MessageSquarePlus className="w-5 h-5" />
                            </button>
                        </div>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                            value={filterRole}
                            onChange={e => setFilterRole(e.target.value)}
                        >
                            <option value="all">Todos los roles</option>
                            <option value="jefe">Jefe de Obra</option>
                            <option value="trabajador">Trabajador</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </div>

                    {/* Chats Grupales por Proyecto */}
                    {filteredProjectChats.length > 0 && (
                        <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-slate-600" />
                                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Chats Grupales</h3>
                            </div>
                            <div className="space-y-1">
                                {filteredProjectChats.map(chat => {
                                    const unreadCount = projectUnreadCounts[chat.projectId] || 0;
                                    const isSelected = selectedProjectChat?.projectId === chat.projectId;
                                    
                                    return (
                                        <div
                                            key={chat.projectId}
                                            onClick={() => setSelectedProjectChat(chat)}
                                            className={cn(
                                                "p-3 rounded-lg cursor-pointer transition-all",
                                                isSelected
                                                    ? "bg-blue-100 border border-blue-300"
                                                    : "hover:bg-white border border-transparent"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Building2 className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm text-slate-800 truncate">
                                                        {chat.projectName}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 truncate">{chat.projectCity}</p>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredUsers.length === 0 && filteredProjectChats.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <UserIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p className="text-sm font-medium text-slate-700 mb-1">
                                    {currentUser?.rol === 'cliente' 
                                        ? 'No hay conversaciones disponibles' 
                                        : 'No se encontraron conversaciones'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {currentUser?.rol === 'cliente' 
                                        ? 'Contacta al administrador para que te asignen a un proyecto' 
                                        : 'Inicia una nueva conversación usando el botón +'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {filteredUsers.length > 0 && (
                                    <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-slate-600" />
                                            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Conversaciones Individuales</h3>
                                        </div>
                                    </div>
                                )}
                                {filteredUsers.map(user => {
                                    const lastMessage = getLastMessage(user.id);
                                    const unreadCount = unreadCounts[user.id] || 0;
                                    const isOnline = onlineUsers.has(user.id);
                                    
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => setSelectedUser(user)}
                                            className={cn(
                                                "p-4 border-b border-slate-100 cursor-pointer transition-all relative group",
                                                selectedUser?.id === user.id 
                                                    ? "bg-blue-50 border-l-4 border-l-blue-600" 
                                                    : "hover:bg-white"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="relative shrink-0">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm",
                                                        user.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                                        user.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                                        "bg-gradient-to-br from-purple-600 to-pink-600"
                                                    )}>
                                                        {user.nombre.charAt(0).toUpperCase()}
                                                    </div>
                                                    {isOnline && (
                                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-slate-800 truncate">{user.nombre}</h4>
                                                        {lastMessage && (
                                                            <span className="text-xs text-slate-400 shrink-0 ml-2">
                                                                {formatTime(lastMessage.fecha_envio)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-slate-600 truncate flex-1">
                                                            {lastMessage 
                                                                ? (lastMessage.contenido.length > 40 
                                                                    ? lastMessage.contenido.substring(0, 40) + '...' 
                                                                    : lastMessage.contenido)
                                                                : 'Sin mensajes'}
                                                        </p>
                                                        {unreadCount > 0 && (
                                                            <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={cn(
                                                            "text-xs px-2 py-0.5 rounded-full font-medium",
                                                            user.rol === 'jefe' ? "bg-blue-100 text-blue-700" :
                                                            user.rol === 'trabajador' ? "bg-emerald-100 text-emerald-700" :
                                                            "bg-purple-100 text-purple-700"
                                                        )}>
                                                            {user.rol === 'jefe' ? 'Jefe' : user.rol === 'trabajador' ? 'Trabajador' : 'Cliente'}
                                                        </span>
                                                        {lastMessage?.proyecto_id && (() => {
                                                            const project = getProjectFromMessage(lastMessage);
                                                            return project ? (
                                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <Building2 className="w-3 h-3" />
                                                                    {project.nombre_mandante}
                                                                </span>
                                                            ) : null;
                                                        })()}
                                                        {!isOnline && (
                                                            <span className="text-xs text-slate-400">• Offline</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Chat Area - Mejorado */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedUser ? (
                        <>
                            {/* Chat Header Mejorado */}
                            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md",
                                            selectedUser.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                            selectedUser.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                            "bg-gradient-to-br from-purple-600 to-pink-600"
                                        )}>
                                            {selectedUser.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        {onlineUsers.has(selectedUser.id) && (
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800">{selectedUser.nombre}</h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {onlineUsers.has(selectedUser.id) ? (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span className="text-xs text-emerald-600 font-medium">En línea</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400">Desconectado</span>
                                            )}
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-slate-500 capitalize">{selectedUser.rol}</span>
                                            {(() => {
                                                const userProject = getProjectFromUser(selectedUser);
                                                return userProject ? (
                                                    <>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Building2 className="w-3 h-3" />
                                                            {userProject.nombre_mandante}
                                                        </span>
                                                    </>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                        title="Llamar"
                                    >
                                        <Phone className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                        title="Videollamada"
                                    >
                                        <Video className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowUserInfo(!showUserInfo)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                        title="Información"
                                    >
                                        <Info className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                        title="Más opciones"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Messages Bar - Mejorado */}
                            {messages.length > 0 && (
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 space-y-2">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                        <input
                                            type="text"
                                            placeholder="Buscar en la conversación..."
                                            className="w-full pl-10 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            value={searchMessages}
                                            onChange={e => setSearchMessages(e.target.value)}
                                        />
                                        {searchMessages && (
                                            <button
                                                onClick={() => setSearchMessages('')}
                                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Filtros Avanzados */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <select
                                            value={messageDateFilter}
                                            onChange={e => setMessageDateFilter(e.target.value)}
                                            className="text-xs px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="all">Todas las fechas</option>
                                            <option value="today">Hoy</option>
                                            <option value="week">Esta semana</option>
                                            <option value="month">Este mes</option>
                                        </select>
                                        
                                        {selectedProjectChat && (
                                            <select
                                                value={messageUserFilter || ''}
                                                onChange={e => setMessageUserFilter(e.target.value ? parseInt(e.target.value) : null)}
                                                className="text-xs px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="">Todos los usuarios</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        
                                        {(messageDateFilter !== 'all' || messageUserFilter || searchMessages) && (
                                            <button
                                                onClick={() => {
                                                    setMessageDateFilter('all');
                                                    setMessageUserFilter(null);
                                                    setSearchMessages('');
                                                }}
                                                className="text-xs px-2 py-1 text-slate-600 hover:text-slate-800 underline"
                                            >
                                                Limpiar filtros
                                            </button>
                                        )}
                                        
                                        {filteredMessages.length !== messages.length && (
                                            <span className="text-xs text-slate-500 ml-auto">
                                                {filteredMessages.length} de {messages.length} mensajes
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Messages List Mejorado */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-slate-50 to-white">
                                {groupedMessages.length === 0 ? (
                                    <div className="text-center text-slate-400 py-16">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserIcon className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-500 mb-1">
                                            {searchMessages 
                                                ? 'No se encontraron mensajes' 
                                                : currentUser?.rol === 'cliente'
                                                    ? `Inicia una conversación con ${selectedUser.nombre} del equipo`
                                                    : `Inicia una conversación con ${selectedUser.nombre}`}
                                        </p>
                                        {!searchMessages && (
                                            <p className="text-sm text-slate-400">
                                                {currentUser?.rol === 'cliente' 
                                                    ? 'Envía un mensaje para comunicarte con el equipo del proyecto' 
                                                    : 'Envía un mensaje para comenzar'}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {groupedMessages.map((group, groupIdx) => (
                                    <div key={groupIdx} className="space-y-4">
                                        {/* Date Separator */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-px bg-slate-200"></div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">
                                                {group.date}
                                            </span>
                                            <div className="flex-1 h-px bg-slate-200"></div>
                                        </div>
                                        
                                        {/* Messages */}
                                        {group.messages.map((msg, idx) => {
                                            const isMe = msg.remitente_id === currentUser?.id;
                                            const prevMsg = idx > 0 ? group.messages[idx - 1] : null;
                                            const showAvatar = !prevMsg || prevMsg.remitente_id !== msg.remitente_id || 
                                                (new Date(msg.fecha_envio).getTime() - new Date(prevMsg.fecha_envio).getTime()) > 300000; // 5 minutos
                                            
                                            return (
                                                <div key={msg.id} className={cn("flex gap-3", isMe ? "justify-end" : "justify-start")}>
                                                    {!isMe && (
                                                        <div className="shrink-0">
                                                            {showAvatar ? (
                                                                <div className={cn(
                                                                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm",
                                                                    selectedUser.rol === 'jefe' ? "bg-blue-600" :
                                                                    selectedUser.rol === 'trabajador' ? "bg-emerald-600" :
                                                                    "bg-purple-600"
                                                                )}>
                                                                        {selectedUser.nombre.charAt(0).toUpperCase()}
                                                                    </div>
                                                            ) : (
                                                                <div className="w-8"></div>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
                                                        {!isMe && showAvatar && (
                                                            <span className="text-xs text-slate-500 mb-1 px-2">{selectedUser.nombre}</span>
                                                        )}
                                                        <div className={cn(
                                                            "group relative px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all",
                                                            isMe
                                                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none"
                                                                : "bg-white text-slate-800 border border-slate-200 rounded-bl-none hover:shadow-md"
                                                        )}>
                                                            {/* Mostrar tarjeta compartida si es tipo project o user */}
                                                            {msg.tipo === 'project' && msg.metadata?.projectId && (() => {
                                                                const sharedProject = projects.find(p => p.id === msg.metadata.projectId);
                                                                return sharedProject ? (
                                                                    <SharedProjectCard 
                                                                        project={sharedProject}
                                                                        onViewProject={() => window.location.href = `/projects/${sharedProject.id}`}
                                                                    />
                                                                ) : (
                                                                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.contenido}</p>
                                                                );
                                                            })()}
                                                            {msg.tipo === 'user' && msg.metadata?.userId && (() => {
                                                                const sharedUser = users.find(u => u.id === msg.metadata.userId);
                                                                return sharedUser ? (
                                                                    <SharedUserCard 
                                                                        user={sharedUser}
                                                                        isOnline={onlineUsers.has(sharedUser.id)}
                                                                        onViewUser={() => window.location.href = `/users`}
                                                                    />
                                                                ) : (
                                                                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.contenido}</p>
                                                                );
                                                            })()}
                                                            {(!msg.tipo || msg.tipo === 'text') && (
                                                                <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.contenido}</p>
                                                            )}
                                                            <div className={cn(
                                                                "flex items-center gap-1.5 mt-1.5 justify-end",
                                                                isMe ? "text-blue-100" : "text-slate-400"
                                                            )}>
                                                                <span className="text-[10px]">
                                                                    {new Date(msg.fecha_envio).toLocaleTimeString('es-CL', { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit' 
                                                                    })}
                                                                </span>
                                                                {isMe && (
                                                                    msg.leido ? (
                                                                        <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                                                                    ) : (
                                                                        <Check className="w-3.5 h-3.5 text-blue-200" />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {isMe && <div className="shrink-0 w-8"></div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                                    </>
                                )}
                                
                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                            selectedUser.rol === 'jefe' ? "bg-blue-600" :
                                            selectedUser.rol === 'trabajador' ? "bg-emerald-600" :
                                            "bg-purple-600"
                                        )}>
                                            {selectedUser.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area Mejorado */}
                            <div className="p-4 bg-white border-t border-slate-200">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1 relative">
                                        <div className="flex items-center gap-2 mb-2 relative">
                                            {currentUser?.rol !== 'cliente' && (
                                                <>
                                                    <button
                                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                        title="Adjuntar archivo"
                                                    >
                                                        <Paperclip className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                        title="Adjuntar imagen"
                                                    >
                                                        <ImageIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowShareMenu(true)}
                                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                        title="Compartir proyecto o usuario"
                                                    >
                                                        <Building2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder={currentUser?.rol === 'cliente' 
                                                ? "Escribe un mensaje al equipo..." 
                                                : "Escribe un mensaje..."}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm"
                                            value={inputText}
                                            onChange={handleInputChange}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            onFocus={() => setShowShareMenu(false)}
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim()}
                                        className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
                                        title="Enviar mensaje"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 px-1">
                                    Presiona Enter para enviar • Shift+Enter para nueva línea
                                </p>
                            </div>
                        </>
                    ) : selectedProjectChat ? (
                        <>
                            {/* Chat Grupal Header */}
                            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800">{selectedProjectChat.projectName}</h3>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-xs text-slate-500">{selectedProjectChat.projectCity}</span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-blue-600 font-medium">Chat Grupal</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Info del proyecto">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area - Reutilizar el mismo componente */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                                {groupedMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                        <Users className="w-16 h-16 text-slate-300 mb-4" />
                                        <p className="text-slate-600 font-medium mb-1">
                                            {currentUser?.rol === 'cliente' 
                                                ? 'No hay mensajes en este proyecto aún' 
                                                : 'No hay mensajes en este chat grupal'}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {currentUser?.rol === 'cliente' 
                                                ? 'Sé el primero en iniciar la conversación con el equipo' 
                                                : 'Sé el primero en escribir'}
                                        </p>
                                    </div>
                                ) : (
                                    groupedMessages.map(group => (
                                        <div key={group.date} className="space-y-3">
                                            <div className="text-center">
                                                <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                                    {group.date}
                                                </span>
                                            </div>
                                            {group.messages.map(msg => {
                                                const isOwn = msg.remitente_id === currentUser?.id;
                                                const sender = users.find(u => u.id === msg.remitente_id);
                                                
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={cn(
                                                            "flex gap-3",
                                                            isOwn ? "justify-end" : "justify-start"
                                                        )}
                                                    >
                                                        {!isOwn && sender && (
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0",
                                                                sender.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                                                sender.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                                                "bg-gradient-to-br from-purple-600 to-pink-600"
                                                            )}>
                                                                {sender.nombre.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className={cn(
                                                            "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                                                            isOwn
                                                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                                                                : "bg-white border border-slate-200 text-slate-800"
                                                        )}>
                                                            {!isOwn && sender && (
                                                                <p className="text-xs font-semibold mb-1 text-slate-600">{sender.nombre}</p>
                                                            )}
                                                            {/* Mostrar tarjeta compartida si es tipo project o user */}
                                                            {msg.tipo === 'project' && msg.metadata?.projectId && (() => {
                                                                const sharedProject = msg.metadata.project || projects.find(p => p.id === msg.metadata.projectId);
                                                                return sharedProject ? (
                                                                    <SharedProjectCard 
                                                                        project={sharedProject}
                                                                        onViewProject={() => window.location.href = `/projects/${sharedProject.id}`}
                                                                    />
                                                                ) : (
                                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.contenido}</p>
                                                                );
                                                            })()}
                                                            {msg.tipo === 'user' && msg.metadata?.userId && (() => {
                                                                const sharedUser = msg.metadata.user || users.find(u => u.id === msg.metadata.userId);
                                                                return sharedUser ? (
                                                                    <SharedUserCard 
                                                                        user={sharedUser}
                                                                        isOnline={onlineUsers.has(sharedUser.id)}
                                                                        onViewUser={() => window.location.href = `/users`}
                                                                    />
                                                                ) : (
                                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.contenido}</p>
                                                                );
                                                            })()}
                                                            {(!msg.tipo || msg.tipo === 'text') && (
                                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.contenido}</p>
                                                            )}
                                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                                <span className={cn(
                                                                    "text-xs",
                                                                    isOwn ? "text-blue-100" : "text-slate-400"
                                                                )}>
                                                                    {formatTime(msg.fecha_envio)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area - Mismo que chat individual */}
                            <div className="p-4 bg-white border-t border-slate-200">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1 relative">
                                        <div className="flex items-center gap-2 mb-2 relative">
                                            <button
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                title="Adjuntar archivo"
                                            >
                                                <Paperclip className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                title="Adjuntar imagen"
                                            >
                                                <ImageIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setShowShareMenu(true)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                title="Compartir proyecto o usuario"
                                            >
                                                <Building2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Escribe un mensaje al grupo..."
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm"
                                            value={inputText}
                                            onChange={handleInputChange}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            onFocus={() => setShowShareMenu(false)}
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputText.trim()}
                                        className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
                                        title="Enviar mensaje"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 px-1">
                                    Presiona Enter para enviar • Shift+Enter para nueva línea
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-white">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <UserIcon className="w-12 h-12 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">Selecciona una conversación</h3>
                            <p className="text-sm text-slate-400 max-w-md text-center">
                                Elige un compañero de la lista para comenzar a chatear o busca una conversación existente
                            </p>
                        </div>
                    )}
                </div>

                {/* User Info Sidebar */}
                {showUserInfo && selectedUser && (
                    <div className="w-80 border-l border-slate-200 bg-slate-50 p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-slate-800">Información</h3>
                            <button
                                onClick={() => setShowUserInfo(false)}
                                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        
                        <div className="text-center mb-6">
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg",
                                selectedUser.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                selectedUser.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                "bg-gradient-to-br from-purple-600 to-pink-600"
                            )}>
                                {selectedUser.nombre.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">{selectedUser.nombre}</h4>
                            <p className="text-sm text-slate-500 capitalize">{selectedUser.rol}</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                {onlineUsers.has(selectedUser.id) ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-xs text-emerald-600 font-medium">En línea</span>
                                    </>
                                ) : (
                                    <span className="text-xs text-slate-400">Desconectado</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                    Email
                                </label>
                                <p className="text-sm text-slate-700">{selectedUser.email}</p>
                            </div>
                            
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                    Rol
                                </label>
                                <span className={cn(
                                    "inline-block text-xs px-3 py-1 rounded-full font-medium",
                                    selectedUser.rol === 'jefe' ? "bg-blue-100 text-blue-700" :
                                    selectedUser.rol === 'trabajador' ? "bg-emerald-100 text-emerald-700" :
                                    "bg-purple-100 text-purple-700"
                                )}>
                                    {selectedUser.rol === 'jefe' ? 'Jefe de Obra' : selectedUser.rol === 'trabajador' ? 'Trabajador' : 'Cliente'}
                                </span>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-200">
                                <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                                    <Phone className="w-4 h-4" />
                                    Llamar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Nuevo Chat */}
            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onSelectUser={handleNewChat}
                existingUsers={users}
                selectedProjectId={selectedProject}
            />

            {/* Modal de Compartir */}
            <ShareMenu
                isOpen={showShareMenu}
                onClose={() => setShowShareMenu(false)}
                projects={projects}
                users={users}
                onShareProject={handleShareProject}
                onShareUser={handleShareUser}
            />
        </div>
    );
}
