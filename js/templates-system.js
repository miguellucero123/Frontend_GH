/**
 * ============================================================================
 * SISTEMA DE PLANTILLAS - MEJORA FASE 1
 * ============================================================================
 * Plantillas para proyectos y documentos
 * Versión: 1.0.0
 * ============================================================================
 */

class TemplatesSystem {
    constructor() {
        this.templates = new Map();
        this.init();
    }

    /**
     * Inicializar sistema de plantillas
     */
    init() {
        this.loadTemplates();
        this.createDefaultTemplates();
    }

    /**
     * Crear plantillas por defecto
     */
    createDefaultTemplates() {
        if (this.templates.size === 0) {
            // Plantilla de Proyecto Residencial
            this.templates.set('project_residential', {
                id: 'project_residential',
                name: 'Proyecto Residencial',
                type: 'project',
                category: 'residential',
                data: {
                    nombre: 'Nuevo Proyecto Residencial',
                    tipo: 'Residencial',
                    presupuesto: 500000,
                    duracion: 12,
                    hitos: [
                        { nombre: 'Excavación', duracion: 2, orden: 1 },
                        { nombre: 'Fundaciones', duracion: 3, orden: 2 },
                        { nombre: 'Estructura', duracion: 4, orden: 3 },
                        { nombre: 'Instalaciones', duracion: 2, orden: 4 },
                        { nombre: 'Acabados', duracion: 3, orden: 5 }
                    ],
                    recursos: [
                        { tipo: 'Obrero', cantidad: 5 },
                        { tipo: 'Maestro', cantidad: 2 },
                        { tipo: 'Ingeniero', cantidad: 1 }
                    ]
                }
            });

            // Plantilla de Proyecto Comercial
            this.templates.set('project_commercial', {
                id: 'project_commercial',
                name: 'Proyecto Comercial',
                type: 'project',
                category: 'commercial',
                data: {
                    nombre: 'Nuevo Proyecto Comercial',
                    tipo: 'Comercial',
                    presupuesto: 1000000,
                    duracion: 18,
                    hitos: [
                        { nombre: 'Diseño Arquitectónico', duracion: 3, orden: 1 },
                        { nombre: 'Permisos', duracion: 2, orden: 2 },
                        { nombre: 'Construcción', duracion: 10, orden: 3 },
                        { nombre: 'Instalaciones Especiales', duracion: 2, orden: 4 },
                        { nombre: 'Acabados y Entrega', duracion: 1, orden: 5 }
                    ],
                    recursos: [
                        { tipo: 'Obrero', cantidad: 10 },
                        { tipo: 'Maestro', cantidad: 4 },
                        { tipo: 'Ingeniero', cantidad: 2 },
                        { tipo: 'Arquitecto', cantidad: 1 }
                    ]
                }
            });

            // Plantilla de Documento de Contrato
            this.templates.set('document_contract', {
                id: 'document_contract',
                name: 'Contrato de Obra',
                type: 'document',
                category: 'legal',
                data: {
                    titulo: 'Contrato de Obra',
                    tipo: 'Contrato',
                    contenido: `
CONTRATO DE OBRA

Entre [CLIENTE], en adelante "EL CLIENTE", y [CONSTRUCTORA], 
en adelante "LA CONSTRUCTORA", se acuerda:

1. OBJETO: [Descripción del proyecto]
2. PRESUPUESTO: $[Monto]
3. PLAZO: [Duración] meses
4. FORMA DE PAGO: [Condiciones]
5. GARANTÍAS: [Detalles]

Firma: _______________    Firma: _______________
      EL CLIENTE              LA CONSTRUCTORA
                    `
                }
            });

            this.saveTemplates();
        }
    }

