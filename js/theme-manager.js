/**
 * ============================================================================
 * GESTOR DE TEMAS - MEJORA FASE 1
 * ============================================================================
 * Sistema de temas personalizables
 * Versión: 1.0.0
 * ============================================================================
 */

class ThemeManager {
    constructor() {
        this.themes = {
            dark: {
                name: 'Oscuro',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#0f172a',
                    accent: '#1e293b'
                }
            },
            light: {
                name: 'Claro',
                colors: {
                    primary: '#2563eb',
                    secondary: '#ffffff',
                    accent: '#f8fafc'
                }
            },
            blue: {
                name: 'Azul',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#1e3a8a',
                    accent: '#1e40af'
                }
            },
            purple: {
                name: 'Púrpura',
                colors: {
                    primary: '#8b5cf6',
                    secondary: '#4c1d95',
                    accent: '#6d28d9'
                }
            }
        };
        this.currentTheme = 'dark';
        this.init();
    }

    /**
     * Inicializar gestor de temas
     */
    init() {
        this.loadTheme();
        this.createThemeSelector();
        this.applyTheme(this.currentTheme);
    }

    /**
     * Cargar tema guardado
     */
    loadTheme() {
        const saved = localStorage.getItem('selectedTheme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    /**
     * Crear selector de temas
     */
    createThemeSelector() {
        const header = document.querySelector('header');
        if (!header) return;

        const themeBtn = document.createElement('button');
        themeBtn.id = 'btnThemeSelector';
        themeBtn.className = 'px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all';
        themeBtn.innerHTML = '<i class="fas fa-palette"></i>';
        themeBtn.title = 'Cambiar Tema';
        themeBtn.addEventListener('click', () => this.showThemeSelector());

        // Insertar en header
        const searchBtn = document.getElementById('btnGlobalSearch');
        if (searchBtn) {
            searchBtn.parentNode.insertBefore(themeBtn, searchBtn);
        }
    }

    /**
     * Mostrar selector de temas
     */
    showThemeSelector() {
        if (document.getElementById('themeSelectorModal')) {
            const modal = document.getElementById('themeSelectorModal');
            modal.classList.remove('hidden');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'themeSelectorModal';
        modal.className = 'fixed inset-0 z-50';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="themeManager.closeThemeSelector()"></div>
            <div class="fixed top-20 right-4 glass-effect rounded-xl p-4 border border-white/10 shadow-2xl min-w-[200px]">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="fas fa-palette text-purple-400"></i>
                        Temas
                    </h3>
                    <button onclick="themeManager.closeThemeSelector()" 
                        class="text-slate-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <button onclick="themeManager.applyTheme('${key}')" 
                            class="w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                                this.currentTheme === key 
                                    ? 'bg-blue-600/20 border border-blue-500/50' 
                                    : 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700'
                            }">
                            <div class="flex items-center gap-3">
                                <div class="w-4 h-4 rounded-full" style="background-color: ${theme.colors.primary}"></div>
                                <span class="text-white font-medium">${theme.name}</span>
                            </div>
                            ${this.currentTheme === key ? '<i class="fas fa-check text-blue-400"></i>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Cerrar selector de temas
     */
    closeThemeSelector() {
        const modal = document.getElementById('themeSelectorModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Aplicar tema
     */
    applyTheme(themeKey) {
        if (!this.themes[themeKey]) return;

        this.currentTheme = themeKey;
        const theme = this.themes[themeKey];

        // Aplicar colores CSS variables
        document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
        document.documentElement.style.setProperty('--theme-secondary', theme.colors.secondary);
        document.documentElement.style.setProperty('--theme-accent', theme.colors.accent);

        // Guardar preferencia
        localStorage.setItem('selectedTheme', themeKey);

        // Cerrar selector
        this.closeThemeSelector();

        // Notificar
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: 'Tema Cambiado',
                message: `Tema "${theme.name}" aplicado correctamente`
            });
        }

        // Actualizar selector
        this.updateThemeSelector();
    }

    /**
     * Actualizar selector
     */
    updateThemeSelector() {
        const modal = document.getElementById('themeSelectorModal');
        if (modal) {
            modal.remove();
            this.showThemeSelector();
        }
    }
}

// Inicializar gestor de temas
if (typeof window !== 'undefined') {
    window.themeManager = new ThemeManager();
}

