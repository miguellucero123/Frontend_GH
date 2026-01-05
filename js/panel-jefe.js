/**
 * Lógica del Panel de Jefe (Administrador)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Servicios Empresariales (Enterprise Fase 1)
    window.projectService = new ProjectService(api, coreState);
    window.userService = new UserService(api, coreState);
    window.documentService = new DocumentService(api, coreState);
    window.reportingService = new ReportingService(api);

    // Verificar autenticación y rol
    if (!auth.requireAuth()) {
        return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        console.error('Usuario no autenticado');
        return;
    }

    const userRole = currentUser.role || currentUser.rol;
    if (userRole !== 'jefe' && userRole !== 'admin') {
        console.warn('Usuario no autorizado para esta página');
        if (typeof navigationManager !== 'undefined') {
            navigationManager.redirectByRole();
        }
        return;
    }

    // Inicializar layout con diseño React
    if (typeof layoutManager !== 'undefined') {
        layoutManager.init(userRole);

        // Mover contenido al main content del layout
        const adminContent = document.getElementById('adminContent');
        const mainContent = document.getElementById('mainContent');
        if (adminContent && mainContent) {
            // Mover todas las secciones al main content
            Array.from(adminContent.children).forEach(child => {
                mainContent.appendChild(child);
            });
            adminContent.remove();
        }
    }

    // Inicializar listeners centralizados
    initEventListeners();

    // Inicializar secciones
    initProjectsSection();
    initUsersSection();
    initMessagesSection();
    initExcelUploadSection(); // FASE 6: Carga de Excel/Word

    // Cargar dashboard con mejoras
    loadDashboard();

    /**
     * Inicializar event listeners centralizados
     */
    function initEventListeners() {
        // Navegación
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.dataset.section;

                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === `section${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`) {
                        section.classList.add('active');
                        if (typeof visualService !== 'undefined') {
                            visualService.animateSection(section.id);
                        }
                        
                        // Cargar datos cuando se activa la sección de proyectos
                        if (sectionId === 'proyectos') {
                            loadProjectsSection();
                        }
                    }
                });
            });
        });

        // Botones estáticos
        document.getElementById('btnGenerateReport')?.addEventListener('click', () => reportingService.generateConsolidatedReport());
        document.getElementById('btnGuardarKPI')?.addEventListener('click', saveKPIChanges);

        // Event Delegation for Projects Grid (Botones dinámicos)
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.dataset.action;
                const id = btn.dataset.id;

                if (action === 'report') reportingService.generateExecutiveReport(id);
                if (action === 'edit') editProject(id);
                if (action === 'files') viewProjectFiles(id);
                if (action === 'archive') confirmArchiveProject(id);
            });
        }

        // Event Delegation for Section Dashboard (KPI Edit)
        const sectionDashboard = document.getElementById('sectionDashboard');
        if (sectionDashboard) {
            sectionDashboard.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-action="editKPI"]');
                if (!btn) return;
                openEditKPIModal(btn.dataset.field);
            });
        }

        // Event Delegation for Users Container
        const usersContainer = document.getElementById('usersContainer');
        if (usersContainer) {
            usersContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.dataset.action;
                const id = btn.dataset.id;

                if (action === 'approve') window.approveUser(id);
                if (action === 'reject') window.rejectUser(id);
            });
        }
    }

    /**
     * Cargar dashboard usando el servicio centralizado
     */
    async function loadDashboard() {
        try {
            // Inicializar GestorGerencia si está disponible
            if (typeof GestorGerencia !== 'undefined' && typeof proyectoMaestro !== 'undefined') {
                window.gestorGerencia = new GestorGerencia(proyectoMaestro);
                
                // Inicializar Dashboard Interactivo
                if (typeof DashboardInteractive !== 'undefined') {
                    window.dashboardInteractive = new DashboardInteractive(window.gestorGerencia);
                }

                // Inicializar Modal de Detalles KPI
                if (typeof KPIDetailsModal !== 'undefined') {
                    window.kpiDetailsModal = new KPIDetailsModal(window.gestorGerencia);
                }

                // Inicializar Gestor de Exportación
                if (typeof ExportManager !== 'undefined') {
                    window.exportManager = new ExportManager(window.gestorGerencia);
                }

                // Inicializar Análisis Predictivo
                if (typeof PredictiveAnalysis !== 'undefined') {
                    window.predictiveAnalysis = new PredictiveAnalysis(window.gestorGerencia);
                    
                // Inicializar Widget de Análisis Predictivo
                if (typeof PredictiveWidget !== 'undefined') {
                    window.predictiveWidget = new PredictiveWidget(window.predictiveAnalysis);
                }

                // Inicializar Panel de Riesgos
                if (typeof RisksPanel !== 'undefined') {
                    window.risksPanel = new RisksPanel(window.gestorGerencia, window.predictiveAnalysis);
                }

                // Inicializar Gestor de Accesibilidad
                if (typeof AccessibilityManager !== 'undefined' && typeof window.accessibilityManager === 'undefined') {
                    window.accessibilityManager = new AccessibilityManager();
                }

                // Inicializar Analytics Manager
                if (typeof AnalyticsManager !== 'undefined' && typeof window.analyticsManager === 'undefined') {
                    window.analyticsManager = new AnalyticsManager();
                }

                // Inicializar Tooltip Manager
                if (typeof TooltipManager !== 'undefined' && typeof window.tooltipManager === 'undefined') {
                    window.tooltipManager = new TooltipManager();
                }

                // Inicializar Lazy Loader
                if (typeof LazyLoader !== 'undefined' && typeof window.lazyLoader === 'undefined') {
                    window.lazyLoader = new LazyLoader();
                }

                // Inicializar Dashboard Customizer
                if (typeof DashboardCustomizer !== 'undefined' && typeof window.dashboardCustomizer === 'undefined') {
                    window.dashboardCustomizer = new DashboardCustomizer();
                }

                // Inicializar Sistema de Comentarios
                if (typeof CommentsSystem !== 'undefined' && typeof window.commentsSystem === 'undefined') {
                    window.commentsSystem = new CommentsSystem();
                }

                // Inicializar Vista de Calendario
                if (typeof CalendarView !== 'undefined' && typeof window.calendarView === 'undefined') {
                    window.calendarView = new CalendarView();
                }

                // Inicializar Sistema de Plantillas
                if (typeof TemplatesSystem !== 'undefined' && typeof window.templatesSystem === 'undefined') {
                    window.templatesSystem = new TemplatesSystem();
                }

                // Inicializar Sistema de Reportes Avanzados
                if (typeof AdvancedReports !== 'undefined' && typeof window.advancedReports === 'undefined') {
                    window.advancedReports = new AdvancedReports();
                }

                // Inicializar Sistema de Auditoría
                if (typeof AuditLogger !== 'undefined' && typeof window.auditLogger === 'undefined') {
                    window.auditLogger = new AuditLogger();
                    // Log de carga del dashboard
                    window.auditLogger.logAccess('dashboard', 'VIEW');
                }
                    
                    // Mostrar predicciones en notificaciones si hay alertas
                    setTimeout(() => {
                        const resumen = window.predictiveAnalysis.obtenerResumenPredictivo();
                        resumen.alertas.forEach(alerta => {
                            if (typeof window.notificationSystem !== 'undefined') {
                                window.notificationSystem.add({
                                    type: alerta.tipo === 'critica' ? 'error' : 'warning',
                                    priority: alerta.tipo === 'critica' ? 'critical' : 'high',
                                    title: alerta.titulo,
                                    message: alerta.mensaje,
                                    action: () => {
                                        // Navegar a sección relevante
                                        if (alerta.accion === 'revisar_finanzas') {
                                            const navItem = document.querySelector('[data-section="financiero"]');
                                            if (navItem) navItem.click();
                                        } else if (alerta.accion === 'revisar_cronograma') {
                                            const navItem = document.querySelector('[data-section="cronograma"]');
                                            if (navItem) navItem.click();
                                        }
                                    }
                                });
                            }
                        });
                    }, 2000);
                }
            }

            coreState.subscribe('stats.projects', (stats) => {
                updateStat('statTotalProjects', stats.total || 0);
                updateStat('statTotalCost', formatCurrency(stats.totalCost || 0));
            });

            coreState.subscribe('projects', (projects) => {
                renderProjectsGrid(projects);

                if (typeof visualService !== 'undefined') {
                    visualService.initDashboardCharts(projects);
                    visualService.renderGanttChart(projects);
                    visualService.animateSection('sectionDashboard');
                }
            });

            const stats = await api.getDashboardStats();
            updateStat('statTotalUsers', stats.total_users || 0);
            updateStat('statUnreadMessages', stats.unread_messages || 0);

            await projectService.fetchProjects();

            // Mostrar notificación de bienvenida
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.add({
                    type: 'info',
                    priority: 'low',
                    title: '✅ Dashboard Cargado',
                    message: 'El dashboard interactivo está listo. Explora los gráficos haciendo clic en ellos.'
                });
            }

        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            
            // Notificar error
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.add({
                    type: 'error',
                    priority: 'medium',
                    title: '⚠️ Error al Cargar Dashboard',
                    message: 'Hubo un problema al cargar algunos datos. Por favor, recarga la página.'
                });
            }
        }
    }

    /**
     * Renderizar grid de proyectos (React-like)
     */
    function renderProjectsGrid(projects) {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (projects.length === 0) {
            grid.innerHTML = '<div class="col-span-full py-20 text-center text-slate-500"><p>No hay proyectos registrados</p></div>';
            return;
        }

        projects.forEach(project => {
            const card = createProjectCard(project);
            grid.appendChild(card);
        });
    }

    /**
     * Actualizar estadística
     */
    function updateStat(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }


    /**
     * Crear tarjeta de proyecto
     */
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.project_id;

        // Limpieza de datos para evitar 'undefined'
        const checkValid = (val) => (val && val !== 'undefined' && val !== 'null') ? val : null;

        const mandante = checkValid(project.mandante_nombre) || checkValid(project.customer_name) || 'Sin nombre';
        const direccion = checkValid(project.direccion) || checkValid(project.address) || 'S/D';
        const ciudad = checkValid(project.ciudad) || checkValid(project.city) || 'S/C';
        const fechaInicio = checkValid(project.fecha_inicio) || checkValid(project.start_date) || '';
        const fechaFin = checkValid(project.fecha_termino_estimada) || checkValid(project.end_date) || '';

        card.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-card-title">${mandante}</h3>
                <div class="project-card-actions">
                    <button class="btn-icon text-emerald-400" data-action="report" data-id="${project.project_id}" title="Reporte Ejecutivo">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    <button class="btn-icon text-blue-400" data-action="edit" data-id="${project.project_id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon text-slate-400" data-action="files" data-id="${project.project_id}" title="Ver Archivos">
                        <i class="fas fa-folder-open"></i>
                    </button>
                </div>
            </div>
            <div class="project-card-info">
                <div class="project-card-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${direccion}, ${ciudad}</span>
                </div>
                <div class="project-card-info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Inicio: ${formatDate(fechaInicio)}</span>
                </div>
                <div class="project-card-info-item">
                    <i class="fas fa-calendar-check text-emerald-400"></i>
                    <span>Fin Est.: ${formatDate(fechaFin)}</span>
                </div>
            </div>
            <div class="project-card-footer">
                <span class="project-cost">${formatCurrency(project.costo_final || 0)}</span>
            </div>
        `;

        return card;
    }

    /**
     * Obtener ID del proyecto actual
     */
    function getCurrentProjectId() {
        const projects = coreState.getState('projects');
        if (projects && projects.length > 0) {
            // Retornar el primer proyecto como predeterminado si no hay selección
            return projects[0].project_id;
        }
        return null;
    }

    /**
     * Cargar y renderizar sección de proyectos
     */
    async function loadProjectsSection() {
        console.log('📊 Cargando sección de proyectos...');
        
        try {
            // Cargar proyectos
            const projects = await projectService.fetchProjects() || [];
            
            // Actualizar estadísticas
            updateProjectsStats(projects);
            
            // Renderizar tabla de proyectos
            renderProjectsTable(projects);
            
            // Renderizar Gantt
            if (typeof visualService !== 'undefined') {
                visualService.renderGanttChart(projects);
            }
            
            console.log('✅ Sección de proyectos cargada:', projects.length, 'proyectos');
        } catch (error) {
            console.error('❌ Error cargando sección de proyectos:', error);
            // Mostrar mensaje de error en la tabla
            const tbody = document.getElementById('projectsTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="py-20 text-center">
                            <i class="fas fa-exclamation-triangle text-3xl text-amber-400 mb-4"></i>
                            <p class="text-red-400">Error al cargar proyectos</p>
                            <p class="text-slate-500 text-sm mt-2">${error.message || 'Error desconocido'}</p>
                        </td>
                    </tr>
                `;
            }
        }
    }

    /**
     * Actualizar estadísticas de proyectos
     */
    function updateProjectsStats(projects) {
        const total = projects.length;
        const active = projects.filter(p => p.activo === true || p.estado === 'activo').length;
        const pending = projects.filter(p => p.estado === 'pendiente' || !p.fecha_inicio).length;
        const totalInvestment = projects.reduce((sum, p) => sum + (parseFloat(p.costo_final) || 0), 0);

        updateStat('projectsTotalCount', total);
        updateStat('projectsActiveCount', active);
        updateStat('projectsPendingCount', pending);
        updateStat('projectsTotalInvestment', formatCurrency(totalInvestment));
    }

    /**
     * Renderizar tabla de proyectos
     */
    function renderProjectsTable(projects) {
        const tbody = document.getElementById('projectsTableBody');
        if (!tbody) return;

        if (projects.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="py-20 text-center">
                        <i class="fas fa-inbox text-4xl text-slate-500 mb-4"></i>
                        <p class="text-slate-400">No hay proyectos registrados</p>
                        <button id="btnNewProjectFromTable" class="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-all">
                            <i class="fas fa-plus mr-2"></i>Crear Primer Proyecto
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = projects.map(project => {
            const mandante = project.mandante_nombre || project.customer_name || 'Sin nombre';
            const ciudad = project.ciudad || project.city || 'S/C';
            const direccion = project.direccion || project.address || 'S/D';
            const estado = project.estado || (project.activo ? 'activo' : 'pendiente');
            const presupuesto = parseFloat(project.costo_final) || 0;
            const fechaInicio = project.fecha_inicio || project.start_date || '';
            const fechaFin = project.fecha_termino_estimada || project.end_date || '';
            const progreso = project.progreso || 0;

            // Determinar color del estado
            let estadoColor = 'bg-slate-500';
            let estadoText = estado;
            if (estado === 'activo' || project.activo) {
                estadoColor = 'bg-emerald-500';
                estadoText = 'Activo';
            } else if (estado === 'pendiente') {
                estadoColor = 'bg-amber-500';
                estadoText = 'Pendiente';
            } else if (estado === 'completado') {
                estadoColor = 'bg-blue-500';
                estadoText = 'Completado';
            } else if (estado === 'pausado') {
                estadoColor = 'bg-red-500';
                estadoText = 'Pausado';
            }

            return `
                <tr class="hover:bg-slate-800/50 transition-colors">
                    <td class="py-4 px-4">
                        <div class="font-semibold text-white">${escapeHtml(mandante)}</div>
                        <div class="text-xs text-slate-400 mt-1">ID: ${project.project_id}</div>
                    </td>
                    <td class="py-4 px-4 text-slate-300">${escapeHtml(mandante)}</td>
                    <td class="py-4 px-4">
                        <div class="text-slate-300">${escapeHtml(ciudad)}</div>
                        <div class="text-xs text-slate-500">${escapeHtml(direccion)}</div>
                    </td>
                    <td class="py-4 px-4 text-center">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${estadoColor} text-white">
                            ${estadoText}
                        </span>
                    </td>
                    <td class="py-4 px-4 text-right font-semibold text-white">${formatCurrency(presupuesto)}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 bg-slate-700 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full transition-all" style="width: ${progreso}%"></div>
                            </div>
                            <span class="text-sm text-slate-300 w-12 text-right">${progreso}%</span>
                        </div>
                    </td>
                    <td class="py-4 px-4 text-slate-400 text-sm">
                        <div>Inicio: ${formatDate(fechaInicio)}</div>
                        <div class="text-xs mt-1">Fin: ${formatDate(fechaFin)}</div>
                    </td>
                    <td class="py-4 px-4">
                        <div class="flex items-center justify-center gap-2">
                            <button class="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-all" 
                                data-action="view" data-id="${project.project_id}" title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-all" 
                                data-action="edit" data-id="${project.project_id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 transition-all" 
                                data-action="files" data-id="${project.project_id}" title="Archivos">
                                <i class="fas fa-folder-open"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Actualizar paginación
        updateProjectsPagination(projects.length);
    }

    /**
     * Actualizar paginación
     */
    function updateProjectsPagination(total) {
        const showingFrom = document.getElementById('projectsShowingFrom');
        const showingTo = document.getElementById('projectsShowingTo');
        const projectsTotal = document.getElementById('projectsTotal');

        if (showingFrom) showingFrom.textContent = '1';
        if (showingTo) showingTo.textContent = total.toString();
        if (projectsTotal) projectsTotal.textContent = total.toString();
    }

    /**
     * Inicializar sección de proyectos
     */
    function initProjectsSection() {
        const btnCreateProject = document.getElementById('btnCreateProject');
        const btnNewProject = document.getElementById('btnNewProject');
        const btnNewProjectFromSection = document.getElementById('btnNewProjectFromSection');
        const projectModal = document.getElementById('projectModal');
        const projectForm = document.getElementById('projectForm');
        const btnCloseProjectModal = document.getElementById('btnCloseProjectModal');
        const btnCancelProject = document.getElementById('btnCancelProject');

        // Abrir modal de crear proyecto
        [btnCreateProject, btnNewProject].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    openProjectModal();
                });
            }
        });

        // Cerrar modal
        [btnCloseProjectModal, btnCancelProject].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    closeProjectModal();
                });
            }
        });

        // Enviar formulario
        if (projectForm) {
            projectForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await saveProject();
            });
        }

        // Calcular costo final automáticamente
        const costoInicial = document.getElementById('costoInicial');
        const costoAdicionales = document.getElementById('costoAdicionales');
        const costoExtras = document.getElementById('costoExtras');
        const costoFinal = document.getElementById('costoFinal');

        [costoInicial, costoAdicionales, costoExtras].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    calculateFinalCost();
                });
            }
        });

        function calculateFinalCost() {
            const inicial = parseFloat(costoInicial?.value || 0);
            const adicionales = parseFloat(costoAdicionales?.value || 0);
            const extras = parseFloat(costoExtras?.value || 0);
            const final = inicial + adicionales + extras;

            if (costoFinal) {
                costoFinal.value = final.toFixed(2);
            }
        }
    }

    /**
 * Abrir modal de proyecto
 */
    function openProjectModal(project = null) {
        window.openProjectModalGlobal = openProjectModal; // Exponer para edición global
        const modalEl = document.getElementById('projectModal');
        const form = document.getElementById('projectForm');
        const title = document.getElementById('projectModalTitle');

        if (title) {
            title.textContent = project ? 'Editar Proyecto' : 'Nuevo Proyecto';
        }

        if (form) {
            form.reset();
            if (project) {
                // Llenar formulario con datos del proyecto (Mapeo de campos)
                const mapping = {
                    'mandante_nombre': project.mandante_nombre || project.customer_name || '',
                    'ciudad': project.ciudad || project.city || '',
                    'direccion': project.direccion || project.address || '',
                    'fecha_inicio': project.fecha_inicio || '',
                    'fecha_termino_estimada': project.fecha_termino_estimada || '',
                    'costoInicial': project.costo_inicial || 0,
                    'costoAdicionales': project.costo_adicionales || 0,
                    'costoExtras': project.costo_extras || 0,
                    'costoFinal': project.costo_final || 0
                };

                Object.keys(mapping).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = mapping[key];
                    }
                });
            }
        }

        if (modalEl) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
            bsModal.show();
        }
    }

    /**
     * Cerrar modal de proyecto
     */
    function closeProjectModal() {
        const modalEl = document.getElementById('projectModal');
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }
    }

    /**
     * Guardar proyecto usando el servicio empresarial
     */
    async function saveProject() {
        const form = document.getElementById('projectForm');
        if (!form) return;

        const formData = new FormData(form);
        const projectData = Object.fromEntries(formData.entries());

        // Incluir el ID si estamos editando
        if (form.dataset.projectId) {
            projectData.project_id = form.dataset.projectId;
        }

        // Convertir campos numéricos
        ['costo_inicial', 'costo_adicionales', 'costo_extras', 'costo_final'].forEach(key => {
            if (projectData[key]) {
                projectData[key] = parseFloat(projectData[key]);
            }
        });

        try {
            const isEdit = !!form.dataset.projectId;
            await projectService.saveProject(projectData);
            
            // Log de auditoría
            if (typeof window.auditLogger !== 'undefined') {
                if (isEdit) {
                    window.auditLogger.logUpdate('project', form.dataset.projectId, {}, projectData);
                } else {
                    window.auditLogger.logCreate('project', projectData.project_id, projectData);
                }
            }
            
            closeProjectModal();
            // No es necesario llamar a loadDashboard(), CoreState lo maneja reactivamente
            alert('Proyecto guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
            alert('Error al guardar el proyecto: ' + error.message);
        }
    }

    /**
     * Editar proyecto
     */
    function editProject(id) {
        const projects = coreState.get('projects') || [];
        const project = projects.find(p => p.project_id == id);
        if (project) {
            openProjectModal(project);
            // Marcar el formulario con el ID para saber que es edición
            const form = document.getElementById('projectForm');
            if (form) form.dataset.projectId = id;
        }
    }

    /**
     * Ver archivos del proyecto
     */
    function viewProjectFiles(id) {
        const filePanel = document.getElementById('filesPanel');
        if (filePanel) {
            filePanel.style.display = 'flex';
            // Cargar archivos usando DocumentService si existe
            if (window.documentService) {
                // Simulación o llamada real
                console.log('Cargando archivos del proyecto:', id);
                // Si existiera método loadProjectFiles en documentService:
                // window.documentService.loadProjectFiles(id);
            }
        }
    }

    /**
    * Archivar proyecto
    */
    function confirmArchiveProject(id) {
        if (confirm('¿Está seguro de archivar este proyecto?')) {
            if (window.projectService) {
                // projectService.archiveProject(id); // Asumiendo que existe
                alert('Funcionalidad de archivar en desarrollo');
            }
        }
    }

    /**
     * Guardar cambios de KPI (Modal)
     */
    function guardarCambiosKPI() {
        const fieldId = document.getElementById('kpiFieldId')?.value;
        const value = document.getElementById('kpiValue')?.value;

        if (!fieldId || !value) {
            alert('Por favor ingrese un valor válido');
            return;
        }

        // Lógica de actualización (simulada o vía API)
        console.log(`Guardando KPI: ${fieldId} = ${value}`);

        // Cerrar modal
        const modalEl = document.getElementById('modalEdicionKPI');
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }

        alert('Indicador actualizado correctamente (Simulación)');
    }

    /**
     * Abrir modal de edición de KPI
     */
    function openEditKPIModal(fieldId) {
        const modalEl = document.getElementById('modalEdicionKPI');
        if (!modalEl) return;

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        const kpiFieldId = document.getElementById('kpiFieldId');
        const kpiLabel = document.getElementById('kpiLabel');
        const kpiValue = document.getElementById('kpiValue');
        const kpiTitle = document.getElementById('kpiModalTitle');

        const fieldMap = {
            'total_projects': { label: 'Total Proyectos Activos', title: 'Editar Proyectos' },
            'total_users': { label: 'Total Usuarios en Sistema', title: 'Editar Personal' },
            'unread_messages': { label: 'Mensajes sin Leer', title: 'Editar Mensajería' },
            'total_cost': { label: 'Inversión Total Estimada ($)', title: 'Editar Presupuesto' }
        };

        const config = fieldMap[fieldId];
        if (config) {
            kpiFieldId.value = fieldId;
            kpiLabel.textContent = config.label;
            kpiTitle.textContent = config.title;

            // Obtener valor actual desde el DOM
            const camelCaseId = 'stat' + fieldId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
            const currentEl = document.getElementById(camelCaseId);

            if (currentEl) {
                // Limpiar formato moneda/texto
                let val = currentEl.textContent.replace(/[$.]/g, '').trim();
                kpiValue.value = parseFloat(val) || 0;
            }

            modal.show();
        }
    }

    /**
     * Guardar cambios de KPI
     */
    async function saveKPIChanges() {
        const fieldId = document.getElementById('kpiFieldId')?.value;
        const newValue = document.getElementById('kpiValue')?.value;

        if (!fieldId || !newValue) {
            alert('Por favor ingrese un valor válido');
            return;
        }

        try {
            // 1. Simulación de persistencia global (Legacy Support)
            if (typeof proyectoMaestro !== 'undefined') {
                if (fieldId === 'total_cost') {
                    proyectoMaestro.datosGerencia.financiero.presupuestoInicial.monto = parseFloat(newValue);
                }
                if (typeof guardarProyecto === 'function') guardarProyecto();
            }

            // 2. Actualización DOM Directa
            const camelCaseId = 'stat' + fieldId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
            const element = document.getElementById(camelCaseId);

            if (element) {
                if (fieldId === 'total_cost') {
                    element.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(newValue);
                } else {
                    element.textContent = newValue;
                }
            }

            // Cerrar modal
            const modalEl = document.getElementById('modalEdicionKPI');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }

            alert('Indicador actualizado correctamente');

        } catch (error) {
            console.error('Error actualizando KPI:', error);
            alert('Error al actualizar');
        }
    }

    /**
     * Inicializar sección de usuarios
     */
    function initUsersSection() {
        const tabButtons = document.querySelectorAll('.tab-btn');

        // Suscribirse a cambios en la lista de usuarios para actualizar la UI
        coreState.subscribe('users.pending', (users) => renderUsersList(users, 'pending'));
        coreState.subscribe('users.approved', (users) => renderUsersList(users, 'approved'));

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                userService.fetchUsers(btn.dataset.tab);
            });
        });

        // Carga inicial
        userService.fetchUsers('pending');
    }

    /**
     * Renderizar lista de usuarios (Enterprise UI)
     */
    function renderUsersList(users, type) {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        if (activeTab !== type) return; // Solo renderizar si es la pestaña activa

        const container = document.getElementById('usersContainer');
        if (!container) return;

        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = `<div class="col-span-full py-10 text-center text-slate-500">No hay usuarios ${type === 'pending' ? 'pendientes' : 'activos'}</div>`;
            return;
        }

        users.forEach(user => {
            container.appendChild(createUserCard(user, type));
        });
    }

    /**
     * Crear tarjeta de usuario
     */
    function createUserCard(user, type) {
        const card = document.createElement('div');
        card.className = 'user-card';

        const initials = (user.name || user.username || 'U').substring(0, 2).toUpperCase();

        card.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${initials}</div>
                <div class="user-details">
                    <h4>${user.name || user.username}</h4>
                    <p>${user.email || ''}</p>
                </div>
            </div>
            <div class="user-actions">
                <span class="user-badge ${type === 'pending' ? 'badge-pending' : 'badge-approved'}">
                    ${type === 'pending' ? 'Pendiente' : 'Aprobado'}
                </span>
                ${type === 'pending' ? `
                    <button class="btn btn-primary btn-sm" data-action="approve" data-id="${user.user_id}">
                        Aprobar
                    </button>
                    <button class="btn btn-danger btn-sm" data-action="reject" data-id="${user.user_id}">
                        Rechazar
                    </button>
                ` : ''}
            </div>
        `;

        return card;
    }

    /**
     * Inicializar sección de mensajes - FASE 3: Canales Separados
     */
    function initMessagesSection() {
        const channelsContainer = document.getElementById('channelsContainer');
        if (!channelsContainer) return;

        // Obtener rol del usuario
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser?.role || currentUser?.rol || 'jefe';

        // Solo gerencia puede ver esta sección
        if (userRole === 'jefe' || userRole === 'admin') {
            // Renderizar sistema de canales para gerencia
            renderManagementChannels();
        }
    }

    /**
     * Renderizar canales para gerencia
     */
    function renderManagementChannels() {
        const channelsContainer = document.getElementById('channelsContainer');
        if (!channelsContainer) return;

        // Limpiar contenido existente (excepto info)
        const info = channelsContainer.querySelector('.channels-info');
        channelsContainer.innerHTML = '';
        if (info) {
            channelsContainer.appendChild(info);
        }

        // Crear contenedor de canales
        const channelsWrapper = document.createElement('div');
        channelsWrapper.className = 'channels-wrapper';
        channelsWrapper.id = 'channelsWrapper';

        channelsWrapper.innerHTML = `
            <div class="channels-grid">
                <div class="channel-card" data-channel="cliente-gerencia">
                    <div class="channel-card-header" style="border-left: 4px solid #8b5cf6;">
                        <div class="channel-icon-wrapper" style="background: #8b5cf6;">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="channel-info">
                            <h3>Canal Cliente</h3>
                            <p>Comunicación con clientes</p>
                        </div>
                    </div>
                    <div class="channel-card-body">
                        <div class="channel-stats">
                            <span id="statClienteMessages">0 mensajes</span>
                            <span id="statClienteUnread" class="unread-badge" style="display: none;">0</span>
                        </div>
                    </div>
                    <div class="channel-card-footer">
                        <button class="btn btn-primary btn-open-channel" data-channel="cliente-gerencia">
                            <i class="fas fa-comments"></i> Abrir Canal
                        </button>
                    </div>
                </div>

                <div class="channel-card" data-channel="trabajador-gerencia">
                    <div class="channel-card-header" style="border-left: 4px solid #f59e0b;">
                        <div class="channel-icon-wrapper" style="background: #f59e0b;">
                            <i class="fas fa-hard-hat"></i>
                        </div>
                        <div class="channel-info">
                            <h3>Canal Trabajadores</h3>
                            <p>Comunicación con equipo de obra</p>
                        </div>
                    </div>
                    <div class="channel-card-body">
                        <div class="channel-stats">
                            <span id="statTrabajadorMessages">0 mensajes</span>
                            <span id="statTrabajadorUnread" class="unread-badge" style="display: none;">0</span>
                        </div>
                    </div>
                    <div class="channel-card-footer">
                        <button class="btn btn-primary btn-open-channel" data-channel="trabajador-gerencia">
                            <i class="fas fa-comments"></i> Abrir Canal
                        </button>
                    </div>
                </div>
            </div>
        `;

        channelsContainer.appendChild(channelsWrapper);

        // Event listeners para abrir canales
        channelsWrapper.querySelectorAll('.btn-open-channel').forEach(btn => {
            btn.addEventListener('click', () => {
                const channel = btn.dataset.channel;
                openChannelModal(channel);
            });
        });
    }

    /**
     * Abrir modal de canal
     */
    function openChannelModal(channel) {
        // Crear o actualizar modal
        let modal = document.getElementById('channelModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'channelModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        const channelName = channel === 'cliente-gerencia' ? 'Canal Cliente' : 'Canal Trabajadores';

        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>${channelName}</h3>
                    <button class="btn-icon btn-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: 0;">
                    <div id="channelChatContainer" style="height: 600px;"></div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';

        // Inicializar chat del canal
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser?.role || currentUser?.rol || 'jefe';

        // Obtener projectId (usar el primero disponible o el seleccionado)
        const projectId = getCurrentProjectId() || 1;

        if (typeof chatChannelsManager !== 'undefined') {
            // Renderizar solo el canal específico en el modal
            renderChannelInModal(channel, projectId);
        }
    }

    /**
     * Renderizar canal en modal
     */
    function renderChannelInModal(channel, projectId) {
        const container = document.getElementById('channelChatContainer');
        if (!container) return;

        const channelData = {
            'cliente-gerencia': {
                nombre: 'Canal Cliente',
                icon: 'fa-user-tie',
                color: '#8b5cf6',
                subtitle: 'Comunicación con clientes del proyecto'
            },
            'trabajador-gerencia': {
                nombre: 'Canal Trabajadores',
                icon: 'fa-hard-hat',
                color: '#f59e0b',
                subtitle: 'Comunicación con el equipo de obra'
            }
        };

        const config = channelData[channel];
        const channelId = channel.replace('-', '');

        container.innerHTML = `
            <div class="chat-channel-panel active" data-channel="${channel}">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <i class="fas ${config.icon} chat-channel-icon" style="color: ${config.color};"></i>
                        <div>
                            <h3>${config.nombre}</h3>
                            <p class="chat-subtitle">${config.subtitle}</p>
                        </div>
                    </div>
                </div>
                
                <div class="chat-messages" id="chatMessages${channelId}">
                    <div class="chat-loading">
                        <i class="fas fa-spinner fa-spin"></i> Cargando mensajes...
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chatInput${channelId}" 
                        class="chat-input" 
                        placeholder="Escribe un mensaje..."
                        maxlength="500"
                    >
                    <button class="btn-icon btn-send" id="btnSend${channelId}">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        // Inicializar chat del canal
        if (typeof chatChannelsManager !== 'undefined') {
            // Cargar mensajes del canal
            chatChannelsManager.currentProjectId = projectId;
            chatChannelsManager.currentChannel = channel;
            chatChannelsManager.loadChannelMessages(channel);

            // Setup event listeners
            const input = document.getElementById(`chatInput${channelId}`);
            const btnSend = document.getElementById(`btnSend${channelId}`);

            if (btnSend) {
                btnSend.addEventListener('click', () => {
                    chatChannelsManager.sendMessage(channel, input);
                });
            }

            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        chatChannelsManager.sendMessage(channel, input);
                    }
                });
            }
        }
    }

    /**
     * Obtener ID del proyecto actual
     */
    function getCurrentProjectId() {
        // Intentar obtener del estado o de la URL
        return null; // Implementar según necesidad
    }

    /**
     * Agrupar mensajes por proyecto
     */
    function groupMessagesByProject(messages) {
        const grouped = {};
        messages.forEach(msg => {
            const projectId = msg.project_id;
            if (!grouped[projectId]) {
                grouped[projectId] = [];
            }
            grouped[projectId].push(msg);
        });
        return grouped;
    }

    /**
     * Crear grupo de mensajes
     */
    function createMessageGroup(messages) {
        const div = document.createElement('div');
        div.className = 'message-group';

        const unreadCount = messages.filter(m => !m.is_read).length;
        const projectName = messages[0]?.project_name || 'Proyecto';

        div.innerHTML = `
            <div class="message-group-header">
                <h3 class="message-group-title">${projectName}</h3>
                <span class="message-group-count">${unreadCount} no leídos</span>
            </div>
            <div class="message-list">
                ${messages.map(msg => `
                    <div class="message-item-admin ${!msg.is_read ? 'unread' : ''}">
                        <div class="message-item-header">
                            <span class="message-sender">${msg.sender_name}</span>
                            <span class="message-time-admin">${formatTime(new Date(msg.timestamp))}</span>
                        </div>
                        <div class="message-content-admin">${msg.content}</div>
                    </div>
                `).join('')}
            </div>
        `;

        return div;
    }

    /**
     * Ver archivos de proyecto
     */
    window.viewProjectFiles = async function (projectId) {
        const filesPanel = document.getElementById('filesPanel');
        const filesPanelTitle = document.getElementById('filesPanelTitle');
        const filesPanelContent = document.getElementById('filesPanelContent');

        if (filesPanelTitle) {
            filesPanelTitle.textContent = 'Sistema de Archivos del Proyecto';
        }

        // Inicializar sistema de archivos con carpetas separadas (FASE 2)
        try {
            if (filesPanelContent) {
                filesPanelContent.innerHTML = '<p class="loading-text"><i class="fas fa-spinner fa-spin"></i> Cargando sistema de archivos...</p>';
            }

            // Obtener rol del usuario actual
            const currentUser = auth.getCurrentUser();
            const userRole = currentUser?.role || currentUser?.rol || 'jefe';

            // Inicializar el nuevo sistema de archivos
            if (typeof fileSystemManager !== 'undefined') {
                fileSystemManager.init(projectId, 'filesPanelContent', userRole);
            } else {
                // Fallback al sistema anterior
                if (filesPanelContent) {
                    filesPanelContent.innerHTML = '<p class="error-text">Error: Sistema de archivos no disponible</p>';
                }
            }

            // Actualizar información de rol
            const roleInfo = document.getElementById('userRoleInfo');
            if (roleInfo && currentUser) {
                const roleLabels = {
                    'jefe': 'Gerencia: Tienes acceso a todas las carpetas',
                    'admin': 'Administrador: Tienes acceso a todas las carpetas',
                    'cliente': 'Cliente: Solo puedes acceder a la Carpeta Cliente',
                    'trabajador': 'Trabajador: Solo puedes acceder a la Carpeta Obra'
                };
                const userRoleLabel = currentUser.role || currentUser.rol || 'cliente';
                roleInfo.textContent = roleLabels[userRoleLabel] || 'Solo puedes acceder a las carpetas según tu rol.';
            }

        } catch (error) {
            console.error('Error al cargar archivos:', error);
            if (filesPanelContent) {
                filesPanelContent.innerHTML = '<p class="error-text">Error al cargar el sistema de archivos</p>';
            }
        }

        if (filesPanel) {
            filesPanel.style.display = 'flex';
            document.querySelector('.admin-container')?.classList.add('with-panel');
        }

        // Configurar botón de cerrar
        const btnClose = document.getElementById('btnCloseFilesPanel');
        if (btnClose) {
            btnClose.onclick = () => {
                if (filesPanel) {
                    filesPanel.style.display = 'none';
                    document.querySelector('.admin-container')?.classList.remove('with-panel');
                }
            };
        }
    };

    /**
     * Formatear moneda
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    }

    /**
     * Formatear fecha
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Formatear tiempo
     */
    function formatTime(date) {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Inicializar sección de carga de Excel/Word (FASE 6)
     */
    function initExcelUploadSection() {
        const btnUploadExcel = document.getElementById('btnUploadExcel');
        const excelUploadSection = document.getElementById('excelUploadSection');
        const btnCloseExcelUpload = document.getElementById('btnCloseExcelUpload');
        const excelUploadArea = document.getElementById('excelUploadArea');
        const excelFileInput = document.getElementById('excelFileInput');
        const btnProcessExcel = document.getElementById('btnProcessExcel');
        const btnCancelExcel = document.getElementById('btnCancelExcel');
        const excelUploadProgress = document.getElementById('excelUploadProgress');
        const excelProgressBar = document.getElementById('excelProgressBar');
        const excelProgressText = document.getElementById('excelProgressText');
        const excelProcessingStatus = document.getElementById('excelProcessingStatus');
        const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');

        let selectedFile = null;

        // Verificar que excelProcessor esté disponible
        if (typeof excelProcessor === 'undefined') {
            console.error('excelProcessor no está disponible');
            return;
        }

        // Mostrar sección de carga
        if (btnUploadExcel) {
            btnUploadExcel.addEventListener('click', () => {
                if (excelUploadSection) {
                    excelUploadSection.style.display = 'block';
                    excelUploadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        // Cerrar sección de carga
        if (btnCloseExcelUpload) {
            btnCloseExcelUpload.addEventListener('click', () => {
                if (excelUploadSection) {
                    excelUploadSection.style.display = 'none';
                    resetExcelUpload();
                }
            });
        }

        // Click en área de carga
        if (excelUploadArea) {
            excelUploadArea.addEventListener('click', () => {
                if (excelFileInput) {
                    excelFileInput.click();
                }
            });
        }

        // Drag and drop
        if (excelUploadArea) {
            excelUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                excelUploadArea.classList.add('dragover');
            });

            excelUploadArea.addEventListener('dragleave', () => {
                excelUploadArea.classList.remove('dragover');
            });

            excelUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                excelUploadArea.classList.remove('dragover');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileSelect(files[0]);
                }
            });
        }

        // Selección de archivo
        if (excelFileInput) {
            excelFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                }
            });
        }

        // Procesar archivo
        if (btnProcessExcel) {
            btnProcessExcel.addEventListener('click', async () => {
                if (selectedFile) {
                    await processExcelFile(selectedFile);
                }
            });
        }

        // Cancelar
        if (btnCancelExcel) {
            btnCancelExcel.addEventListener('click', () => {
                resetExcelUpload();
            });
        }

        // Descargar plantilla
        if (btnDownloadTemplate) {
            btnDownloadTemplate.addEventListener('click', (e) => {
                e.preventDefault();
                downloadExcelTemplate();
            });
        }

        /**
         * Manejar selección de archivo
         */
        function handleFileSelect(file) {
            // Validar archivo
            const validation = excelProcessor.validateFile(file);

            if (!validation.valid) {
                showExcelStatus('error', validation.errors.join(', '));
                return;
            }

            selectedFile = file;

            // Habilitar botón de procesar
            if (btnProcessExcel) {
                btnProcessExcel.disabled = false;
            }

            // Mostrar información del archivo
            showExcelStatus('info', `Archivo seleccionado: ${file.name} (${excelProcessor.formatFileSize(file.size)})`);
        }

        /**
         * Procesar archivo Excel/Word
         */
        async function processExcelFile(file) {
            try {
                // Mostrar progreso
                if (excelUploadProgress) {
                    excelUploadProgress.classList.add('active');
                }
                updateProgress(10, 'Validando archivo...');

                // Determinar tipo de archivo
                const isExcel = excelProcessor.supportedFormats.excel.includes(file.type);
                const isWord = excelProcessor.supportedFormats.word.includes(file.type);

                let result;

                if (isExcel) {
                    updateProgress(30, 'Procesando archivo Excel...');

                    // Intentar procesar localmente primero
                    try {
                        result = await excelProcessor.processExcelFile(file);
                    } catch (error) {
                        // Si falla, usar n8n
                        console.log('Procesamiento local falló, usando n8n...');
                        updateProgress(40, 'Enviando a n8n para procesamiento...');
                        result = await excelProcessor.processWithN8N(file, 'excel');
                    }
                } else if (isWord) {
                    updateProgress(30, 'Procesando archivo Word...');
                    result = await excelProcessor.processWithN8N(file, 'word');
                } else {
                    throw new Error('Formato de archivo no soportado');
                }

                updateProgress(60, 'Mapeando datos al modelo de proyecto...');

                // Mapear datos al modelo
                const projectId = excelProcessor.getCurrentProjectId();
                const projectData = excelProcessor.mapExcelToProjectModel(result, projectId);

                updateProgress(80, 'Actualizando proyecto...');

                // Actualizar proyecto
                const updateResult = await excelProcessor.updateProjectFromExcel(projectData);

                updateProgress(100, '¡Procesamiento completado!');

                // Mostrar éxito
                showExcelStatus('success', updateResult.message || 'Archivo procesado correctamente');

                // Notificar
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.success('Archivo procesado y proyecto actualizado correctamente');
                }

                // Recargar dashboard
                setTimeout(() => {
                    loadDashboard();
                    resetExcelUpload();
                }, 2000);

            } catch (error) {
                console.error('Error al procesar archivo:', error);
                showExcelStatus('error', error.error || error.message || 'Error al procesar el archivo');

                if (typeof notificationManager !== 'undefined') {
                    notificationManager.error('Error al procesar el archivo: ' + (error.error || error.message));
                }
            }
        }

        /**
         * Actualizar barra de progreso
         */
        function updateProgress(percent, message) {
            if (excelProgressBar) {
                excelProgressBar.style.width = percent + '%';
            }
            if (excelProgressText) {
                excelProgressText.textContent = message || `${percent}%`;
            }
        }

        /**
         * Mostrar estado del procesamiento
         */
        function showExcelStatus(type, message) {
            if (!excelProcessingStatus) return;

            excelProcessingStatus.className = `excel-processing-status active ${type}`;

            const statusIcon = excelProcessingStatus.querySelector('.status-icon');
            const statusMessage = excelProcessingStatus.querySelector('.status-message');

            if (statusIcon) {
                switch (type) {
                    case 'success':
                        statusIcon.className = 'status-icon fas fa-check-circle';
                        break;
                    case 'error':
                        statusIcon.className = 'status-icon fas fa-exclamation-circle';
                        break;
                    case 'info':
                        statusIcon.className = 'status-icon fas fa-info-circle';
                        break;
                }
            }

            if (statusMessage) {
                statusMessage.textContent = message;
            }
        }

        /**
         * Resetear formulario de carga
         */
        function resetExcelUpload() {
            selectedFile = null;

            if (excelFileInput) {
                excelFileInput.value = '';
            }

            if (btnProcessExcel) {
                btnProcessExcel.disabled = true;
            }

            if (excelUploadProgress) {
                excelUploadProgress.classList.remove('active');
            }

            if (excelProgressBar) {
                excelProgressBar.style.width = '0%';
            }

            if (excelProgressText) {
                excelProgressText.textContent = '0%';
            }

            if (excelProcessingStatus) {
                excelProcessingStatus.classList.remove('active');
            }
        }

        /**
         * Descargar plantilla Excel
         */
        function downloadExcelTemplate() {
            // Crear workbook con SheetJS
            if (typeof XLSX === 'undefined') {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.warning('SheetJS no está disponible. Descargando plantilla básica...');
                }
                // Crear plantilla básica sin SheetJS
                createBasicTemplate();
                return;
            }

            const wb = XLSX.utils.book_new();

            // Hoja 1: Información Básica
            const basicInfo = [
                ['INFORMACIÓN BÁSICA DEL PROYECTO'],
                [''],
                ['Nombre Mandante', ''],
                ['Dirección', ''],
                ['Ciudad', ''],
                ['Descripción', '']
            ];
            const ws1 = XLSX.utils.aoa_to_sheet(basicInfo);
            XLSX.utils.book_append_sheet(wb, ws1, 'Información Básica');

            // Hoja 2: Presupuesto
            const budget = [
                ['PRESUPUESTO'],
                [''],
                ['Presupuesto Inicial', 0],
                ['Adicionales', 0],
                ['Gastos Extras', 0]
            ];
            const ws2 = XLSX.utils.aoa_to_sheet(budget);
            XLSX.utils.book_append_sheet(wb, ws2, 'Presupuesto');

            // Hoja 3: Fechas
            const dates = [
                ['FECHAS DEL PROYECTO'],
                [''],
                ['Fecha Inicio', ''],
                ['Fecha Término Estimado', ''],
                ['Fecha Término Modificada', ''],
                ['Fecha Término Real', '']
            ];
            const ws3 = XLSX.utils.aoa_to_sheet(dates);
            XLSX.utils.book_append_sheet(wb, ws3, 'Fechas');

            // Hoja 4: Cubicación
            const cubicacion = [
                ['CUBICACIÓN'],
                [''],
                ['Total M2', 0],
                ['M2 Construidos', 0],
                ['M2 Terreno', 0],
                ['Volumen M3', 0],
                ['Pisos', 0],
                ['Unidades', 0]
            ];
            const ws4 = XLSX.utils.aoa_to_sheet(cubicacion);
            XLSX.utils.book_append_sheet(wb, ws4, 'Cubicación');

            // Descargar
            XLSX.writeFile(wb, 'Plantilla_Proyecto.xlsx');

            if (typeof notificationManager !== 'undefined') {
                notificationManager.success('Plantilla descargada correctamente');
            }
        }

        /**
         * Crear plantilla básica sin SheetJS
         */
        function createBasicTemplate() {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`
PLANTILLA DE PROYECTO - G&H Construcciones SPA

INFORMACIÓN BÁSICA
==================
Nombre Mandante: 
Dirección: 
Ciudad: 
Descripción: 

PRESUPUESTO
===========
Presupuesto Inicial: 0
Adicionales: 0
Gastos Extras: 0

FECHAS
======
Fecha Inicio: 
Fecha Término Estimado: 
Fecha Término Modificada: 
Fecha Término Real: 

CUBICACIÓN
==========
Total M2: 0
M2 Construidos: 0
M2 Terreno: 0
Volumen M3: 0
Pisos: 0
Unidades: 0
            `);
            link.download = 'Plantilla_Proyecto.txt';
            link.click();
        }
    }
});

// Funciones globales para botones (vinculadas a servicios enterprise)
window.editProject = async function (projectId) {
    try {
        const project = await projectService.getProjectById(projectId);
        if (project) {
            // we need to access the openProjectModal function inside the closure or make it global
            // Since it's defined inside the DOMContentLoaded closure, we can't access it unless we move it
            // For now, let's trigger it if possible or expose it
            if (window.openProjectModalGlobal) {
                window.openProjectModalGlobal(project);
            }
        }
    } catch (error) {
        console.error('Error al editar proyecto:', error);
    }
};

window.approveUser = async function (userId) {
    if (confirm('¿Aprobar este usuario?')) {
        try {
            await userService.approveUser(userId, 'trabajador');
            alert('Usuario aprobado exitosamente');
            // La UI se actualizará automáticamente gracias a CoreState
        } catch (error) {
            alert('Error al aprobar usuario: ' + error.message);
        }
    }
};

window.rejectUser = async function (userId) {
    if (confirm('¿Rechazar este usuario? Esta acción no se puede deshacer.')) {
        try {
            await userService.rejectUser(userId);
            alert('Usuario rechazado');
            // La UI se actualizará automáticamente gracias a CoreState
        } catch (error) {
            alert('Error al rechazar usuario: ' + error.message);
        }
    }
};

// Funciones globales para edición de KPIs (Fase 4)
window.abrirModalEdicion = function (fieldId) {
    const modal = new bootstrap.Modal(document.getElementById('modalEdicionKPI'));
    const kpiFieldId = document.getElementById('kpiFieldId');
    const kpiLabel = document.getElementById('kpiLabel');
    const kpiValue = document.getElementById('kpiValue');
    const kpiTitle = document.getElementById('kpiModalTitle');

    const fieldMap = {
        'total_projects': { label: 'Total Proyectos Activos', title: 'Editar Proyectos' },
        'total_users': { label: 'Total Usuarios en Sistema', title: 'Editar Personal' },
        'unread_messages': { label: 'Mensajes sin Leer', title: 'Editar Mensajería' },
        'total_cost': { label: 'Inversión Total Estimada ($)', title: 'Editar Presupuesto' }
    };

    const config = fieldMap[fieldId];
    if (config) {
        kpiFieldId.value = fieldId;
        kpiLabel.textContent = config.label;
        kpiTitle.textContent = config.title;

        // Obtener valor actual desde el DOM
        const currentEl = document.getElementById('stat' + fieldId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(''));
        if (currentEl) {
            let val = currentEl.textContent.replace(/[$.]/g, '').trim();
            kpiValue.value = parseInt(val) || 0;
        }

        modal.show();
    }
};

window.guardarCambiosKPI = async function () {
    const fieldId = document.getElementById('kpiFieldId').value;
    const newValue = document.getElementById('kpiValue').value;

    try {
        // 1. Actualizar en el Objeto Maestro (Simulación de persistencia)
        if (typeof proyectoMaestro !== 'undefined') {
            if (fieldId === 'total_cost') {
                proyectoMaestro.datosGerencia.financiero.presupuestoInicial.monto = parseFloat(newValue);
            }
            // Otros mapeos según necesidad...
            if (typeof guardarProyecto === 'function') guardarProyecto();
        }

        // 2. Notificar al CoreState si está disponible para reactividad
        if (typeof coreState !== 'undefined') {
            const stats = { ...coreState.get('stats.projects') };
            if (fieldId === 'total_projects') stats.total = parseInt(newValue);
            if (fieldId === 'total_cost') stats.totalCost = parseFloat(newValue);
            coreState.set('stats.projects', stats);
        }

        // 3. Actualización manual del DOM como fallback
        const elementId = 'stat' + fieldId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        const element = document.getElementById(elementId);
        if (element) {
            if (fieldId === 'total_cost') {
                element.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(newValue);
            } else {
                element.textContent = newValue;
            }
        }

        // Cerrar modal
        const modalEl = document.getElementById('modalEdicionKPI');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        if (typeof notificationManager !== 'undefined') {
            notificationManager.success('KPI actualizado correctamente');
        } else {
            alert('Cambio guardado exitosamente');
        }

    } catch (error) {
        console.error('Error al guardar KPI:', error);
        alert('Error al guardar los cambios');
    }
};

