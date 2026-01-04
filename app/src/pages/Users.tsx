import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Shield, User, Phone, MoreVertical, CheckCircle, XCircle, Clock, Download, Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { CreateUserModal } from '../components/CreateUserModal';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    avatar: string;
    projects: number;
}

const mockUsers: UserData[] = [
    {
        id: 1,
        name: 'Carlos Mendoza',
        email: 'cmendoza@constructora.com',
        role: 'Jefe de Obra',
        phone: '+56 9 8765 4321',
        status: 'active',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=0D8ABC&color=fff',
        projects: 3
    },
    {
        id: 2,
        name: 'María González',
        email: 'mgonzalez@constructora.com',
        role: 'Ingeniero Civil',
        phone: '+56 9 7654 3210',
        status: 'active',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=10b981&color=fff',
        projects: 2
    },
    {
        id: 3,
        name: 'Pedro Ramírez',
        email: 'pramirez@constructora.com',
        role: 'Capataz',
        phone: '+56 9 6543 2109',
        status: 'pending',
        avatar: 'https://ui-avatars.com/api/?name=Pedro+Ramirez&background=f59e0b&color=fff',
        projects: 1
    },
    {
        id: 4,
        name: 'Ana Torres',
        email: 'atorres@constructora.com',
        role: 'Administrador',
        phone: '+56 9 5432 1098',
        status: 'inactive',
        avatar: 'https://ui-avatars.com/api/?name=Ana+Torres&background=ef4444&color=fff',
        projects: 0
    }
];

export function Users() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            inactive: 'bg-red-50 text-red-700 border-red-200',
            pending: 'bg-amber-50 text-amber-700 border-amber-200'
        };
        const icons = {
            active: CheckCircle,
            inactive: XCircle,
            pending: Clock
        };
        const labels = {
            active: 'Activo',
            inactive: 'Inactivo',
            pending: 'Pendiente'
        };

        const Icon = icons[status as keyof typeof icons];

        return (
            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', styles[status as keyof typeof styles])}>
                <Icon className="w-3 h-3" />
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const handleCreateUser = () => {
        setShowCreateModal(true);
    };

    const handleUserCreated = () => {
        // Aquí podrías recargar la lista de usuarios o mostrar un mensaje de éxito
        alert('✅ Usuario creado exitosamente.\n\nSe ha enviado un email de activación.');
        // TODO: Recargar lista de usuarios cuando se implemente la integración con el backend
    };

    const handleUserAction = (user: UserData, action: string) => {
        setShowActionsMenu(null);
        switch (action) {
            case 'view':
                alert(`👤 Perfil de ${user.name}\n\nEmail: ${user.email}\nRol: ${user.role}\nTeléfono: ${user.phone}\nProyectos activos: ${user.projects}\nEstado: ${user.status}`);
                break;
            case 'edit':
                const confirmed = confirm(`📝 ¿Editar usuario ${user.name}?`);
                if (confirmed) {
                    alert(`Editando usuario ${user.name}...\n\nFuncionalidad en desarrollo`);
                }
                break;
            case 'message':
                // Navegar a mensajería con el usuario seleccionado
                navigate(`/messages?userId=${user.id}`);
                break;
            case 'delete':
                const confirmDelete = confirm(`⚠️ ¿Está seguro de eliminar a ${user.name}?\n\nEsta acción no se puede deshacer.`);
                if (confirmDelete) {
                    alert(`🗑️ Usuario ${user.name} eliminado correctamente`);
                }
                break;
        }
    };

    const handleExportUsers = () => {
        alert(`📊 Exportando lista de usuarios...\n\nFormato: Excel (.xlsx)\nRegistros: ${filteredUsers.length}\n\n✅ La descarga comenzará en breve`);
    };

    const handleStatClick = (label: string) => {
        switch (label) {
            case 'Total Usuarios':
                alert('👥 Desglose de Usuarios:\n\nActivos: 18\nInactivos: 2\nPendientes: 4\n\nTotal: 24 usuarios');
                break;
            case 'Activos':
                setFilterRole('all');
                setSearchTerm('');
                alert('Mostrando solo usuarios activos');
                break;
            case 'Pendientes':
                alert('⏳ Usuarios Pendientes de Aprobación:\n\n• Pedro Ramírez\n• 3 solicitudes más\n\nRequieren validación del administrador');
                break;
            case 'Roles':
                alert('🎭 Roles del Sistema:\n\n• Administrador\n• Jefe de Obra\n• Ingeniero Civil\n• Capataz\n• Supervisor\n• Operario');
                break;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Usuarios</h1>
                    <p className="text-slate-500 mt-1">Administra el equipo y permisos de acceso</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportUsers}
                        className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-all"
                    >
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button
                        onClick={handleCreateUser}
                        disabled={showCreateModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <UserPlus className="w-5 h-5" /> Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Usuarios', value: '24', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Activos', value: '18', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Pendientes', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Roles', value: '6', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => handleStatClick(stat.label)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left w-full"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={cn('p-3 rounded-xl', stat.bg)}>
                                <stat.icon className={cn('w-6 h-6', stat.color)} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="all">Todos los roles</option>
                    <option value="Jefe de Obra">Jefe de Obra</option>
                    <option value="Ingeniero Civil">Ingeniero Civil</option>
                    <option value="Capataz">Capataz</option>
                    <option value="Administrador">Administrador</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Usuario</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Rol</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Contacto</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Proyectos</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Estado</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.name}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-4 h-4" />
                                            {user.phone}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-900">{user.projects} activos</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {showActionsMenu === user.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                                                    <button
                                                        onClick={() => handleUserAction(user, 'view')}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" /> Ver Perfil
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(user, 'edit')}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" /> Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(user, 'message')}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <MessageSquare className="w-4 h-4" /> Enviar Mensaje
                                                    </button>
                                                    <div className="border-t border-slate-100 my-1"></div>
                                                    <button
                                                        onClick={() => handleUserAction(user, 'delete')}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Crear Usuario */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onUserCreated={handleUserCreated}
            />
        </div>
    );
}
