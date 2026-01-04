/**
 * ============================================================
 * DASHBOARD TRABAJADOR OPERATIVO - FASE 5
 * ============================================================
 * 
 * Dashboard claro y funcional para trabajadores con:
 * - Registro de horas
 * - Gestión de tareas
 * - Recursos de apoyo (videos e imágenes)
 * - Proyectos asignados
 * - Estadísticas
 */

document.addEventListener('DOMContentLoaded', () => {
    // Esperar un momento para que auth se inicialice completamente
    setTimeout(() => {
        // Verificar autenticación
        if (!auth.isAuthenticated()) {
            console.warn('⚠️ Usuario no autenticado, redirigiendo a login...');
            window.location.href = 'index.html';
            return;
        }

        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            console.warn('⚠️ No se pudo obtener usuario, redirigiendo a login...');
            window.location.href = 'index.html';
            return;
        }

        console.log('✅ Usuario autenticado:', currentUser);

        // Verificar que sea trabajador
        const userRole = currentUser.role || currentUser.rol;
        if (userRole !== 'trabajador') {
            // Redirigir según rol
            if (userRole === 'jefe' || userRole === 'admin') {
                window.location.href = 'panel-jefe.html';
            } else if (userRole === 'cliente') {
                window.location.href = 'dashboard-cliente.html';
            } else {
                window.location.href = 'panel-usuario.html';
            }
            return;
        }

        // Inicializar layout con diseño React
        if (typeof layoutManager !== 'undefined') {
            layoutManager.init('trabajador');

            // Esperar a que el layout se cree
            setTimeout(() => {
                // Mover contenido al main content del layout
                const workerMain = document.getElementById('workerMain');
                const mainContent = document.getElementById('mainContent');

                if (workerMain && mainContent) {
                    // Mover todos los hijos de workerMain al mainContent
                    while (workerMain.firstChild) {
                        mainContent.appendChild(workerMain.firstChild);
                    }
                    workerMain.remove();
                    console.log('✅ Contenido movido al layout correctamente');

                    // Inicializar dashboard DESPUÉS de mover el contenido
                    initDashboard();
                } else {
                    console.warn('⚠️ No se encontraron los elementos para mover el contenido');
                    console.log('workerMain:', workerMain);
                    console.log('mainContent:', mainContent);
                    // Inicializar dashboard de todas formas
                    initDashboard();
                }
            }, 200);
        } else {
            // Si no hay layout manager, inicializar directamente
            initDashboard();
        }
    });

    /**
     * Inicializar dashboard
     */
    function initDashboard() {
        const currentUser = auth.getCurrentUser();

        // Inicializar sistemas de mejora
        if (typeof notificationManager !== 'undefined') {
            notificationManager.init();
        }
        if (typeof stateSync !== 'undefined') {
            // Estado ya se inicializa automáticamente
        }

        // Actualizar nombre del trabajador
        const workerNameEl = document.getElementById('workerName');
        if (workerNameEl) {
            workerNameEl.textContent = currentUser?.name || currentUser?.nombre || 'Trabajador';
        }

        // Configurar event listeners
        setupEventListeners();

        // Inicializar reloj
        initClock();

        // Cargar datos del dashboard
        loadDashboardData();
    }

    /**
     * Configurar event listeners
     */
    function setupEventListeners() {
        // Logout
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    auth.logout();
                    window.location.href = 'index.html';
                }
            });
        }

        // Registro de horas
        const btnClockIn = document.getElementById('btnClockIn');
        const btnClockOut = document.getElementById('btnClockOut');

        if (btnClockIn) {
            btnClockIn.addEventListener('click', handleClockIn);
        }

        if (btnClockOut) {
            btnClockOut.addEventListener('click', handleClockOut);
        }

        // Filtros de tareas
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                filterTasks(filter);
            });
        });

        // Modales
        const btnCloseResource = document.getElementById('btnCloseResource');
        const btnCloseTask = document.getElementById('btnCloseTask');
        const resourceModal = document.getElementById('resourceModal');
        const taskModal = document.getElementById('taskModal');

        if (btnCloseResource && resourceModal) {
            btnCloseResource.addEventListener('click', () => {
                resourceModal.style.display = 'none';
            });
        }

        if (btnCloseTask && taskModal) {
            btnCloseTask.addEventListener('click', () => {
                taskModal.style.display = 'none';
            });
        }

        if (resourceModal) {
            resourceModal.addEventListener('click', (e) => {
                if (e.target === resourceModal) {
                    resourceModal.style.display = 'none';
                }
            });
        }

        if (taskModal) {
            taskModal.addEventListener('click', (e) => {
                if (e.target === taskModal) {
                    taskModal.style.display = 'none';
                }
            });
        }
    }

    /**
     * Inicializar reloj
     */
    function initClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    /**
     * Actualizar reloj
     */
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const timeEl = document.getElementById('currentTime');
        const dateEl = document.getElementById('currentDate');

        if (timeEl) timeEl.textContent = time;
        if (dateEl) dateEl.textContent = date.charAt(0).toUpperCase() + date.slice(1);
    }

    /**
     * Cargar datos del dashboard
     */
    async function loadDashboardData() {
        try {
            const projectData = await getProjectData();

            // Cargar tareas
            loadTasks(projectData);

            // Cargar recursos
            loadResources(projectData);

            // Cargar proyectos
            loadProjects(projectData);

            // Cargar estadísticas
            loadStatistics(projectData);

            // Verificar estado de registro de horas
            checkClockStatus();

            // Funciones globales para edición de KPIs (Fase 4 - Worker)
            window.abrirModalEdicion = function (fieldId) {
                const modalEl = document.getElementById('modalEdicionKPI');
                if (!modalEl) return;

                const modal = new bootstrap.Modal(modalEl);
                const kpiFieldId = document.getElementById('kpiFieldId');
                const kpiLabel = document.getElementById('kpiLabel');
                const kpiValue = document.getElementById('kpiValue');
                const kpiTitle = document.getElementById('kpiModalTitle');

                const fieldMap = {
                    'completed_tasks': { label: 'Tareas Completadas', title: 'Editar Avance' },
                    'assigned_projects': { label: 'Proyectos Asignados', title: 'Editar Carga' },
                    'total_hours': { label: 'Horas Totales', title: 'Editar Jornada' },
                    'performance': { label: 'Porcentaje Desempeño (%)', title: 'Editar Rendimiento' }
                };

                const config = fieldMap[fieldId];
                if (config) {
                    kpiFieldId.value = fieldId;
                    kpiLabel.textContent = config.label;
                    kpiTitle.textContent = config.title;

                    // Obtener valor actual
                    const statId = 'stat' + fieldId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                    const currentEl = document.getElementById(statId);
                    if (currentEl) {
                        let val = currentEl.textContent.replace(/[h%]/g, '').trim();
                        kpiValue.value = parseInt(val) || 0;
                    }

                    modal.show();
                }
            };

            window.guardarCambiosKPI = async function () {
                const fieldId = document.getElementById('kpiFieldId').value;
                const newValue = document.getElementById('kpiValue').value;

                try {
                    const statId = 'stat' + fieldId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                    const element = document.getElementById(statId);

                    if (element) {
                        let suffix = '';
                        if (fieldId === 'total_hours') suffix = 'h';
                        if (fieldId === 'performance') suffix = '%';
                        element.textContent = newValue + suffix;
                    }

                    // Cerrar modal
                    const modalEl = document.getElementById('modalEdicionKPI');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();

                    if (typeof notificationManager !== 'undefined') {
                        notificationManager.success('Dato actualizado correctamente');
                    }
                } catch (error) {
                    console.error('Error al guardar KPI:', error);
                }
            };

        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
        }
    }

    /**
     * Obtener datos del proyecto
     */
    async function getProjectData() {
        // Intentar cargar desde API
        if (typeof api !== 'undefined' && api.getProjects) {
            try {
                const projects = await api.getProjects();
                if (projects.length > 0) {
                    return projects[0];
                }
            } catch (error) {
                console.warn('Error al cargar desde API, usando datos demo:', error);
            }
        }

        // Usar datos del modelo (FASE 1)
        if (typeof window.masterProjectDataModel !== 'undefined' && window.masterProjectDataModel) {
            const projects = window.masterProjectDataModel.projects || [];
            if (projects.length > 0) {
                return projects[0];
            }
        }

        // También intentar PROJECT_DATA_MODEL si existe
        if (typeof window.PROJECT_DATA_MODEL !== 'undefined' && window.PROJECT_DATA_MODEL) {
            try {
                const project = window.PROJECT_DATA_MODEL.createProject({ project_id: 'PROJ001' });
                if (project) return project;
            } catch (error) {
                console.warn('Error al crear proyecto desde PROJECT_DATA_MODEL:', error);
            }
        }

        // Datos demo
        return {
            id: 'PROJ001',
            nombre_mandante: 'Edificio Central',
            trabajador_ux: {
                tareas_asignadas: [
                    {
                        id: 'TASK001',
                        nombre: 'Hormigonado Losa Nivel 2',
                        proyecto_id: 'PROJ001',
                        estado: 'en_progreso',
                        fecha_limite: '2023-04-20',
                        descripcion: 'Realizar hormigonado de la losa del nivel 2 siguiendo las especificaciones técnicas.',
                        recursos_apoyo: [
                            {
                                tipo: 'video',
                                titulo: 'Técnicas de Hormigonado',
                                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                                descripcion: 'Video tutorial sobre técnicas correctas de hormigonado'
                            },
                            {
                                tipo: 'imagen',
                                titulo: 'Diagrama de Hormigonado',
                                url: '/img/diagrama_hormigonado.png',
                                descripcion: 'Diagrama técnico del proceso de hormigonado'
                            }
                        ]
                    },
                    {
                        id: 'TASK002',
                        nombre: 'Instalación Eléctrica Nivel 1',
                        proyecto_id: 'PROJ001',
                        estado: 'pendiente',
                        fecha_limite: '2023-04-25',
                        descripcion: 'Instalar sistema eléctrico completo del nivel 1.',
                        recursos_apoyo: [
                            {
                                tipo: 'imagen',
                                titulo: 'Diagrama Eléctrico',
                                url: '/img/diagrama_electrico.png',
                                descripcion: 'Diagrama del sistema eléctrico'
                            }
                        ]
                    }
                ],
                horas_registradas: [
                    { fecha: '2023-04-10', horas: 8, proyecto_id: 'PROJ001', descripcion: 'Jornada completa' },
                    { fecha: '2023-04-11', horas: 9, proyecto_id: 'PROJ001', descripcion: 'Horas extras por hormigonado' }
                ],
                recursos_generales: [
                    {
                        id: 'RES001',
                        titulo: 'Manual de Seguridad en Obra',
                        tipo: 'pdf',
                        url: '/docs/manual_seguridad.pdf',
                        descripcion: 'Manual completo de seguridad y protocolos en obra'
                    },
                    {
                        id: 'RES002',
                        titulo: 'Guía de Uso de Herramientas',
                        tipo: 'video',
                        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        descripcion: 'Video tutorial sobre el uso correcto de herramientas'
                    }
                ]
            }
        };
    }

    /**
     * Cargar tareas
     */
    function loadTasks(projectData) {
        const trabajadorUx = projectData.trabajador_ux || {};
        const tareas = trabajadorUx.tareas_asignadas || [];
        const container = document.getElementById('tasksGrid');

        if (!container) return;

        container.innerHTML = '';

        if (tareas.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay tareas asignadas</p>';
            return;
        }

        // Guardar tareas globalmente para filtrado
        window.allTasks = tareas;

        tareas.forEach((tarea, index) => {
            const card = createTaskCard(tarea, index);
            container.appendChild(card);
        });
    }

    /**
     * Crear tarjeta de tarea
     */
    function createTaskCard(tarea, index) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.taskId = tarea.id;
        card.dataset.taskStatus = tarea.estado;

        const statusClass = tarea.estado === 'completado' ? 'completed' :
            tarea.estado === 'en_progreso' ? 'in-progress' : 'pending';
        const statusText = tarea.estado === 'completado' ? 'Completada' :
            tarea.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente';

        card.innerHTML = `
        <div class="task-card-header">
            <h3 class="task-name">${escapeHtml(tarea.nombre)}</h3>
            <span class="task-status ${statusClass}">${statusText}</span>
        </div>
        <div class="task-info">
            <div class="task-info-item">
                <i class="fas fa-calendar"></i>
                <span>Fecha límite: ${formatDate(tarea.fecha_limite)}</span>
            </div>
            <div class="task-info-item">
                <i class="fas fa-folder"></i>
                <span>Proyecto: ${escapeHtml(tarea.proyecto_id)}</span>
            </div>
            ${tarea.recursos_apoyo && tarea.recursos_apoyo.length > 0 ? `
            <div class="task-info-item">
                <i class="fas fa-book"></i>
                <span>${tarea.recursos_apoyo.length} recurso(s) disponible(s)</span>
            </div>
            ` : ''}
        </div>
        <div class="task-actions">
            <button class="btn-task" onclick="openTaskDetail('${tarea.id}')">
                <i class="fas fa-eye"></i>
                Ver Detalles
            </button>
            ${tarea.estado !== 'completado' ? `
            <button class="btn-task primary" onclick="updateTaskStatus('${tarea.id}')">
                <i class="fas fa-check"></i>
                ${tarea.estado === 'pendiente' ? 'Iniciar' : 'Completar'}
            </button>
            ` : ''}
        </div>
    `;

        // Animación de entrada
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.3s ease-out';
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 50);

        return card;
    }

    /**
     * Abrir detalle de tarea
     */
    window.openTaskDetail = function (taskId) {
        const tareas = window.allTasks || [];
        const tarea = tareas.find(t => t.id === taskId);

        if (!tarea) return;

        const modal = document.getElementById('taskModal');
        const title = document.getElementById('taskModalTitle');
        const content = document.getElementById('taskContent');

        if (!modal || !title || !content) return;

        title.textContent = tarea.nombre;

        const statusClass = tarea.estado === 'completado' ? 'completed' :
            tarea.estado === 'en_progreso' ? 'in-progress' : 'pending';
        const statusText = tarea.estado === 'completado' ? 'Completada' :
            tarea.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente';

        content.innerHTML = `
        <div class="task-detail-header">
            <h2 class="task-detail-name">${escapeHtml(tarea.nombre)}</h2>
            <span class="task-status ${statusClass}">${statusText}</span>
            <div class="task-detail-info">
                <div class="task-detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Fecha límite: ${formatDate(tarea.fecha_limite)}</span>
                </div>
                <div class="task-detail-item">
                    <i class="fas fa-folder"></i>
                    <span>Proyecto: ${escapeHtml(tarea.proyecto_id)}</span>
                </div>
            </div>
        </div>
        ${tarea.descripcion ? `
        <div class="task-detail-description">
            <h3>Descripción</h3>
            <p>${escapeHtml(tarea.descripcion)}</p>
        </div>
        ` : ''}
        ${tarea.recursos_apoyo && tarea.recursos_apoyo.length > 0 ? `
        <div class="task-resources">
            <h3 class="task-resources-title">Recursos de Apoyo</h3>
            ${tarea.recursos_apoyo.map((recurso, index) => `
                <div class="task-resource-item" onclick="openResource('${taskId}', ${index})">
                    <div class="task-resource-icon">
                        <i class="fas ${recurso.tipo === 'video' ? 'fa-video' : 'fa-image'}"></i>
                    </div>
                    <div class="task-resource-info">
                        <p class="task-resource-name">${escapeHtml(recurso.titulo)}</p>
                        <p class="task-resource-type">${recurso.tipo === 'video' ? 'Video' : 'Imagen'}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;

        modal.style.display = 'flex';
    };

    /**
     * Abrir recurso de apoyo
     */
    window.openResource = function (taskId, resourceIndex) {
        const tareas = window.allTasks || [];
        const tarea = tareas.find(t => t.id === taskId);

        if (!tarea || !tarea.recursos_apoyo || !tarea.recursos_apoyo[resourceIndex]) return;

        const recurso = tarea.recursos_apoyo[resourceIndex];
        const modal = document.getElementById('resourceModal');
        const title = document.getElementById('resourceModalTitle');
        const content = document.getElementById('resourceContent');

        if (!modal || !title || !content) return;

        title.textContent = recurso.titulo;

        if (recurso.tipo === 'video') {
            content.innerHTML = `
            <div class="resource-description-text">
                ${recurso.descripcion ? `<p>${escapeHtml(recurso.descripcion)}</p>` : ''}
            </div>
            <iframe 
                class="resource-video"
                src="${recurso.url}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
            ></iframe>
        `;
        } else if (recurso.tipo === 'imagen') {
            content.innerHTML = `
            <div class="resource-description-text">
                ${recurso.descripcion ? `<p>${escapeHtml(recurso.descripcion)}</p>` : ''}
            </div>
            <img 
                src="${recurso.url}" 
                alt="${escapeHtml(recurso.titulo)}" 
                class="resource-image"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23e5e7eb\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%239ca3af\' font-family=\'Arial\' font-size=\'18\'%3EImagen no disponible%3C/text%3E%3C/svg%3E'"
            >
        `;
        }

        modal.style.display = 'flex';
    };

    /**
     * Actualizar estado de tarea
     */
    window.updateTaskStatus = function (taskId) {
        const tareas = window.allTasks || [];
        const tarea = tareas.find(t => t.id === taskId);

        if (!tarea) return;

        if (tarea.estado === 'pendiente') {
            tarea.estado = 'en_progreso';
        } else if (tarea.estado === 'en_progreso') {
            tarea.estado = 'completado';
        }

        // Recargar tareas
        loadTasks({ trabajador_ux: { tareas_asignadas: tareas } });

        // Actualizar estadísticas
        getProjectData().then(projectData => {
            projectData.trabajador_ux.tareas_asignadas = tareas;
            loadStatistics(projectData);
        });

        if (typeof notificationManager !== 'undefined') {
            notificationManager.success('Estado de tarea actualizado');
        } else {
            alert('Estado de tarea actualizado');
        }
    };

    /**
     * Filtrar tareas
     */
    function filterTasks(filter) {
        const cards = document.querySelectorAll('.task-card');

        cards.forEach(card => {
            if (filter === 'all') {
                card.style.display = '';
            } else {
                const status = card.dataset.taskStatus;
                if (filter === 'pending' && status === 'pendiente') {
                    card.style.display = '';
                } else if (filter === 'in-progress' && status === 'en_progreso') {
                    card.style.display = '';
                } else if (filter === 'completed' && status === 'completado') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    /**
     * Cargar recursos
     */
    function loadResources(projectData) {
        const trabajadorUx = projectData.trabajador_ux || {};
        const recursos = trabajadorUx.recursos_generales || [];
        const container = document.getElementById('resourcesGrid');

        if (!container) return;

        container.innerHTML = '';

        if (recursos.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay recursos disponibles</p>';
            return;
        }

        recursos.forEach((recurso, index) => {
            const card = createResourceCard(recurso, index);
            container.appendChild(card);
        });
    }

    /**
     * Crear tarjeta de recurso
     */
    function createResourceCard(recurso, index) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.onclick = () => openGeneralResource(recurso);

        const icon = recurso.tipo === 'video' ? 'fa-video' :
            recurso.tipo === 'pdf' ? 'fa-file-pdf' :
                recurso.tipo === 'imagen' ? 'fa-image' : 'fa-file';

        card.innerHTML = `
        <div class="resource-icon">
            <i class="fas ${icon}"></i>
        </div>
        <h3 class="resource-title">${escapeHtml(recurso.titulo)}</h3>
        <p class="resource-description">${escapeHtml(recurso.descripcion || '')}</p>
        <span class="resource-type">${recurso.tipo.toUpperCase()}</span>
    `;

        return card;
    }

    /**
     * Abrir recurso general
     */
    function openGeneralResource(recurso) {
        const modal = document.getElementById('resourceModal');
        const title = document.getElementById('resourceModalTitle');
        const content = document.getElementById('resourceContent');

        if (!modal || !title || !content) return;

        title.textContent = recurso.titulo;

        if (recurso.tipo === 'video') {
            content.innerHTML = `
            <div class="resource-description-text">
                ${recurso.descripcion ? `<p>${escapeHtml(recurso.descripcion)}</p>` : ''}
            </div>
            <iframe 
                class="resource-video"
                src="${recurso.url}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
            ></iframe>
        `;
        } else if (recurso.tipo === 'imagen') {
            content.innerHTML = `
            <div class="resource-description-text">
                ${recurso.descripcion ? `<p>${escapeHtml(recurso.descripcion)}</p>` : ''}
            </div>
            <img 
                src="${recurso.url}" 
                alt="${escapeHtml(recurso.titulo)}" 
                class="resource-image"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23e5e7eb\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%239ca3af\' font-family=\'Arial\' font-size=\'18\'%3EImagen no disponible%3C/text%3E%3C/svg%3E'"
            >
        `;
        } else if (recurso.tipo === 'pdf') {
            content.innerHTML = `
            <div class="resource-description-text">
                ${recurso.descripcion ? `<p>${escapeHtml(recurso.descripcion)}</p>` : ''}
            </div>
            <iframe 
                class="resource-pdf"
                src="${recurso.url}" 
                frameborder="0"
            ></iframe>
        `;
        }

        modal.style.display = 'flex';
    }

    /**
     * Cargar proyectos
     */
    function loadProjects(projectData) {
        const container = document.getElementById('projectsList');
        if (!container) return;

        // Por ahora mostrar solo el proyecto actual
        container.innerHTML = `
        <div class="project-item">
            <div class="project-info">
                <h3 class="project-name">${escapeHtml(projectData.nombre_mandante || 'Proyecto')}</h3>
                <p class="project-details">${escapeHtml(projectData.descripcion || 'Sin descripción')}</p>
            </div>
        </div>
    `;
    }

    /**
     * Cargar estadísticas
     */
    function loadStatistics(projectData) {
        const trabajadorUx = projectData.trabajador_ux || {};
        const tareas = trabajadorUx.tareas_asignadas || [];
        const horas = trabajadorUx.horas_registradas || [];

        // Calcular estadísticas
        const totalHours = horas.reduce((sum, h) => sum + (h.horas || 0), 0);
        const completedTasks = tareas.filter(t => t.estado === 'completado').length;
        const pendingTasks = tareas.filter(t => t.estado === 'pendiente').length;
        const assignedProjects = 1; // Por ahora

        // Actualizar elementos
        const statTotalHours = document.getElementById('statTotalHours');
        const statCompletedTasks = document.getElementById('statCompletedTasks');
        const statPendingTasks = document.getElementById('statPendingTasks');
        const statAssignedProjects = document.getElementById('statAssignedProjects');
        const todayHours = document.getElementById('todayHours');
        const activeTasks = document.getElementById('activeTasks');

        if (statTotalHours) statTotalHours.textContent = `${totalHours}h`;
        if (statCompletedTasks) statCompletedTasks.textContent = completedTasks;
        if (statPendingTasks) statPendingTasks.textContent = pendingTasks;
        if (statAssignedProjects) statAssignedProjects.textContent = assignedProjects;
        if (todayHours) {
            const today = new Date().toISOString().split('T')[0];
            const todayHoursValue = horas.find(h => h.fecha === today)?.horas || 0;
            todayHours.textContent = `${todayHoursValue}h`;
        }
        if (activeTasks) {
            const active = tareas.filter(t => t.estado === 'en_progreso').length;
            activeTasks.textContent = active;
        }
    }

    /**
     * Manejar entrada de horas
     */
    function handleClockIn() {
        const projectId = prompt('Selecciona el proyecto (por ahora usar PROJ001):', 'PROJ001');
        if (!projectId) return;

        const now = new Date();
        const clockInData = {
            fecha: now.toISOString().split('T')[0],
            hora_entrada: now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
            proyecto_id: projectId
        };

        // Guardar en localStorage
        const clockIns = JSON.parse(localStorage.getItem('workerClockIns') || '[]');
        clockIns.push(clockInData);
        localStorage.setItem('workerClockIns', JSON.stringify(clockIns));

        // Actualizar UI
        const btnClockIn = document.getElementById('btnClockIn');
        const btnClockOut = document.getElementById('btnClockOut');
        const hoursSummary = document.getElementById('hoursSummary');
        const currentProject = document.getElementById('currentProject');

        if (btnClockIn) btnClockIn.style.display = 'none';
        if (btnClockOut) btnClockOut.style.display = 'flex';
        if (hoursSummary) hoursSummary.style.display = 'flex';
        if (currentProject) currentProject.textContent = projectId;

        // Usar sistema de notificaciones mejorado
        if (typeof notificationManager !== 'undefined') {
            notificationManager.success('Entrada registrada correctamente');
        } else {
            alert('Entrada registrada correctamente');
        }
    }

    /**
     * Manejar salida de horas
     */
    function handleClockOut() {
        const clockIns = JSON.parse(localStorage.getItem('workerClockIns') || '[]');
        if (clockIns.length === 0) return;

        const lastClockIn = clockIns[clockIns.length - 1];
        const now = new Date();
        const entrada = new Date(`${lastClockIn.fecha}T${lastClockIn.hora_entrada}`);
        const horas = (now - entrada) / (1000 * 60 * 60);

        // Guardar salida
        lastClockIn.hora_salida = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        lastClockIn.horas = Math.round(horas * 10) / 10;
        localStorage.setItem('workerClockIns', JSON.stringify(clockIns));

        // Actualizar UI
        const btnClockIn = document.getElementById('btnClockIn');
        const btnClockOut = document.getElementById('btnClockOut');
        const hoursSummary = document.getElementById('hoursSummary');
        const todayHoursValue = document.getElementById('todayHoursValue');

        if (btnClockIn) btnClockIn.style.display = 'flex';
        if (btnClockOut) btnClockOut.style.display = 'none';
        if (hoursSummary) hoursSummary.style.display = 'none';
        if (todayHoursValue) {
            const today = new Date().toISOString().split('T')[0];
            const todayHours = clockIns
                .filter(c => c.fecha === today && c.horas)
                .reduce((sum, c) => sum + c.horas, 0);
            todayHoursValue.textContent = `${Math.floor(todayHours)}h ${Math.round((todayHours % 1) * 60)}m`;
        }

        const message = `Salida registrada. Horas trabajadas: ${lastClockIn.horas.toFixed(1)}h`;
        if (typeof notificationManager !== 'undefined') {
            notificationManager.success(message);
        } else {
            alert(message);
        }
    }

    /**
     * Verificar estado de registro de horas
     */
    function checkClockStatus() {
        const clockIns = JSON.parse(localStorage.getItem('workerClockIns') || '[]');
        if (clockIns.length === 0) return;

        const lastClockIn = clockIns[clockIns.length - 1];
        if (!lastClockIn.hora_salida) {
            // Hay una entrada activa
            const btnClockIn = document.getElementById('btnClockIn');
            const btnClockOut = document.getElementById('btnClockOut');
            const hoursSummary = document.getElementById('hoursSummary');
            const currentProject = document.getElementById('currentProject');

            if (btnClockIn) btnClockIn.style.display = 'none';
            if (btnClockOut) btnClockOut.style.display = 'flex';
            if (hoursSummary) hoursSummary.style.display = 'flex';
            if (currentProject) currentProject.textContent = lastClockIn.proyecto_id;
        }
    }

    /**
     * Utilidades
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

