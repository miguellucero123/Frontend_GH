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

        return `
            <div class="glass-effect rounded-xl p-6 border ${statusColor} hover:scale-105 transition-all cursor-pointer"
                 onclick="phasesVisualizer.navigateToPhase('${phase.id}')">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-white mb-2">${phase.name}</h3>
                        <p class="text-sm text-slate-400 mb-4">${phase.description}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColor}">
                        ${phase.status === 'completed' ? 'Completo' : phase.status === 'implemented' ? 'Implementado' : 'Pendiente'}
                    </span>
                </div>

                <div class="space-y-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-400">Módulos:</span>
                        <span class="text-white font-medium">${phase.modules.length}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-400">Usos:</span>
                        <span class="text-white font-medium">${usageCount}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-400">Último uso:</span>
                        <span class="text-white font-medium">${lastUsed}</span>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-slate-700">
                    <button class="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all"
                            onclick="event.stopPropagation(); phasesVisualizer.navigateToPhase('${phase.id}')">
                        <i class="fas fa-arrow-right mr-2"></i>
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

        return `
            <div class="glass-effect rounded-lg p-4 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-between"
                 onclick="phasesVisualizer.navigateToPhase('${phase.id}')">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-3 h-3 rounded-full ${statusColor}"></div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-white">${phase.name}</h3>
                        <p class="text-sm text-slate-400">${phase.description}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-slate-400">Usos: <span class="text-white font-medium">${usageCount}</span></div>
                        <div class="text-xs text-slate-500">${phase.modules.length} módulos</div>
                    </div>
                </div>
                <button class="ml-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-all"
                        onclick="event.stopPropagation(); phasesVisualizer.navigateToPhase('${phase.id}')">
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
                    <button class="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-all"
                            onclick="phasesVisualizer.navigateToPhase('${phase.id}')">
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
    }

    /**
     * Navegar a fase
     */
    navigateToPhase(phaseId) {
        if (typeof window.phaseManager !== 'undefined') {
            window.phaseManager.navigateToPhase(phaseId);
        } else {
            console.warn('PhaseManager no está disponible');
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

