/**
 * ============================================================================
 * GESTOR DE FASES - SISTEMA MODULAR
 * ============================================================================
 * Gestión centralizada de todas las fases del proyecto
 * Versión: 1.0.0
 * ============================================================================
 */

class PhaseManager {
    constructor() {
        this.phases = new Map();
        this.currentPhase = null;
        this.init();
    }

    /**
     * Inicializar gestor de fases
     */
    init() {
        this.registerPhases();
        this.loadPhaseStatus();
    }

    /**
     * Registrar todas las fases
     */
    registerPhases() {
        // FASE 1: Datos de Gerencia
        this.phases.set('fase1', {
            id: 'fase1',
            name: 'Datos de Gerencia',
            status: 'completed',
            description: 'Gestión integral de métricas financieras, cronograma y KPIs',
            modules: ['GestorGerencia', 'DashboardInteractive', 'PredictiveAnalysis'],
            html: 'panel-jefe.html',
            sections: ['dashboard', 'proyectos', 'usuarios', 'mensajeria'],
            dependencies: []
        });

        // FASE 2: Gestor Documental
        this.phases.set('fase2', {
            id: 'fase2',
            name: 'Gestor Documental',
            status: 'implemented',
            description: 'Sistema de gestión de documentos con permisos y versionado',
            modules: ['FileSystemManager', 'DocumentService'],
            html: 'panel-jefe.html#documentos',
            sections: ['documentos', 'archivos'],
            dependencies: ['fase1']
        });

        // FASE 3: Canales de Comunicación
        this.phases.set('fase3', {
            id: 'fase3',
            name: 'Canales de Comunicación',
            status: 'implemented',
            description: 'Sistema de chat separado por canales (Gerencia-Trabajadores, Cliente-Gerencia)',
            modules: ['ChatChannelsManager', 'ChatManager'],
            html: 'mensajeria.html',
            sections: ['chat'],
            dependencies: ['fase1']
        });

        // FASE 4: UX Cliente Gamificada
        this.phases.set('fase4', {
            id: 'fase4',
            name: 'UX Cliente Gamificada',
            status: 'implemented',
            description: 'Dashboard del cliente con gamificación, progreso visual y satisfacción',
            modules: ['ClientDashboard', 'GamificationSystem'],
            html: 'dashboard-cliente.html',
            sections: ['dashboard', 'proyecto', 'galeria'],
            dependencies: ['fase1', 'fase2']
        });

        // FASE 5: UX Trabajador Operativa
        this.phases.set('fase5', {
            id: 'fase5',
            name: 'UX Trabajador Operativa',
            status: 'implemented',
            description: 'Panel operativo para trabajadores con tareas, recursos y comunicación',
            modules: ['WorkerDashboard', 'TaskManager'],
            html: 'dashboard-trabajador.html',
            sections: ['dashboard', 'tareas', 'recursos'],
            dependencies: ['fase1', 'fase3']
        });

        // FASE 6: Automatización Excel
        this.phases.set('fase6', {
            id: 'fase6',
            name: 'Automatización Excel',
            status: 'implemented',
            description: 'Carga y procesamiento automático de archivos Excel/Word',
            modules: ['ExcelProcessor', 'DocumentUpload'],
            html: 'panel-jefe.html#excel-upload',
            sections: ['excel-upload'],
            dependencies: ['fase1', 'fase2']
        });
    }

    /**
     * Cargar estado de fases
     */
    loadPhaseStatus() {
        const saved = localStorage.getItem('phaseStatus');
        if (saved) {
            try {
                const status = JSON.parse(saved);
                status.forEach(phaseStatus => {
                    const phase = this.phases.get(phaseStatus.id);
                    if (phase) {
                        phase.status = phaseStatus.status;
                    }
                });
            } catch (error) {
                console.warn('Error cargando estado de fases:', error);
            }
        }
    }

    /**
     * Guardar estado de fases
     */
    savePhaseStatus() {
        const status = Array.from(this.phases.values()).map(phase => ({
            id: phase.id,
            status: phase.status
        }));
        localStorage.setItem('phaseStatus', JSON.stringify(status));
    }

    /**
     * Obtener fase
     */
    getPhase(phaseId) {
        return this.phases.get(phaseId);
    }

    /**
     * Obtener todas las fases
     */
    getAllPhases() {
        return Array.from(this.phases.values());
    }

    /**
     * Verificar si fase está disponible
     */
    isPhaseAvailable(phaseId) {
        const phase = this.phases.get(phaseId);
        if (!phase) return false;

        // Verificar dependencias
        for (const depId of phase.dependencies) {
            const dep = this.phases.get(depId);
            if (!dep || dep.status !== 'completed') {
                return false;
            }
        }

        return phase.status === 'completed' || phase.status === 'implemented';
    }

