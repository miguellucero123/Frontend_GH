import { User, Mail, Phone, Shield, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { ChatUser } from '../services/chatService';
import { cn } from '../lib/utils';

interface SharedUserCardProps {
    user: ChatUser;
    onViewUser?: () => void;
    isOnline?: boolean;
}

export function SharedUserCard({ user, onViewUser, isOnline }: SharedUserCardProps) {
    const getRoleBadge = (rol: string) => {
        const styles = {
            jefe: 'bg-blue-100 text-blue-700',
            trabajador: 'bg-emerald-100 text-emerald-700',
            cliente: 'bg-purple-100 text-purple-700'
        };
        const labels = {
            jefe: 'Jefe de Obra',
            trabajador: 'Trabajador',
            cliente: 'Cliente'
        };
        return {
            className: styles[rol as keyof typeof styles] || 'bg-slate-100 text-slate-700',
            label: labels[rol as keyof typeof labels] || rol
        };
    };

    const roleBadge = getRoleBadge(user.rol);

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-4 my-2 max-w-md">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm relative",
                        user.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                        user.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                        "bg-gradient-to-br from-purple-600 to-pink-600"
                    )}>
                        {user.nombre.charAt(0).toUpperCase()}
                        {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{user.nombre}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                        </p>
                    </div>
                </div>
                {onViewUser && (
                    <button
                        onClick={onViewUser}
                        className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Ver usuario"
                    >
                        <ExternalLink className="w-4 h-4 text-slate-600" />
                    </button>
                )}
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", roleBadge.className)}>
                        {roleBadge.label}
                    </span>
                </div>

                {user.ultimo_acceso && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Último acceso</p>
                            <p className="font-medium text-slate-700">
                                {new Date(user.ultimo_acceso).toLocaleDateString('es-CL', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                )}

                {isOnline !== undefined && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {isOnline ? (
                            <>
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-medium text-emerald-600">En línea</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-500">Desconectado</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

