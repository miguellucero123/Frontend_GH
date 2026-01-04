/**
 * ============================================================================
 * GESTOR DE MÚLTIPLES PROYECTOS - MEJORA FASE 1
 * ============================================================================
 * Vista consolidada y comparación de proyectos
 * Versión: 1.0.0
 * ============================================================================
 */

class MultiProjectManager {
    constructor() {
        this.projects = [];
        this.selectedProjects = [];
        this.init();
    }

    /**
     * Inicializar gestor
     */
    init() {
        this.loadProjects();
        this.createUI();
    }

    /**
     * Cargar proyectos
     */
    loadProjects() {
        // Cargar desde localStorage o API
        const saved = localStorage.getItem('multiProjects');
        if (saved) {
            this.projects = JSON.parse(saved);
        } else {
            // Proyecto por defecto
            this.projects = [{
                id: 'PROY_001',
                nombre: 'Casa Moderna',
                activo: true,
                presupuesto: 850000,
                gastado: 487500,
                avance: 57.36,
                fechaInicio: '2024-06-01',
                fechaTermino: '2025-01-31'
            }];
            this.saveProjects();
        }
    }

    /**
     * Guardar proyectos
     */
    saveProjects() {
        localStorage.setItem('multiProjects', JSON.stringify(this.projects));
    }

    /**
     * Crear UI
     */
    createUI() {
        const dashboard = document.getElementById('sectionDashboard');
        if (!dashboard) return;

        // Agregar sección de múltiples proyectos después de los gráficos
        const projectsSection = `
            <div id="multiProjectsSection" class="glass-effect rounded-2xl p-6 mb-8 border border-indigo-500/20">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white flex items-center gap-3">
                        <i class="fas fa-layer-group text-indigo-400"></i>
                        Vista Consolidada de Proyectos
                    </h3>
                    <div class="flex gap-2">
                        <button id="btnAddProject" 
                            class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all">
                            <i class="fas fa-plus mr-2"></i>Nuevo Proyecto
                        </button>
                        <button id="btnCompareProjects" 
                            class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
                            <i class="fas fa-balance-scale mr-2"></i>Comparar
                        </button>
                    </div>
                </div>

                <!-- Resumen Consolidado -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                        <p class="text-sm text-slate-400 mb-1">Total Proyectos</p>
                        <p class="text-2xl font-bold text-blue-400" id="totalProjectsCount">0</p>
                    </div>
                    <div class="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/20">
                        <p class="text-sm text-slate-400 mb-1">Presupuesto Total</p>
                        <p class="text-2xl font-bold text-emerald-400" id="totalBudget">$0</p>
                    </div>
                    <div class="bg-slate-800/50 rounded-lg p-4 border border-amber-500/20">
                        <p class="text-sm text-slate-400 mb-1">Gastado Total</p>
                        <p class="text-2xl font-bold text-amber-400" id="totalSpent">$0</p>
                    </div>
                    <div class="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                        <p class="text-sm text-slate-400 mb-1">Avance Promedio</p>
                        <p class="text-2xl font-bold text-purple-400" id="avgProgress">0%</p>
                    </div>
                </div>

                <!-- Lista de Proyectos -->
                <div id="projectsList" class="space-y-3">
                    <!-- Se carga dinámicamente -->
                </div>
            </div>
        `;

        // Insertar después de la sección de análisis predictivo
        const predictiveSection = document.getElementById('predictiveAnalysisSection');
        if (predictiveSection) {
            predictiveSection.insertAdjacentHTML('afterend', projectsSection);
        } else {
            // Si no existe, insertar después de los gráficos
            const chartsSection = dashboard.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
            if (chartsSection) {
                chartsSection.insertAdjacentHTML('afterend', projectsSection);
            }
        }

        this.renderProjects();
        this.setupEventListeners();
    }

