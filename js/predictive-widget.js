/**
 * ============================================================================
 * WIDGET DE ANÁLISIS PREDICTIVO - MEJORA FASE 1
 * ============================================================================
 * Visualización de predicciones en el dashboard
 * Versión: 1.0.0
 * ============================================================================
 */

class PredictiveWidget {
    constructor(predictiveAnalysis) {
        this.predictiveAnalysis = predictiveAnalysis;
        this.init();
    }

    /**
     * Inicializar widget
     */
    init() {
        this.render();
        this.setupEventListeners();
    }

    /**
     * Renderizar contenido
     */
    render() {
        const container = document.getElementById('predictiveContent');
        if (!container) return;

        const resumen = this.predictiveAnalysis.obtenerResumenPredictivo();
        const { costo, fecha } = resumen;

        container.innerHTML = `
            <!-- Predicción de Costo -->
            <div class="glass-effect rounded-xl p-6 border border-blue-500/20">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="fas fa-dollar-sign text-blue-400"></i>
                        Predicción de Costo
                    </h4>
                    <span class="px-2 py-1 rounded text-xs font-medium ${
                        costo.probabilidadExceder > 50 ? 'bg-red-500/20 text-red-400' :
                        costo.probabilidadExceder > 20 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-emerald-500/20 text-emerald-400'
                    }">
                        ${costo.probabilidadExceder}% riesgo
                    </span>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-slate-400">Costo Proyectado</span>
                            <span class="text-xl font-bold text-white">$${this.formatNumber(costo.costoProyectado)}</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(100, (costo.costoProyectado / costo.costoMaximo) * 100)}%"></div>
                        </div>
                        <div class="flex justify-between text-xs text-slate-500 mt-1">
                            <span>$${this.formatNumber(costo.costoMinimo)}</span>
                            <span>$${this.formatNumber(costo.costoMaximo)}</span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-700">
                        <p class="text-sm text-slate-400 mb-2">Tendencia:</p>
                        <div class="flex items-center gap-2">
                            <i class="fas ${
                                costo.tendencia === 'ascendente' ? 'fa-arrow-up text-red-400' :
                                costo.tendencia === 'descendente' ? 'fa-arrow-down text-emerald-400' :
                                'fa-minus text-slate-400'
                            }"></i>
                            <span class="text-white capitalize">${costo.tendencia}</span>
                        </div>
                    </div>

                    ${costo.recomendaciones.length > 0 ? `
                        <div class="pt-4 border-t border-slate-700">
                            <p class="text-sm font-medium text-amber-400 mb-2">Recomendaciones:</p>
                            <ul class="space-y-1">
                                ${costo.recomendaciones.map(rec => `
                                    <li class="text-xs text-slate-300 flex items-start gap-2">
                                        <i class="fas fa-circle text-amber-400 mt-1" style="font-size: 4px;"></i>
                                        <span>${rec.mensaje}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Predicción de Fecha -->
            <div class="glass-effect rounded-xl p-6 border border-purple-500/20">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="fas fa-calendar-alt text-purple-400"></i>
                        Predicción de Fecha
                    </h4>
                    <span class="px-2 py-1 rounded text-xs font-medium ${
                        fecha.estado === 'retraso' ? 'bg-red-500/20 text-red-400' :
                        fecha.estado === 'adelantado' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                    }">
                        ${fecha.estado === 'retraso' ? '⚠️ Retraso' : fecha.estado === 'adelantado' ? '✅ Adelantado' : '✓ Normal'}
                    </span>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-slate-400">Fecha Estimada</span>
                            <span class="text-lg font-bold text-white">${this.formatDate(fecha.fechaEstimada)}</span>
                        </div>
                        <div class="flex justify-between text-xs text-slate-500">
                            <span>Programada: ${this.formatDate(fecha.fechaProgramada)}</span>
                            <span class="${
                                fecha.diferenciaDias > 0 ? 'text-red-400' :
                                fecha.diferenciaDias < 0 ? 'text-emerald-400' :
                                'text-slate-400'
                            }">
                                ${fecha.diferenciaDias > 0 ? `+${fecha.diferenciaDias} días` :
                                  fecha.diferenciaDias < 0 ? `${fecha.diferenciaDias} días` :
                                  'En tiempo'}
                            </span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-700">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-slate-400">Días Restantes</span>
                            <span class="text-xl font-bold text-white">${fecha.diasRestantes}</span>
                        </div>
                        <span class="text-xs text-slate-500">Velocidad: ${fecha.velocidadActual.toFixed(2)} hitos/día</span>
                    </div>

                    <div class="pt-4 border-t border-slate-700">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-slate-400">Confianza de Predicción</span>
                            <span class="text-sm font-bold text-white">${fecha.confianza}%</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2 mt-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${fecha.confianza}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Renderizar escenarios si hay
        this.renderScenarios(container);
    }

    /**
     * Renderizar escenarios
     */
    renderScenarios(container) {
        const escenarios = this.predictiveAnalysis.generarEscenarios([
            {
                nombre: 'Escenario Optimista',
                descripcion: 'Reducción del 5% en costos',
                porcentaje: -5
            },
            {
                nombre: 'Escenario Pesimista',
                descripcion: 'Aumento del 10% en costos',
                porcentaje: 10
            },
            {
                nombre: 'Escenario Crítico',
                descripcion: 'Aumento del 20% en costos',
                porcentaje: 20
            }
        ]);

        const escenariosHTML = `
            <div class="col-span-full glass-effect rounded-xl p-6 border border-amber-500/20">
                <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-project-diagram text-amber-400"></i>
                    Escenarios "Qué Pasaría Si"
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${escenarios.map(esc => `
                        <div class="bg-slate-800/50 rounded-lg p-4 border ${
                            esc.factibilidad === 'alta' ? 'border-emerald-500/30' :
                            esc.factibilidad === 'media' ? 'border-orange-500/30' :
                            'border-red-500/30'
                        }">
                            <h5 class="font-bold text-white mb-2">${esc.nombre}</h5>
                            <p class="text-xs text-slate-400 mb-3">${esc.descripcion}</p>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-xs text-slate-400">Costo Final:</span>
                                    <span class="text-sm font-bold text-white">$${this.formatNumber(esc.costoFinal)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-xs text-slate-400">Impacto:</span>
                                    <span class="text-sm ${
                                        esc.impacto > 0 ? 'text-red-400' : 'text-emerald-400'
                                    }">
                                        ${esc.impacto > 0 ? '+' : ''}$${this.formatNumber(esc.impacto)}
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-xs text-slate-400">Variación:</span>
                                    <span class="text-sm font-medium ${
                                        esc.variacionPorcentaje > 15 ? 'text-red-400' :
                                        esc.variacionPorcentaje > 10 ? 'text-orange-400' :
                                        'text-slate-300'
                                    }">
                                        ${esc.variacionPorcentaje}%
                                    </span>
                                </div>
                                <div class="mt-3 pt-3 border-t border-slate-700">
                                    <span class="text-xs px-2 py-1 rounded ${
                                        esc.factibilidad === 'alta' ? 'bg-emerald-500/20 text-emerald-400' :
                                        esc.factibilidad === 'media' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-red-500/20 text-red-400'
                                    }">
                                        Factibilidad: ${esc.factibilidad}
                                    </span>
                                </div>
                                <p class="text-xs text-slate-500 mt-2">${esc.recomendacion}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', escenariosHTML);
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const btnRefresh = document.getElementById('btnRefreshPredictions');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                btnRefresh.querySelector('i').classList.add('fa-spin');
                setTimeout(() => {
                    this.render();
                    btnRefresh.querySelector('i').classList.remove('fa-spin');
                    
                    if (typeof window.notificationSystem !== 'undefined') {
                        window.notificationSystem.add({
                            type: 'success',
                            priority: 'low',
                            title: '✅ Predicciones Actualizadas',
                            message: 'Los análisis predictivos han sido recalculados'
                        });
                    }
                }, 500);
            });
        }
    }

    /**
     * Formatear número
     */
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    /**
     * Formatear fecha
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PredictiveWidget = PredictiveWidget;
}

