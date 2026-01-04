import { useState, useEffect } from 'react';
import { X, Search, User, Users, UserPlus, Building2 } from 'lucide-react';
import { chatService, ChatUser } from '../services/chatService';
import { projectService, Project } from '../services/projectService';
import { authService } from '../services/authService';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectUser: (user: ChatUser, projectId?: number) => void;
    existingUsers: ChatUser[];
    selectedProjectId?: number | null;
}

export function NewChatModal({ isOpen, onClose, onSelectUser, existingUsers, selectedProjectId }: NewChatModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(selectedProjectId || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            console.log('📂 Modal de nuevo chat abierto');
            loadProjects();
            loadAvailableUsers();
        } else {
            console.log('📂 Modal de nuevo chat cerrado');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            loadAvailableUsers();
        }
    }, [selectedProject]);

    const loadProjects = async () => {
        try {
            const allProjects = await projectService.getAll({ activo: true });
            setProjects(allProjects);
        } catch (error) {
            console.error('Error cargando proyectos', error);
        }
    };

    const loadAvailableUsers = async () => {
        setLoading(true);
        try {
            console.log('📥 Cargando usuarios disponibles...');
            let users: ChatUser[];
            
            // Si es cliente, solo cargar usuarios de sus proyectos
            const currentUser = authService.getCurrentUser();
            if (currentUser?.rol === 'cliente') {
                // Obtener proyectos del cliente
                const clientProjects = await projectService.getAll({ activo: true });
                const projectIds = clientProjects.map(p => p.id);
                
                // Cargar usuarios de todos los proyectos del cliente
                const allUsersFromProjects: ChatUser[] = [];
                for (const projectId of projectIds) {
                    try {
                        const projectUsers = await chatService.getUsersByProject(projectId);
                        projectUsers.forEach(user => {
                            if (!allUsersFromProjects.find(u => u.id === user.id) && user.id !== currentUser?.id) {
                                allUsersFromProjects.push(user);
                            }
                        });
                    } catch (error) {
                        console.error(`Error cargando usuarios del proyecto ${projectId}:`, error);
                    }
                }
                users = allUsersFromProjects;
            } else if (selectedProject) {
                // Cargar usuarios del proyecto seleccionado
                console.log('📋 Cargando usuarios del proyecto:', selectedProject);
                users = await chatService.getUsersByProject(selectedProject);
            } else {
                // Cargar todos los usuarios
                users = await chatService.getUsers();
            }
            
            console.log('✅ Usuarios cargados:', users.length);
            // Filtrar usuarios que ya tienen conversaciones
            const existingUserIds = new Set(existingUsers.map(u => u.id));
            const filtered = users.filter(u => !existingUserIds.has(u.id));
            console.log('👥 Usuarios disponibles para nuevo chat:', filtered.length);
            setAvailableUsers(filtered);
        } catch (error) {
            console.error('❌ Error cargando usuarios disponibles', error);
            setAvailableUsers([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredUsers = availableUsers.filter(u => {
        const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.rol === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleSelectUser = (user: ChatUser) => {
        console.log('👤 Usuario seleccionado para nuevo chat:', user);
        onSelectUser(user, selectedProject || undefined);
        onClose();
        setSearchTerm('');
        setFilterRole('all');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Nuevo Chat</h3>
                            <p className="text-xs text-slate-500">Selecciona un usuario para iniciar una conversación</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100 bg-white space-y-3">
                    {/* Selector de Proyecto */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            <Building2 className="w-3.5 h-3.5 inline mr-1" />
                            Proyecto
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                            value={selectedProject || ''}
                            onChange={e => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
                        >
                            <option value="">Todos los proyectos</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.nombre_mandante} - {project.ciudad}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    
                    {/* Filtro de Rol */}
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

                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm">Cargando usuarios...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm font-medium text-slate-600 mb-1">
                                {searchTerm || filterRole !== 'all' 
                                    ? 'No se encontraron usuarios' 
                                    : 'Todos los usuarios ya tienen conversaciones'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {searchTerm || filterRole !== 'all'
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Puedes iniciar un chat desde la lista de conversaciones'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full p-4 hover:bg-slate-50 transition-colors text-left flex items-center gap-3 group"
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0",
                                        user.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                        user.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                        "bg-gradient-to-br from-purple-600 to-pink-600"
                                    )}>
                                        {user.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                            {user.nombre}
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        <span className={cn(
                                            "inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1",
                                            user.rol === 'jefe' ? "bg-blue-100 text-blue-700" :
                                            user.rol === 'trabajador' ? "bg-emerald-100 text-emerald-700" :
                                            "bg-purple-100 text-purple-700"
                                        )}>
                                            {user.rol === 'jefe' ? 'Jefe de Obra' : user.rol === 'trabajador' ? 'Trabajador' : 'Cliente'}
                                        </span>
                                    </div>
                                    <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

