import React from 'react';
import { Building2, User, X, Search } from 'lucide-react';
import { Project } from '../services/projectService';
import { ChatUser } from '../services/chatService';
import { cn } from '../lib/utils';

interface ShareMenuProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    users: ChatUser[];
    onShareProject: (project: Project) => void;
    onShareUser: (user: ChatUser) => void;
}

export function ShareMenu({ isOpen, onClose, projects, users, onShareProject, onShareUser }: ShareMenuProps) {
    const [activeTab, setActiveTab] = React.useState<'projects' | 'users'>('projects');
    const [searchTerm, setSearchTerm] = React.useState('');

    if (!isOpen) return null;

    const filteredProjects = projects.filter(p =>
        p.nombre_mandante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Compartir</h3>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100">
                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={cn(
                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeTab === 'projects'
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <Building2 className="w-4 h-4 inline mr-2" />
                            Proyectos
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={cn(
                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeTab === 'users'
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Usuarios
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder={activeTab === 'projects' ? 'Buscar proyecto...' : 'Buscar usuario...'}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {activeTab === 'projects' ? (
                        filteredProjects.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p className="text-sm">No se encontraron proyectos</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredProjects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => {
                                            onShareProject(project);
                                            onClose();
                                        }}
                                        className="w-full p-4 hover:bg-slate-50 transition-colors text-left flex items-center gap-3 group"
                                    >
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                {project.nombre_mandante}
                                            </h4>
                                            <p className="text-xs text-slate-500 truncate">{project.ciudad}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )
                    ) : (
                        filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p className="text-sm">No se encontraron usuarios</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredUsers.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => {
                                            onShareUser(user);
                                            onClose();
                                        }}
                                        className="w-full p-4 hover:bg-slate-50 transition-colors text-left flex items-center gap-3 group"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                                            user.rol === 'jefe' ? "bg-blue-600" :
                                            user.rol === 'trabajador' ? "bg-emerald-600" :
                                            "bg-purple-600"
                                        )}>
                                            {user.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                {user.nombre}
                                            </h4>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

