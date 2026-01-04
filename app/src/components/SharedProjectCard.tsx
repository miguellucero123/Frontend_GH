import { Building2, Calendar, DollarSign, Users, MapPin, ExternalLink } from 'lucide-react';
import { Project } from '../services/projectService';
import { cn } from '../lib/utils';

interface SharedProjectCardProps {
    project: Project;
    onViewProject?: () => void;
}

export function SharedProjectCard({ project, onViewProject }: SharedProjectCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 my-2 max-w-md">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{project.nombre_mandante}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {project.ciudad}
                        </p>
                    </div>
                </div>
                {onViewProject && (
                    <button
                        onClick={onViewProject}
                        className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors"
                        title="Ver proyecto"
                    >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                    </button>
                )}
            </div>

            <div className="space-y-2 text-sm">
                {project.descripcion && (
                    <p className="text-slate-600 line-clamp-2">{project.descripcion}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Inicio</p>
                            <p className="font-medium text-slate-700">{formatDate(project.fecha_inicio)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Término</p>
                            <p className="font-medium text-slate-700">{formatDate(project.fecha_termino_estimado)}</p>
                        </div>
                    </div>
                </div>

                {project.costo_inicial && (
                    <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500">Presupuesto Inicial</p>
                            <p className="font-bold text-emerald-700">{formatCurrency(project.costo_inicial)}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                    <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        project.activo 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-slate-100 text-slate-600"
                    )}>
                        {project.activo ? 'Activo' : 'Inactivo'}
                    </div>
                </div>
            </div>
        </div>
    );
}

