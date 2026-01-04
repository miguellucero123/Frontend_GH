import { useState, useEffect } from 'react';
import {
    ArrowUpRight, DollarSign, Activity, Calendar, AlertTriangle,
    CheckCircle2, TrendingUp, FileText, Download, Clock, Target,
    Briefcase, ArrowDown, ChevronRight, MapPin, Users, BarChart3,
    Zap, Shield, PieChart, LineChart as LineChartIcon, Filter,
    RefreshCw, Eye, Settings, Bell, TrendingDown, Award, Building2,
    UserCheck, FileCheck, AlertCircle, CheckCircle, XCircle, Edit2,
    FolderOpen, MessageSquare, Plus, ListChecks, CheckSquare, Play, Square,
    Timer, CalendarDays, CalendarCheck, CalendarClock, StopCircle, X
} from 'lucide-react';
import { EditKPIModal } from '../components/EditKPIModal';
import { EditMetricModal } from '../components/EditMetricModal';
import { EditProjectBudgetModal } from '../components/EditProjectBudgetModal';
import { CreateRequirementModal } from '../components/CreateRequirementModal';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
    AreaChart, Area, Legend, ComposedChart
} from 'recharts';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { workHoursService, WorkHour, WorkHourStats } from '../services/workHoursService';

// Mock Data Mejorado
const financialData = [
    { name: 'Ene', planificado: 4000, ejecutado: 3800, proyectado: 4200, presupuesto: 4500 },
    { name: 'Feb', planificado: 4500, ejecutado: 4200, proyectado: 4800, presupuesto: 5000 },
    { name: 'Mar', planificado: 5200, ejecutado: 5000, proyectado: 5500, presupuesto: 5800 },
    { name: 'Abr', planificado: 4800, ejecutado: 4600, proyectado: 5000, presupuesto: 5200 },
    { name: 'May', planificado: 5500, ejecutado: 5200, proyectado: 5800, presupuesto: 6000 },
    { name: 'Jun', planificado: 6000, ejecutado: 5800, proyectado: 6200, presupuesto: 6500 },
    { name: 'Jul', planificado: 6500, ejecutado: 6200, proyectado: 6800, presupuesto: 7000 },
];

const taskData = [
    { name: 'Cimientos', completado: 80, pendiente: 20, retraso: 0 },
    { name: 'Estructura', completado: 45, pendiente: 55, retraso: 5 },
    { name: 'Instalaciones', completado: 25, pendiente: 75, retraso: 10 },
    { name: 'Acabados', completado: 5, pendiente: 95, retraso: 0 },
    { name: 'Paisajismo', completado: 0, pendiente: 100, retraso: 0 },
];

const projectsData = [
    { name: 'Torre A', value: 35, color: '#3b82f6', presupuesto: 1200000, ejecutado: 950000 },
    { name: 'Edificio Central', value: 28, color: '#10b981', presupuesto: 800000, ejecutado: 720000 },
    { name: 'Urbanización', value: 20, color: '#f59e0b', presupuesto: 400000, ejecutado: 380000 },
    { name: 'Centro Comercial', value: 12, color: '#8b5cf6', presupuesto: 200000, ejecutado: 150000 },
    { name: 'Otros', value: 5, color: '#ef4444', presupuesto: 100000, ejecutado: 85000 },
];

const performanceMetrics = [
    { metric: 'Cumplimiento de Plazos', value: 89, target: 95, status: 'warning' },
    { metric: 'Eficiencia Presupuestaria', value: 94, target: 90, status: 'success' },
    { metric: 'Calidad de Obra', value: 97, target: 95, status: 'success' },
    { metric: 'Seguridad', value: 100, target: 100, status: 'success' },
    { metric: 'Satisfacción Cliente', value: 92, target: 90, status: 'success' },
];

const recentActivity = [
    { id: 1, type: 'task', title: 'Tarea completada: Hormigonado Torre A', time: 'Hace 15 min', user: 'Carlos Mendoza', status: 'success', project: 'Torre A' },
    { id: 2, type: 'budget', title: 'Presupuesto aprobado: Instalaciones', time: 'Hace 1 hora', user: 'María González', status: 'info', project: 'Edificio Central' },
    { id: 3, type: 'alert', title: 'Alerta: Retraso en suministro de materiales', time: 'Hace 2 horas', user: 'Sistema', status: 'warning', project: 'Urbanización' },
    { id: 4, type: 'milestone', title: 'Hito alcanzado: Estructura 50%', time: 'Hace 3 horas', user: 'Pedro Ramírez', status: 'success', project: 'Torre A' },
    { id: 5, type: 'user', title: 'Nuevo usuario aprobado: Ana Torres', time: 'Hace 4 horas', user: 'Admin', status: 'info', project: '-' },
    { id: 6, type: 'file', title: 'Documento subido: Planos actualizados', time: 'Hace 5 horas', user: 'María González', status: 'info', project: 'Edificio Central' },
];

