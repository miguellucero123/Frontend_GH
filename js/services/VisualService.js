/**
 * ============================================================
 * VISUAL SERVICE (Enterprise Edition - Phase 2)
 * ============================================================
 * Maneja gráficos avanzados, diagramas de Gantt y animaciones.
 */

class VisualService {
    constructor() {
        this.charts = {};
        this.gantt = null;
    }

    /**
     * Inicializar gráficos del dashboard con diseño premium
     */
    initDashboardCharts(projects) {
        this.renderFinancialChart(projects);
        this.renderDistributionChart(projects);
        this.renderMilestonesChart(projects);
    }

    /**
     * Gráfico de barras: Cumplimiento de Hitos por proyecto
     */
    renderMilestonesChart(projects) {
        const canvas = document.getElementById('milestonesChart');
        if (!canvas) return;

        // Destruir gráfico anterior si existe
        if (this.charts.milestones) {
            try {
                this.charts.milestones.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart de milestones anterior:', e);
            }
            this.charts.milestones = null;
        }

        // Verificar si Chart.js tiene un chart registrado en este canvas
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            try {
                existingChart.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart existente de Chart.js:', e);
            }
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const labels = projects.map(p => p.mandante_nombre.substring(0, 10) + '...');
        const data = projects.map(p => p.avance || 0);

        this.charts.milestones = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: '% Cumplimiento',
                    data: data,
                    backgroundColor: 'rgba(245, 158, 11, 0.5)',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#cbd5e1', callback: v => v + '%' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#cbd5e1' }
                    }
                }
            }
        });
    }

    /**
     * Gráfico de línea: Evolución de costos vs presupuesto
     */
    renderFinancialChart(projects) {
        const canvas = document.getElementById('financialChart');
        if (!canvas) return;

        // Destruir gráfico anterior si existe (tanto en this.charts como en Chart.js)
        if (this.charts.financial) {
            try {
                this.charts.financial.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart financiero anterior:', e);
            }
            this.charts.financial = null;
        }

        // Verificar si Chart.js tiene un chart registrado en este canvas
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            try {
                existingChart.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart existente de Chart.js:', e);
            }
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const labels = projects.map(p => p.mandante_nombre.substring(0, 15) + '...');
        const budgetData = projects.map(p => p.costo_inicial || 0);
        const actualData = projects.map(p => p.costo_final || 0);

        // Crear gradientes
        const budgetGradient = ctx.createLinearGradient(0, 0, 0, 400);
        budgetGradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
        budgetGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        const actualGradient = ctx.createLinearGradient(0, 0, 0, 400);
        actualGradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
        actualGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

        this.charts.financial = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Presupuesto Planeado',
                        data: budgetData,
                        borderColor: '#3b82f6',
                        backgroundColor: budgetGradient,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#3b82f6',
                        pointRadius: 4
                    },
                    {
                        label: 'Costo Real/Actual',
                        data: actualData,
                        borderColor: '#10b981',
                        backgroundColor: actualGradient,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#10b981',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#cbd5e1', font: { family: 'Inter', size: 12 } }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#cbd5e1' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: {
                            color: '#cbd5e1',
                            callback: value => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    /**
     * Gráfico circular: Distribución por obra
     */
    renderDistributionChart(projects) {
        const canvas = document.getElementById('distributionChart');
        if (!canvas) return;

        // Destruir gráfico anterior si existe
        if (this.charts.distribution) {
            try {
                this.charts.distribution.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart de distribución anterior:', e);
            }
            this.charts.distribution = null;
        }

        // Verificar si Chart.js tiene un chart registrado en este canvas
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            try {
                existingChart.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart existente de Chart.js:', e);
            }
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const data = projects.map(p => p.costo_final || 0);
        const labels = projects.map(p => p.mandante_nombre);

        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'
                    ],
                    borderWidth: 0,
                    hoverOffset: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#cbd5e1',
                            boxWidth: 12,
                            padding: 20,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    /**
     * Inicializar Diagrama de Gantt
     */
    renderGanttChart(projects) {
        const container = document.getElementById('ganttContainer');
        if (!container || projects.length === 0) return;

        // Adaptar datos de proyectos al formato de Frappe Gantt
        const tasks = projects.map(p => ({
            id: p.project_id.toString(),
            name: p.mandante_nombre,
            start: p.fecha_inicio || new Date().toISOString().split('T')[0],
            end: p.fecha_termino_estimada || (() => {
                const d = new Date(p.fecha_inicio || Date.now());
                d.setDate(d.getDate() + 180); // Default 6 months
                return d.toISOString().split('T')[0];
            })(),
            progress: p.avance || 0,
            dependencies: ''
        }));

        container.innerHTML = '<svg id="ganttSVG"></svg>';

        try {
            this.gantt = new Gantt("#ganttSVG", tasks, {
                header_height: 50,
                column_width: 30,
                step: 24,
                view_modes: ['Day', 'Week', 'Month'],
                bar_height: 20,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                view_mode: 'Week',
                language: 'es',
                custom_popup_html: function (task) {
                    return `
                        <div class="p-3 bg-slate-900 border border-white/10 rounded-lg shadow-xl">
                            <h5 class="font-bold text-white mb-1">${task.name}</h5>
                            <p class="text-xs text-slate-400 mb-2">Progreso: ${task.progress}%</p>
                            <p class="text-xs text-slate-500">${task.start} - ${task.end}</p>
                            <div class="w-full bg-white/10 h-1 rounded-full mt-2">
                                <div class="bg-blue-500 h-1 rounded-full" style="width: ${task.progress}%"></div>
                            </div>
                        </div>
                    `;
                },
                on_date_change: (task, start, end) => {
                    console.log('Fecha cambiada:', task, start, end);
                    // Actualizar estado global
                    if (window.projectService) {
                        window.projectService.updateProjectDates(task.id, start, end);
                    }
                },
                on_progress_change: (task, progress) => {
                    console.log('Progreso cambiado:', task, progress);
                    if (window.projectService) {
                        window.projectService.updateProjectProgress(task.id, progress);
                    }
                },
                on_click: (task) => {
                    // Abrir modal de edición rápida
                    if (window.openProjectModalGlobal) {
                        // Buscar el proyecto completo en el estado
                        const projects = window.coreState?.getState('projects') || [];
                        const project = projects.find(p => p.project_id.toString() === task.id);
                        if (project) {
                            window.openProjectModalGlobal(project);
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error renderizando Gantt:', e);
            container.innerHTML = '<p class="text-slate-500 italic text-center py-10">Error al cargar cronograma visual.</p>';
        }
    }

    /**
     * Gráfico circular de progreso para el cliente
     */
    renderClientProgressChart(canvasId, percentage) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'Pendiente'],
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: ['#a78bfa', 'rgba(255, 255, 255, 0.05)'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    /**
     * Gráfico de barras de horas semanales para el trabajador
     */
    renderWorkerHoursChart(canvasId, weeklyData = null) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        const hours = weeklyData || [8, 8, 8, 8, 8, 4]; // Default standard week

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Horas',
                    data: hours,
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#cbd5e1' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#cbd5e1' }
                    }
                }
            }
        });
    }

    /**
     * Animaciones de entrada suaves (GSAP)
     */
    animateSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        gsap.fromTo(section,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );

        // Animar tarjetas hijos
        const cards = section.querySelectorAll('.glass-effect');
        gsap.fromTo(cards,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
        );
    }
}

window.visualService = new VisualService();
