/**
 * ============================================================================
 * BÚSQUEDA GLOBAL - MEJORA FASE 1
 * ============================================================================
 * Búsqueda rápida en todo el sistema
 * Versión: 1.0.0
 * ============================================================================
 */

class GlobalSearch {
    constructor() {
        this.searchIndex = [];
        this.results = [];
        this.init();
    }

    /**
     * Inicializar búsqueda global
     */
    init() {
        this.createSearchUI();
        this.buildSearchIndex();
        this.setupEventListeners();
    }

    /**
     * Crear UI de búsqueda
     */
    createSearchUI() {
        // Botón de búsqueda en header
        const header = document.querySelector('header');
        if (header) {
            const searchBtn = document.createElement('button');
            searchBtn.id = 'btnGlobalSearch';
            searchBtn.className = 'px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all flex items-center gap-2';
            searchBtn.innerHTML = '<i class="fas fa-search"></i><span class="hidden md:inline">Buscar</span>';
            searchBtn.title = 'Búsqueda Global (Ctrl+K)';
            
            // Insertar antes del botón de logout
            const logoutBtn = header.querySelector('button[onclick*="logout"]');
            if (logoutBtn) {
                logoutBtn.parentNode.insertBefore(searchBtn, logoutBtn);
            } else {
                header.querySelector('.flex.items-center.gap-4')?.appendChild(searchBtn);
            }
        }

        // Modal de búsqueda
        const modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="globalSearch.close()"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="glass-effect rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl">
                    <div class="flex items-center gap-3 mb-6">
                        <i class="fas fa-search text-blue-400 text-xl"></i>
                        <input type="text" 
                            id="globalSearchInput" 
                            placeholder="Buscar proyectos, usuarios, documentos, KPIs..."
                            class="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autocomplete="off">
                        <button onclick="globalSearch.close()" 
                            class="text-slate-400 hover:text-white transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div id="searchResults" class="max-h-96 overflow-y-auto space-y-2">
                        <div class="text-center py-8 text-slate-400">
                            <i class="fas fa-search text-3xl mb-3"></i>
                            <p>Escribe para buscar...</p>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
                        <div class="flex items-center gap-4">
                            <span><kbd class="px-2 py-1 bg-slate-800 rounded">↑↓</kbd> Navegar</span>
                            <span><kbd class="px-2 py-1 bg-slate-800 rounded">Enter</kbd> Seleccionar</span>
                            <span><kbd class="px-2 py-1 bg-slate-800 rounded">Esc</kbd> Cerrar</span>
                        </div>
                        <span id="searchResultsCount"></span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Construir índice de búsqueda
     */
    buildSearchIndex() {
        this.searchIndex = [];

        // Proyectos
        if (typeof window.multiProjectManager !== 'undefined') {
            window.multiProjectManager.projects.forEach(project => {
                this.searchIndex.push({
                    type: 'proyecto',
                    id: project.id,
                    title: project.nombre,
                    description: `Presupuesto: $${this.formatNumber(project.presupuesto)} | Avance: ${project.avance}%`,
                    data: project,
                    action: () => window.multiProjectManager.viewProject(project.id)
                });
            });
        }

        // KPIs
        const kpiFields = [
            { field: 'total_projects', title: 'Total Proyectos', type: 'kpi' },
            { field: 'total_users', title: 'Total Usuarios', type: 'kpi' },
            { field: 'unread_messages', title: 'Mensajes No Leídos', type: 'kpi' },
            { field: 'total_cost', title: 'Costo Total', type: 'kpi' }
        ];

        kpiFields.forEach(kpi => {
            this.searchIndex.push({
                type: 'kpi',
                id: kpi.field,
                title: kpi.title,
                description: 'Ver detalles del KPI',
                data: kpi,
                action: () => {
                    if (typeof window.kpiDetailsModal !== 'undefined') {
                        window.kpiDetailsModal.show(kpi.field);
                    }
                }
            });
        });

        // Secciones del dashboard
        const sections = [
            { id: 'dashboard', title: 'Dashboard', icon: 'fa-th-large' },
            { id: 'proyectos', title: 'Proyectos', icon: 'fa-project-diagram' },
            { id: 'usuarios', title: 'Usuarios', icon: 'fa-users' },
            { id: 'mensajeria', title: 'Mensajería', icon: 'fa-comment-alt' },
            { id: 'configuracion', title: 'Configuración', icon: 'fa-cog' }
        ];

        sections.forEach(section => {
            this.searchIndex.push({
                type: 'seccion',
                id: section.id,
                title: section.title,
                description: 'Navegar a esta sección',
                icon: section.icon,
                action: () => {
                    const navItem = document.querySelector(`[data-section="${section.id}"]`);
                    if (navItem) navItem.click();
                }
            });
        });
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Atajo de teclado Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.open();
            }
        });

        // Botón de búsqueda
        document.getElementById('btnGlobalSearch')?.addEventListener('click', () => {
            this.open();
        });

        // Input de búsqueda
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.search(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const firstResult = this.results[0];
                    if (firstResult) {
                        firstResult.action();
                        this.close();
                    }
                } else if (e.key === 'Escape') {
                    this.close();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateResults(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateResults(-1);
                }
            });
        }
    }

    /**
     * Abrir búsqueda
     */
    open() {
        const modal = document.getElementById('globalSearchModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            const input = document.getElementById('globalSearchInput');
            if (input) {
                input.focus();
                input.value = '';
            }

            // Reconstruir índice
            this.buildSearchIndex();
        }
    }

    /**
     * Cerrar búsqueda
     */
    close() {
        const modal = document.getElementById('globalSearchModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    /**
     * Buscar
     */
    search(query) {
        if (!query || query.length < 2) {
            this.renderResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        this.results = this.searchIndex.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                   (item.description && item.description.toLowerCase().includes(lowerQuery));
        });

        this.renderResults(this.results);
    }

    /**
     * Renderizar resultados
     */
    renderResults(results) {
        const container = document.getElementById('searchResults');
        const count = document.getElementById('searchResultsCount');
        
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-slate-400">
                    <i class="fas fa-search text-3xl mb-3"></i>
                    <p>No se encontraron resultados</p>
                </div>
            `;
            if (count) count.textContent = '';
            return;
        }

        if (count) {
            count.textContent = `${results.length} resultado${results.length !== 1 ? 's' : ''}`;
        }

        container.innerHTML = results.map((result, index) => `
            <div class="search-result-item glass-effect rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all ${
                index === 0 ? 'bg-blue-500/10' : ''
            }" 
            onclick="globalSearch.selectResult(${index})"
            data-index="${index}">
                <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg ${
                        result.type === 'proyecto' ? 'bg-blue-500/20 text-blue-400' :
                        result.type === 'kpi' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-purple-500/20 text-purple-400'
                    } flex items-center justify-center">
                        <i class="fas ${
                            result.type === 'proyecto' ? 'fa-briefcase' :
                            result.type === 'kpi' ? 'fa-chart-line' :
                            result.icon || 'fa-folder'
                        }"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                        <h4 class="font-bold text-white mb-1">${this.escapeHtml(result.title)}</h4>
                        <p class="text-sm text-slate-400">${this.escapeHtml(result.description || '')}</p>
                    </div>
                    <div class="flex-shrink-0">
                        <span class="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 capitalize">
                            ${result.type}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Navegar resultados
     */
    navigateResults(direction) {
        const items = document.querySelectorAll('.search-result-item');
        const current = document.querySelector('.search-result-item.bg-blue-500\\/10');
        
        let currentIndex = 0;
        if (current) {
            currentIndex = parseInt(current.dataset.index || 0);
            current.classList.remove('bg-blue-500/10');
        }

        const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
        if (items[newIndex]) {
            items[newIndex].classList.add('bg-blue-500/10');
            items[newIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    /**
     * Seleccionar resultado
     */
    selectResult(index) {
        const result = this.results[index];
        if (result && result.action) {
            result.action();
            this.close();
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

// Inicializar búsqueda global
if (typeof window !== 'undefined') {
    window.globalSearch = new GlobalSearch();
}

