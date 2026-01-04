import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gantt, Task as GTask, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Plus, Calendar as CalendarIcon, RefreshCw, ArrowLeft, LayoutDashboard, FolderOpen, Users, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import { projectService, ProjectStats } from '../services/projectService';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { FileManager } from '../components/FileManager';
import { authService } from '../services/authService';

export function Projects() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'docs' | 'gantt' | 'team'>('dashboard');
    const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Gantt States
    const [view, setView] = useState<ViewMode>(ViewMode.Day);
    const [tasksState, setTasksState] = useState<GTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const PROJECT_ID = id ? parseInt(id) : 1;

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        loadProjectData();
    }, [PROJECT_ID]);

    const loadProjectData = async () => {
        try {
            const stats = await projectService.getStats(PROJECT_ID);
            setProjectStats(stats);
            if (activeTab === 'gantt') loadTasks();
        } catch (e) {
            console.error("Error loading project data", e);
        }
    };

    const loadTasks = async () => {
        setLoading(true);
        try {
            const apiTasks = await api.getProjectTasks(PROJECT_ID);

            if (apiTasks.length === 0) {
                setTasksState([]);
                return;
            }

            const newTasks: GTask[] = apiTasks.map(t => ({
                start: t.start_date ? new Date(t.start_date) : new Date(),
                end: t.end_date ? new Date(t.end_date) : new Date(new Date().setDate(new Date().getDate() + t.duration)),
                name: t.name,
                id: t.id.toString(),
                type: 'task',
                progress: t.progress || 0,
                isDisabled: false,
                styles: {
                    progressColor: t.is_critical ? '#ef4444' : '#3b82f6',
                    progressSelectedColor: t.is_critical ? '#dc2626' : '#2563eb'
                },
            }));
            setTasksState(newTasks);
        } catch (e) {
            console.error("Error loading tasks", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'gantt') loadTasks();
    }, [activeTab]);

    const handleTaskChange = (task: GTask) => {
        let newTasks = tasksState.map(t => (t.id === task.id ? task : t));
        setTasksState(newTasks);
    };

    return (
        <div className="space-y-6 animate-fade-in text-slate-800 min-h-screen flex flex-col">

            {/* Header */}
            <div className="bg-white border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver a proyectos
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 text-sm">Detalle</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{projectStats?.nombre_mandante || 'Cargando Proyecto...'}</h1>
                        <p className="text-slate-500 text-sm mt-1">ID: #{PROJECT_ID} • {projectStats?.estado || 'Estado desconocido'}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-6 border-b border-slate-200 -mb-4">
                    {[
                        { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
                        { id: 'docs', label: 'Documentos', icon: FolderOpen },
                        { id: 'gantt', label: 'Cronograma', icon: CalendarIcon },
                        { id: 'team', label: 'Equipo', icon: Users },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors font-medium text-sm",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1">
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Métricas Clave</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">Progreso Financiero</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${projectStats?.porcentaje_presupuesto || 0}%` }}></div>
                                        </div>
                                        <span className="text-sm font-medium">{projectStats?.porcentaje_presupuesto?.toFixed(1) || 0}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Días Transcurridos</p>
                                    <p className="text-2xl font-bold">{projectStats?.dias_transcurridos || 0} <span className="text-sm font-normal text-slate-400">/ {projectStats?.dias_restantes ? projectStats.dias_transcurridos + projectStats.dias_restantes : '-'} días</span></p>
                                </div>
                            </div>
                        </div>
                        {/* More summary cards here */}
                    </div>
                )}

                {activeTab === 'docs' && (
                    <FileManager projectId={PROJECT_ID} />
                )}

                {activeTab === 'gantt' && (
                    <div className="space-y-4">
                        {/* Toolbar Gantt */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex gap-2">
                                <div className="bg-slate-100 p-1 rounded-lg flex text-sm">
                                    {[ViewMode.Day, ViewMode.Week, ViewMode.Month].map(vm => (
                                        <button
                                            key={vm}
                                            onClick={() => setView(vm)}
                                            className={cn("px-3 py-1 rounded-md transition-colors", view === vm ? "bg-white shadow-sm text-blue-700 font-medium" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            {vm}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={loadTasks} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                                </button>
                            </div>
                            {/* Solo jefes y trabajadores pueden crear tareas */}
                            {(currentUser?.rol === 'jefe' || currentUser?.rol === 'trabajador') && (
                                <button
                                    onClick={() => setIsTaskModalOpen(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Tarea
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[600px] w-full flex flex-col">
                            {tasksState.length > 0 ? (
                                <Gantt
                                    tasks={tasksState}
                                    viewMode={view}
                                    onDateChange={handleTaskChange}
                                    onProgressChange={handleTaskChange}
                                    onDoubleClick={() => alert('Detalles de la tarea')}
                                    listCellWidth="155px"
                                    columnWidth={60}
                                    rowHeight={50}
                                    barCornerRadius={4}
                                    headerHeight={50}
                                    fontFamily="Inter, sans-serif"
                                    fontSize="12px"
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                    <CalendarIcon className="w-16 h-16 mb-4 text-slate-200" />
                                    <p className="font-medium text-slate-500">Sin cronograma definido</p>
                                    {/* Solo jefes y trabajadores pueden crear tareas */}
                                    {(currentUser?.rol === 'jefe' || currentUser?.rol === 'trabajador') && (
                                        <button onClick={() => setIsTaskModalOpen(true)} className="mt-2 text-blue-600 hover:underline text-sm">Crear primera tarea</button>
                                    )}
                                </div>
                            )}
                        </div>
                        <CreateTaskModal
                            isOpen={isTaskModalOpen}
                            onClose={() => setIsTaskModalOpen(false)}
                            onTaskCreated={loadTasks}
                            projectId={PROJECT_ID}
                        />
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="bg-white p-10 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-center mb-8">
                            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">
                                {currentUser?.rol === 'cliente' ? 'Equipo del Proyecto' : 'Gestión de Equipo'}
                            </h3>
                            <p className="text-slate-500 mb-6">
                                {currentUser?.rol === 'cliente' 
                                    ? 'Conoce al equipo que está trabajando en tu proyecto.' 
                                    : 'Asigna usuarios y gestiona permisos para este proyecto.'}
                            </p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            {/* Solo jefes pueden gestionar miembros */}
                            {currentUser?.rol === 'jefe' && (
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Gestionar Miembros
                                </button>
                            )}
                            <button 
                                onClick={() => navigate(`/messages?projectId=${PROJECT_ID}`)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {currentUser?.rol === 'cliente' ? 'Contactar Equipo' : 'Chat del Proyecto'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
