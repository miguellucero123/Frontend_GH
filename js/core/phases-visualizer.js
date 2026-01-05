/**
 * ============================================================================
 * VISUALIZADOR DE FASES - INTERFAZ GRÁFICA
 * ============================================================================
 * Componente visual para mostrar y gestionar las fases del proyecto
 * Versión: 1.0.0
 * ============================================================================
 */

class PhasesVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.currentView = 'grid'; // grid, list, timeline
        this.init();
    }

    /**
     * Inicializar visualizador
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Contenedor no encontrado: ${this.containerId}`);
            return;
        }

        this.render();
        this.setupEventListeners();
    }

    /**
     * Renderizar visualizador
     */
    render() {
        if (!this.container) return;

        const phases = typeof window.phaseManager !== 'undefined' 
            ? window.phaseManager.getAllPhases() 
            : [];

        const enhancements = typeof window.phasesEnhancements !== 'undefined'
            ? window.phasesEnhancements
            : null;

        const usageStats = enhancements ? enhancements.getUsageStats() : {};

        this.container.innerHTML = `
            <div class="phases-visualizer">
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                        <i class="fas fa-project-diagram text-indigo-400"></i>
                        Fases del Proyecto
                    </h2>
                    <div class="flex gap-2">
                        <button id="btnViewGrid" 
                            class="px-3 py-2 rounded-lg ${this.currentView === 'grid' ? 'bg-indigo-600' : 'bg-slate-700'} text-white transition-all">
                            <i class="fas fa-th"></i>
                        </button>
                        <button id="btnViewList" 
                            class="px-3 py-2 rounded-lg ${this.currentView === 'list' ? 'bg-indigo-600' : 'bg-slate-700'} text-white transition-all">
                            <i class="fas fa-list"></i>
                        </button>
                        <button id="btnViewTimeline" 
                            class="px-3 py-2 rounded-lg ${this.currentView === 'timeline' ? 'bg-indigo-600' : 'bg-slate-700'} text-white transition-all">
                            <i class="fas fa-stream"></i>
                        </button>
                    </div>
                </div>

                <!-- Vista según tipo -->
                <div id="phasesContent">
                    ${this.currentView === 'grid' ? this.renderGridView(phases, usageStats) : ''}
                    ${this.currentView === 'list' ? this.renderListView(phases, usageStats) : ''}
                    ${this.currentView === 'timeline' ? this.renderTimelineView(phases, usageStats) : ''}
                </div>

                <!-- Resumen -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    ${this.renderSummary(phases)}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar vista de cuadrícula
     */
    renderGridView(phases, usageStats) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${phases.map(phase => this.renderPhaseCard(phase, usageStats[phase.id])).join('')}
            </div>
        `;
    }

    /**
     * Renderizar vista de lista
     */
    renderListView(phases, usageStats) {
        return `
            <div class="space-y-4">
                ${phases.map(phase => this.renderPhaseListItem(phase, usageStats[phase.id])).join('')}
            </div>
        `;
    }

    /**
     * Renderizar vista de timeline
     */
    renderTimelineView(phases, usageStats) {
        return `
            <div class="relative">
                <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-500/30"></div>
                <div class="space-y-8">
                    ${phases.map((phase, index) => this.renderPhaseTimelineItem(phase, index, usageStats[phase.id])).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar tarjeta de fase
     */
    renderPhaseCard(phase, stats) {
        const statusColors = {
            'completed': 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
            'implemented': 'bg-blue-500/20 border-blue-500/50 text-blue-400',
            'pending': 'bg-amber-500/20 border-amber-500/50 text-amber-400'
        };

        const statusColor = statusColors[phase.status] || statusColors.pending;
        const isAvailable = typeof window.phaseManager !== 'undefined' 
            ? window.phaseManager.isPhaseAvailable(phase.id)
            : false;

        const usageCount = stats?.count || 0;
        const lastUsed = stats?.lastUsed 
            ? new Date(stats.lastUsed).toLocaleDateString('es-CL')
            : 'Nunca';

        // Obtener mejoras disponibles
        const enhancements = typeof window.phasesEnhancements !== 'undefined'
            ? window.phasesEnhancements.getPhaseEnhancements(phase.id)
            : null;
        
        const totalFeatures = enhancements 
            ? Object.values(enhancements.improvements || {}).reduce((sum, imp) => sum + (imp.features?.length || 0), 0)
            : 0;

        // Obtener icono según fase
        const phaseIcons = {
            'fase1': 'fa-chart-line',
            'fase2': 'fa-folder-open',
            'fase3': 'fa-comments',
            'fase4': 'fa-gamepad',
            'fase5': 'fa-hard-hat',
            'fase6': 'fa-file-excel'
        };
        const phaseIcon = phaseIcons[phase.id] || 'fa-cube';

        return `
            <div class="glass-effect rounded-xl p-6 border ${statusColor} hover:scale-105 transition-all cursor-pointer phase-card group" data-phase-id="${phase.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-3 flex-1">
                        <div class="w-12 h-12 rounded-xl ${statusColor.replace('/20', '/30')} flex items-center justify-center flex-shrink-0">
                            <i class="fas ${phaseIcon} text-2xl ${phase.status === 'completed' ? 'text-emerald-400' : phase.status === 'implemented' ? 'text-blue-400' : 'text-amber-400'}"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-white mb-1">${phase.name}</h3>
                            <p class="text-sm text-slate-400 mb-3">${phase.description}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColor} whitespace-nowrap">
                        ${phase.status === 'completed' ? 'Completo' : phase.status === 'implemented' ? 'Implementado' : 'Pendiente'}
                    </span>
                </div>

                <div class="space-y-3 mb-4">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white/5 rounded-lg p-3">
                            <div class="text-xs text-slate-400 mb-1">Módulos</div>
                            <div class="text-lg font-bold text-white">${phase.modules.length}</div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-3">
                            <div class="text-xs text-slate-400 mb-1">Características</div>
                            <div class="text-lg font-bold text-purple-400">${totalFeatures}</div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between text-sm bg-white/5 rounded-lg p-3">
                        <span class="text-slate-400">
                            <i class="fas fa-chart-line mr-1"></i>Usos:
                        </span>
                        <span class="text-white font-medium">${usageCount}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm bg-white/5 rounded-lg p-3">
                        <span class="text-slate-400">
                            <i class="fas fa-clock mr-1"></i>Último uso:
                        </span>
                        <span class="text-white font-medium">${lastUsed}</span>
                    </div>
                </div>

                ${phase.dependencies && phase.dependencies.length > 0 ? `
                    <div class="mb-4 pt-3 border-t border-slate-700">
                        <div class="text-xs text-slate-400 mb-2">Depende de:</div>
                        <div class="flex flex-wrap gap-2">
                            ${phase.dependencies.map(depId => {
                                const depPhase = typeof window.phaseManager !== 'undefined' 
                                    ? window.phaseManager.phases?.get?.(depId)
                                    : null;
                                if (!depPhase) return '';
                                return `<span class="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-300">${depPhase.name}</span>`;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="mt-4 pt-4 border-t border-slate-700">
                    <button class="phase-btn w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                            data-phase-id="${phase.id}">
                        <i class="fas fa-arrow-right"></i>
                        ${isAvailable ? 'Abrir' : 'Ver Detalles'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar item de lista
     */
    renderPhaseListItem(phase, stats) {
        const statusColors = {
            'completed': 'bg-emerald-500',
            'implemented': 'bg-blue-500',
            'pending': 'bg-amber-500'
        };

        const statusColor = statusColors[phase.status] || statusColors.pending;
        const usageCount = stats?.count || 0;

        // Obtener mejoras disponibles
        const enhancements = typeof window.phasesEnhancements !== 'undefined'
            ? window.phasesEnhancements.getPhaseEnhancements(phase.id)
            : null;
        
        const totalFeatures = enhancements 
            ? Object.values(enhancements.improvements || {}).reduce((sum, imp) => sum + (imp.features?.length || 0), 0)
            : 0;

        // Obtener icono según fase
        const phaseIcons = {
            'fase1': 'fa-chart-line',
            'fase2': 'fa-folder-open',
            'fase3': 'fa-comments',
            'fase4': 'fa-gamepad',
            'fase5': 'fa-hard-hat',
            'fase6': 'fa-file-excel'
        };
        const phaseIcon = phaseIcons[phase.id] || 'fa-cube';

        return `
            <div class="glass-effect rounded-lg p-4 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-between phase-card-list" data-phase-id="${phase.id}">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-10 h-10 rounded-lg ${statusColor.replace('bg-', 'bg-').replace('-500', '-500/20')} flex items-center justify-center flex-shrink-0">
                        <i class="fas ${phaseIcon} ${statusColor === 'bg-emerald-500' ? 'text-emerald-400' : statusColor === 'bg-blue-500' ? 'text-blue-400' : 'text-amber-400'}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-1">
                            <h3 class="text-lg font-bold text-white">${phase.name}</h3>
                            <span class="px-2 py-0.5 rounded text-xs font-medium ${statusColor.replace('bg-', 'bg-').replace('-500', '-500/30')} ${statusColor === 'bg-emerald-500' ? 'text-emerald-300' : statusColor === 'bg-blue-500' ? 'text-blue-300' : 'text-amber-300'}">
                                ${phase.status === 'completed' ? 'Completo' : phase.status === 'implemented' ? 'Implementado' : 'Pendiente'}
                            </span>
                        </div>
                        <p class="text-sm text-slate-400 mb-2">${phase.description}</p>
                        <div class="flex items-center gap-4 text-xs text-slate-500">
                            <span><i class="fas fa-cube mr-1"></i>${phase.modules.length} módulos</span>
                            <span><i class="fas fa-star mr-1"></i>${totalFeatures} características</span>
                            <span><i class="fas fa-chart-line mr-1"></i>${usageCount} usos</span>
                        </div>
                    </div>
                </div>
                <button class="phase-btn ml-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-all flex-shrink-0"
                        data-phase-id="${phase.id}">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    }

    /**
     * Renderizar item de timeline
     */
    renderPhaseTimelineItem(phase, index, stats) {
        const statusColors = {
            'completed': 'bg-emerald-500',
            'implemented': 'bg-blue-500',
            'pending': 'bg-amber-500'
        };

        const statusColor = statusColors[phase.status] || statusColors.pending;
        const usageCount = stats?.count || 0;

        return `
            <div class="relative flex items-start gap-6">
                <div class="relative z-10 flex-shrink-0">
                    <div class="w-16 h-16 rounded-full ${statusColor} flex items-center justify-center text-white font-bold text-lg">
                        ${index + 1}
                    </div>
                </div>
                <div class="flex-1 glass-effect rounded-lg p-4 border border-slate-700">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <h3 class="text-lg font-bold text-white">${phase.name}</h3>
                            <p class="text-sm text-slate-400 mt-1">${phase.description}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                            ${phase.status === 'completed' ? 'Completo' : phase.status === 'implemented' ? 'Implementado' : 'Pendiente'}
                        </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-slate-400">
                        <span><i class="fas fa-cube mr-1"></i>${phase.modules.length} módulos</span>
                        <span><i class="fas fa-chart-line mr-1"></i>${usageCount} usos</span>
                    </div>
                    <button class="phase-btn mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-all"
                            data-phase-id="${phase.id}">
                        Ver Detalles
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar resumen
     */
    renderSummary(phases) {
        const completed = phases.filter(p => p.status === 'completed').length;
        const implemented = phases.filter(p => p.status === 'implemented').length;
        const totalModules = phases.reduce((sum, p) => sum + p.modules.length, 0);

        return `
            <div class="glass-effect rounded-lg p-4 border border-blue-500/20">
                <p class="text-sm text-slate-400 mb-1">Total Fases</p>
                <p class="text-2xl font-bold text-blue-400">${phases.length}</p>
            </div>
            <div class="glass-effect rounded-lg p-4 border border-emerald-500/20">
                <p class="text-sm text-slate-400 mb-1">Completadas</p>
                <p class="text-2xl font-bold text-emerald-400">${completed}</p>
            </div>
            <div class="glass-effect rounded-lg p-4 border border-indigo-500/20">
                <p class="text-sm text-slate-400 mb-1">Implementadas</p>
                <p class="text-2xl font-bold text-indigo-400">${implemented}</p>
            </div>
            <div class="glass-effect rounded-lg p-4 border border-purple-500/20">
                <p class="text-sm text-slate-400 mb-1">Módulos Totales</p>
                <p class="text-2xl font-bold text-purple-400">${totalModules}</p>
            </div>
        `;
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Cambiar vista
        const btnViewGrid = document.getElementById('btnViewGrid');
        const btnViewList = document.getElementById('btnViewList');
        const btnViewTimeline = document.getElementById('btnViewTimeline');

        if (btnViewGrid) {
            btnViewGrid.addEventListener('click', () => {
                this.currentView = 'grid';
                this.render();
            });
        }

        if (btnViewList) {
            btnViewList.addEventListener('click', () => {
                this.currentView = 'list';
                this.render();
            });
        }

        if (btnViewTimeline) {
            btnViewTimeline.addEventListener('click', () => {
                this.currentView = 'timeline';
                this.render();
            });
        }
        
        // Event delegation para botones de fases (se ejecuta después de render)
        setTimeout(() => {
            if (this.container) {
                // Botones de fase
                this.container.addEventListener('click', (e) => {
                    const phaseBtn = e.target.closest('.phase-btn');
                    if (phaseBtn) {
                        e.stopPropagation();
                        const phaseId = phaseBtn.dataset.phaseId;
                        if (phaseId) {
                            this.navigateToPhase(phaseId);
                        }
                    }
                    
                    // Click en la tarjeta completa (grid y list)
                    const phaseCard = e.target.closest('.phase-card, .phase-card-list');
                    if (phaseCard && !e.target.closest('.phase-btn')) {
                        const phaseId = phaseCard.dataset.phaseId;
                        if (phaseId) {
                            this.navigateToPhase(phaseId);
                        }
                    }
                });
            }
        }, 100);
    }

    /**
     * Navegar a fase
     */
    navigateToPhase(phaseId) {
        console.log('navigateToPhase llamado con:', phaseId);
        if (typeof window.phaseManager !== 'undefined') {
            window.phaseManager.navigateToPhase(phaseId);
        } else {
            console.warn('PhaseManager no está disponible');
            // Fallback: intentar navegar directamente
            const phase = window.phaseManager?.phases?.get?.(phaseId);
            if (phase && phase.html) {
                window.location.href = phase.html;
            }
        }
    }

    /**
     * Actualizar visualización
     */
    refresh() {
        this.render();
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PhasesVisualizer = PhasesVisualizer;
}

