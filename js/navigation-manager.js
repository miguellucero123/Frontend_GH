/**
 * ============================================================
 * GESTOR DE NAVEGACIÓN UNIFICADO
 * ============================================================
 * 
 * Sistema centralizado para navegación entre dashboards y paneles
 */

class NavigationManager {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
    }

    /**
     * Inicializar gestor de navegación
     */
    init() {
        if (typeof auth !== 'undefined' && auth.getCurrentUser) {
            this.currentUser = auth.getCurrentUser();
            this.currentRole = this.currentUser?.role || this.currentUser?.rol;
        }
    }

    /**
     * Obtener rutas disponibles según rol
     */
    getAvailableRoutes() {
        const routes = {
            'jefe': [
                { label: 'Dashboard', url: 'panel-jefe.html#dashboard', icon: 'fa-tachometer-alt' },
                { label: 'Proyectos', url: 'panel-jefe.html#proyectos', icon: 'fa-folder' },
                { label: 'Usuarios', url: 'panel-jefe.html#usuarios', icon: 'fa-users' },
                { label: 'Mensajes', url: 'panel-jefe.html#mensajes', icon: 'fa-comments' },
                { label: 'Info Detallada', url: 'panel-jefe.html#informacion-detallada', icon: 'fa-info-circle' }
            ],
            'admin': [
                { label: 'Dashboard', url: 'panel-jefe.html#dashboard', icon: 'fa-tachometer-alt' },
                { label: 'Proyectos', url: 'panel-jefe.html#proyectos', icon: 'fa-folder' },
                { label: 'Usuarios', url: 'panel-jefe.html#usuarios', icon: 'fa-users' },
                { label: 'Mensajes', url: 'panel-jefe.html#mensajes', icon: 'fa-comments' }
            ],
            'cliente': [
                { label: 'Mi Dashboard', url: 'dashboard-cliente.html', icon: 'fa-home', active: true },
                { label: 'Mis Proyectos', url: 'panel-usuario.html', icon: 'fa-folder' },
                { label: 'Mensajes', url: 'panel-usuario.html#chat', icon: 'fa-comments' }
            ],
            'trabajador': [
                { label: 'Mi Panel', url: 'dashboard-trabajador.html', icon: 'fa-home', active: true },
                { label: 'Proyectos', url: 'panel-usuario.html', icon: 'fa-folder' },
                { label: 'Mensajes', url: 'panel-usuario.html#chat', icon: 'fa-comments' }
            ]
        };

        return routes[this.currentRole] || [];
    }

    /**
     * Crear menú de navegación
     */
    createNavigationMenu(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const routes = this.getAvailableRoutes();
        if (routes.length === 0) return;

        const currentPage = window.location.pathname.split('/').pop() || window.location.href;

        container.innerHTML = `
            <nav class="unified-navigation">
                ${routes.map(route => {
                    const isActive = currentPage.includes(route.url.split('#')[0]) || route.active;
                    return `
                        <a href="${route.url}" class="nav-link ${isActive ? 'active' : ''}">
                            <i class="fas ${route.icon}"></i>
                            <span>${route.label}</span>
                        </a>
                    `;
                }).join('')}
            </nav>
        `;
    }

    /**
     * Navegar a una ruta
     */
    navigateTo(url) {
        window.location.href = url;
    }

    /**
     * Obtener URL del dashboard principal según rol
     */
    getMainDashboardUrl() {
        switch(this.currentRole) {
            case 'jefe':
            case 'admin':
                return 'panel-jefe.html';
            case 'cliente':
                return 'dashboard-cliente.html';
            case 'trabajador':
                return 'dashboard-trabajador.html';
            default:
                return 'index.html';
        }
    }

    /**
     * Verificar si está en el dashboard correcto
     */
    isInCorrectDashboard() {
        const currentPage = window.location.pathname.split('/').pop() || window.location.href;
        const correctUrl = this.getMainDashboardUrl();
        return currentPage.includes(correctUrl);
    }

    /**
     * Redirigir al dashboard correcto si es necesario
     */
    redirectIfNeeded() {
        if (!this.isInCorrectDashboard()) {
            const correctUrl = this.getMainDashboardUrl();
            console.log(`Redirigiendo a dashboard correcto: ${correctUrl}`);
            window.location.href = correctUrl;
        }
    }
}

// Instancia global
const navigationManager = new NavigationManager();

