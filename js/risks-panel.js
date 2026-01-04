/**
 * ============================================================================
 * PANEL DE RIESGOS Y ALERTAS - MEJORA FASE 1
 * ============================================================================
 * Visualización centralizada de riesgos y alertas
 * Versión: 1.0.0
 * ============================================================================
 */

class RisksPanel {
    constructor(gestorGerencia, predictiveAnalysis) {
        this.gestorGerencia = gestorGerencia;
        this.predictiveAnalysis = predictiveAnalysis;
        this.risks = [];
        this.init();
    }

    /**
     * Inicializar panel
     */
    init() {
        this.identifyRisks();
        this.createPanel();
    }

    /**
     * Identificar riesgos
     */
    identifyRisks() {
        this.risks = [];

        // Riesgos financieros
        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        if (resumen.variacionPorcentaje > 15) {
            this.risks.push({
                id: 'risk_fin_001',
                tipo: 'financiero',
                nivel: 'critico',
                titulo: 'Variación de Costos Crítica',
                descripcion: `La variación de costos es del ${resumen.variacionPorcentaje.toFixed(2)}%, supera el umbral crítico del 15%`,
                impacto: 'alto',
                probabilidad: 'alta',
                acciones: [
                    'Revisar todos los gastos extras pendientes',
                    'Optimizar costos en categorías no críticas',
                    'Considerar ajustes en el alcance del proyecto'
                ]
            });
        } else if (resumen.variacionPorcentaje > 10) {
            this.risks.push({
                id: 'risk_fin_002',
                tipo: 'financiero',
                nivel: 'alto',
                titulo: 'Variación de Costos Elevada',
                descripcion: `La variación de costos es del ${resumen.variacionPorcentaje.toFixed(2)}%`,
                impacto: 'medio',
                probabilidad: 'media',
                acciones: [
                    'Monitorear de cerca los gastos',
                    'Buscar oportunidades de ahorro'
                ]
            });
        }

        // Riesgos de cronograma
        const hitos = this.gestorGerencia.obtenerHitos();
        const hitosRetrasados = hitos.filter(h => {
            if (h.estado === 'completado') return false;
            const retraso = this.gestorGerencia.calcularRetrasoHito(h.id);
            return retraso > 14;
        });

        if (hitosRetrasados.length > 0) {
            this.risks.push({
                id: 'risk_cron_001',
                tipo: 'cronograma',
                nivel: 'critico',
                titulo: 'Hitos con Retraso Crítico',
                descripcion: `${hitosRetrasados.length} hito(s) con más de 14 días de retraso`,
                impacto: 'alto',
                probabilidad: 'alta',
                acciones: [
                    'Revisar recursos asignados',
                    'Acelerar actividades críticas',
                    'Considerar ajustes en el cronograma'
                ],
                detalles: hitosRetrasados.map(h => h.nombre)
            });
        }

        const hitosRetrasadosMedio = hitos.filter(h => {
            if (h.estado === 'completado') return false;
            const retraso = this.gestorGerencia.calcularRetrasoHito(h.id);
            return retraso > 7 && retraso <= 14;
        });

        if (hitosRetrasadosMedio.length > 0) {
            this.risks.push({
                id: 'risk_cron_002',
                tipo: 'cronograma',
                nivel: 'alto',
                titulo: 'Hitos con Retraso',
                descripcion: `${hitosRetrasadosMedio.length} hito(s) con retraso entre 7 y 14 días`,
                impacto: 'medio',
                probabilidad: 'media',
                acciones: [
                    'Monitorear de cerca',
                    'Asignar recursos adicionales si es necesario'
                ]
            });
        }

        // Riesgos predictivos
        if (this.predictiveAnalysis) {
            const prediccion = this.predictiveAnalysis.predecirCostoFinal();
            if (prediccion.probabilidadExceder > 50) {
                this.risks.push({
                    id: 'risk_pred_001',
                    tipo: 'predictivo',
                    nivel: 'critico',
                    titulo: 'Alta Probabilidad de Exceder Presupuesto',
                    descripcion: `El análisis predictivo indica un ${prediccion.probabilidadExceder}% de probabilidad de exceder el presupuesto`,
                    impacto: 'alto',
                    probabilidad: 'alta',
                    acciones: prediccion.recomendaciones.map(r => r.mensaje)
                });
            }

            const fechaPred = this.predictiveAnalysis.predecirFechaTermino();
            if (fechaPred.estado === 'retraso' && fechaPred.diferenciaDias > 14) {
                this.risks.push({
                    id: 'risk_pred_002',
                    tipo: 'predictivo',
                    nivel: 'alto',
                    titulo: 'Retraso Significativo Proyectado',
                    descripcion: `El proyecto podría terminar con ${fechaPred.diferenciaDias} días de retraso`,
                    impacto: 'medio',
                    probabilidad: 'media',
                    acciones: [
                        'Revisar velocidad de avance',
                        'Optimizar procesos',
                        'Considerar ajustes en el cronograma'
                    ]
                });
            }
        }

        // Ordenar por nivel (crítico primero)
        this.risks.sort((a, b) => {
            const order = { critico: 0, alto: 1, medio: 2, bajo: 3 };
            return order[a.nivel] - order[b.nivel];
        });
    }

