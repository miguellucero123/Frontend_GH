/**
 * Sistema de Dark Mode
 * Tema oscuro profesional
 */

class DarkMode {
    constructor() {
        this.isDark = false;
        this.init();
    }

    init() {
        // NO aplicar dark mode en la página de login
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            document.body.classList.contains('login-page') ||
            document.querySelector('#loginForm')) {
            console.log('[DarkMode] Deshabilitado en página de login');
            return;
        }
        
        // Cargar preferencia guardada
        this.loadPreference();
        
        // Aplicar tema
        this.applyTheme();
        
        // Crear toggle button
        this.createToggle();
        
        // Escuchar cambios del sistema
        this.watchSystemPreference();
    }

    /**
     * Cargar preferencia guardada
     */
    loadPreference() {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            this.isDark = saved === 'true';
        } else {
            // Usar preferencia del sistema
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    /**
     * Aplicar tema
     */
    applyTheme() {
        if (this.isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
        }
    }

    /**
     * Toggle dark mode
     */
    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('darkMode', this.isDark.toString());
        this.applyTheme();
        this.updateToggleButton();
    }

    /**
     * Crear botón toggle
     */
    createToggle() {
        // Buscar si ya existe un contenedor para el toggle
        const header = document.querySelector('.panel-header, .header-right, .admin-menu');
        
        if (header) {
            const toggle = document.createElement('button');
            toggle.className = 'btn-icon dark-mode-toggle';
            toggle.id = 'darkModeToggle';
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            toggle.title = 'Cambiar tema';
            toggle.addEventListener('click', () => this.toggle());
            
            // Insertar al inicio del header-right o admin-menu
            if (header.querySelector('.header-right')) {
                header.querySelector('.header-right').prepend(toggle);
            } else if (header.classList.contains('admin-menu')) {
                header.prepend(toggle);
            } else {
                header.appendChild(toggle);
            }
            
            this.updateToggleButton();
        }
    }

    /**
     * Actualizar icono del botón
     */
    updateToggleButton() {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            toggle.title = this.isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
        }
    }

    /**
     * Escuchar cambios del sistema
     */
    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Solo aplicar si no hay preferencia guardada
            if (localStorage.getItem('darkMode') === null) {
                this.isDark = e.matches;
                this.applyTheme();
            }
        });
    }
}

// Instancia global
const darkMode = new DarkMode();

