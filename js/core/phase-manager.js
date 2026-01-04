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

        // Navegar usando router
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

