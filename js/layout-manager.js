/**
 * ============================================================
 * LAYOUT MANAGER - Diseño React para HTML/JS
 * ============================================================
 * 
 * Gestiona el layout común con sidebar oscuro y header moderno
 * similar al diseño de React
 */

class LayoutManager {
    constructor() {
        this.isSidebarOpen = true;
        this.currentUser = null;
        this.unreadMessageCount = 0;
        this.showNotifications = false;
    }

    /**
     * Inicializar el layout
     */
    init(userRole = null) {
        // Obtener usuario actual
        if (typeof auth !== 'undefined' && auth.getCurrentUser) {
            this.currentUser = auth.getCurrentUser();
        }

        // Si no se proporciona rol, obtenerlo del usuario
        if (!userRole && this.currentUser) {
            userRole = this.currentUser.role || this.currentUser.rol;
        }

        // Crear estructura del layout
        this.createLayoutStructure(userRole);
        
        // Event listeners
        this.setupEventListeners();
    }

    /**
     * Crear estructura del layout
     */
    createLayoutStructure(userRole = null) {
        const body = document.body;
        
        // Verificar si ya tiene el layout
        if (body.querySelector('#layoutContainer')) {
            return;
        }

        // Si no se proporciona rol, obtenerlo del usuario
        if (!userRole && this.currentUser) {
            userRole = this.currentUser.role || this.currentUser.rol || 'cliente';
        } else if (!userRole) {
            userRole = 'cliente';
        }

        // Crear contenedor principal
        const layoutContainer = document.createElement('div');
        layoutContainer.className = 'flex h-screen bg-slate-50 overflow-hidden';
        layoutContainer.id = 'layoutContainer';

        // Crear sidebar
        const sidebar = this.createSidebar(userRole);
        
        // Crear content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'flex-1 flex flex-col min-w-0 overflow-hidden relative';
        contentWrapper.id = 'mainContentWrapper';

        // Crear header
        const header = this.createHeader(userRole);

        // Crear main content
        const mainContent = document.createElement('main');
        mainContent.className = 'flex-1 overflow-auto p-6 scroll-smooth';
        mainContent.id = 'mainContent';

        // Ensamblar layout
        layoutContainer.appendChild(sidebar);
        layoutContainer.appendChild(contentWrapper);
        contentWrapper.appendChild(header);
        contentWrapper.appendChild(mainContent);

        // NO mover contenido automáticamente - se moverá desde los scripts específicos
        // Esto evita mover elementos que no deberían moverse
        
        body.appendChild(layoutContainer);
        
        // Asegurar que el body tenga el estilo correcto
        body.style.margin = '0';
        body.style.padding = '0';
        body.style.overflow = 'hidden';
    }

