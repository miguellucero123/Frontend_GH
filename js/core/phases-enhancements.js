/**
 * ============================================================================
 * MEJORAS AVANZADAS PARA FASES - SISTEMA COMPLETO
 * ============================================================================
 * Funcionalidades avanzadas para todas las fases del proyecto
 * Versión: 2.0.0
 * ============================================================================
 */

class PhasesEnhancements {
    constructor() {
        this.enhancements = new Map();
        this.analytics = {
            phaseUsage: {},
            featureUsage: {},
            performance: {}
        };
        this.init();
    }

    /**
     * Inicializar mejoras
     */
    init() {
        this.registerEnhancements();
        this.loadAnalytics();
        this.setupEventListeners();
    }

    /**
     * Registrar mejoras por fase
     */
    registerEnhancements() {
        // FASE 1: Mejoras de Dashboard Interactivo
        this.enhancements.set('fase1', {
            id: 'fase1',
            name: 'Datos de Gerencia',
            improvements: {
                dashboardInteractive: {
                    enabled: true,
                    features: [
                        'gráficos-interactivos',
                        'drill-down-kpis',
                        'filtros-avanzados',
                        'exportación-múltiple',
                        'widgets-personalizables',
                        'comparación-temporal'
                    ]
                },
                predictiveAnalysis: {
                    enabled: true,
                    features: [
                        'forecasting-costos',
                        'predicción-fechas',
                        'análisis-escenarios',
                        'alertas-preventivas',
                        'análisis-tendencias'
                    ]
                },
                multiProject: {
                    enabled: true,
                    features: [
                        'vista-consolidada',
                        'comparación-proyectos',
                        'dashboard-ejecutivo',
                        'filtros-múltiples',
                        'asignación-recursos'
                    ]
                },
                advancedReports: {
                    enabled: true,
                    features: [
                        'plantillas-reportes',
                        'programación-automática',
                        'envío-email',
                        'reportes-comparativos',
                        'exportación-múltiple'
                    ]
                }
            }
        });

        // FASE 2: Mejoras de Gestor Documental
        this.enhancements.set('fase2', {
            id: 'fase2',
            name: 'Gestor Documental',
            improvements: {
                versioning: {
                    enabled: true,
                    features: [
                        'control-versiones',
                        'historial-cambios',
                        'comparación-versiones',
                        'restauración-versiones'
                    ]
                },
                advancedSearch: {
                    enabled: true,
                    features: [
                        'búsqueda-full-text',
                        'filtros-múltiples',
                        'búsqueda-semántica',
                        'búsqueda-por-metadatos'
                    ]
                },
                collaboration: {
                    enabled: true,
                    features: [
                        'comentarios-documentos',
                        'revisión-colaborativa',
                        'notificaciones-cambios',
                        'workflow-aprobación'
                    ]
                }
            }
        });

        // FASE 3: Mejoras de Comunicación
        this.enhancements.set('fase3', {
            id: 'fase3',
            name: 'Canales de Comunicación',
            improvements: {
                realTime: {
                    enabled: true,
                    features: [
                        'websockets-tiempo-real',
                        'notificaciones-push',
                        'indicadores-escritura',
                        'mensajes-editados',
                        'reacciones-mensajes'
                    ]
                },
                videoCalls: {
                    enabled: false,
                    features: [
                        'videollamadas-integradas',
                        'grabación-llamadas',
                        'pantalla-compartida',
                        'transcripción-automática'
                    ]
                },
                advancedFeatures: {
                    enabled: true,
                    features: [
                        'búsqueda-mensajes',
                        'filtros-avanzados',
                        'etiquetas-mensajes',
                        'mensajes-programados',
                        'recordatorios'
                    ]
                }
            }
        });

        // FASE 4: Mejoras de UX Cliente
        this.enhancements.set('fase4', {
            id: 'fase4',
            name: 'UX Cliente Gamificada',
            improvements: {
                gamification: {
                    enabled: true,
                    features: [
                        'sistema-logros',
                        'badges-recompensas',
                        'puntos-participación',
                        'niveles-progreso',
                        'ranking-cliente'
                    ]
                },
                visualization: {
                    enabled: true,
                    features: [
                        'progreso-visual',
                        'galería-fotos',
                        'timeline-interactivo',
                        'métricas-simplificadas',
                        'animaciones-avance'
                    ]
                },
                engagement: {
                    enabled: true,
                    features: [
                        'notificaciones-avances',
                        'recordatorios-pagos',
                        'encuestas-satisfacción',
                        'feedback-continuo'
                    ]
                }
            }
        });

        // FASE 5: Mejoras de UX Trabajador
        this.enhancements.set('fase5', {
            id: 'fase5',
            name: 'UX Trabajador Operativa',
            improvements: {
                taskManagement: {
                    enabled: true,
                    features: [
                        'gestión-tareas',
                        'estados-tareas',
                        'actualización-avance',
                        'reportes-trabajo',
                        'asignación-tareas'
                    ]
                },
                resources: {
                    enabled: true,
                    features: [
                        'acceso-planos',
                        'especificaciones-técnicas',
                        'manuales-guías',
                        'recursos-capacitación'
                    ]
                },
                mobile: {
                    enabled: false,
                    features: [
                        'app-móvil-nativa',
                        'funciona-offline',
                        'gps-integrado',
                        'cámara-integrada',
                        'firma-digital'
                    ]
                }
            }
        });

        // FASE 6: Mejoras de Automatización Excel
        this.enhancements.set('fase6', {
            id: 'fase6',
            name: 'Automatización Excel',
            improvements: {
                processing: {
                    enabled: true,
                    features: [
                        'carga-archivos',
                        'procesamiento-automático',
                        'importación-datos',
                        'validación-datos',
                        'logs-errores'
                    ]
                },
                advanced: {
                    enabled: false,
                    features: [
                        'exportación-automática',
                        'programación-importación',
                        'plantillas-personalizadas',
                        'transformación-datos',
                        'integración-apis'
                    ]
                }
            }
        });
    }

