/**
 * ============================================================================
 * MODAL DE DETALLES KPI - MEJORA FASE 1
 * ============================================================================
 * Drill-down en KPIs con información detallada
 * Versión: 1.0.0
 * ============================================================================
 */

class KPIDetailsModal {
    constructor(gestorGerencia) {
        this.gestorGerencia = gestorGerencia;
        this.init();
    }

    /**
     * Inicializar modal
     */
    init() {
        this.createModal();
    }

    /**
     * Crear estructura del modal
     */
    createModal() {
        if (document.getElementById('kpiDetailsModal')) return;

        const modal = document.createElement('div');
        modal.id = 'kpiDetailsModal';
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="kpiDetailsModal.close()"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="glass-effect rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h2 id="kpiModalTitle" class="text-2xl font-bold text-white flex items-center gap-3">
                            <i id="kpiModalIcon" class="fas fa-chart-line"></i>
                            <span id="kpiModalTitleText">Detalles del KPI</span>
                        </h2>
                        <button onclick="kpiDetailsModal.close()" 
                            class="text-slate-400 hover:text-white transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    
                    <div id="kpiModalContent" class="space-y-6">
                        <!-- Contenido dinámico -->
                    </div>
                    
                    <div class="mt-6 flex justify-end gap-3">
                        <button onclick="kpiDetailsModal.exportData()" 
                            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">
                            <i class="fas fa-download mr-2"></i>Exportar Datos
                        </button>
                        <button onclick="kpiDetailsModal.close()" 
                            class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Mostrar detalles de KPI
     */
    show(field) {
        const modal = document.getElementById('kpiDetailsModal');
        if (!modal) return;

        const details = this.getKPIDetails(field);
        if (!details) {
            console.warn('KPI no encontrado:', field);
            return;
        }

        // Actualizar título e icono
        document.getElementById('kpiModalTitleText').textContent = details.title;
        document.getElementById('kpiModalIcon').className = `fas ${details.icon}`;
        
        // Actualizar contenido
        const content = document.getElementById('kpiModalContent');
        content.innerHTML = this.generateContent(field, details);

        // Mostrar modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Inicializar gráficos si hay
        setTimeout(() => {
            this.initCharts(field, details);
        }, 100);
    }

    /**
     * Cerrar modal
     */
    close() {
        const modal = document.getElementById('kpiDetailsModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    /**
     * Obtener detalles del KPI
     */
    getKPIDetails(field) {
        const kpis = {
            total_projects: {
                title: 'Total de Proyectos',
                icon: 'fa-briefcase',
                type: 'projects'
            },
            total_users: {
                title: 'Total de Usuarios',
                icon: 'fa-users',
                type: 'users'
            },
            unread_messages: {
                title: 'Mensajes No Leídos',
                icon: 'fa-envelope',
                type: 'messages'
            },
            total_cost: {
                title: 'Costo Total Estimado',
                icon: 'fa-dollar-sign',
                type: 'financial'
            }
        };

        return kpis[field];
    }

    /**
     * Generar contenido del modal
     */
    generateContent(field, details) {
        switch (details.type) {
            case 'financial':
                return this.generateFinancialContent();
            case 'projects':
                return this.generateProjectsContent();
            case 'users':
                return this.generateUsersContent();
            case 'messages':
                return this.generateMessagesContent();
            default:
                return this.generateDefaultContent(field);
        }
    }

    /**
     * Generar contenido financiero
     */
    generateFinancialContent() {
        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        const desglose = this.gestorGerencia.obtenerDesgloseCostos();
        const historial = this.gestorGerencia.obtenerHistorialPagos();

        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="glass-effect rounded-xl p-4 border border-blue-500/20">
                    <p class="text-sm text-slate-400 mb-1">Presupuesto Inicial</p>
                    <p class="text-2xl font-bold text-blue-400">$${this.formatNumber(resumen.presupuestoInicial)}</p>
                </div>
                <div class="glass-effect rounded-xl p-4 border border-emerald-500/20">
                    <p class="text-sm text-slate-400 mb-1">Gastos Extras</p>
                    <p class="text-2xl font-bold text-emerald-400">$${this.formatNumber(resumen.totalGastosExtras)}</p>
                </div>
                <div class="glass-effect rounded-xl p-4 border border-amber-500/20">
                    <p class="text-sm text-slate-400 mb-1">Costo Final</p>
                    <p class="text-2xl font-bold text-amber-400">$${this.formatNumber(resumen.costoFinal)}</p>
                </div>
            </div>

            <div class="glass-effect rounded-xl p-6 mb-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-chart-pie text-blue-400"></i>
                    Desglose por Categoría
                </h3>
                <div class="space-y-3">
                    ${desglose.map(cat => `
                        <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-3 h-3 rounded-full" style="background-color: ${this.getCategoryColor(cat.categoria)}"></div>
                                <span class="text-white font-medium">${cat.categoria}</span>
                            </div>
                            <div class="text-right">
                                <p class="text-white font-bold">$${this.formatNumber(cat.monto)}</p>
                                <p class="text-xs text-slate-400">${cat.porcentaje}%</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-history text-purple-400"></i>
                    Historial de Pagos
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-700">
                                <th class="text-left py-2 px-3 text-sm text-slate-400">#</th>
                                <th class="text-left py-2 px-3 text-sm text-slate-400">Descripción</th>
                                <th class="text-right py-2 px-3 text-sm text-slate-400">Monto</th>
                                <th class="text-left py-2 px-3 text-sm text-slate-400">Fecha</th>
                                <th class="text-left py-2 px-3 text-sm text-slate-400">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historial.map(pago => `
                                <tr class="border-b border-slate-800 hover:bg-slate-800/50">
                                    <td class="py-2 px-3 text-white">${pago.numero}</td>
                                    <td class="py-2 px-3 text-white">${pago.descripcion}</td>
                                    <td class="py-2 px-3 text-right text-white font-medium">$${this.formatNumber(pago.monto)}</td>
                                    <td class="py-2 px-3 text-slate-400">${pago.fecha}</td>
                                    <td class="py-2 px-3">
                                        <span class="px-2 py-1 rounded text-xs font-medium ${
                                            pago.estado === 'completado' ? 'bg-emerald-500/20 text-emerald-400' :
                                            pago.estado === 'pendiente' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-slate-500/20 text-slate-400'
                                        }">
                                            ${pago.estado}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-6">
                <canvas id="kpiFinancialChart" height="100"></canvas>
            </div>
        `;
    }

    /**
     * Generar contenido de proyectos
     */
    generateProjectsContent() {
        // Obtener proyectos desde el estado global o API
        const projects = window.coreState?.get('projects') || [];

        return `
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-project-diagram text-blue-400"></i>
                    Proyectos Activos
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${projects.length > 0 ? projects.map(project => `
                        <div class="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <h4 class="font-bold text-white mb-2">${project.nombre || project.name || 'Sin nombre'}</h4>
                            <div class="space-y-1 text-sm">
                                <p class="text-slate-400">Estado: <span class="text-white">${project.activo ? 'Activo' : 'Completado'}</span></p>
                                <p class="text-slate-400">Avance: <span class="text-white">${project.avance || 0}%</span></p>
                            </div>
                        </div>
                    `).join('') : '<p class="text-slate-400">No hay proyectos registrados</p>'}
                </div>
            </div>
        `;
    }

    /**
     * Generar contenido de usuarios
     */
    generateUsersContent() {
        return `
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-users text-emerald-400"></i>
                    Equipo de Trabajo
                </h3>
                <p class="text-slate-400">Información detallada de usuarios pendiente de implementación.</p>
            </div>
        `;
    }

    /**
     * Generar contenido de mensajes
     */
    generateMessagesContent() {
        return `
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-envelope text-amber-400"></i>
                    Mensajes No Leídos
                </h3>
                <p class="text-slate-400">Información detallada de mensajes pendiente de implementación.</p>
            </div>
        `;
    }

    /**
     * Generar contenido por defecto
     */
    generateDefaultContent(field) {
        return `
            <div class="glass-effect rounded-xl p-6">
                <p class="text-slate-400">Detalles del KPI "${field}" pendiente de implementación.</p>
            </div>
        `;
    }

    /**
     * Inicializar gráficos en el modal
     */
    initCharts(field, details) {
        if (details.type === 'financial' && typeof Chart !== 'undefined') {
            const canvas = document.getElementById('kpiFinancialChart');
            if (canvas) {
                const historial = this.gestorGerencia.obtenerHistorialPagos();
                const ctx = canvas.getContext('2d');

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: historial.map(p => p.fecha),
                        datasets: [{
                            label: 'Pagos Acumulados',
                            data: historial.map((p, i, arr) => 
                                arr.slice(0, i + 1).reduce((sum, pago) => sum + pago.monto, 0)
                            ),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: { color: '#cbd5e1' }
                            }
                        },
                        scales: {
                            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                            y: { 
                                ticks: { 
                                    color: '#94a3b8',
                                    callback: (value) => `$${this.formatNumber(value)}`
                                }, 
                                grid: { color: 'rgba(255, 255, 255, 0.05)' } 
                            }
                        }
                    }
                });
            }
        }
    }

    /**
     * Exportar datos
     */
    exportData() {
        // TODO: Implementar exportación
        if (typeof window.dashboardInteractive !== 'undefined') {
            window.dashboardInteractive.exportToExcel();
        } else {
            alert('Funcionalidad de exportación en desarrollo');
        }
    }

    /**
     * Obtener color de categoría
     */
    getCategoryColor(categoria) {
        const colors = {
            'Materiales': 'rgb(59, 130, 246)',
            'Mano de Obra': 'rgb(16, 185, 129)',
            'Equipo y Maquinaria': 'rgb(245, 158, 11)',
            'Administración': 'rgb(139, 92, 246)'
        };
        return colors[categoria] || 'rgb(100, 116, 139)';
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
    window.KPIDetailsModal = KPIDetailsModal;
}