    /**
     * Crear sidebar
     */
    createSidebar(userRole = null) {
        const sidebar = document.createElement('aside');
        sidebar.className = `bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col z-20 ${this.isSidebarOpen ? 'w-64' : 'w-20'}`;
        sidebar.id = 'layoutSidebar';

        if (!userRole) {
            userRole = this.currentUser?.role || this.currentUser?.rol || 'cliente';
        }
        
        // Header del sidebar
        const sidebarHeader = document.createElement('div');
        sidebarHeader.className = 'h-16 flex items-center px-4 border-b border-slate-800';
        sidebarHeader.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <img src="assets/logo.jpg" alt="Logo" class="w-8 h-8 rounded-lg object-cover shrink-0">
                ${this.isSidebarOpen ? '<span class="font-bold text-lg truncate animate-fade-in">G y H Construcciones SPA</span>' : ''}
            </div>
        `;

        // Navegación
        const nav = document.createElement('nav');
        nav.className = 'flex-1 py-6 px-3 flex flex-col gap-2';
        nav.id = 'sidebarNav';

        // Items de navegación según rol
        const navItems = this.getNavItems(userRole);
        navItems.forEach((item, index) => {
            const navItem = document.createElement('a');
            navItem.href = item.href || '#';
            const isActive = index === 0; // Primera sección activa por defecto
            navItem.className = `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;
            navItem.dataset.section = item.section;
            
            const badgeHtml = item.badge && item.badge > 0 
                ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">${item.badge > 99 ? '99+' : item.badge}</span>`
                : '';
            
            navItem.innerHTML = `
                <div class="relative">
                    <i class="${item.icon} w-5 h-5 shrink-0"></i>
                    ${badgeHtml}
                </div>
                ${this.isSidebarOpen ? `<span class="truncate font-medium animate-fade-in flex-1">${item.label}</span>` : ''}
            `;

            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.section) {
                    this.handleNavClick(item.section);
                }
            });

            nav.appendChild(navItem);
        });

        // Footer del sidebar (logout)
        const sidebarFooter = document.createElement('div');
        sidebarFooter.className = 'p-4 border-t border-slate-800';
        sidebarFooter.innerHTML = `
            <button id="btnSidebarLogout" class="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2">
                <i class="fas fa-sign-out-alt w-5 h-5 shrink-0"></i>
                ${this.isSidebarOpen ? '<span class="truncate">Cerrar Sesión</span>' : ''}
            </button>
        `;

        sidebar.appendChild(sidebarHeader);
        sidebar.appendChild(nav);
        sidebar.appendChild(sidebarFooter);

        return sidebar;
    }

    /**
     * Obtener items de navegación según rol
     */
    getNavItems(role) {
        const allItems = [
            { icon: 'fas fa-tachometer-alt', label: 'Dashboard', section: 'dashboard', href: null, roles: ['jefe', 'trabajador', 'cliente'] },
            { icon: 'fas fa-folder', label: 'Proyectos', section: 'proyectos', href: null, roles: ['jefe', 'trabajador', 'cliente'] },
            { icon: 'fas fa-users', label: 'Usuarios', section: 'usuarios', href: null, roles: ['jefe'] },
            { icon: 'fas fa-comments', label: 'Mensajes', section: 'mensajes', href: null, roles: ['jefe', 'trabajador', 'cliente'], badge: this.unreadMessageCount > 0 ? this.unreadMessageCount : null },
            { icon: 'fas fa-cog', label: 'Configuración', section: 'settings', href: null, roles: ['jefe', 'trabajador'] },
        ];

        return allItems.filter(item => item.roles.includes(role));
    }

    /**
     * Crear header
     */
    createHeader(userRole = null) {
        const header = document.createElement('header');
        header.className = 'h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0';
        header.id = 'mainHeader';

        if (!userRole) {
            userRole = this.currentUser?.role || this.currentUser?.rol || 'cliente';
        }
        const userName = this.currentUser?.name || this.currentUser?.nombre || 'Usuario';
        const roleLabel = this.getRoleLabel(userRole);

        header.innerHTML = `
            <button id="btnToggleSidebar" class="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <i class="fas fa-bars w-5 h-5"></i>
            </button>

            <div class="flex items-center gap-4">
                <div class="relative">
                    <button id="btnNotifications" class="p-2 relative hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <i class="fas fa-bell w-5 h-5"></i>
                        ${this.unreadMessageCount > 0 ? `<span class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">${this.unreadMessageCount > 99 ? '99+' : this.unreadMessageCount}</span>` : ''}
                    </button>
                </div>
                <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-semibold text-slate-900 truncate max-w-[150px]">${userName}</p>
                        <p class="text-xs text-slate-500">${roleLabel}</p>
                    </div>
                    <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-bold ${this.getRoleGradient(userRole)}">
                        ${userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        `;

        return header;
    }

    /**
     * Obtener etiqueta del rol
     */
    getRoleLabel(role) {
        const labels = {
            'jefe': 'Jefe de Obra',
            'trabajador': 'Trabajador',
            'cliente': 'Cliente'
        };
        return labels[role] || role;
    }

    /**
     * Obtener gradiente según rol
     */
    getRoleGradient(role) {
        const gradients = {
            'jefe': 'bg-gradient-to-br from-blue-600 to-indigo-600',
            'trabajador': 'bg-gradient-to-br from-emerald-600 to-teal-600',
            'cliente': 'bg-gradient-to-br from-purple-600 to-pink-600'
        };
        return gradients[role] || 'bg-gradient-to-br from-slate-600 to-slate-700';
    }


    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Toggle sidebar
        const btnToggleSidebar = document.getElementById('btnToggleSidebar');
        if (btnToggleSidebar) {
            btnToggleSidebar.addEventListener('click', () => this.toggleSidebar());
        }

        // Logout
        const btnSidebarLogout = document.getElementById('btnSidebarLogout');
        if (btnSidebarLogout) {
            btnSidebarLogout.addEventListener('click', () => {
                if (typeof auth !== 'undefined' && auth.logout) {
                    auth.logout();
                }
                window.location.href = 'index.html';
            });
        }

        // Notificaciones
        const btnNotifications = document.getElementById('btnNotifications');
        if (btnNotifications) {
            btnNotifications.addEventListener('click', () => this.toggleNotifications());
        }
    }

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        const sidebar = document.getElementById('layoutSidebar');
        if (sidebar) {
            sidebar.className = `bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col z-20 ${this.isSidebarOpen ? 'w-64' : 'w-20'}`;
            
            // Actualizar texto del logo
            const logoText = sidebar.querySelector('.font-bold');
            if (logoText) {
                logoText.style.display = this.isSidebarOpen ? 'inline' : 'none';
            }

            // Actualizar textos de navegación
            const navItems = sidebar.querySelectorAll('#sidebarNav a');
            navItems.forEach(navItem => {
                const textSpan = navItem.querySelector('.truncate');
                if (textSpan) {
                    textSpan.style.display = this.isSidebarOpen ? 'inline' : 'none';
                }
            });

            // Actualizar texto de logout
            const logoutText = sidebar.querySelector('#btnSidebarLogout .truncate');
            if (logoutText) {
                logoutText.style.display = this.isSidebarOpen ? 'inline' : 'none';
            }
        }
    }

    /**
     * Toggle notificaciones
     */
    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
        // Implementar panel de notificaciones si es necesario
        console.log('Toggle notifications:', this.showNotifications);
    }

    /**
     * Manejar click en navegación
     */
    handleNavClick(section) {
        // Implementar lógica de navegación según la página
        console.log('Navigate to section:', section);
        
        // Si hay un sistema de secciones, activarlo
        if (typeof window.showSection === 'function') {
            window.showSection(section);
        }
    }

    /**
     * Actualizar badge de mensajes
     */
    updateMessageBadge(count) {
        this.unreadMessageCount = count;
        const badge = document.querySelector('#sidebarNav .animate-pulse');
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        const headerBadge = document.querySelector('#btnNotifications .absolute');
        if (headerBadge) {
            if (count > 0) {
                headerBadge.textContent = count > 99 ? '99+' : count;
                headerBadge.style.display = 'flex';
            } else {
                headerBadge.style.display = 'none';
            }
        }
    }
}

// Exportar para uso global
window.LayoutManager = LayoutManager;
window.layoutManager = new LayoutManager();

