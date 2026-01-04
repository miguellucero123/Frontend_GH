/**
 * ============================================================================
 * ATAJOS DE TECLADO - MEJORA FASE 1
 * ============================================================================
 * Atajos de teclado para navegación rápida
 * Versión: 1.0.0
 * ============================================================================
 */

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    /**
     * Inicializar atajos
     */
    init() {
        this.registerShortcuts();
        this.createHelpModal();
        this.setupEventListeners();
    }

    /**
     * Registrar atajos
     */
    registerShortcuts() {
        // Navegación
        this.register('g d', () => this.navigateToSection('dashboard'), 'Ir a Dashboard');
        this.register('g p', () => this.navigateToSection('proyectos'), 'Ir a Proyectos');
        this.register('g u', () => this.navigateToSection('usuarios'), 'Ir a Usuarios');
        this.register('g m', () => this.navigateToSection('mensajeria'), 'Ir a Mensajería');
        this.register('g c', () => this.navigateToSection('configuracion'), 'Ir a Configuración');

        // Acciones
        this.register('n', () => this.createNewProject(), 'Nuevo Proyecto', { requireCtrl: false });
        this.register('?', () => this.showHelp(), 'Mostrar Ayuda', { requireCtrl: false });
        this.register('esc', () => this.closeModals(), 'Cerrar Modales', { requireCtrl: false });

        // Búsqueda
        this.register('k', () => {
            if (typeof window.globalSearch !== 'undefined') {
                window.globalSearch.open();
            }
        }, 'Búsqueda Global', { requireCtrl: true });

        // Exportación
        this.register('e p', () => this.exportPDF(), 'Exportar PDF');
        this.register('e x', () => this.exportExcel(), 'Exportar Excel');

        // Notificaciones
        this.register('n h', () => {
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.showHistory();
            }
        }, 'Historial de Notificaciones');
    }

    /**
     * Registrar un atajo
     */
    register(keys, action, description, options = {}) {
        const keySequence = keys.split(' ').map(k => k.toLowerCase());
        const id = keySequence.join('_');
        
        this.shortcuts.set(id, {
            keys: keySequence,
            action,
            description,
            requireCtrl: options.requireCtrl !== false
        });
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        let pressedKeys = [];
        let lastKeyTime = Date.now();

        document.addEventListener('keydown', (e) => {
            // Ignorar si está escribiendo en un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (e.key === 'Escape') {
                    this.closeModals();
                }
                return;
            }

            const now = Date.now();
            if (now - lastKeyTime > 1000) {
                pressedKeys = [];
            }
            lastKeyTime = now;

            const key = e.key.toLowerCase();
            const ctrlPressed = e.ctrlKey || e.metaKey;

            // Agregar tecla presionada
            if (key === 'escape') {
                pressedKeys = ['esc'];
            } else if (key === '?') {
                pressedKeys = ['?'];
            } else if (!ctrlPressed && key.length === 1) {
                pressedKeys.push(key);
            } else if (ctrlPressed && key === 'k') {
                pressedKeys = ['ctrl+k'];
            }

            // Limitar a 2 teclas
            if (pressedKeys.length > 2) {
                pressedKeys = pressedKeys.slice(-2);
            }

            // Buscar coincidencia
            this.shortcuts.forEach((shortcut, id) => {
                const sequence = shortcut.keys;
                const requireCtrl = shortcut.requireCtrl;

                // Verificar si requiere Ctrl
                if (requireCtrl && !ctrlPressed && key !== 'escape' && key !== '?') {
                    return;
                }

                // Verificar secuencia
                if (sequence.length === 1) {
                    if (pressedKeys.length === 1 && pressedKeys[0] === sequence[0]) {
                        if (requireCtrl && !ctrlPressed) return;
                        e.preventDefault();
                        shortcut.action();
                        pressedKeys = [];
                    }
                } else if (sequence.length === 2) {
                    if (pressedKeys.length === 2 && 
                        pressedKeys[0] === sequence[0] && 
                        pressedKeys[1] === sequence[1]) {
                        e.preventDefault();
                        shortcut.action();
                        pressedKeys = [];
                    }
                }
            });
        });
    }

    /**
     * Navegar a sección
     */
    navigateToSection(section) {
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.click();
            
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.add({
                    type: 'info',
                    priority: 'low',
                    title: 'Navegación Rápida',
                    message: `Navegaste a ${section}`
                });
            }
        }
    }

    /**
     * Crear nuevo proyecto
     */
    createNewProject() {
        if (typeof window.multiProjectManager !== 'undefined') {
            window.multiProjectManager.showAddProjectModal();
        } else {
            const btn = document.getElementById('btnNewProject');
            if (btn) btn.click();
        }
    }

    /**
     * Cerrar modales
     */
    closeModals() {
        // Cerrar todos los modales abiertos
        const modals = document.querySelectorAll('[id$="Modal"]:not(.hidden)');
        modals.forEach(modal => {
            if (modal.id === 'globalSearchModal' && typeof window.globalSearch !== 'undefined') {
                window.globalSearch.close();
            } else if (modal.id === 'notificationHistoryModal' && typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.closeHistory();
            } else if (modal.id === 'kpiDetailsModal' && typeof window.kpiDetailsModal !== 'undefined') {
                window.kpiDetailsModal.close();
            } else if (modal.id === 'compareProjectsModal' && typeof window.multiProjectManager !== 'undefined') {
                window.multiProjectManager.closeCompareModal();
            } else {
                modal.classList.add('hidden');
            }
        });
    }

    /**
     * Exportar PDF
     */
    exportPDF() {
        if (typeof window.exportManager !== 'undefined') {
            window.exportManager.exportToPDF();
        } else {
            const btn = document.getElementById('btnExportPDF');
            if (btn) btn.click();
        }
    }

    /**
     * Exportar Excel
     */
    exportExcel() {
        if (typeof window.exportManager !== 'undefined') {
            window.exportManager.exportToExcel();
        } else {
            const btn = document.getElementById('btnExportExcel');
            if (btn) btn.click();
        }
    }

    /**
     * Mostrar ayuda
     */
    showHelp() {
        this.createHelpModal();
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Crear modal de ayuda
     */
    createHelpModal() {
        if (document.getElementById('keyboardShortcutsModal')) return;

        const modal = document.createElement('div');
        modal.id = 'keyboardShortcutsModal';
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="keyboardShortcuts.closeHelp()"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="glass-effect rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                            <i class="fas fa-keyboard text-blue-400"></i>
                            Atajos de Teclado
                        </h2>
                        <button onclick="keyboardShortcuts.closeHelp()" 
                            class="text-slate-400 hover:text-white transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <i class="fas fa-compass text-blue-400"></i>
                                Navegación
                            </h3>
                            <div class="space-y-2">
                                ${this.getShortcutsByCategory('navegacion').map(s => `
                                    <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                        <span class="text-slate-300">${s.description}</span>
                                        <div class="flex items-center gap-1">
                                            ${s.keys.map((k, i) => `
                                                ${i > 0 ? '<span class="text-slate-500 mx-1">+</span>' : ''}
                                                <kbd class="px-2 py-1 bg-slate-700 rounded text-sm font-mono text-white">
                                                    ${k === 'g' ? 'G' : k === 'd' ? 'D' : k === 'p' ? 'P' : k === 'u' ? 'U' : k === 'm' ? 'M' : k === 'c' ? 'C' : k.toUpperCase()}
                                                </kbd>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <i class="fas fa-bolt text-amber-400"></i>
                                Acciones Rápidas
                            </h3>
                            <div class="space-y-2">
                                ${this.getShortcutsByCategory('acciones').map(s => `
                                    <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                        <span class="text-slate-300">${s.description}</span>
                                        <div class="flex items-center gap-1">
                                            ${s.keys.map((k, i) => `
                                                ${i > 0 ? '<span class="text-slate-500 mx-1">+</span>' : ''}
                                                <kbd class="px-2 py-1 bg-slate-700 rounded text-sm font-mono text-white">
                                                    ${k === 'ctrl' ? 'Ctrl' : k === 'k' ? 'K' : k === 'n' ? 'N' : k === 'esc' ? 'Esc' : k === '?' ? '?' : k.toUpperCase()}
                                                </kbd>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <i class="fas fa-file-export text-emerald-400"></i>
                                Exportación
                            </h3>
                            <div class="space-y-2">
                                ${this.getShortcutsByCategory('exportacion').map(s => `
                                    <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                        <span class="text-slate-300">${s.description}</span>
                                        <div class="flex items-center gap-1">
                                            ${s.keys.map((k, i) => `
                                                ${i > 0 ? '<span class="text-slate-500 mx-1">+</span>' : ''}
                                                <kbd class="px-2 py-1 bg-slate-700 rounded text-sm font-mono text-white">
                                                    ${k === 'e' ? 'E' : k === 'p' ? 'P' : k === 'x' ? 'X' : k.toUpperCase()}
                                                </kbd>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button onclick="keyboardShortcuts.closeHelp()" 
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
     * Obtener atajos por categoría
     */
    getShortcutsByCategory(category) {
        const categories = {
            navegacion: ['g d', 'g p', 'g u', 'g m', 'g c'],
            acciones: ['k', 'n', '?', 'esc', 'n h'],
            exportacion: ['e p', 'e x']
        };

        const keys = categories[category] || [];
        return Array.from(this.shortcuts.values()).filter(s => 
            keys.includes(s.keys.join(' '))
        );
    }

    /**
     * Cerrar ayuda
     */
    closeHelp() {
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}

// Inicializar atajos de teclado
if (typeof window !== 'undefined') {
    window.keyboardShortcuts = new KeyboardShortcuts();
}