const upcomingMilestones = [
    { id: 1, project: 'Torre A', milestone: 'Finalización estructura', date: '15 Ene', progress: 75, critical: true },
    { id: 2, project: 'Edificio Central', milestone: 'Instalaciones eléctricas', date: '22 Ene', progress: 45, critical: false },
    { id: 3, project: 'Urbanización', milestone: 'Pavimentación', date: '30 Ene', progress: 20, critical: false },
    { id: 4, project: 'Centro Comercial', milestone: 'Apertura comercial', date: '15 Feb', progress: 10, critical: false },
];

const riskAlerts = [
    { id: 1, type: 'high', title: 'Retraso crítico en suministro', project: 'Torre A', days: 5, action: 'Revisar proveedor' },
    { id: 2, type: 'medium', title: 'Desviación presupuestaria', project: 'Urbanización', days: 2, action: 'Ajustar costos' },
    { id: 3, type: 'low', title: 'Cambio en especificaciones', project: 'Edificio Central', days: 1, action: 'Actualizar planos' },
];

const topProjects = [
    { id: 1, name: 'Torre A', progress: 75, budget: 1200000, spent: 950000, status: 'on-track', team: 12 },
    { id: 2, name: 'Edificio Central', progress: 60, budget: 800000, spent: 720000, status: 'at-risk', team: 8 },
    { id: 3, name: 'Urbanización', progress: 45, budget: 400000, spent: 380000, status: 'on-track', team: 6 },
];