    /**
     * Renderizar proyectos
     */
    renderProjects() {
        const container = document.getElementById('projectsList');
        if (!container) return;

        // Actualizar resumen consolidado
        this.updateConsolidatedSummary();

        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-slate-400">
                    <i class="fas fa-folder-open text-4xl mb-4"></i>
                    <p>No hay proyectos registrados</p>
                    <button onclick="multiProjectManager.showAddProjectModal()" 
                        class="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
                        Crear Primer Proyecto
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.projects.map(project => `
            <div class="project-item glass-effect rounded-lg p-4 border border-slate-700 hover:border-indigo-500/50 transition-all">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-grow">
                        <input type="checkbox" 
                            class="project-checkbox w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                            data-project-id="${project.id}"
                            onchange="multiProjectManager.toggleProjectSelection('${project.id}')">
                        <div class="flex-grow">
                            <div class="flex items-center gap-3 mb-2">
                                <h4 class="text-lg font-bold text-white">${this.escapeHtml(project.nombre)}</h4>
                                <span class="px-2 py-1 rounded text-xs font-medium ${
                                    project.activo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                                }">
                                    ${project.activo ? 'Activo' : 'Completado'}
                                </span>
                            </div>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p class="text-slate-400">Presupuesto</p>
                                    <p class="text-white font-medium">$${this.formatNumber(project.presupuesto)}</p>
                                </div>
                                <div>
                                    <p class="text-slate-400">Gastado</p>
                                    <p class="text-white font-medium">$${this.formatNumber(project.gastado)}</p>
                                </div>
                                <div>
                                    <p class="text-slate-400">Avance</p>
                                    <div class="flex items-center gap-2">
                                        <div class="flex-grow bg-slate-800 rounded-full h-2">
                                            <div class="bg-indigo-500 h-2 rounded-full" style="width: ${project.avance}%"></div>
                                        </div>
                                        <span class="text-white font-medium">${project.avance}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-slate-400">Variación</p>
                                    <p class="font-medium ${
                                        project.variacion > 0 ? 'text-red-400' : 'text-emerald-400'
                                    }">
                                        ${project.variacion > 0 ? '+' : ''}${project.variacion?.toFixed(2) || 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="multiProjectManager.viewProject('${project.id}')" 
                            class="px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium transition-all">
                            <i class="fas fa-eye mr-1"></i>Ver
                        </button>
                        <button onclick="multiProjectManager.editProject('${project.id}')" 
                            class="px-3 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-sm font-medium transition-all">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Actualizar resumen consolidado
     */
    updateConsolidatedSummary() {
        const total = this.projects.length;
        const totalBudget = this.projects.reduce((sum, p) => sum + (p.presupuesto || 0), 0);
        const totalSpent = this.projects.reduce((sum, p) => sum + (p.gastado || 0), 0);
        const avgProgress = this.projects.length > 0
            ? this.projects.reduce((sum, p) => sum + (p.avance || 0), 0) / this.projects.length
            : 0;

        document.getElementById('totalProjectsCount').textContent = total;
        document.getElementById('totalBudget').textContent = `$${this.formatNumber(totalBudget)}`;
        document.getElementById('totalSpent').textContent = `$${this.formatNumber(totalSpent)}`;
        document.getElementById('avgProgress').textContent = `${avgProgress.toFixed(1)}%`;
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        document.getElementById('btnAddProject')?.addEventListener('click', () => {
            this.showAddProjectModal();
        });

        document.getElementById('btnCompareProjects')?.addEventListener('click', () => {
            this.showCompareModal();
        });
    }

    /**
     * Mostrar modal de agregar proyecto
     */
    showAddProjectModal() {
        // TODO: Implementar modal completo
        const nombre = prompt('Nombre del proyecto:');
        if (nombre) {
            this.addProject({
                id: `PROY_${Date.now()}`,
                nombre,
                activo: true,
                presupuesto: 0,
                gastado: 0,
                avance: 0,
                fechaInicio: new Date().toISOString().split('T')[0],
                fechaTermino: null
            });
        }
    }

    /**
     * Agregar proyecto
     */
    addProject(project) {
        this.projects.push(project);
        this.saveProjects();
        this.renderProjects();

        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Proyecto Agregado',
                message: `El proyecto "${project.nombre}" ha sido agregado`
            });
        }
    }

    /**
     * Ver proyecto
     */
    viewProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (project) {
            // Cambiar al proyecto actual
            if (typeof window.gestorGerencia !== 'undefined' && typeof proyectoMaestro !== 'undefined') {
                // Cargar proyecto en el gestor
                console.log('Cargando proyecto:', project);
                // TODO: Implementar carga de proyecto específico
            }
        }
    }

    /**
     * Editar proyecto
     */
    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (project) {
            // TODO: Implementar modal de edición
            console.log('Editando proyecto:', project);
        }
    }

    /**
     * Toggle selección de proyecto
     */
    toggleProjectSelection(id) {
        const index = this.selectedProjects.indexOf(id);
        if (index > -1) {
            this.selectedProjects.splice(index, 1);
        } else {
            this.selectedProjects.push(id);
        }
    }

    /**
     * Mostrar modal de comparación
     */
    showCompareModal() {
        if (this.selectedProjects.length < 2) {
            alert('Selecciona al menos 2 proyectos para comparar');
            return;
        }

        this.createCompareModal();
    }

    /**
     * Crear modal de comparación
     */
    createCompareModal() {
        const selected = this.projects.filter(p => this.selectedProjects.includes(p.id));
        
        const modal = document.createElement('div');
        modal.id = 'compareProjectsModal';
        modal.className = 'fixed inset-0 z-50';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="multiProjectManager.closeCompareModal()"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="glass-effect rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                            <i class="fas fa-balance-scale text-purple-400"></i>
                            Comparación de Proyectos
                        </h2>
                        <button onclick="multiProjectManager.closeCompareModal()" 
                            class="text-slate-400 hover:text-white transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-700">
                                    <th class="text-left py-3 px-4 text-sm font-bold text-slate-400">Proyecto</th>
                                    <th class="text-right py-3 px-4 text-sm font-bold text-slate-400">Presupuesto</th>
                                    <th class="text-right py-3 px-4 text-sm font-bold text-slate-400">Gastado</th>
                                    <th class="text-right py-3 px-4 text-sm font-bold text-slate-400">Avance</th>
                                    <th class="text-right py-3 px-4 text-sm font-bold text-slate-400">Variación</th>
                                    <th class="text-left py-3 px-4 text-sm font-bold text-slate-400">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${selected.map(project => `
                                    <tr class="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td class="py-3 px-4 text-white font-medium">${this.escapeHtml(project.nombre)}</td>
                                        <td class="py-3 px-4 text-right text-white">$${this.formatNumber(project.presupuesto)}</td>
                                        <td class="py-3 px-4 text-right text-white">$${this.formatNumber(project.gastado)}</td>
                                        <td class="py-3 px-4 text-right">
                                            <div class="flex items-center justify-end gap-2">
                                                <div class="w-24 bg-slate-800 rounded-full h-2">
                                                    <div class="bg-indigo-500 h-2 rounded-full" style="width: ${project.avance}%"></div>
                                                </div>
                                                <span class="text-white">${project.avance}%</span>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-right">
                                            <span class="font-medium ${
                                                project.variacion > 0 ? 'text-red-400' : 'text-emerald-400'
                                            }">
                                                ${project.variacion > 0 ? '+' : ''}${project.variacion?.toFixed(2) || 0}%
                                            </span>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="px-2 py-1 rounded text-xs font-medium ${
                                                project.activo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                                            }">
                                                ${project.activo ? 'Activo' : 'Completado'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button onclick="multiProjectManager.closeCompareModal()" 
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
     * Cerrar modal de comparación
     */
    closeCompareModal() {
        const modal = document.getElementById('compareProjectsModal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Formatear número
     */
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
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
    window.multiProjectManager = new MultiProjectManager();
}

