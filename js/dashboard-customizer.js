/**
 * ============================================================================
 * PERSONALIZADOR DE DASHBOARD - MEJORA FASE 1
 * ============================================================================
 * Drag & Drop para reorganizar widgets del dashboard
 * Versión: 1.0.0
 * ============================================================================
 */

class DashboardCustomizer {
    constructor() {
        this.isEditMode = false;
        this.widgets = [];
        this.init();
    }

    /**
     * Inicializar personalizador
     */
    init() {
        this.loadLayout();
        this.createEditButton();
        this.setupDragAndDrop();
    }

    /**
     * Crear botón de edición
     */
    createEditButton() {
        const btn = document.createElement('button');
        btn.id = 'btnEditDashboard';
        btn.className = 'fixed top-20 right-4 z-40 glass-effect rounded-lg px-4 py-2 text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2';
        btn.innerHTML = '<i class="fas fa-edit"></i> Personalizar Dashboard';
        btn.onclick = () => this.toggleEditMode();
        document.body.appendChild(btn);
    }

    /**
     * Toggle modo edición
     */
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const btn = document.getElementById('btnEditDashboard');
        
        if (this.isEditMode) {
            btn.innerHTML = '<i class="fas fa-check"></i> Guardar Layout';
            btn.classList.add('bg-green-600');
            this.enableEditMode();
        } else {
            btn.innerHTML = '<i class="fas fa-edit"></i> Personalizar Dashboard';
            btn.classList.remove('bg-green-600');
            this.disableEditMode();
            this.saveLayout();
        }
    }

    /**
     * Habilitar modo edición
     */
    enableEditMode() {
        // Agregar clase a widgets
        document.querySelectorAll('.stat-card, .chart-container, .widget').forEach(widget => {
            widget.classList.add('draggable-widget');
            widget.setAttribute('draggable', 'true');
            widget.style.cursor = 'move';
            
            // Agregar indicador visual
            const indicator = document.createElement('div');
            indicator.className = 'drag-indicator';
            indicator.innerHTML = '<i class="fas fa-grip-vertical"></i>';
            widget.appendChild(indicator);
        });

        // Agregar zonas de drop
        this.createDropZones();
    }

    /**
     * Deshabilitar modo edición
     */
    disableEditMode() {
        document.querySelectorAll('.draggable-widget').forEach(widget => {
            widget.classList.remove('draggable-widget');
            widget.removeAttribute('draggable');
            widget.style.cursor = '';
            
            const indicator = widget.querySelector('.drag-indicator');
            if (indicator) indicator.remove();
        });

        // Remover zonas de drop
        document.querySelectorAll('.drop-zone').forEach(zone => zone.remove());
    }

    /**
     * Crear zonas de drop
     */
    createDropZones() {
        const containers = document.querySelectorAll('#dashboardGrid, .dashboard-section, .stats-grid');
        containers.forEach(container => {
            if (!container.querySelector('.drop-zone')) {
                const zone = document.createElement('div');
                zone.className = 'drop-zone';
                zone.innerHTML = '<span>Arrastra aquí</span>';
                container.appendChild(zone);
            }
        });
    }

    /**
     * Configurar drag and drop
     */
    setupDragAndDrop() {
        let draggedElement = null;

        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-widget')) {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable-widget')) {
                e.target.style.opacity = '1';
            }
            draggedElement = null;
        });

        document.addEventListener('dragover', (e) => {
            if (!this.isEditMode) return;
            
            e.preventDefault();
            const dropZone = e.target.closest('.drop-zone, .stat-card, .chart-container, .widget');
            if (dropZone && dropZone !== draggedElement) {
                dropZone.classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            e.target.classList.remove('drag-over');
        });

        document.addEventListener('drop', (e) => {
            if (!this.isEditMode || !draggedElement) return;
            
            e.preventDefault();
            const dropZone = e.target.closest('.drop-zone, .stat-card, .chart-container, .widget');
            
            if (dropZone && dropZone !== draggedElement) {
                // Insertar antes del elemento objetivo
                if (dropZone.classList.contains('drop-zone')) {
                    dropZone.parentNode.insertBefore(draggedElement, dropZone);
                } else {
                    dropZone.parentNode.insertBefore(draggedElement, dropZone.nextSibling);
                }
                
                dropZone.classList.remove('drag-over');
                this.updateWidgetOrder();
            }
        });
    }

    /**
     * Actualizar orden de widgets
     */
    updateWidgetOrder() {
        const widgets = Array.from(document.querySelectorAll('.stat-card, .chart-container, .widget'));
        this.widgets = widgets.map((widget, index) => ({
            id: widget.id || `widget-${index}`,
            type: widget.className,
            order: index
        }));
    }

    /**
     * Guardar layout
     */
    saveLayout() {
        this.updateWidgetOrder();
        const layout = {
            widgets: this.widgets,
            timestamp: Date.now()
        };
        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
        
        // Notificar
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Layout Guardado',
                message: 'Tu configuración del dashboard ha sido guardada.'
            });
        }
    }

    /**
     * Cargar layout
     */
    loadLayout() {
        const saved = localStorage.getItem('dashboardLayout');
        if (saved) {
            try {
                const layout = JSON.parse(saved);
                // Aplicar orden guardado si es necesario
                // Esto se puede expandir para restaurar posiciones exactas
            } catch (error) {
                console.warn('Error cargando layout:', error);
            }
        }
    }

    /**
     * Reset layout
     */
    resetLayout() {
        if (confirm('¿Estás seguro de restaurar el layout por defecto?')) {
            localStorage.removeItem('dashboardLayout');
            location.reload();
        }
    }
}

// Inicializar personalizador
if (typeof window !== 'undefined') {
    window.dashboardCustomizer = new DashboardCustomizer();
}