export function Dashboard() {
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('6months');
    const [refreshKey, setRefreshKey] = useState(0);
    const [globalStats, setGlobalStats] = useState<{
        total_projects: number;
        active_projects: number;
        completed_projects: number;
        total_budget: number;
    } | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [editingKPI, setEditingKPI] = useState<{ index: number; data: any } | null>(null);
    const [editingMetric, setEditingMetric] = useState<{ index: number; data: any } | null>(null);
    const [editingProject, setEditingProject] = useState<{ id: number; data: any } | null>(null);
    const [showRequirementModal, setShowRequirementModal] = useState(false);
    const [requirements, setRequirements] = useState<any[]>([]);
    
    // Estados para trabajador
    const [workHours, setWorkHours] = useState<any[]>([]);
    const [workHourStats, setWorkHourStats] = useState<any>(null);
    const [activeWorkHour, setActiveWorkHour] = useState<any>(null);
    const [myTasks, setMyTasks] = useState<any[]>([]);
    const [showClockInModal, setShowClockInModal] = useState(false);
    
    // Estado local para KPIs editables
    const [kpis, setKPIs] = useState([
        {
            label: 'Presupuesto Total',
            value: '$0',
            trend: '+12%', trendUp: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10',
            subtitle: 'Presupuesto ejecutado'
        },
        {
            label: 'Proyectos Activos',
            value: '0',
            trend: '+1', trendUp: true, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10',
            subtitle: 'En ejecución'
        },
        {
            label: 'Completados',
            value: '0',
            trend: '+2', trendUp: true, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-500/10',
            subtitle: 'Finalizados'
        },
        {
            label: 'Riesgos Activos',
            value: riskAlerts.length.toString(),
            trend: '-1', trendUp: false, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10',
            subtitle: 'Requieren atención'
        },
        {
            label: 'Usuarios Activos',
            value: '24',
            trend: '+3', trendUp: true, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10',
            subtitle: 'En el sistema'
        },
        {
            label: 'Eficiencia Global',
            value: '94%',
            trend: '+2%', trendUp: true, icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10',
            subtitle: 'Rendimiento'
        },
    ]);
    
    // Estado local para métricas editables
    const [metrics, setMetrics] = useState(performanceMetrics);
    
    // Estado local para proyectos editables
    const [projects, setProjects] = useState(topProjects);

    // Formateador de moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        // Cargar datos según el rol del usuario
        if (user?.rol === 'cliente') {
            loadClientDashboardData();
        } else if (user?.rol === 'trabajador') {
            loadWorkerDashboardData();
        } else {
            loadDashboardData();
        }
    }, [refreshKey]);

    const loadClientDashboardData = async () => {
        setLoading(true);
        try {
            // Cargar estadísticas globales del backend (ya filtradas por cliente)
            const stats = await projectService.getGlobalStats();
            setGlobalStats(stats);
            
            // Cargar solo proyectos del cliente (el backend ya filtra por usuario asignado)
            const assignedProjects = await projectService.getAll({ activo: true });
            
            // Cargar requisitos del cliente desde localStorage (en producción sería desde API)
            const savedRequirements = localStorage.getItem(`requirements_${currentUser?.id}`);
            const clientRequirements = savedRequirements ? JSON.parse(savedRequirements) : [];
            setRequirements(clientRequirements);
            
            // Calcular estadísticas del cliente con cálculos dinámicos
            const activeProjects = assignedProjects.filter(p => p.activo);
            const completedProjects = assignedProjects.filter(p => !p.activo);
            
            // Calcular avance promedio basado en proyectos
            const avgProgress = activeProjects.length > 0
                ? activeProjects.reduce((sum, p) => {
                    // Calcular progreso basado en fechas
                    const start = new Date(p.fecha_inicio);
                    const end = new Date(p.fecha_fin_estimada);
                    const today = new Date();
                    const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                    const elapsedDays = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                    const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
                    return sum + progress;
                }, 0) / activeProjects.length
                : 0;
            
            // Calcular requisitos pendientes
            const pendingRequirements = clientRequirements.filter((r: any) => r.estado === 'pendiente' || !r.estado).length;
            const approvedRequirements = clientRequirements.filter((r: any) => r.estado === 'aprobado').length;
            const rejectedRequirements = clientRequirements.filter((r: any) => r.estado === 'rechazado').length;
            
            // Calcular costo total de requisitos pendientes
            const totalRequirementsCost = clientRequirements
                .filter((r: any) => r.estado === 'pendiente' || !r.estado)
                .reduce((sum: number, r: any) => sum + (r.costo_estimado || 0), 0);
            
            // Calcular satisfacción basada en requisitos aprobados vs totales
            const satisfaction = clientRequirements.length > 0
                ? Math.round((approvedRequirements / clientRequirements.length) * 100)
                : 95; // Default si no hay requisitos
            
            // Actualizar KPIs para cliente con cálculos dinámicos
            // Nota: Clientes no ven costos, así que usamos "Inversión" como concepto general
            setKPIs(prev => prev.map((kpi, i) => {
                if (i === 0) {
                    // Clientes no ven costos reales, mostrar número de proyectos en su lugar
                    return { ...kpi, label: 'Mis Proyectos', value: stats.total_projects.toString(), subtitle: 'Total de proyectos asignados' };
                } else if (i === 1) {
                    return { ...kpi, label: 'En Ejecución', value: stats.active_projects.toString(), subtitle: 'Proyectos activos' };
                } else if (i === 2) {
                    return { ...kpi, label: 'Completados', value: stats.completed_projects.toString(), subtitle: 'Proyectos finalizados' };
                } else if (i === 3) {
                    return { ...kpi, label: 'Avance Promedio', value: `${Math.round(avgProgress)}%`, subtitle: 'Progreso general', trend: avgProgress > 70 ? '+5%' : avgProgress > 50 ? '+2%' : '-3%', trendUp: avgProgress > 50 };
                } else if (i === 4) {
                    return { ...kpi, label: 'Requisitos', value: pendingRequirements.toString(), subtitle: `${approvedRequirements} aprobados`, trend: `+${approvedRequirements}`, trendUp: true };
                } else if (i === 5) {
                    return { ...kpi, label: 'Satisfacción', value: `${satisfaction}%`, subtitle: 'Calificación del servicio', trend: satisfaction >= 90 ? '+2%' : satisfaction >= 75 ? '0%' : '-5%', trendUp: satisfaction >= 75 };
                }
                return kpi;
            }));
            
            // Actualizar proyectos para cliente con cálculos dinámicos
            // Clientes no ven costos, solo progreso
            setProjects(assignedProjects.slice(0, 3).map(p => {
                const start = new Date(p.fecha_inicio);
                const end = new Date(p.fecha_termino_estimado);
                const today = new Date();
                const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                const elapsedDays = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                const progress = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
                
                return {
                    id: p.id,
                    name: p.nombre_mandante,
                    progress: progress,
                    budget: 0, // Clientes no ven costos
                    spent: 0, // Clientes no ven costos
                    status: progress >= 80 ? 'on-track' : progress >= 50 ? 'at-risk' : 'delayed',
                    team: 8
                };
            }));
        } catch (error) {
            console.error("Error loading client dashboard", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSaveRequirement = (requirement: any) => {
        const newRequirement = {
            ...requirement,
            id: Date.now(),
            estado: 'pendiente',
            fecha_creacion: new Date().toISOString(),
            creado_por: currentUser?.nombre || 'Cliente'
        };
        
        const updatedRequirements = [...requirements, newRequirement];
        setRequirements(updatedRequirements);
        
        // Guardar en localStorage (en producción sería en API)
        localStorage.setItem(`requirements_${currentUser?.id}`, JSON.stringify(updatedRequirements));
        
        // Recalcular dashboard
        loadClientDashboardData();
        
        alert('✅ Requisito creado exitosamente. El equipo lo revisará pronto.');
    };

    // Actualizar KPIs cuando cambian las estadísticas globales
    useEffect(() => {
        if (globalStats) {
            setKPIs(prev => prev.map((kpi, i) => {
                if (i === 0) {
                    return { ...kpi, value: formatCurrency(globalStats.total_budget) };
                } else if (i === 1) {
                    return { ...kpi, value: globalStats.active_projects.toString() };
                } else if (i === 2) {
                    return { ...kpi, value: globalStats.completed_projects.toString() };
                }
                return kpi;
            }));
        }
    }, [globalStats]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const stats = await projectService.getGlobalStats();
            setGlobalStats(stats);
        } catch (error) {
            console.error("Error loading dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleViewAgenda = () => {
        setShowCalendar(true);
        setTimeout(() => {
            alert('📅 Próximas reuniones:\n\n• Hoy 15:00 - Revisión Torre A\n• Mañana 10:00 - Aprobación presupuesto\n• Viernes 14:00 - Inspección de obra');
            setShowCalendar(false);
        }, 300);
    };

    const handleApproveBudgets = () => {
        setShowBudgetModal(true);
        setTimeout(() => {
            const confirmed = confirm('💰 Presupuestos Pendientes:\n\n1. Instalaciones eléctricas - $45.000.000\n2. Acabados Torre B - $32.000.000\n3. Equipamiento - $18.000.000\n\n¿Aprobar todos los presupuestos?');
            if (confirmed) {
                alert('✅ Presupuestos aprobados exitosamente');
            }
            setShowBudgetModal(false);
        }, 300);
    };

    const handleKPIClick = (label: string, index: number, e?: React.MouseEvent) => {
        // Si se hace clic en el botón de editar, abrir modal
        if (e && (e.target as HTMLElement).closest('.edit-button')) {
            e.stopPropagation();
            const kpi = kpis[index];
            setEditingKPI({ index, data: kpi });
            return;
        }
        
        // Navegación normal
        switch (label) {
            case 'Presupuesto Total':
                navigate('/projects');
                break;
            case 'Proyectos Activos':
                navigate('/projects');
                break;
            case 'Proyectos Completados':
                navigate('/projects?status=completed');
                break;
            case 'Riesgos Activos':
                navigate('/projects');
                break;
            case 'Usuarios Activos':
                navigate('/users');
                break;
            case 'Eficiencia Global':
                alert('📊 Métricas de Eficiencia:\n\nProductividad: 94%\nCumplimiento de plazos: 89%\nCalidad: 97%\nSeguridad: 100%\n\n✨ Rendimiento por encima del promedio');
                break;
        }
    };

    const handleSaveKPI = (data: any) => {
        if (editingKPI) {
            setKPIs(prev => prev.map((kpi, i) => 
                i === editingKPI.index ? { ...kpi, ...data } : kpi
            ));
            setEditingKPI(null);
        }
    };

    const handleSaveMetric = (data: any) => {
        if (editingMetric) {
            setMetrics(prev => prev.map((metric, i) => 
                i === editingMetric.index ? { ...metric, ...data } : metric
            ));
            setEditingMetric(null);
        }
    };

    const handleSaveProject = (data: any) => {
        if (editingProject) {
            setProjects(prev => prev.map((project) => 
                project.id === editingProject.id 
                    ? { ...project, budget: data.budget, spent: data.spent, progress: data.progress } 
                    : project
            ));
            setEditingProject(null);
        }
    };

    const handleExportReport = () => {
        alert('📄 Generando reporte ejecutivo...\n\nIncluye:\n• Resumen financiero\n• Estado de proyectos\n• Análisis de riesgos\n• Proyecciones\n\n✅ El reporte se descargará en formato PDF');
    };

    const handleViewCriticalDelay = () => {
        navigate('/projects/1');
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'task': return CheckCircle2;
            case 'budget': return DollarSign;
            case 'alert': return AlertTriangle;
            case 'milestone': return Target;
            case 'user': return UserCheck;
            case 'file': return FileCheck;
            default: return Activity;
        }
    };

    const getActivityColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-emerald-600 bg-emerald-50';
            case 'warning': return 'text-amber-600 bg-amber-50';
            case 'info': return 'text-blue-600 bg-blue-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('es-CL').format(value);
    };

    const getRiskColor = (type: string) => {
        switch (type) {
            case 'high': return 'bg-red-50 border-red-200 text-red-700';
            case 'medium': return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'low': return 'bg-blue-50 border-blue-200 text-blue-700';
            default: return 'bg-slate-50 border-slate-200 text-slate-700';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-track': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'at-risk': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'delayed': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const renderWorkerDashboard = () => {
        return (
            <div className="space-y-6 animate-fade-in text-slate-800 pb-8">
                {/* Header para Trabajador */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex-1 min-w-[300px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold tracking-tight">Mi Panel de Trabajo</h1>
                                    <button
                                        onClick={handleRefresh}
                                        disabled={loading}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                        title="Actualizar datos"
                                    >
                                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                                    </button>
                                </div>
                                <p className="mt-2 text-emerald-100 max-w-2xl text-lg">
                                    Bienvenido, <span className="font-bold text-white">{currentUser?.nombre || 'Trabajador'}</span>. 
                                    {activeWorkHour ? (
                                        <span> Tienes una entrada activa desde las <span className="font-bold text-white">{activeWorkHour.hora_entrada}</span>.</span>
                                    ) : (
                                        <span> Registra tu entrada para comenzar a trabajar.</span>
                                    )}
                                </p>
                                <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                        <Clock className="w-4 h-4" />
                                        <span>Última actualización: {new Date().toLocaleTimeString('es-CL')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{myTasks.length} tareas asignadas</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                        <Timer className="w-4 h-4" />
                                        <span>{workHourStats?.horas_mes || 0}h trabajadas este mes</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {!activeWorkHour ? (
                                    <button
                                        onClick={() => setShowClockInModal(true)}
                                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-lg font-bold transition-all border border-white/20 text-lg"
                                    >
                                        <Play className="w-5 h-5" /> Registrar Entrada
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleClockOut}
                                        className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md px-6 py-3 rounded-lg font-bold transition-all border border-red-300/20 text-lg"
                                    >
                                        <StopCircle className="w-5 h-5" /> Registrar Salida
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPIs para Trabajador */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kpis.map((kpi, index) => {
                        const Icon = kpi.icon;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300",
                                    "hover:scale-[1.02]"
                                )}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("p-3 rounded-xl", kpi.bg)}>
                                        <Icon className={cn("w-6 h-6", kpi.color)} />
                                    </div>
                                    {kpi.trend && (
                                        <div className={cn(
                                            "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg",
                                            kpi.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {kpi.trend}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</h3>
                                <p className="text-sm font-medium text-slate-600 mb-1">{kpi.label}</p>
                                <p className="text-xs text-slate-500">{kpi.subtitle}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Registro de Horas - Trabajador */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Timer className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Registro de Horas</h2>
                                    <p className="text-sm text-slate-500">Historial de trabajo</p>
                                </div>
                            </div>
                            {activeWorkHour && (
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">En trabajo</span>
                                </div>
                            )}
                        </div>
                        
                        {activeWorkHour && (
                            <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Entrada registrada</p>
                                        <p className="text-2xl font-bold text-emerald-700">{activeWorkHour.hora_entrada}</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(activeWorkHour.fecha).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-600 mb-1">Tiempo transcurrido</p>
                                        <p className="text-2xl font-bold text-emerald-700">
                                            {(() => {
                                                const entrada = new Date(`${activeWorkHour.fecha}T${activeWorkHour.hora_entrada}`);
                                                const ahora = new Date();
                                                const horas = Math.floor((ahora.getTime() - entrada.getTime()) / (1000 * 60 * 60));
                                                const minutos = Math.floor(((ahora.getTime() - entrada.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
                                                return `${horas}h ${minutos}m`;
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {workHours.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p className="text-sm">No hay registros de horas</p>
                                </div>
                            ) : (
                                workHours.slice(0, 10).map((wh) => (
                                    <div
                                        key={wh.id}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all",
                                            wh.estado === 'activo' 
                                                ? "bg-emerald-50 border-emerald-200" 
                                                : "bg-slate-50 border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    {new Date(wh.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            {wh.horas_trabajadas && (
                                                <span className="text-sm font-bold text-blue-600">
                                                    {wh.horas_trabajadas.toFixed(1)}h
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                            <span>Entrada: {wh.hora_entrada}</span>
                                            {wh.hora_salida && <span>Salida: {wh.hora_salida}</span>}
                                        </div>
                                        {wh.descripcion && (
                                            <p className="text-xs text-slate-500 mt-2">{wh.descripcion}</p>
                                        )}
                                        {wh.project_name && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Building2 className="w-3 h-3 text-slate-400" />
                                                <span className="text-xs text-slate-500">{wh.project_name}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Tareas Asignadas - Trabajador */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <ListChecks className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Mis Tareas</h2>
                                    <p className="text-sm text-slate-500">Tareas asignadas a ti</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/projects')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Ver todas
                            </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {myTasks.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <ListChecks className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p className="text-sm">No hay tareas asignadas</p>
                                </div>
                            ) : (
                                myTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => navigate(`/projects/${task.project_id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-900 mb-1">{task.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Building2 className="w-3 h-3" />
                                                    <span>{task.project_name}</span>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full font-medium",
                                                task.status === 'completada' ? "bg-emerald-100 text-emerald-700" :
                                                task.status === 'en_progreso' ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-700"
                                            )}>
                                                {task.status === 'completada' ? 'Completada' :
                                                 task.status === 'en_progreso' ? 'En progreso' : 'Pendiente'}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                                                <span>Progreso</span>
                                                <span>{task.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className={cn(
                                                        "h-2 rounded-full transition-all",
                                                        task.progress === 100 ? "bg-emerald-500" :
                                                        task.progress > 50 ? "bg-blue-500" : "bg-amber-500"
                                                    )}
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <CalendarClock className="w-3 h-3" />
                                                <span>Inicio: {new Date(task.start_date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarCheck className="w-3 h-3" />
                                                <span>Fin: {new Date(task.end_date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Estadísticas de Horas - Gráfico */}
                {workHourStats && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Estadísticas de Horas</h2>
                                    <p className="text-sm text-slate-500">Resumen mensual</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-xs text-slate-600 mb-1">Hoy</p>
                                <p className="text-2xl font-bold text-blue-600">{workHourStats.horas_hoy.toFixed(1)}h</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <p className="text-xs text-slate-600 mb-1">Esta Semana</p>
                                <p className="text-2xl font-bold text-emerald-600">{workHourStats.horas_semana}h</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <p className="text-xs text-slate-600 mb-1">Este Mes</p>
                                <p className="text-2xl font-bold text-purple-600">{workHourStats.horas_mes}h</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl">
                                <p className="text-xs text-slate-600 mb-1">Promedio Diario</p>
                                <p className="text-2xl font-bold text-amber-600">{workHourStats.promedio_diario.toFixed(1)}h</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Registro de Entrada */}
                {showClockInModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-900">Registrar Entrada</h3>
                                <button
                                    onClick={() => setShowClockInModal(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Proyecto (Opcional)</label>
                                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Seleccionar proyecto</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Descripción (Opcional)</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Describe el trabajo que realizarás..."
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleClockIn}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                                    >
                                        <Play className="w-5 h-5 inline mr-2" />
                                        Registrar Entrada
                                    </button>
                                    <button
                                        onClick={() => setShowClockInModal(false)}
                                        className="px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Renderizar dashboard según el rol
    if (currentUser?.rol === 'trabajador') {
        return renderWorkerDashboard();
    }

    return (
        <div className="space-y-6 animate-fade-in text-slate-800 pb-8">
            {/* Header Section with Enhanced Glassmorphism */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-white/5 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold tracking-tight">Panel de Control Ejecutivo</h1>
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                    title="Actualizar datos"
                                >
                                    <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                                </button>
                            </div>
                            <p className="mt-2 text-blue-100 max-w-2xl text-lg">
                                Bienvenido de nuevo, <span className="font-bold text-white">{currentUser?.nombre || 'Usuario'}</span>. 
                                Tienes <span className="font-bold text-white underline decoration-blue-400 decoration-2 underline-offset-2">
                                    {globalStats?.active_projects || 0} proyectos activos
                                </span> reportando avances hoy.
                            </p>
                            <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                    <Clock className="w-4 h-4" />
                                    <span>Última actualización: {new Date().toLocaleTimeString('es-CL')}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{globalStats?.total_projects || 0} total históricos</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                    <Award className="w-4 h-4" />
                                    <span>Rol: {currentUser?.rol === 'jefe' ? 'Jefe de Obra' : currentUser?.rol === 'trabajador' ? 'Trabajador' : 'Cliente'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleExportReport}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all border border-white/20"
                            >
                                <Download className="w-4 h-4" /> Exportar Reporte
                            </button>
                            {currentUser?.rol !== 'cliente' && (
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all"
                                >
                                    <Settings className="w-4 h-4" /> Configuración
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3 flex-wrap">
                        {currentUser?.rol === 'cliente' ? (
                            <>
                                <button
                                    onClick={() => setShowRequirementModal(true)}
                                    className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2.5 rounded-lg font-bold shadow-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" /> Nuevo Requisito
                                </button>
                                <button
                                    onClick={() => navigate('/projects')}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all border border-white/20"
                                >
                                    <FolderOpen className="w-4 h-4" /> Mis Proyectos
                                </button>
                                <button
                                    onClick={() => navigate('/messages')}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all border border-white/20"
                                >
                                    <MessageSquare className="w-4 h-4" /> Contactar Equipo
                                </button>
                                <button
                                    onClick={handleExportReport}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all border border-white/20"
                                >
                                    <Download className="w-4 h-4" /> Descargar Reportes
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleViewAgenda}
                                    disabled={showCalendar}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 border border-white/20"
                                >
                                    <Calendar className="w-4 h-4" /> Ver Agenda
                                </button>
                                {currentUser?.rol === 'jefe' && (
                                    <button
                                        onClick={handleApproveBudgets}
                                        disabled={showBudgetModal}
                                        className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2.5 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Aprobar Presupuestos
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/projects')}
                                    className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all border border-emerald-300/30"
                                >
                                    <TrendingUp className="w-4 h-4" /> Ver Proyectos
                                </button>
                                {currentUser?.rol === 'jefe' && (
                                    <button
                                        onClick={() => navigate('/users')}
                                        className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-md px-4 py-2.5 rounded-lg font-medium transition-all border border-purple-300/30"
                                    >
                                        <Users className="w-4 h-4" /> Gestión de Usuarios
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {kpis.map((stat, i) => (
                    <div
                        key={i}
                        className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        <button
                            onClick={(e) => handleKPIClick(stat.label, i, e)}
                            className="text-left w-full"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={cn("rounded-xl p-2.5", stat.bg)}>
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={cn(
                                        "flex items-center font-semibold text-xs px-2 py-0.5 rounded-full",
                                        stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                                    )}>
                                        {stat.trendUp ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDown className="mr-0.5 h-3 w-3" />}
                                        {stat.trend}
                                    </span>
                                    {/* Solo jefes pueden editar KPIs */}
                                    {currentUser?.rol === 'jefe' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingKPI({ index: i, data: stat });
                                            }}
                                            className="edit-button p-1 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                            title="Editar KPI"
                                        >
                                            <Edit2 className="w-3 h-3 text-slate-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
                                {stat.subtitle && (
                                    <p className="text-xs text-slate-400 mt-1">{stat.subtitle}</p>
                                )}
                            </div>
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {metrics.map((metric, i) => (
                    <div key={i} className="group relative bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-slate-600">{metric.metric}</p>
                            <div className="flex items-center gap-1">
                                {metric.status === 'success' ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                )}
                                {/* Solo jefes pueden editar métricas */}
                                {currentUser?.rol === 'jefe' && (
                                    <button
                                        onClick={() => setEditingMetric({ index: i, data: metric })}
                                        className="p-1 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="Editar métrica"
                                    >
                                        <Edit2 className="w-3 h-3 text-slate-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <p className="text-2xl font-bold text-slate-800">{metric.value}%</p>
                            <p className="text-xs text-slate-400">/ {metric.target}%</p>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                                className={cn(
                                    "h-2 rounded-full transition-all",
                                    metric.value >= metric.target ? "bg-emerald-500" : "bg-amber-500"
                                )}
                                style={{ width: `${Math.min(metric.value, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enhanced Financial Curve */}
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <LineChartIcon className="w-5 h-5 text-blue-600" />
                                Flujo de Caja (S-Curve)
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Comparativa: Planificado vs Ejecutado vs Proyectado</p>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="6months">Últimos 6 meses</option>
                                <option value="year">Este año</option>
                                <option value="lastyear">Último año</option>
                            </select>
                            <button
                                onClick={() => alert('📊 Exportando gráfico de flujo de caja...')}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                title="Exportar gráfico"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={financialData}>
                                <defs>
                                    <linearGradient id="colorEjecutado" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '13px' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="ejecutado" fill="url(#colorEjecutado)" stroke="#3b82f6" strokeWidth={2} name="Ejecutado" />
                                <Line type="monotone" dataKey="planificado" stroke="#94a3b8" strokeWidth={2} dot={false} name="Planificado" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="proyectado" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Proyectado" strokeDasharray="3 3" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-6 justify-center text-sm flex-wrap">
                        {[
                            { label: 'Planificado', color: 'bg-slate-400' },
                            { label: 'Ejecutado', color: 'bg-blue-600' },
                            { label: 'Proyectado', color: 'bg-emerald-600' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full", item.color)}></div>
                                <span className="text-slate-600">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution by Project - Enhanced Pie Chart */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-purple-600" />
                            Distribución por Proyecto
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Presupuesto asignado</p>
                    </div>
                    <div className="h-[240px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={projectsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {projectsData.map((project, i) => (
                            <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                                    <span className="text-slate-700 font-medium">{project.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-slate-900">{project.value}%</span>
                                    <span className="text-xs text-slate-400">{formatCurrency(project.ejecutado)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Task Progress */}
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-emerald-600" />
                                Estado de Obras
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Avance físico por fase principal</p>
                        </div>
                        <button
                            onClick={() => navigate('/projects')}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            title="Ver todos los proyectos"
                        >
                            <FileText className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={taskData} barSize={32} barGap={10}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="completado" name="Completado" stackId="a" fill="#10b981" radius={[4, 0, 0, 4]} />
                                <Bar dataKey="pendiente" name="Pendiente" stackId="a" fill="#f1f5f9" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-2">
                        {riskAlerts.filter(r => r.type === 'high').map((alert) => (
                            <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-red-500">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{alert.title}</p>
                                        <p className="text-xs text-slate-500">{alert.project} • {alert.days} días de retraso</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleViewCriticalDelay}
                                    className="text-xs font-bold text-red-600 bg-white px-3 py-1.5 rounded-md shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
                                >
                                    {alert.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Upcoming Milestones */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            Próximos Hitos
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Fechas clave del mes</p>
                    </div>
                    <div className="space-y-4">
                        {upcomingMilestones.map((milestone) => (
                            <div key={milestone.id} className="group cursor-pointer p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                {milestone.milestone}
                                            </p>
                                            {milestone.critical && (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">CRÍTICO</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            <p className="text-xs text-slate-500">{milestone.project}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">{milestone.date}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${milestone.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{milestone.progress}% completado</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/projects')}
                        className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        Ver todos los hitos
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Top Projects Table */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            {currentUser?.rol === 'cliente' ? 'Mis Proyectos' : 'Proyectos Destacados'}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {currentUser?.rol === 'cliente' 
                                ? 'Estado y avance de tus proyectos en tiempo real' 
                                : 'Top proyectos por presupuesto y avance'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        {currentUser?.rol === 'cliente' ? 'Ver detalles' : 'Ver todos'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Proyecto</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Avance</th>
                                {currentUser?.rol !== 'cliente' && (
                                    <>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Presupuesto</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Ejecutado</th>
                                    </>
                                )}
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Equipo</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Estado</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-4">
                                        <p className="font-semibold text-slate-800">{project.name}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{project.progress}%</span>
                                        </div>
                                    </td>
                                    {currentUser?.rol !== 'cliente' && (
                                        <>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-slate-700">{formatCurrency(project.budget)}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-slate-700">{formatCurrency(project.spent)}</p>
                                                <p className="text-xs text-slate-400">
                                                    {project.budget > 0 ? `${((project.spent / project.budget) * 100).toFixed(1)}% usado` : 'N/A'}
                                                </p>
                                            </td>
                                        </>
                                    )}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-700">{project.team} miembros</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", getStatusColor(project.status))}>
                                            {project.status === 'on-track' ? 'En Tiempo' : project.status === 'at-risk' ? 'En Riesgo' : 'Retrasado'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Solo jefes pueden editar presupuesto */}
                                            {currentUser?.rol === 'jefe' && (
                                                <button
                                                    onClick={() => setEditingProject({ id: project.id, data: project })}
                                                    className="p-1.5 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Editar presupuesto"
                                                >
                                                    <Edit2 className="w-4 h-4 text-slate-400" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                {currentUser?.rol === 'cliente' ? 'Ver Detalles' : 'Ver'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Requisitos Section para Clientes */}
            {currentUser?.rol === 'cliente' && requirements.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-blue-600" />
                                Mis Requisitos
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {requirements.filter((r: any) => r.estado === 'pendiente' || !r.estado).length} pendientes • {requirements.filter((r: any) => r.estado === 'aprobado').length} aprobados
                            </p>
                        </div>
                        <button
                            onClick={() => setShowRequirementModal(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Nuevo
                        </button>
                    </div>
                    <div className="space-y-3">
                        {requirements.slice(0, 5).map((req: any) => (
                            <div key={req.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-0.5 rounded-full",
                                                req.estado === 'aprobado' ? "bg-emerald-100 text-emerald-700" :
                                                req.estado === 'rechazado' ? "bg-red-100 text-red-700" :
                                                "bg-amber-100 text-amber-700"
                                            )}>
                                                {req.estado === 'aprobado' ? 'Aprobado' : req.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                                            </span>
                                            <span className={cn(
                                                "text-xs font-semibold px-2 py-0.5 rounded-full",
                                                req.prioridad === 'critica' ? "bg-red-100 text-red-700" :
                                                req.prioridad === 'alta' ? "bg-amber-100 text-amber-700" :
                                                req.prioridad === 'media' ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-700"
                                            )}>
                                                {req.prioridad === 'critica' ? '🔴 Crítica' : req.prioridad === 'alta' ? '🟠 Alta' : req.prioridad === 'media' ? '🟡 Media' : '🟢 Baja'}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-slate-800 mb-1">{req.titulo}</p>
                                        <p className="text-sm text-slate-600 line-clamp-2">{req.descripcion}</p>
                                        {req.costo_estimado && (
                                            <p className="text-xs text-slate-500 mt-2">
                                                Costo estimado: {formatCurrency(req.costo_estimado)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {requirements.length > 5 && (
                            <button
                                onClick={() => navigate('/projects')}
                                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
                            >
                                Ver todos los requisitos ({requirements.length})
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Risk Alerts Section */}
            {currentUser?.rol !== 'cliente' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                Alertas y Riesgos
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Situaciones que requieren atención</p>
                        </div>
                        <div className="space-y-3">
                            {riskAlerts.map((alert) => (
                            <div key={alert.id} className={cn("p-4 rounded-xl border", getRiskColor(alert.type))}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-0.5 rounded uppercase",
                                                alert.type === 'high' ? "bg-red-200 text-red-800" :
                                                alert.type === 'medium' ? "bg-amber-200 text-amber-800" :
                                                "bg-blue-200 text-blue-800"
                                            )}>
                                                {alert.type === 'high' ? 'Alto' : alert.type === 'medium' ? 'Medio' : 'Bajo'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800 mb-1">{alert.title}</p>
                                        <p className="text-xs text-slate-600">{alert.project} • {alert.days} días</p>
                                    </div>
                                    <button className="text-xs font-medium px-3 py-1.5 bg-white rounded-md hover:opacity-80 transition-opacity">
                                        {alert.action}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Recent Activity */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Actividad Reciente
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Últimas actualizaciones del sistema</p>
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Ver todo
                        </button>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {recentActivity.map((activity) => {
                            const Icon = getActivityIcon(activity.type);
                            return (
                                <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-slate-100">
                                    <div className={cn("p-2 rounded-lg flex-shrink-0", getActivityColor(activity.status))}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <p className="text-xs text-slate-500">{activity.user}</p>
                                            <span className="text-xs text-slate-400">•</span>
                                            <p className="text-xs text-slate-500">{activity.project}</p>
                                            <span className="text-xs text-slate-400">•</span>
                                            <p className="text-xs text-slate-400">{activity.time}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            )}

            {/* Modales de Edición */}
            {editingKPI && (
                <EditKPIModal
                    isOpen={true}
                    onClose={() => setEditingKPI(null)}
                    onSave={handleSaveKPI}
                    kpiData={editingKPI.data}
                />
            )}

            {editingMetric && (
                <EditMetricModal
                    isOpen={true}
                    onClose={() => setEditingMetric(null)}
                    onSave={handleSaveMetric}
                    metricData={editingMetric.data}
                />
            )}

            {editingProject && (
                <EditProjectBudgetModal
                    isOpen={true}
                    onClose={() => setEditingProject(null)}
                    onSave={handleSaveProject}
                    projectData={editingProject.data}
                />
            )}

            {/* Modal de Requisitos para Clientes */}
            {currentUser?.rol === 'cliente' && (
                <CreateRequirementModal
                    isOpen={showRequirementModal}
                    onClose={() => setShowRequirementModal(false)}
                    onSave={handleSaveRequirement}
                />
            )}
        </div>
    );
}
