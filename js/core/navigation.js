/**
 * ============================================================================
 * NAVEGACIÓN UNIFICADA - SISTEMA EMPRESARIAL
 * ============================================================================
 * Navegación consistente entre todas las páginas
 * Versión: 1.0.0
 * ============================================================================
 */

class UnifiedNavigation {
    constructor() {
        this.currentPage = null;
        this.init();
    }

    /**
     * Inicializar navegación
     */
    init() {
        this.detectCurrentPage();
        this.setupNavigationLinks();
        this.setupBreadcrumbs();
    }

    /**
     * Detectar página actual
     */
    detectCurrentPage() {
        const path = window.location.pathname.split('/').pop();
        this.currentPage = path || 'index.html';
    }

    /**
     * Configurar enlaces de navegación
     */
    setupNavigationLinks() {
        // Interceptar todos los enlaces internos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Solo manejar enlaces internos
            if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#')) {
                // Verificar si es un enlace a otra página HTML
                if (href.endsWith('.html') || href.includes('.html#')) {
                    e.preventDefault();
                    this.navigateToPage(href);
                }
            }
        });
    }

    /**
     * Navegar a página
     */
    navigateToPage(href) {
        // Usar router si está disponible
        if (typeof window.router !== 'undefined') {
            const routeName = window.router.getRouteNameByPath(href);
            if (routeName) {
                const [path, hash] = href.split('#');
                window.router.navigate(routeName, hash ? { section: hash } : {});
                return;
            }
        }

        // Fallback: navegación directa
        window.location.href = href;
    }

    /**
     * Configurar breadcrumbs
     */
    setupBreadcrumbs() {
        const breadcrumbContainer = document.getElementById('breadcrumbs');
        if (!breadcrumbContainer) return;

        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = breadcrumbs;
    }

    /**
     * Generar breadcrumbs
     */
    generateBreadcrumbs() {
        const path = window.location.pathname;
        const hash = window.location.hash.substring(1);
        
        const breadcrumbs = [
            { label: 'Inicio', url: 'index.html' }
        ];

        // Agregar según página actual
        if (path.includes('panel-jefe.html')) {
            breadcrumbs.push({ label: 'Dashboard Gerencia', url: 'panel-jefe.html' });
            if (hash) {
                const sectionLabels = {
                    'dashboard': 'Dashboard',
                    'proyectos': 'Proyectos',
                    'usuarios': 'Usuarios',
                    'mensajeria': 'Mensajería',
                    'configuracion': 'Configuración'
                };
                breadcrumbs.push({ label: sectionLabels[hash] || hash, url: null });
            }
        } else if (path.includes('dashboard-cliente.html')) {
            breadcrumbs.push({ label: 'Mi Dashboard', url: 'dashboard-cliente.html' });
        } else if (path.includes('dashboard-trabajador.html')) {
            breadcrumbs.push({ label: 'Mi Panel', url: 'dashboard-trabajador.html' });
        } else if (path.includes('panel-usuario.html')) {
            breadcrumbs.push({ label: 'Mi Proyecto', url: 'panel-usuario.html' });
        }

        return breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${crumb.url && !isLast 
                        ? `<a href="${crumb.url}" class="text-blue-400 hover:text-blue-300">${crumb.label}</a>`
                        : `<span class="text-slate-400">${crumb.label}</span>`
                    }
                    ${!isLast ? '<i class="fas fa-chevron-right mx-2 text-slate-500"></i>' : ''}
                </span>
            `;
        }).join('');
    }

    /**
     * Crear menú de navegación por fases
     */
    createPhasesMenu(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof window.phaseManager === 'undefined') return;

        const user = typeof auth !== 'undefined' ? auth.getCurrentUser() : null;
        const role = user?.role || user?.rol;
        
        if (!role) return;

        const availablePhases = window.phaseManager.getAvailablePhasesForRole(role);
        
        container.innerHTML = `
            <div class="phases-menu">
                <h3 class="text-white font-semibold mb-4">Fases del Sistema</h3>
                <div class="space-y-2">
                    ${availablePhases.map(phase => `
                        <button 
                            onclick="phaseManager.navigateToPhase('${phase.id}')"
                            class="w-full text-left px-4 py-3 rounded-lg glass-effect border border-white/5 hover:border-blue-500 transition-all flex items-center justify-between">
                            <div>
                                <div class="text-white font-medium">${phase.name}</div>
                                <div class="text-slate-400 text-sm">${phase.description}</div>
                            </div>
                            <span class="badge badge-${phase.status === 'completed' ? 'success' : 'info'}">
                                ${phase.status === 'completed' ? 'Completo' : 'Implementado'}
                            </span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Inicializar navegación unificada
if (typeof window !== 'undefined') {
    window.unifiedNavigation = new UnifiedNavigation();
}

