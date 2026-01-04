/**
 * ============================================================================
 * DASHBOARD INTERACTIVO - MEJORA FASE 1
 * ============================================================================
 * Gráficos interactivos, drill-down, filtros y exportación
 * Versión: 1.0.0
 * ============================================================================
 */

class DashboardInteractive {
    constructor(gestorGerencia) {
        this.gestorGerencia = gestorGerencia;
        this.charts = {};
        this.filters = {
            fechaInicio: null,
            fechaFin: null,
            proyecto: 'all'
        };
        this.init();
    }

    /**
     * Inicializar dashboard interactivo
     */
    init() {
        // Verificar que Chart.js esté disponible
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js no está cargado. Cargando desde CDN...');
            this.loadChartJS();
            return;
        }

        // Inicializar gráficos
        this.initFinancialChart();
        this.initDistributionChart();
        this.initMilestonesChart();
        this.initKPICards();
        this.initFilters();
        this.initExportButtons();
    }

    /**
     * Cargar Chart.js desde CDN
     */
    loadChartJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = () => {
            console.log('Chart.js cargado correctamente');
            this.init();
        };
        document.head.appendChild(script);
    }

    /**
     * Inicializar gráfico de evolución financiera
     */
    initFinancialChart() {
        const canvas = document.getElementById('financialChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getFinancialData();

        this.charts.financial = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Presupuesto Inicial',
                        data: data.presupuesto,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Gastos Realizados',
                        data: data.gastos,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Costo Estimado',
                        data: data.estimado,
                        borderColor: 'rgb(245, 158, 11)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: $${this.formatNumber(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#94a3b8',
                            callback: (value) => `$${this.formatNumber(value)}`
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        this.showFinancialDetails(elements[0].index);
                    }
                }
            }
        });
    }

    /**
     * Inicializar gráfico de distribución por proyecto
     */
    initDistributionChart() {
        const canvas = document.getElementById('distributionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getDistributionData();

        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                size: 12
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${this.formatNumber(value)} (${percentage}%)`;
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        this.showProjectDetails(data.labels[index]);
                    }
                }
            }
        });
    }

    /**
     * Inicializar gráfico de cumplimiento de hitos
     */
    initMilestonesChart() {
        const canvas = document.getElementById('milestonesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getMilestonesData();

        this.charts.milestones = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Completado',
                        data: data.completados,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    },
                    {
                        label: 'En Progreso',
                        data: data.enProgreso,
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderColor: 'rgb(245, 158, 11)',
                        borderWidth: 1
                    },
                    {
                        label: 'Pendiente',
                        data: data.pendientes,
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: '#94a3b8',
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        this.showMilestoneDetails(data.labels[index]);
                    }
                }
            }
        });
    }

    /**
     * Inicializar tarjetas KPI interactivas
     */
    initKPICards() {
        const kpiCards = document.querySelectorAll('.stat-card');
        kpiCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button[data-action="editKPI"]')) {
                    return; // No hacer nada si se clickea el botón de editar
                }
                const field = card.querySelector('[data-field]')?.dataset.field;
                if (field) {
                    this.showKPIDetails(field);
                }
            });

            // Efecto hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.transition = 'transform 0.2s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Inicializar filtros
     */
    initFilters() {
        // Crear contenedor de filtros si no existe
        const dashboardSection = document.getElementById('sectionDashboard');
        if (!dashboardSection) return;

        const filtersHTML = `
            <div class="glass-effect rounded-2xl p-6 mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="fas fa-filter text-blue-400"></i>
                        Filtros
                    </h3>
                    <button id="btnResetFilters" class="text-sm text-slate-400 hover:text-white">
                        <i class="fas fa-redo mr-1"></button>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-2">Fecha Inicio</label>
                        <input type="date" id="filterFechaInicio" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-2">Fecha Fin</label>
                        <input type="date" id="filterFechaFin" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-2">Proyecto</label>
                        <select id="filterProyecto" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">Todos los Proyectos</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        // Insertar filtros después de las tarjetas KPI
        const kpiSection = dashboardSection.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
        if (kpiSection) {
            kpiSection.insertAdjacentHTML('afterend', filtersHTML);
        }

        // Event listeners para filtros
        document.getElementById('filterFechaInicio')?.addEventListener('change', (e) => {
            this.filters.fechaInicio = e.target.value;
            this.applyFilters();
        });

        document.getElementById('filterFechaFin')?.addEventListener('change', (e) => {
            this.filters.fechaFin = e.target.value;
            this.applyFilters();
        });

        document.getElementById('filterProyecto')?.addEventListener('change', (e) => {
            this.filters.proyecto = e.target.value;
            this.applyFilters();
        });

        document.getElementById('btnResetFilters')?.addEventListener('click', () => {
            this.resetFilters();
        });
    }

    /**
     * Inicializar botones de exportación
     */
    initExportButtons() {
        const dashboardSection = document.getElementById('sectionDashboard');
        if (!dashboardSection) return;

        const exportHTML = `
            <div class="flex justify-end gap-2 mb-6">
                <button id="btnExportPDF" 
                    class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all flex items-center gap-2">
                    <i class="fas fa-file-pdf"></i>
                    Exportar PDF
                </button>
                <button id="btnExportExcel" 
                    class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all flex items-center gap-2">
                    <i class="fas fa-file-excel"></i>
                    Exportar Excel
                </button>
            </div>
        `;

        const chartsSection = dashboardSection.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
        if (chartsSection) {
            chartsSection.insertAdjacentHTML('beforebegin', exportHTML);
        }

        document.getElementById('btnExportPDF')?.addEventListener('click', () => {
            this.exportToPDF();
        });

        document.getElementById('btnExportExcel')?.addEventListener('click', () => {
            this.exportToExcel();
        });
    }

    /**
     * Obtener datos financieros
     */
    getFinancialData() {
        // Intentar obtener del cache
        if (typeof window.smartCache !== 'undefined') {
            const cached = window.smartCache.get('financial_data', 'financial');
            if (cached) {
                return cached;
            }
        }

        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        const historial = this.gestorGerencia.obtenerHistorialPagos();

        // Generar datos mensuales (últimos 6 meses)
        const meses = [];
        const presupuesto = [];
        const gastos = [];
        const estimado = [];

        const hoy = new Date();
        for (let i = 5; i >= 0; i--) {
            const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
            meses.push(fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }));
            
            // Presupuesto inicial (constante)
            presupuesto.push(resumen.presupuestoInicial);
            
            // Gastos acumulados hasta ese mes
            const gastosHastaMes = historial
                .filter(p => new Date(p.fecha) <= fecha)
                .reduce((sum, p) => sum + p.monto, 0);
            gastos.push(gastosHastaMes);
            
            // Estimado (presupuesto + gastos extras aprobados)
            estimado.push(resumen.costoFinal);
        }

        const data = {
            labels: meses,
            presupuesto,
            gastos,
            estimado
        };

        // Guardar en cache
        if (typeof window.smartCache !== 'undefined') {
            window.smartCache.set('financial_data', data, 'financial');
        }

        return data;
    }

    /**
     * Obtener datos de distribución
     */
    getDistributionData() {
        const desglose = this.gestorGerencia.obtenerDesgloseCostos();
        
        return {
            labels: desglose.map(d => d.categoria),
            values: desglose.map(d => d.monto)
        };
    }

    /**
     * Obtener datos de hitos
     */
    getMilestonesData() {
        const hitos = this.gestorGerencia.obtenerHitos();
        
        const porEstado = {
            completado: hitos.filter(h => h.estado === 'completado').length,
            en_progreso: hitos.filter(h => h.estado === 'en_progreso').length,
            pendiente: hitos.filter(h => h.estado === 'pendiente').length
        };

        return {
            labels: ['Hitos'],
            completados: [porEstado.completado],
            enProgreso: [porEstado.en_progreso],
            pendientes: [porEstado.pendiente]
        };
    }

    /**
     * Aplicar filtros
     */
    applyFilters() {
        // Actualizar gráficos con datos filtrados
        this.updateCharts();
    }

    /**
     * Resetear filtros
     */
    resetFilters() {
        this.filters = {
            fechaInicio: null,
            fechaFin: null,
            proyecto: 'all'
        };

        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterProyecto').value = 'all';

        this.updateCharts();
    }

    /**
     * Actualizar gráficos
     */
    updateCharts() {
        if (this.charts.financial) {
            const data = this.getFinancialData();
            this.charts.financial.data.labels = data.labels;
            this.charts.financial.data.datasets[0].data = data.presupuesto;
            this.charts.financial.data.datasets[1].data = data.gastos;
            this.charts.financial.data.datasets[2].data = data.estimado;
            this.charts.financial.update();
        }

        if (this.charts.distribution) {
            const data = this.getDistributionData();
            this.charts.distribution.data.labels = data.labels;
            this.charts.distribution.data.datasets[0].data = data.values;
            this.charts.distribution.update();
        }

        if (this.charts.milestones) {
            const data = this.getMilestonesData();
            this.charts.milestones.data.datasets[0].data = data.completados;
            this.charts.milestones.data.datasets[1].data = data.enProgreso;
            this.charts.milestones.data.datasets[2].data = data.pendientes;
            this.charts.milestones.update();
        }
    }

    /**
     * Mostrar detalles de KPI (drill-down)
     */
    showKPIDetails(field) {
        if (typeof window.kpiDetailsModal !== 'undefined') {
            window.kpiDetailsModal.show(field);
        } else {
            console.warn('KPIDetailsModal no está disponible');
        }
    }

    /**
     * Mostrar detalles financieros
     */
    showFinancialDetails(index) {
        console.log('Mostrando detalles financieros para índice:', index);
        // TODO: Implementar modal de detalles
    }

    /**
     * Mostrar detalles de proyecto
     */
    showProjectDetails(projectName) {
        console.log('Mostrando detalles de proyecto:', projectName);
        // TODO: Implementar modal de detalles
    }

    /**
     * Mostrar detalles de hito
     */
    showMilestoneDetails(milestoneName) {
        console.log('Mostrando detalles de hito:', milestoneName);
        // TODO: Implementar modal de detalles
    }

    /**
     * Exportar a PDF
     */
    async exportToPDF() {
        if (typeof window.exportManager !== 'undefined') {
            await window.exportManager.exportToPDF('dashboard');
        } else {
            alert('Sistema de exportación no está disponible');
        }
    }

    /**
     * Exportar a Excel
     */
    async exportToExcel() {
        if (typeof window.exportManager !== 'undefined') {
            await window.exportManager.exportToExcel('dashboard');
        } else {
            alert('Sistema de exportación no está disponible');
        }
    }

    /**
     * Formatear número
     */
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DashboardInteractive = DashboardInteractive;
}

