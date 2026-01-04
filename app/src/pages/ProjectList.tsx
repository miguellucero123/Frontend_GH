import { useState, useEffect } from 'react';
import { Plus, Search, FolderOpen, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectService, Project } from '../services/projectService';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { authService } from '../services/authService';

export function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser] = useState(authService.getCurrentUser());

    const loadProjects = async () => {
        setLoading(true);
        try {
            let data: Project[];
            
            // El backend ya filtra proyectos según el rol:
            // - JEFE: ve todos los proyectos
            // - TRABAJADOR/CLIENTE: solo ve proyectos asignados
            if (currentUser?.rol === 'trabajador' || currentUser?.rol === 'cliente') {
                // Filtrar proyectos activos (el backend ya filtra por usuario asignado)
                data = await projectService.getAll({ activo: true });
            } else {
                // Jefe ve todos los proyectos
                data = await projectService.getAll();
            }
            
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.nombre_mandante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount?: number) => {
        if (!amount) return "$ 0";
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="space-y-8 animate-fade-in text-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {currentUser?.rol === 'trabajador' ? 'Mis Proyectos' : 
                         currentUser?.rol === 'cliente' ? 'Mis Proyectos' : 
                         'Cartera de Proyectos'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {currentUser?.rol === 'trabajador' 
                            ? 'Proyectos asignados a ti' 
                            : currentUser?.rol === 'cliente'
                            ? 'Sigue el avance de tus proyectos en tiempo real'
                            : 'Gestión centralizada de obras en ejecución'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 shadow-sm"
                        />
                    </div>
                    {/* Solo jefes pueden crear proyectos */}
                    {currentUser?.rol === 'jefe' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" /> Nuevo Proyecto
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                    <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">{searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos aún'}</h3>
                    <p className="text-slate-500 mb-6 w-full max-w-md mx-auto">
                        {searchTerm 
                            ? 'Intenta con otros términos de búsqueda.' 
                            : currentUser?.rol === 'trabajador'
                                ? 'No tienes proyectos asignados aún.'
                                : 'Comienza creando tu primera obra para gestionar el cronograma.'}
                    </p>
                    {!searchTerm && currentUser?.rol === 'jefe' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Crear Proyecto Ahora
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                                    <FolderOpen className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${project.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                                    {project.activo ? 'En Ejecución' : 'Inactivo'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{project.nombre_mandante}</h3>
                            <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{project.ciudad}, {project.direccion}</span>
                            </div>

                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">
                                {project.descripcion || 'Sin descripción disponible.'}
                            </p>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Inicio</span>
                                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(project.fecha_inicio).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Costo Total</span>
                                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                        {formatCurrency(project.costo_final)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={loadProjects}
            />
        </div>
    );
}
