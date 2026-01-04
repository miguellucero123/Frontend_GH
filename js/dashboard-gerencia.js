/**
 * ============================================================
 * DASHBOARD DE GERENCIA - FASE 1
 * ============================================================
 * 
 * Renderiza información detallada de proyectos con métricas
 * financieras complejas, fechas y detalles técnicos.
 * 
 * Dependencias: project-data-model.js
 */

class DashboardGerencia {
    constructor() {
        this.currentProject = null;
        this.projectsData = [];
    }

    /**
     * Inicializar dashboard
     */
    async init() {
        await this.loadProjects();
        this.renderDashboard();
        this.setupEventListeners();
    }

    /**
     * Cargar proyectos desde API o localStorage
     */
    async loadProjects() {
        try {
            // Intentar cargar desde API
            if (typeof api !== 'undefined' && api.getProjects) {
                const projects = await api.getProjects();
                this.projectsData = projects.map(p => this.enrichProjectData(p));
            } else {
                // Fallback: cargar desde localStorage o datos demo
                this.projectsData = this.getDemoProjects();
            }
        } catch (error) {
            console.error('Error cargando proyectos:', error);
            this.projectsData = this.getDemoProjects();
        }
    }

    /**
     * Enriquecer datos del proyecto con estructura completa
     */
    enrichProjectData(project) {
        if (!window.PROJECT_DATA_MODEL) {
            console.warn('PROJECT_DATA_MODEL no está disponible');
            return project;
        }

        // Crear proyecto con estructura completa
        const enriched = window.PROJECT_DATA_MODEL.createProject({
            project_id: project.project_id || project.id,
            nombre_mandante: project.mandante_nombre || project.nombre_mandante || '',
            direccion: project.direccion || '',
            ciudad: project.ciudad || '',
            descripcion: project.descripcion || '',
            fecha_inicio: project.fecha_inicio || null,
            fecha_termino_estimado: project.fecha_termino_estimada || project.fecha_termino_estimado || null,
            fecha_termino_modificada: project.fecha_termino_modificada || null,
            fecha_termino_real: project.fecha_termino_real || null,
            presupuesto: {
                inicial: project.costo_inicial || project.presupuesto?.inicial || 0,
                adicionales: project.costos_adicionales || project.presupuesto?.adicionales || 0,
                gastos_extras: project.costos_extras || project.presupuesto?.gastos_extras || 0,
                costo_final: project.costo_final || project.presupuesto?.costo_final || 0
            }
        });

        // Calcular costos
        window.PROJECT_DATA_MODEL.calculateCosts(enriched);

        return enriched;
    }

    /**
     * Datos demo para desarrollo
     */
    getDemoProjects() {
        return [
            window.PROJECT_DATA_MODEL.createProject({
                project_id: 1,
                nombre_mandante: "Torre Residencial Los Alamos",
                direccion: "Av. Los Alamos 1234",
                ciudad: "Santiago",
                descripcion: "Edificio residencial de 12 pisos con 48 departamentos",
                fecha_inicio: "2024-01-15",
                fecha_termino_estimado: "2025-06-30",
                fecha_termino_modificada: "2025-07-15",
                presupuesto: {
                    inicial: 2500000000,
                    adicionales: 150000000,
                    gastos_extras: 50000000
                },
                informacion_tecnica: {
                    ubicacion: {
                        direccion_completa: "Av. Los Alamos 1234, Las Condes",
                        comuna: "Las Condes",
                        region: "Región Metropolitana"
                    },
                    cubicacion: {
                        total_m2: 8500,
                        m2_construidos: 7200,
                        m2_terreno: 1200,
                        pisos: 12,
                        unidades: 48
                    },
                    metodologia_constructiva: {
                        tipo_estructura: "Hormigón armado",
                        sistema_constructivo: "Tradicional"
                    },
                    costos: {
                        mano_obra: 800000000,
                        materiales: 1200000000,
                        maquinaria_herramientas: 150000000,
                        servicios: 200000000,
                        gastos_generales: 150000000,
                        imprevistos: 100000000
                    }
                }
            })
        ];
    }

    /**
     * Renderizar dashboard principal
     */
    renderDashboard() {
        this.renderStats();
        this.renderProjectsGrid();
    }