    /**
     * Crear panel
     */
    createPanel() {
        const dashboard = document.getElementById('sectionDashboard');
        if (!dashboard) return;

        const panelHTML = `
            <div id="risksPanel" class="glass-effect rounded-2xl p-6 mb-8 border border-red-500/20">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white flex items-center gap-3">
                        <i class="fas fa-exclamation-triangle text-red-400"></i>
                        Riesgos y Alertas
                        ${this.risks.length > 0 ? `
                            <span class="px-3 py-1 rounded-full text-sm font-bold ${
                                this.risks.filter(r => r.nivel === 'critico').length > 0 
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            }">
                                ${this.risks.length} ${this.risks.length === 1 ? 'riesgo' : 'riesgos'}
                            </span>
                        ` : ''}
                    </h3>
                    <button id="btnRefreshRisks" 
                        class="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium transition-all">
                        <i class="fas fa-sync-alt mr-2"></i>Actualizar
                    </button>
                </div>

                <div id="risksContent">
                    ${this.renderRisks()}
                </div>
            </div>
        `;

        // Insertar después de múltiples proyectos o análisis predictivo
        const multiProjectsSection = document.getElementById('multiProjectsSection');
        const predictiveSection = document.getElementById('predictiveAnalysisSection');
        
        if (multiProjectsSection) {
            multiProjectsSection.insertAdjacentHTML('afterend', panelHTML);
        } else if (predictiveSection) {
            predictiveSection.insertAdjacentHTML('afterend', panelHTML);
        } else {
            const chartsSection = dashboard.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
            if (chartsSection) {
                chartsSection.insertAdjacentHTML('afterend', panelHTML);
            }
        }

        this.setupEventListeners();
    }

    /**
     * Renderizar riesgos
     */
    renderRisks() {
        if (this.risks.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="fas fa-check-circle text-4xl text-emerald-400 mb-4"></i>
                    <p class="text-slate-400">No hay riesgos identificados en este momento</p>
                    <p class="text-sm text-slate-500 mt-2">El proyecto está en buen estado</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${this.risks.map(risk => `
                    <div class="risk-item glass-effect rounded-lg p-5 border-l-4 ${
                        risk.nivel === 'critico' ? 'border-red-500 bg-red-500/10' :
                        risk.nivel === 'alto' ? 'border-orange-500 bg-orange-500/10' :
                        risk.nivel === 'medio' ? 'border-amber-500 bg-amber-500/10' :
                        'border-blue-500 bg-blue-500/10'
                    }">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-start gap-3 flex-grow">
                                <div class="flex-shrink-0 text-2xl ${
                                    risk.nivel === 'critico' ? 'text-red-400' :
                                    risk.nivel === 'alto' ? 'text-orange-400' :
                                    'text-amber-400'
                                }">
                                    <i class="fas ${
                                        risk.tipo === 'financiero' ? 'fa-dollar-sign' :
                                        risk.tipo === 'cronograma' ? 'fa-calendar-times' :
                                        'fa-crystal-ball'
                                    }"></i>
                                </div>
                                <div class="flex-grow">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h4 class="text-lg font-bold text-white">${this.escapeHtml(risk.titulo)}</h4>
                                        <span class="px-2 py-1 rounded text-xs font-medium ${
                                            risk.nivel === 'critico' ? 'bg-red-500/20 text-red-400' :
                                            risk.nivel === 'alto' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-amber-500/20 text-amber-400'
                                        }">
                                            ${risk.nivel.toUpperCase()}
                                        </span>
                                    </div>
                                    <p class="text-slate-300 text-sm">${this.escapeHtml(risk.descripcion)}</p>
                                </div>
                            </div>
                            <button onclick="risksPanel.toggleRiskDetails('${risk.id}')" 
                                class="text-slate-400 hover:text-white transition-colors">
                                <i class="fas fa-chevron-down" id="riskIcon_${risk.id}"></i>
                            </button>
                        </div>

                        <div id="riskDetails_${risk.id}" class="hidden mt-4 pt-4 border-t border-slate-700">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p class="text-xs text-slate-400 mb-1">Impacto</p>
                                    <p class="text-sm font-medium text-white capitalize">${risk.impacto}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-400 mb-1">Probabilidad</p>
                                    <p class="text-sm font-medium text-white capitalize">${risk.probabilidad}</p>
                                </div>
                            </div>

                            ${risk.detalles ? `
                                <div class="mb-4">
                                    <p class="text-xs text-slate-400 mb-2">Detalles:</p>
                                    <ul class="space-y-1">
                                        ${risk.detalles.map(d => `
                                            <li class="text-sm text-slate-300 flex items-start gap-2">
                                                <i class="fas fa-circle text-amber-400 mt-1" style="font-size: 4px;"></i>
                                                <span>${this.escapeHtml(d)}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}

                            <div>
                                <p class="text-xs font-medium text-amber-400 mb-2">Acciones Recomendadas:</p>
                                <ul class="space-y-2">
                                    ${risk.acciones.map((accion, index) => `
                                        <li class="text-sm text-slate-300 flex items-start gap-2">
                                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                                                ${index + 1}
                                            </span>
                                            <span>${this.escapeHtml(accion)}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Toggle detalles de riesgo
     */
    toggleRiskDetails(id) {
        const details = document.getElementById(`riskDetails_${id}`);
        const icon = document.getElementById(`riskIcon_${id}`);
        
        if (details) {
            details.classList.toggle('hidden');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        document.getElementById('btnRefreshRisks')?.addEventListener('click', () => {
            this.identifyRisks();
            const content = document.getElementById('risksContent');
            if (content) {
                content.innerHTML = this.renderRisks();
            }
        });
    }

    /**
     * Escapar HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.RisksPanel = RisksPanel;
}

