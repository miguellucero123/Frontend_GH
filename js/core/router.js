/**
 * ============================================================================
 * ROUTER EMPRESARIAL - SISTEMA DE NAVEGACIÓN CENTRALIZADO
 * ============================================================================
 * Gestión de rutas y navegación entre todas las páginas
 * Versión: 1.0.0
 * ============================================================================
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.history = [];
        this.init();
    }

    /**
     * Inicializar router
     */
    init() {
        this.registerRoutes();
        this.setupNavigation();
        this.handleHashChanges();
    }

    /**
     * Registrar todas las rutas del sistema
     */
    registerRoutes() {
        // Rutas principales
        this.routes.set('login', {
            path: 'index.html',
            roles: [],
            requiresAuth: false
        });

        this.routes.set('dashboard-jefe', {
            path: 'panel-jefe.html',
            roles: ['jefe', 'admin'],
            requiresAuth: true,
            sections: ['dashboard', 'proyectos', 'usuarios', 'mensajeria', 'configuracion']
        });

        this.routes.set('dashboard-cliente', {
            path: 'dashboard-cliente.html',
            roles: ['cliente'],
            requiresAuth: true
        });

        this.routes.set('dashboard-trabajador', {
            path: 'dashboard-trabajador.html',
            roles: ['trabajador'],
            requiresAuth: true
        });

        this.routes.set('panel-usuario', {
            path: 'panel-usuario.html',
            roles: ['cliente', 'trabajador'],
            requiresAuth: true,
            sections: ['files', 'chat']
        });

        this.routes.set('mensajeria', {
            path: 'mensajeria.html',
            roles: ['jefe', 'admin'],
            requiresAuth: true
        });

        this.routes.set('gestion-archivos', {
            path: 'gestion-archivos.html',
            roles: ['jefe', 'admin'],
            requiresAuth: true
        });

        // FASE 2: Gestor Documental
        this.routes.set('documentos', {
            path: 'panel-jefe.html#documentos',
            roles: ['jefe', 'admin'],
            requiresAuth: true
        });

        // FASE 3: Canales de Comunicación
        this.routes.set('chat-gerencia-trabajadores', {
            path: 'chats/chat_gerencia_trabajadores.html',
            roles: ['jefe', 'admin', 'trabajador'],
            requiresAuth: true
        });

        this.routes.set('chat-cliente-gerencia', {
            path: 'chats/chat_cliente_gerencia.html',
            roles: ['jefe', 'admin', 'cliente'],
            requiresAuth: true
        });

        // FASE 4: UX Cliente
        this.routes.set('cliente-proyecto', {
            path: 'dashboard-cliente.html',
            roles: ['cliente'],
            requiresAuth: true
        });

        // FASE 5: UX Trabajador
        this.routes.set('trabajador-panel', {
            path: 'dashboard-trabajador.html',
            roles: ['trabajador'],
            requiresAuth: true
        });

        // FASE 6: Automatización Excel
        this.routes.set('excel-upload', {
            path: 'panel-jefe.html#excel-upload',
            roles: ['jefe', 'admin'],
            requiresAuth: true
        });
    }

    /**
     * Configurar navegación
     */
    setupNavigation() {
        // Interceptar clics en enlaces
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const routeName = link.dataset.route;
                this.navigate(routeName);
            }
        });

        // Manejar botones de navegación
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-route]');
            if (btn) {
                const routeName = btn.dataset.route;
                this.navigate(routeName);
            }
        });
    }

    /**
     * Manejar cambios de hash
     */
    handleHashChanges() {
        window.addEventListener('hashchange', () => {
            this.handleCurrentRoute();
        });

        // Manejar ruta inicial
        this.handleCurrentRoute();
    }

    /**
     * Manejar ruta actual
     */
    handleCurrentRoute() {
        const currentPage = window.location.pathname.split('/').pop();
        const hash = window.location.hash.substring(1);

        // Buscar ruta por path
        for (const [name, route] of this.routes.entries()) {
            if (route.path === currentPage || route.path.includes(currentPage)) {
                this.currentRoute = name;
                this.activateRoute(name, hash);
                return;
            }
        }

        // Si no se encuentra, verificar autenticación y redirigir
        this.redirectByRole();
    }

    /**
     * Navegar a una ruta
     */
    navigate(routeName, params = {}) {
        const route = this.routes.get(routeName);
        if (!route) {
            console.error(`Ruta no encontrada: ${routeName}`);
            return;
        }

        // Verificar autenticación
        if (route.requiresAuth) {
            if (typeof auth === 'undefined' || !auth.isAuthenticated()) {
                this.navigate('login');
                return;
            }

            // Verificar rol
            const user = auth.getCurrentUser();
            const userRole = user?.role || user?.rol;
            if (!route.roles.includes(userRole)) {
                console.warn(`Usuario sin permiso para ruta: ${routeName}`);
                this.redirectByRole();
                return;
            }
        }

        // Guardar en historial
        this.history.push({
            route: routeName,
            path: route.path,
            timestamp: Date.now()
        });

        // Navegar
        if (params.section) {
            window.location.href = `${route.path}#${params.section}`;
        } else {
            window.location.href = route.path;
        }

        // Log de auditoría
        if (typeof window.auditLogger !== 'undefined') {
            window.auditLogger.logAccess(routeName, 'NAVIGATE');
        }
    }

    /**
     * Activar ruta actual
     */
    activateRoute(routeName, hash = '') {
        const route = this.routes.get(routeName);
        if (!route) return;

        // Activar sección si hay hash
        if (hash && route.sections) {
            this.activateSection(hash);
        }

        // Marcar navegación activa
        this.updateNavigationActive(routeName, hash);

        // Disparar evento
        document.dispatchEvent(new CustomEvent('route:activated', {
            detail: { route: routeName, hash }
        }));
    }

    /**
     * Activar sección
     */
    activateSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección activa
        const section = document.getElementById(`section${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
        if (section) {
            section.classList.add('active');
        }

        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Actualizar navegación activa
     */
    updateNavigationActive(routeName, hash = '') {
        // Actualizar enlaces de navegación
        document.querySelectorAll('[data-route]').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.route === routeName) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Redirigir según rol
     */
    redirectByRole() {
        if (typeof auth === 'undefined' || !auth.isAuthenticated()) {
            this.navigate('login');
            return;
        }

        const user = auth.getCurrentUser();
        const role = user?.role || user?.rol;

        switch (role) {
            case 'jefe':
            case 'admin':
                this.navigate('dashboard-jefe');
                break;
            case 'cliente':
                this.navigate('dashboard-cliente');
                break;
            case 'trabajador':
                this.navigate('dashboard-trabajador');
                break;
            default:
                this.navigate('login');
        }
    }

    /**
     * Obtener ruta actual
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Obtener historial
     */
    getHistory() {
        return this.history;
    }

    /**
     * Navegar atrás
     */
    goBack() {
        if (this.history.length > 1) {
            this.history.pop(); // Remover actual
            const previous = this.history[this.history.length - 1];
            if (previous) {
                this.navigate(previous.route);
            }
        } else {
            this.redirectByRole();
        }
    }

    /**
     * Obtener rutas disponibles para rol actual
     */
    getAvailableRoutes() {
        if (typeof auth === 'undefined' || !auth.isAuthenticated()) {
            return [this.routes.get('login')];
        }

        const user = auth.getCurrentUser();
        const role = user?.role || user?.rol;

        return Array.from(this.routes.values()).filter(route => {
            if (!route.requiresAuth) return true;
            return route.roles.includes(role);
        });
    }

    /**
     * Crear menú de navegación
     */
    createNavigationMenu(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const routes = this.getAvailableRoutes();
        const currentPage = window.location.pathname.split('/').pop();

        container.innerHTML = routes.map(route => {
            const isActive = currentPage === route.path.split('#')[0];
            return `
                <a href="${route.path}" 
                   data-route="${this.getRouteNameByPath(route.path)}"
                   class="nav-link ${isActive ? 'active' : ''}">
                    <i class="fas ${this.getRouteIcon(route.path)}"></i>
                    <span>${this.getRouteLabel(route.path)}</span>
                </a>
            `;
        }).join('');
    }

    /**
     * Obtener nombre de ruta por path
     */
    getRouteNameByPath(path) {
        for (const [name, route] of this.routes.entries()) {
            if (route.path === path || route.path.includes(path.split('#')[0])) {
                return name;
            }
        }
        return null;
    }

    /**
     * Obtener icono de ruta
     */
    getRouteIcon(path) {
        const icons = {
            'index.html': 'fa-sign-in-alt',
            'panel-jefe.html': 'fa-tachometer-alt',
            'dashboard-cliente.html': 'fa-home',
            'dashboard-trabajador.html': 'fa-hard-hat',
            'panel-usuario.html': 'fa-user',
            'mensajeria.html': 'fa-comments',
            'gestion-archivos.html': 'fa-folder-open'
        };

        const key = Object.keys(icons).find(k => path.includes(k));
        return icons[key] || 'fa-circle';
    }

    /**
     * Obtener etiqueta de ruta
     */
    getRouteLabel(path) {
        const labels = {
            'index.html': 'Login',
            'panel-jefe.html': 'Dashboard',
            'dashboard-cliente.html': 'Mi Dashboard',
            'dashboard-trabajador.html': 'Mi Panel',
            'panel-usuario.html': 'Mi Proyecto',
            'mensajeria.html': 'Mensajería',
            'gestion-archivos.html': 'Archivos'
        };

        const key = Object.keys(labels).find(k => path.includes(k));
        return labels[key] || 'Página';
    }
}

// Inicializar router
if (typeof window !== 'undefined') {
    window.router = new Router();
}

