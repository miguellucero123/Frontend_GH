/**
 * ============================================================================
 * GESTOR DE ACCESIBILIDAD (a11y) - MEJORA FASE 1
 * ============================================================================
 * Mejoras de accesibilidad para WCAG 2.1 AA
 * Versión: 1.0.0
 * ============================================================================
 */

class AccessibilityManager {
    constructor() {
        this.settings = {
            highContrast: false,
            fontSize: 'normal',
            reduceMotion: false,
            screenReader: false
        };
        this.init();
    }

    /**
     * Inicializar gestor de accesibilidad
     */
    init() {
        this.loadSettings();
        this.createAccessibilityPanel();
        this.setupKeyboardNavigation();
        this.addARIALabels();
        this.setupFocusManagement();
        this.detectScreenReader();
    }

    /**
     * Cargar configuración
     */
    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }

    /**
     * Aplicar configuración
     */
    applySettings() {
        const root = document.documentElement;

        // Alto contraste
        if (this.settings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Tamaño de fuente
        root.style.fontSize = this.settings.fontSize === 'large' ? '1.2rem' :
                              this.settings.fontSize === 'xlarge' ? '1.4rem' :
                              '1rem';

        // Reducir movimiento
        if (this.settings.reduceMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }
    }

    /**
     * Crear panel de accesibilidad
     */
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessibilityPanel';
        panel.className = 'fixed bottom-4 left-4 z-50';
        panel.innerHTML = `
            <button id="btnAccessibility" 
                class="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all flex items-center justify-center"
                aria-label="Configuración de Accesibilidad"
                title="Accesibilidad">
                <i class="fas fa-universal-access"></i>
            </button>
        `;

        document.body.appendChild(panel);

        // Modal de configuración
        const modal = document.createElement('div');
        modal.id = 'accessibilityModal';
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="accessibilityManager.closeModal()"></div>
            <div class="fixed bottom-4 left-4 glass-effect rounded-xl p-6 border border-white/10 shadow-2xl min-w-[300px]">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="fas fa-universal-access text-blue-400"></i>
                        Accesibilidad
                    </h3>
                    <button onclick="accessibilityManager.closeModal()" 
                        class="text-slate-400 hover:text-white"
                        aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="flex items-center justify-between cursor-pointer">
                            <span class="text-white">Alto Contraste</span>
                            <input type="checkbox" 
                                id="toggleHighContrast"
                                ${this.settings.highContrast ? 'checked' : ''}
                                onchange="accessibilityManager.toggleHighContrast()"
                                class="w-12 h-6 rounded-full bg-slate-700 appearance-none relative cursor-pointer transition-colors">
                        </label>
                    </div>

                    <div>
                        <label class="text-white mb-2 block">Tamaño de Fuente</label>
                        <select id="fontSizeSelect" 
                            onchange="accessibilityManager.changeFontSize(this.value)"
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                            <option value="normal" ${this.settings.fontSize === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="large" ${this.settings.fontSize === 'large' ? 'selected' : ''}>Grande</option>
                            <option value="xlarge" ${this.settings.fontSize === 'xlarge' ? 'selected' : ''}>Muy Grande</option>
                        </select>
                    </div>

                    <div>
                        <label class="flex items-center justify-between cursor-pointer">
                            <span class="text-white">Reducir Animaciones</span>
                            <input type="checkbox" 
                                id="toggleReduceMotion"
                                ${this.settings.reduceMotion ? 'checked' : ''}
                                onchange="accessibilityManager.toggleReduceMotion()"
                                class="w-12 h-6 rounded-full bg-slate-700 appearance-none relative cursor-pointer transition-colors">
                        </label>
                    </div>

                    <div class="pt-4 border-t border-slate-700">
                        <p class="text-xs text-slate-400 mb-2">Atajos de Teclado:</p>
                        <ul class="space-y-1 text-xs text-slate-300">
                            <li><kbd class="px-1 py-0.5 bg-slate-700 rounded">Tab</kbd> Navegar elementos</li>
                            <li><kbd class="px-1 py-0.5 bg-slate-700 rounded">Enter</kbd> Activar</li>
                            <li><kbd class="px-1 py-0.5 bg-slate-700 rounded">Esc</kbd> Cerrar</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listener
        document.getElementById('btnAccessibility')?.addEventListener('click', () => {
            this.openModal();
        });
    }

    /**
     * Abrir modal
     */
    openModal() {
        const modal = document.getElementById('accessibilityModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        const modal = document.getElementById('accessibilityModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Toggle alto contraste
     */
    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        this.applySettings();
        this.saveSettings();
    }

    /**
     * Cambiar tamaño de fuente
     */
    changeFontSize(size) {
        this.settings.fontSize = size;
        this.applySettings();
        this.saveSettings();
    }

    /**
     * Toggle reducir movimiento
     */
    toggleReduceMotion() {
        this.settings.reduceMotion = !this.settings.reduceMotion;
        this.applySettings();
        this.saveSettings();
    }

    /**
     * Guardar configuración
     */
    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }

    /**
     * Configurar navegación por teclado
     */
    setupKeyboardNavigation() {
        // Asegurar que todos los elementos interactivos sean accesibles
        document.addEventListener('keydown', (e) => {
            // Skip links
            if (e.key === 'Tab' && !e.shiftKey) {
                this.ensureVisibleFocus();
            }
        });

        // Agregar skip links
        this.addSkipLinks();
    }

    /**
     * Agregar skip links
     */
    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#mainContent" class="skip-link">Saltar al contenido principal</a>
            <a href="#navigation" class="skip-link">Saltar a navegación</a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    /**
     * Asegurar que el foco sea visible
     */
    ensureVisibleFocus() {
        const focused = document.activeElement;
        if (focused && focused.scrollIntoView) {
            focused.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    /**
     * Agregar etiquetas ARIA
     */
    addARIALabels() {
        // Agregar aria-labels a botones sin texto
        document.querySelectorAll('button:not([aria-label]):not([title])').forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                let label = 'Botón';
                
                if (iconClass.includes('fa-search')) label = 'Buscar';
                else if (iconClass.includes('fa-plus')) label = 'Agregar';
                else if (iconClass.includes('fa-edit')) label = 'Editar';
                else if (iconClass.includes('fa-times')) label = 'Cerrar';
                else if (iconClass.includes('fa-download')) label = 'Descargar';
                
                btn.setAttribute('aria-label', label);
            }
        });

        // Agregar roles
        document.querySelectorAll('[role]').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
                const role = el.getAttribute('role');
                el.setAttribute('aria-label', `${role} sin etiqueta`);
            }
        });
    }

    /**
     * Configurar gestión de foco
     */
    setupFocusManagement() {
        // Trap focus en modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal:not(.hidden), [id$="Modal"]:not(.hidden)');
                if (modal) {
                    this.trapFocus(modal, e);
                }
            }
        });
    }

    /**
     * Trap focus en modal
     */
    trapFocus(modal, e) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Detectar screen reader
     */
    detectScreenReader() {
        // Detectar si hay un screen reader activo
        const hasScreenReader = window.speechSynthesis !== undefined;
        if (hasScreenReader) {
            this.settings.screenReader = true;
            document.documentElement.setAttribute('data-screen-reader', 'true');
        }
    }

    /**
     * Anunciar cambios a screen readers
     */
    announce(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
}

// Inicializar gestor de accesibilidad
if (typeof window !== 'undefined') {
    window.accessibilityManager = new AccessibilityManager();
}