    /**
     * Navegar a fase
     */
    navigateToPhase(phaseId) {
        const phase = this.phases.get(phaseId);
        if (!phase) {
            console.error(`Fase no encontrada: ${phaseId}`);
            return;
        }

        if (!this.isPhaseAvailable(phaseId)) {
            console.warn(`Fase no disponible: ${phaseId}`);
            return;
        }

        // Manejo especial para fase 1 (Datos de Gerencia)
        if (phaseId === 'fase1') {
            // Si estamos en panel-jefe.html, cambiar a la sección de dashboard
            if (window.location.pathname.includes('panel-jefe.html')) {
                // Cambiar a la sección de dashboard
                const dashboardSection = document.getElementById('sectionDashboard');
                if (dashboardSection) {
                    // Ocultar todas las secciones
                    document.querySelectorAll('.content-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    // Mostrar dashboard
                    dashboardSection.classList.add('active');
                    // Actualizar hash sin recargar
                    window.history.pushState(null, '', 'panel-jefe.html#dashboard');
                    // Activar botón de navegación correspondiente
                    document.querySelectorAll('.nav-item').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    const dashboardBtn = document.querySelector('[data-section="dashboard"]');
                    if (dashboardBtn) {
                        dashboardBtn.classList.add('active');
                    }
                    // Scroll al inicio del dashboard
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // Si no existe la sección, usar hash para que el sistema de navegación la active
                    window.location.hash = 'dashboard';
                }
                // Log
                if (typeof window.auditLogger !== 'undefined') {
                    window.auditLogger.logAccess(`phase-${phaseId}`, 'NAVIGATE');
                }
                return;
            } else {
                // Si no estamos en panel-jefe.html, navegar allí con hash de dashboard
                window.location.href = 'panel-jefe.html#dashboard';
                // Log
                if (typeof window.auditLogger !== 'undefined') {
                    window.auditLogger.logAccess(`phase-${phaseId}`, 'NAVIGATE');
                }
                return;
            }
        }

        // Manejo especial para fase 2 (Gestor Documental)
        if (phaseId === 'fase2') {
            // Si estamos en panel-jefe.html, abrir el panel de archivos directamente
            if (window.location.pathname.includes('panel-jefe.html')) {
                // Buscar un proyecto para abrir el panel (usar el primero disponible o un ID por defecto)
                if (typeof window.projectService !== 'undefined' && typeof window.coreState !== 'undefined') {
                    const projects = window.coreState.getState('projects') || [];
                    const firstProjectId = projects.length > 0 ? projects[0].project_id : null;
                    if (firstProjectId && typeof window.viewProjectFiles === 'function') {
                        window.viewProjectFiles(firstProjectId);
                    } else if (typeof window.viewProjectFiles === 'function') {
                        // Si no hay proyectos, intentar abrir con un ID por defecto o mostrar mensaje
                        const filesPanel = document.getElementById('filesPanel');
                        if (filesPanel) {
                            filesPanel.style.display = 'flex';
                            const filesPanelContent = document.getElementById('filesPanelContent');
                            if (filesPanelContent) {
                                filesPanelContent.innerHTML = '<p class="text-center text-slate-400 py-8">Selecciona un proyecto para ver sus archivos</p>';
                            }
                        }
                    }
                } else {
                    // Fallback: navegar directamente
                    window.location.href = phase.html;
                }
                // Log
                if (typeof window.auditLogger !== 'undefined') {
                    window.auditLogger.logAccess(`phase-${phaseId}`, 'NAVIGATE');
                }
                return;
            } else {
                // Si no estamos en panel-jefe.html, navegar allí primero
                window.location.href = 'panel-jefe.html';
                // Luego abrir el panel cuando se cargue la página
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        if (typeof window.viewProjectFiles === 'function') {
                            const projects = window.coreState?.getState('projects') || [];
                            const firstProjectId = projects.length > 0 ? projects[0].project_id : null;
                            if (firstProjectId) {
                                window.viewProjectFiles(firstProjectId);
                            }
                        }
                    }, 1000);
                });
                // Log
                if (typeof window.auditLogger !== 'undefined') {
                    window.auditLogger.logAccess(`phase-${phaseId}`, 'NAVIGATE');
                }
                return;
            }
        }

        // Navegar usando router para otras fases
        if (typeof window.router !== 'undefined') {
            const routeName = this.getRouteNameForPhase(phaseId);
            if (routeName) {
                window.router.navigate(routeName, { section: phase.sections[0] });
            } else {
                window.location.href = phase.html;
            }
        } else {
            window.location.href = phase.html;
        }

        // Log
        if (typeof window.auditLogger !== 'undefined') {
            window.auditLogger.logAccess(`phase-${phaseId}`, 'NAVIGATE');
        }
    }

    /**
     * Obtener nombre de ruta para fase
     */
    getRouteNameForPhase(phaseId) {
        const routeMap = {
            'fase1': 'dashboard-jefe',
            'fase2': 'documentos',
            'fase3': 'chat-gerencia-trabajadores',
            'fase4': 'cliente-proyecto',
            'fase5': 'trabajador-panel',
            'fase6': 'excel-upload'
        };
        return routeMap[phaseId];
    }

    /**
     * Obtener fases disponibles para rol
     */
    getAvailablePhasesForRole(role) {
        return Array.from(this.phases.values()).filter(phase => {
            // Verificar disponibilidad
            if (!this.isPhaseAvailable(phase.id)) return false;

            // Verificar permisos por rol
            const rolePermissions = {
                'jefe': ['fase1', 'fase2', 'fase3', 'fase6'],
                'admin': ['fase1', 'fase2', 'fase3', 'fase6'],
                'cliente': ['fase4'],
                'trabajador': ['fase5']
            };

            return rolePermissions[role]?.includes(phase.id) || false;
        });
    }

    /**
     * Obtener resumen de fases
     */
    getPhasesSummary() {
        const phases = Array.from(this.phases.values());
        return {
            total: phases.length,
            completed: phases.filter(p => p.status === 'completed').length,
            implemented: phases.filter(p => p.status === 'implemented').length,
            pending: phases.filter(p => p.status === 'pending').length,
            phases: phases.map(p => ({
                id: p.id,
                name: p.name,
                status: p.status,
                available: this.isPhaseAvailable(p.id)
            }))
        };
    }
}

// Inicializar gestor de fases
if (typeof window !== 'undefined') {
    window.phaseManager = new PhaseManager();
}