    /**
     * Obtener mejoras de una fase
     */
    getPhaseEnhancements(phaseId) {
        return this.enhancements.get(phaseId);
    }

    /**
     * Verificar si una mejora está habilitada
     */
    isEnhancementEnabled(phaseId, improvementCategory, feature = null) {
        const phase = this.enhancements.get(phaseId);
        if (!phase) return false;

        const improvement = phase.improvements[improvementCategory];
        if (!improvement) return false;

        if (feature) {
            return improvement.enabled && improvement.features.includes(feature);
        }

        return improvement.enabled;
    }

    /**
     * Habilitar/deshabilitar mejora
     */
    toggleEnhancement(phaseId, improvementCategory, enabled = true) {
        const phase = this.enhancements.get(phaseId);
        if (!phase) return false;

        const improvement = phase.improvements[improvementCategory];
        if (!improvement) return false;

        improvement.enabled = enabled;
        this.saveEnhancements();
        return true;
    }

    /**
     * Guardar mejoras
     */
    saveEnhancements() {
        const data = {};
        this.enhancements.forEach((phase, id) => {
            data[id] = {
                improvements: {}
            };
            Object.keys(phase.improvements).forEach(category => {
                data[id].improvements[category] = {
                    enabled: phase.improvements[category].enabled
                };
            });
        });
        localStorage.setItem('phasesEnhancements', JSON.stringify(data));
    }

    /**
     * Cargar mejoras guardadas
     */
    loadEnhancements() {
        const saved = localStorage.getItem('phasesEnhancements');
        if (!saved) return;

        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(phaseId => {
                const phase = this.enhancements.get(phaseId);
                if (phase) {
                    Object.keys(data[phaseId].improvements).forEach(category => {
                        if (phase.improvements[category]) {
                            phase.improvements[category].enabled = 
                                data[phaseId].improvements[category].enabled;
                        }
                    });
                }
            });
        } catch (error) {
            console.warn('Error cargando mejoras:', error);
        }
    }

    /**
     * Registrar uso de fase
     */
    trackPhaseUsage(phaseId, feature = null) {
        if (!this.analytics.phaseUsage[phaseId]) {
            this.analytics.phaseUsage[phaseId] = {
                count: 0,
                lastUsed: null,
                features: {}
            };
        }

        this.analytics.phaseUsage[phaseId].count++;
        this.analytics.phaseUsage[phaseId].lastUsed = new Date().toISOString();

        if (feature) {
            if (!this.analytics.phaseUsage[phaseId].features[feature]) {
                this.analytics.phaseUsage[phaseId].features[feature] = 0;
            }
            this.analytics.phaseUsage[phaseId].features[feature]++;
        }

        this.saveAnalytics();
    }

    /**
     * Obtener estadísticas de uso
     */
    getUsageStats(phaseId = null) {
        if (phaseId) {
            return this.analytics.phaseUsage[phaseId] || null;
        }
        return this.analytics.phaseUsage;
    }

    /**
     * Guardar analytics
     */
    saveAnalytics() {
        localStorage.setItem('phasesAnalytics', JSON.stringify(this.analytics));
    }

    /**
     * Cargar analytics
     */
    loadAnalytics() {
        const saved = localStorage.getItem('phasesAnalytics');
        if (saved) {
            try {
                this.analytics = { ...this.analytics, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Error cargando analytics:', error);
            }
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Escuchar cambios en el gestor de fases
        if (typeof window.phaseManager !== 'undefined') {
            // Interceptar navegación a fases
            const originalNavigate = window.phaseManager.navigateToPhase.bind(window.phaseManager);
            window.phaseManager.navigateToPhase = (phaseId) => {
                this.trackPhaseUsage(phaseId);
                return originalNavigate(phaseId);
            };
        }
    }

    /**
     * Obtener resumen de mejoras
     */
    getEnhancementsSummary() {
        const summary = {
            totalPhases: this.enhancements.size,
            enabledImprovements: 0,
            totalFeatures: 0,
            enabledFeatures: 0
        };

        this.enhancements.forEach(phase => {
            Object.values(phase.improvements).forEach(improvement => {
                if (improvement.enabled) {
                    summary.enabledImprovements++;
                }
                summary.totalFeatures += improvement.features.length;
                if (improvement.enabled) {
                    summary.enabledFeatures += improvement.features.length;
                }
            });
        });

        return summary;
    }

    /**
     * Generar reporte de mejoras
     */
    generateEnhancementsReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.getEnhancementsSummary(),
            phases: [],
            analytics: this.analytics
        };

        this.enhancements.forEach(phase => {
            const phaseReport = {
                id: phase.id,
                name: phase.name,
                improvements: []
            };

            Object.keys(phase.improvements).forEach(category => {
                const improvement = phase.improvements[category];
                phaseReport.improvements.push({
                    category,
                    enabled: improvement.enabled,
                    featuresCount: improvement.features.length,
                    features: improvement.features
                });
            });

            report.phases.push(phaseReport);
        });

        return report;
    }
}

// Inicializar mejoras de fases
if (typeof window !== 'undefined') {
    window.phasesEnhancements = new PhasesEnhancements();
}

