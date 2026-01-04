import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { authService, User } from '../services/authService';
import { notificationService } from '../services/notificationService';

export function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [unreadMessageCount, setUnreadMessageCount] = React.useState(0);
    const [showNotifications, setShowNotifications] = React.useState(false);

    React.useEffect(() => {
        const user = authService.getCurrentUser();
        console.log('Layout: Usuario obtenido:', user);
        
        if (!user) {
            console.warn('Layout: No se encontró usuario, redirigiendo al login');
            navigate('/');
            return;
        }
        
        setCurrentUser(user);

        // Suscribirse a cambios en notificaciones
        const unsubscribe = notificationService.subscribe((count) => {
            setUnreadMessageCount(count);
        });

        // Solicitar permiso para notificaciones del navegador
        if ('Notification' in window && Notification.permission === 'default') {
            notificationService.requestPermission();
        }

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    // Definir items de navegación según el rol
    const allNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', roles: ['jefe', 'trabajador', 'cliente'] },
        { icon: FolderKanban, label: 'Proyectos', to: '/projects', roles: ['jefe', 'trabajador', 'cliente'] },
        { icon: Users, label: 'Usuarios', to: '/users', roles: ['jefe'] }, // Solo jefes
        { icon: MessageSquare, label: 'Mensajes', to: '/messages', roles: ['jefe', 'trabajador', 'cliente'] },
        { icon: Settings, label: 'Configuración', to: '/settings', roles: ['jefe', 'trabajador'] }, // Clientes no tienen acceso
    ];

    // Filtrar items según el rol del usuario
    const navItems = currentUser 
        ? allNavItems.filter(item => item.roles.includes(currentUser.rol))
        : allNavItems;

    const handleLogout = () => {
        authService.logout();
    };

    const getRoleLabel = (rol: string) => {
        const labels: Record<string, string> = {
            'jefe': 'Jefe de Obra',
            'trabajador': 'Trabajador',
            'cliente': 'Cliente'
        };
        return labels[rol] || rol;
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col z-20",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center px-4 border-b border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img
                            src="/logo.jpg"
                            alt="Logo"
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                            {isSidebarOpen && (
                                <span className="font-bold text-lg truncate animate-fade-in">
                                    G y H Construcciones SPA
                                </span>
                            )}
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isMessages = item.to === '/messages';
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )
                                }
                            >
                                <div className="relative">
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    {isMessages && unreadMessageCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                                            {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                        </span>
                                    )}
                                </div>
                                {isSidebarOpen && (
                                    <span className="truncate font-medium animate-fade-in flex-1">
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span className="truncate">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 relative hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadMessageCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Panel de Notificaciones */}
                            {showNotifications && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-[600px] flex flex-col">
                                        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                                            <h3 className="font-bold text-slate-900">Notificaciones</h3>
                                            {unreadMessageCount > 0 && (
                                                <button
                                                    onClick={() => {
                                                        notificationService.markAllAsRead();
                                                    }}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Marcar todas como leídas
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-y-auto">
                                            {notificationService.getNotifications().length === 0 ? (
                                                <div className="p-8 text-center text-slate-500">
                                                    <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                    <p className="text-sm">No hay notificaciones</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-100">
                                                    {notificationService.getNotifications().slice(0, 20).map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            onClick={() => {
                                                                notificationService.markAsRead(notification.id);
                                                                if (notification.link) {
                                                                    navigate(notification.link);
                                                                    setShowNotifications(false);
                                                                }
                                                            }}
                                                            className={cn(
                                                                "p-4 hover:bg-slate-50 cursor-pointer transition-colors",
                                                                !notification.read && "bg-blue-50/50"
                                                            )}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn(
                                                                    "w-2 h-2 rounded-full mt-2 shrink-0",
                                                                    !notification.read ? "bg-blue-600" : "bg-slate-300"
                                                                )} />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={cn(
                                                                        "text-sm font-semibold mb-1",
                                                                        !notification.read ? "text-slate-900" : "text-slate-600"
                                                                    )}>
                                                                        {notification.title}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 line-clamp-2">
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-xs text-slate-400 mt-1">
                                                                        {new Date(notification.timestamp).toLocaleString('es-CL', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            {currentUser && (
                                <>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">
                                            {currentUser.nombre}
                                        </p>
                                        <p className="text-xs text-slate-500">{getRoleLabel(currentUser.rol)}</p>
                                    </div>
                                    <div className={cn(
                                        "w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-bold",
                                        currentUser.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                        currentUser.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                        "bg-gradient-to-br from-purple-600 to-pink-600"
                                    )}>
                                        {currentUser.nombre.charAt(0).toUpperCase()}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