    /**
     * Renderizar estadísticas generales
     */
    renderStats() {
        const stats = this.calculateGlobalStats();
        
        this.updateElement('statTotalProjects', stats.totalProjects);
        this.updateElement('statTotalUsers', stats.totalUsers || 0);
        this.updateElement('statUnreadMessages', stats.unreadMessages || 0);
        this.updateElement('statTotalCost', this.formatCurrency(stats.totalCost));
    }

    /**
     * Calcular estadísticas globales
     */
    calculateGlobalStats() {
        const totalProjects = this.projectsData.length;
        const totalCost = this.projectsData.reduce((sum, p) => {
            return sum + (p.presupuesto?.costo_final || 0);
        }, 0);

        return {
            totalProjects,
            totalCost,
            activeProjects: this.projectsData.filter(p => p.estado?.activo).length
        };
    }

    /**
     * Renderizar grid de proyectos
     */
    renderProjectsGrid() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (this.projectsData.length === 0) {
            grid.innerHTML = '<p class="empty-state">No hay proyectos registrados</p>';
            return;
        }

        this.projectsData.forEach(project => {
            const card = this.createProjectCard(project);
            grid.appendChild(card);
        });
    }

    /**
     * Crear tarjeta de proyecto mejorada
     */
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card project-card-enhanced';
        card.dataset.projectId = project.project_id;

        const presup = project.presupuesto || {};
        const desviacionClass = presup.porcentaje_desviacion > 10 ? 'negative' : 
                               presup.porcentaje_desviacion > 5 ? 'warning' : 'positive';

        card.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-card-title">${this.escapeHtml(project.nombre_mandante)}</h3>
                <div class="project-card-actions">
                    <button class="btn-icon" onclick="dashboardGerencia.viewProjectDetails(${project.project_id})" title="Ver Detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="dashboardGerencia.editProject(${project.project_id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="dashboardGerencia.viewProjectFiles(${project.project_id})" title="Ver Archivos">
                        <i class="fas fa-folder-open"></i>
                    </button>
                </div>
            </div>
            
            <div class="project-card-body">
                <div class="project-card-info">
                    <div class="project-card-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${this.escapeHtml(project.direccion)}, ${this.escapeHtml(project.ciudad)}</span>
                    </div>
                    <div class="project-card-info-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Inicio: ${this.formatDate(project.fecha_inicio)}</span>
                    </div>
                    <div class="project-card-info-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>Fin Est.: ${this.formatDate(project.fecha_termino_estimado)}</span>
                    </div>
                    ${project.fecha_termino_modificada ? `
                    <div class="project-card-info-item">
                        <i class="fas fa-calendar-edit"></i>
                        <span>Fin Modif.: ${this.formatDate(project.fecha_termino_modificada)}</span>
                    </div>
                    ` : ''}
                </div>

                <!-- Métricas Financieras -->
                <div class="project-financial-metrics">
                    <div class="metric-row">
                        <span class="metric-label">Presupuesto Inicial:</span>
                        <span class="metric-value">${this.formatCurrency(presup.inicial || 0)}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Adicionales:</span>
                        <span class="metric-value">${this.formatCurrency(presup.adicionales || 0)}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Gastos Extras:</span>
                        <span class="metric-value">${this.formatCurrency(presup.gastos_extras || 0)}</span>
                    </div>
                    <div class="metric-row metric-total">
                        <span class="metric-label">Costo Final:</span>
                        <span class="metric-value">${this.formatCurrency(presup.costo_final || 0)}</span>
                    </div>
                    <div class="metric-row metric-deviation ${desviacionClass}">
                        <span class="metric-label">Desviación:</span>
                        <span class="metric-value">
                            ${presup.desviacion >= 0 ? '+' : ''}${this.formatCurrency(presup.desviacion || 0)}
                            (${presup.porcentaje_desviacion?.toFixed(2) || 0}%)
                        </span>
                    </div>
                </div>
            </div>

            <div class="project-card-footer">
                <span class="project-status ${project.estado?.activo ? 'active' : 'inactive'}">
                    ${project.estado?.activo ? 'Activo' : 'Inactivo'}
                </span>
                <span class="project-progress">
                    Progreso: ${project.estado?.progreso_porcentaje || 0}%
                </span>
            </div>
        `;

        return card;
    }

    /**
     * Ver detalles completos del proyecto
     */
    viewProjectDetails(projectId) {
        const project = this.projectsData.find(p => p.project_id === projectId);
        if (!project) {
            alert('Proyecto no encontrado');
            return;
        }

        this.currentProject = project;
        this.renderProjectDetailsModal(project);
    }

    /**
     * Renderizar modal de detalles del proyecto
     */
    renderProjectDetailsModal(project) {
        // Crear o actualizar modal
        let modal = document.getElementById('projectDetailsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'projectDetailsModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        const info = project.informacion_tecnica || {};
        const presup = project.presupuesto || {};

        modal.innerHTML = `
            <div class="modal-content modal-extra-large">
                <div class="modal-header">
                    <h3>Detalles del Proyecto: ${this.escapeHtml(project.nombre_mandante)}</h3>
                    <button class="btn-icon btn-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body modal-scrollable">
                    ${this.renderProjectDetailsContent(project)}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    /**
     * Renderizar contenido de detalles
     */
    renderProjectDetailsContent(project) {
        const info = project.informacion_tecnica || {};
        const presup = project.presupuesto || {};

        return `
            <!-- Sección: Información General -->
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-info-circle"></i> Información General
                </h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <label>Nombre Mandante:</label>
                        <span>${this.escapeHtml(project.nombre_mandante)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Dirección:</label>
                        <span>${this.escapeHtml(project.direccion)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Ciudad:</label>
                        <span>${this.escapeHtml(project.ciudad)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Descripción:</label>
                        <span>${this.escapeHtml(project.descripcion || 'Sin descripción')}</span>
                    </div>
                </div>
            </div>

            <!-- Sección: Fechas -->
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-calendar-alt"></i> Fechas del Proyecto
                </h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <label>Fecha de Inicio:</label>
                        <span>${this.formatDate(project.fecha_inicio)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Fecha Término Estimada:</label>
                        <span>${this.formatDate(project.fecha_termino_estimado)}</span>
                    </div>
                    ${project.fecha_termino_modificada ? `
                    <div class="detail-item">
                        <label>Fecha Término Modificada:</label>
                        <span class="highlight">${this.formatDate(project.fecha_termino_modificada)}</span>
                    </div>
                    ` : ''}
                    ${project.fecha_termino_real ? `
                    <div class="detail-item">
                        <label>Fecha Término Real:</label>
                        <span>${this.formatDate(project.fecha_termino_real)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Sección: Métricas Financieras -->
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-dollar-sign"></i> Métricas Financieras
                </h4>
                <div class="financial-details">
                    <div class="financial-card">
                        <div class="financial-label">Presupuesto Inicial</div>
                        <div class="financial-value">${this.formatCurrency(presup.inicial || 0)}</div>
                    </div>
                    <div class="financial-card">
                        <div class="financial-label">Presupuesto Adicionales</div>
                        <div class="financial-value">${this.formatCurrency(presup.adicionales || 0)}</div>
                    </div>
                    <div class="financial-card">
                        <div class="financial-label">Gastos Extras</div>
                        <div class="financial-value warning">${this.formatCurrency(presup.gastos_extras || 0)}</div>
                    </div>
                    <div class="financial-card total">
                        <div class="financial-label">Costo Final</div>
                        <div class="financial-value">${this.formatCurrency(presup.costo_final || 0)}</div>
                    </div>
                    <div class="financial-card ${presup.porcentaje_desviacion > 10 ? 'negative' : presup.porcentaje_desviacion > 5 ? 'warning' : 'positive'}">
                        <div class="financial-label">Desviación</div>
                        <div class="financial-value">
                            ${presup.desviacion >= 0 ? '+' : ''}${this.formatCurrency(presup.desviacion || 0)}
                            <small>(${presup.porcentaje_desviacion?.toFixed(2) || 0}%)</small>
                        </div>
                    </div>
                </div>
            </div>

            ${info.ubicacion ? this.renderUbicacionSection(info.ubicacion) : ''}
            ${info.cubicacion ? this.renderCubicacionSection(info.cubicacion) : ''}
            ${info.metodologia_constructiva ? this.renderMetodologiaSection(info.metodologia_constructiva) : ''}
            ${info.especificaciones_tecnicas ? this.renderEspecificacionesSection(info.especificaciones_tecnicas) : ''}
            ${info.recursos_equipamiento ? this.renderEquipamientoSection(info.recursos_equipamiento) : ''}
            ${info.mano_de_obra ? this.renderManoObraSection(info.mano_de_obra) : ''}
            ${info.costos ? this.renderCostosSection(info.costos) : ''}
        `;
    }

    /**
     * Renderizar sección de ubicación
     */
    renderUbicacionSection(ubicacion) {
        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-map-marker-alt"></i> Ubicación del Proyecto
                </h4>
                <div class="details-grid">
                    <div class="detail-item full-width">
                        <label>Dirección Completa:</label>
                        <span>${this.escapeHtml(ubicacion.direccion_completa || '')}</span>
                    </div>
                    <div class="detail-item">
                        <label>Comuna:</label>
                        <span>${this.escapeHtml(ubicacion.comuna || '')}</span>
                    </div>
                    <div class="detail-item">
                        <label>Región:</label>
                        <span>${this.escapeHtml(ubicacion.region || '')}</span>
                    </div>
                    ${ubicacion.coordenadas?.latitud ? `
                    <div class="detail-item">
                        <label>Coordenadas:</label>
                        <span>${ubicacion.coordenadas.latitud}, ${ubicacion.coordenadas.longitud}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar sección de cubicación
     */
    renderCubicacionSection(cubicacion) {
        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-cube"></i> Cubicación del Proyecto
                </h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <label>Total m²:</label>
                        <span>${this.formatNumber(cubicacion.total_m2 || 0)} m²</span>
                    </div>
                    <div class="detail-item">
                        <label>m² Construidos:</label>
                        <span>${this.formatNumber(cubicacion.m2_construidos || 0)} m²</span>
                    </div>
                    <div class="detail-item">
                        <label>m² Terreno:</label>
                        <span>${this.formatNumber(cubicacion.m2_terreno || 0)} m²</span>
                    </div>
                    ${cubicacion.volumen_m3 ? `
                    <div class="detail-item">
                        <label>Volumen:</label>
                        <span>${this.formatNumber(cubicacion.volumen_m3)} m³</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <label>Pisos:</label>
                        <span>${cubicacion.pisos || 0}</span>
                    </div>
                    ${cubicacion.unidades ? `
                    <div class="detail-item">
                        <label>Unidades:</label>
                        <span>${cubicacion.unidades}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar sección de metodología
     */
    renderMetodologiaSection(metodologia) {
        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-tools"></i> Metodología Constructiva
                </h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <label>Tipo de Estructura:</label>
                        <span>${this.escapeHtml(metodologia.tipo_estructura || '')}</span>
                    </div>
                    <div class="detail-item">
                        <label>Sistema Constructivo:</label>
                        <span>${this.escapeHtml(metodologia.sistema_constructivo || '')}</span>
                    </div>
                    ${metodologia.tecnicas_especiales?.length ? `
                    <div class="detail-item full-width">
                        <label>Técnicas Especiales:</label>
                        <span>${metodologia.tecnicas_especiales.join(', ')}</span>
                    </div>
                    ` : ''}
                    ${metodologia.normativas_aplicables?.length ? `
                    <div class="detail-item full-width">
                        <label>Normativas Aplicables:</label>
                        <span>${metodologia.normativas_aplicables.join(', ')}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar sección de especificaciones técnicas
     */
    renderEspecificacionesSection(especificaciones) {
        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-clipboard-list"></i> Especificaciones Técnicas
                </h4>
                <div class="details-grid">
                    ${especificaciones.resistencia_hormigon ? `
                    <div class="detail-item">
                        <label>Resistencia Hormigón:</label>
                        <span>${this.escapeHtml(especificaciones.resistencia_hormigon)}</span>
                    </div>
                    ` : ''}
                    ${especificaciones.acero_estructura ? `
                    <div class="detail-item">
                        <label>Acero Estructura:</label>
                        <span>${this.escapeHtml(especificaciones.acero_estructura)}</span>
                    </div>
                    ` : ''}
                    ${especificaciones.instalaciones ? `
                    <div class="detail-item full-width">
                        <label>Instalaciones:</label>
                        <div class="sub-details">
                            ${especificaciones.instalaciones.electrica ? `<span>Eléctrica: ${this.escapeHtml(especificaciones.instalaciones.electrica)}</span>` : ''}
                            ${especificaciones.instalaciones.sanitaria ? `<span>Sanitaria: ${this.escapeHtml(especificaciones.instalaciones.sanitaria)}</span>` : ''}
                            ${especificaciones.instalaciones.gas ? `<span>Gas: ${this.escapeHtml(especificaciones.instalaciones.gas)}</span>` : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderizar sección de equipamiento
     */
    renderEquipamientoSection(equipamiento) {
        const maquinaria = equipamiento.maquinaria || [];
        const herramientas = equipamiento.herramientas || [];
        const equipos = equipamiento.equipos || [];

        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-cog"></i> Maquinaria, Herramientas y Equipos
                </h4>
                
                ${maquinaria.length > 0 ? `
                <div class="equipment-subsection">
                    <h5>Maquinaria</h5>
                    <table class="equipment-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Costo Alquiler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${maquinaria.map(m => `
                                <tr>
                                    <td>${this.escapeHtml(m.nombre || '')}</td>
                                    <td>${this.escapeHtml(m.tipo || '')}</td>
                                    <td>${m.cantidad || 0}</td>
                                    <td>${this.formatCurrency(m.costo_alquiler || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${herramientas.length > 0 ? `
                <div class="equipment-subsection">
                    <h5>Herramientas</h5>
                    <table class="equipment-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Costo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${herramientas.map(h => `
                                <tr>
                                    <td>${this.escapeHtml(h.nombre || '')}</td>
                                    <td>${this.escapeHtml(h.tipo || '')}</td>
                                    <td>${h.cantidad || 0}</td>
                                    <td>${this.formatCurrency(h.costo || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <div class="equipment-total">
                    <strong>Costo Total Equipamiento: ${this.formatCurrency(equipamiento.costo_total_equipamiento || 0)}</strong>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar sección de mano de obra
     */
    renderManoObraSection(manoObra) {
        const desglose = manoObra.desglose || [];

        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-users"></i> Mano de Obra
                </h4>
                
                ${manoObra.tipo_requerida?.length ? `
                <div class="detail-item full-width">
                    <label>Tipos Requeridos:</label>
                    <span>${manoObra.tipo_requerida.join(', ')}</span>
                </div>
                ` : ''}

                ${desglose.length > 0 ? `
                <table class="equipment-table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Cantidad</th>
                            <th>Horas Estimadas</th>
                            <th>Costo/Hora</th>
                            <th>Costo Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${desglose.map(d => `
                            <tr>
                                <td>${this.escapeHtml(d.categoria || '')}</td>
                                <td>${d.cantidad || 0}</td>
                                <td>${d.horas_estimadas || 0}</td>
                                <td>${this.formatCurrency(d.costo_hora || 0)}</td>
                                <td>${this.formatCurrency(d.costo_total || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : ''}

                <div class="equipment-total">
                    <strong>Costo Total Mano de Obra: ${this.formatCurrency(manoObra.costo_total_mano_obra || 0)}</strong>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar sección de costos
     */
    renderCostosSection(costos) {
        return `
            <div class="details-section">
                <h4 class="section-title">
                    <i class="fas fa-calculator"></i> Desglose de Costos
                </h4>
                <div class="costs-breakdown">
                    <div class="cost-item">
                        <span class="cost-label">Mano de Obra:</span>
                        <span class="cost-value">${this.formatCurrency(costos.mano_obra || 0)}</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Materiales:</span>
                        <span class="cost-value">${this.formatCurrency(costos.materiales || 0)}</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Maquinaria y Herramientas:</span>
                        <span class="cost-value">${this.formatCurrency(costos.maquinaria_herramientas || 0)}</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Servicios:</span>
                        <span class="cost-value">${this.formatCurrency(costos.servicios || 0)}</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Gastos Generales:</span>
                        <span class="cost-value">${this.formatCurrency(costos.gastos_generales || 0)}</span>
                    </div>
                    <div class="cost-item">
                        <span class="cost-label">Imprevistos:</span>
                        <span class="cost-value">${this.formatCurrency(costos.imprevistos || 0)}</span>
                    </div>
                    <div class="cost-item total">
                        <span class="cost-label">Total:</span>
                        <span class="cost-value">${this.formatCurrency(costos.total || 0)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Los eventos se manejan mediante onclick en los elementos generados
    }

    /**
     * Utilidades
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('es-CL').format(value);
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Métodos públicos para llamadas desde HTML
    editProject(projectId) {
        // Implementar edición de proyecto
        console.log('Editar proyecto:', projectId);
    }

    viewProjectFiles(projectId) {
        // Implementar vista de archivos
        console.log('Ver archivos del proyecto:', projectId);
    }
}

// Instancia global
const dashboardGerencia = new DashboardGerencia();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboardGerencia.init();
    });
} else {
    dashboardGerencia.init();
}