    /**
     * Mostrar selector de plantillas
     */
    showTemplateSelector(type = 'project') {
        const modal = document.createElement('div');
        modal.id = 'templatesModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="this.closest('#templatesModal').remove()"></div>
            <div class="relative glass-effect rounded-xl p-6 border border-white/10 shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <i class="fas fa-file-alt text-blue-400"></i>
                        Seleccionar Plantilla
                    </h3>
                    <button onclick="this.closest('#templatesModal').remove()" 
                        class="text-slate-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${this.renderTemplates(type)}
                </div>

                <div class="mt-4 pt-4 border-t border-slate-700">
                    <button onclick="templatesSystem.createCustomTemplate('${type}')"
                        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
                        <i class="fas fa-plus"></i> Crear Plantilla Personalizada
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Renderizar plantillas
     */
    renderTemplates(type) {
        const filtered = Array.from(this.templates.values())
            .filter(t => t.type === type);

        if (filtered.length === 0) {
            return '<p class="text-slate-400 col-span-2 text-center py-4">No hay plantillas disponibles</p>';
        }

        return filtered.map(template => `
            <div class="glass-effect rounded-lg p-4 border border-white/5 hover:border-blue-500 transition-all cursor-pointer"
                 onclick="templatesSystem.applyTemplate('${template.id}')">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-white font-semibold">${template.name}</h4>
                    <span class="badge badge-info text-xs">${template.category}</span>
                </div>
                <p class="text-slate-400 text-sm mb-3">${this.getTemplateDescription(template)}</p>
                <button class="text-blue-400 hover:text-blue-300 text-sm">
                    Usar Plantilla <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        `).join('');
    }

    /**
     * Obtener descripción de plantilla
     */
    getTemplateDescription(template) {
        if (template.type === 'project') {
            return `Presupuesto: $${template.data.presupuesto?.toLocaleString() || 'N/A'} | Duración: ${template.data.duracion || 'N/A'} meses`;
        }
        return 'Plantilla lista para usar';
    }

    /**
     * Aplicar plantilla
     */
    applyTemplate(templateId) {
        const template = this.templates.get(templateId);
        if (!template) {
            alert('Plantilla no encontrada');
            return;
        }

        // Cerrar modal
        const modal = document.getElementById('templatesModal');
        if (modal) modal.remove();

        // Aplicar según tipo
        if (template.type === 'project') {
            this.applyProjectTemplate(template);
        } else if (template.type === 'document') {
            this.applyDocumentTemplate(template);
        }

        // Notificar
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Plantilla Aplicada',
                message: `La plantilla "${template.name}" ha sido aplicada.`
            });
        }
    }

    /**
     * Aplicar plantilla de proyecto
     */
    applyProjectTemplate(template) {
        // Aquí se integraría con el formulario de creación de proyectos
        console.log('Aplicando plantilla de proyecto:', template);
        
        // Si hay un modal o formulario de proyecto, llenarlo con los datos
        const projectForm = document.querySelector('#projectForm, [data-project-form]');
        if (projectForm) {
            // Llenar campos del formulario
            Object.entries(template.data).forEach(([key, value]) => {
                const field = projectForm.querySelector(`[name="${key}"], #${key}`);
                if (field) {
                    field.value = value;
                }
            });
        }
    }

    /**
     * Aplicar plantilla de documento
     */
    applyDocumentTemplate(template) {
        console.log('Aplicando plantilla de documento:', template);
        // Similar a applyProjectTemplate pero para documentos
    }

    /**
     * Crear plantilla personalizada
     */
    createCustomTemplate(type) {
        const name = prompt('Nombre de la plantilla:');
        if (!name) return;

        // Aquí se podría abrir un editor más completo
        const template = {
            id: `custom_${Date.now()}`,
            name,
            type,
            category: 'custom',
            data: {}
        };

        this.templates.set(template.id, template);
        this.saveTemplates();

        alert('Plantilla creada. Puedes editarla desde la configuración.');
    }

    /**
     * Guardar plantillas
     */
    saveTemplates() {
        const data = Object.fromEntries(this.templates);
        localStorage.setItem('templatesData', JSON.stringify(data));
    }

    /**
     * Cargar plantillas
     */
    loadTemplates() {
        const saved = localStorage.getItem('templatesData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.templates = new Map(Object.entries(data));
            } catch (error) {
                console.warn('Error cargando plantillas:', error);
            }
        }
    }

    /**
     * Obtener plantilla
     */
    getTemplate(id) {
        return this.templates.get(id);
    }

    /**
     * Eliminar plantilla
     */
    deleteTemplate(id) {
        if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
            this.templates.delete(id);
            this.saveTemplates();
        }
    }
}

// Inicializar sistema de plantillas
if (typeof window !== 'undefined') {
    window.templatesSystem = new TemplatesSystem();
}

