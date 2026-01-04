/**
 * ============================================================================
 * GESTOR DE TOOLTIPS - MEJORA FASE 1
 * ============================================================================
 * Tooltips informativos y contextuales
 * Versión: 1.0.0
 * ============================================================================
 */

class TooltipManager {
    constructor() {
        this.tooltips = new Map();
        this.init();
    }

    /**
     * Inicializar gestor de tooltips
     */
    init() {
        this.setupTooltips();
        this.createTooltipElement();
    }

    /**
     * Crear elemento de tooltip
     */
    createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.id = 'globalTooltip';
        tooltip.className = 'fixed z-50 glass-effect rounded-lg px-3 py-2 text-sm text-white pointer-events-none opacity-0 transition-opacity';
        tooltip.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltip);
    }

    /**
     * Configurar tooltips
     */
    setupTooltips() {
        // Tooltips automáticos para elementos con title
        document.addEventListener('mouseenter', (e) => {
            const target = e.target;
            // Verificar que target sea un elemento válido
            if (!target || typeof target.getAttribute !== 'function') return;
            
            const title = target.getAttribute('title');
            
            if (title && typeof target.hasAttribute === 'function' && !target.hasAttribute('data-tooltip-custom')) {
                e.preventDefault();
                target.removeAttribute('title');
                target.setAttribute('data-tooltip', title);
                this.showTooltip(target, title);
            } else if (typeof target.hasAttribute === 'function' && target.hasAttribute('data-tooltip')) {
                this.showTooltip(target, target.getAttribute('data-tooltip'));
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const target = e.target;
            // Verificar que target sea un elemento válido
            if (!target || typeof target.hasAttribute !== 'function') return;
            
            if (target.hasAttribute('data-tooltip')) {
                this.hideTooltip();
            }
        }, true);

        // Tooltips para KPIs
        this.setupKPITooltips();
    }

    /**
     * Configurar tooltips de KPIs
     */
    setupKPITooltips() {
        const kpiTooltips = {
            'statTotalProjects': 'Total de proyectos activos en el sistema',
            'statTotalUsers': 'Número total de usuarios registrados',
            'statUnreadMessages': 'Mensajes no leídos pendientes de revisión',
            'statTotalCost': 'Costo total estimado de todos los proyectos'
        };

        Object.entries(kpiTooltips).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('data-tooltip', text);
                element.setAttribute('aria-label', text);
            }
        });
    }

    /**
     * Mostrar tooltip
     */
    showTooltip(element, text) {
        const tooltip = document.getElementById('globalTooltip');
        if (!tooltip) return;

        tooltip.textContent = text;
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');

        // Posicionar tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 8;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Ajustar si se sale de la pantalla
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        if (top < 10) {
            top = rect.bottom + 8;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    /**
     * Ocultar tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('globalTooltip');
        if (tooltip) {
            tooltip.classList.remove('opacity-100');
            tooltip.classList.add('opacity-0');
        }
    }

    /**
     * Agregar tooltip personalizado
     */
    addTooltip(element, text, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) return;

        element.setAttribute('data-tooltip', text);
        element.setAttribute('data-tooltip-custom', 'true');
        
        if (options.position) {
            element.setAttribute('data-tooltip-position', options.position);
        }
    }

    /**
     * Tooltip para gráficos
     */
    setupChartTooltips() {
        // Los tooltips de Chart.js se manejan automáticamente
        // Este método puede extenderse para tooltips personalizados
    }
}

// Inicializar gestor de tooltips
if (typeof window !== 'undefined') {
    window.tooltipManager = new TooltipManager();
}

