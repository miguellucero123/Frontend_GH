/**
 * Lógica del Dashboard de Trabajador
 * Refactorizado para Fase 1: Centralización
 * Versión Completa con todas las funcionalidades
 * Sin onclick inline - Todos los eventos centralizados
 */

let workerData = null;

document.addEventListener('DOMContentLoaded', () => {
    if (auth.requireRole('trabajador')) {
        initUI();
        loadWorkerData();
        initCharts();
        initChatWidget();
        initEventListeners(); // Centralizar todos los event listeners
    }
});

/**
 * Inicializar todos los event listeners (sin onclick inline)
 */
function initEventListeners() {
    // Botones de acción principales
    document.getElementById('btnVerProyectos')?.addEventListener('click', verProyectos);
    document.getElementById('btnVerTareas')?.addEventListener('click', verTareas);
    document.getElementById('btnVerDocumentos')?.addEventListener('click', verDocumentos);
    document.getElementById('btnVerMensajes')?.addEventListener('click', verMensajes);
    document.getElementById('btnVerHerramientas')?.addEventListener('click', verHerramientas);
    document.getElementById('btnAbrirModalReporte')?.addEventListener('click', abrirModalReporte);

    // Botones de edición KPI
    document.getElementById('btnEditCompletedTasks')?.addEventListener('click', () => abrirModalEdicion('completed_tasks'));
    document.getElementById('btnEditAssignedProjects')?.addEventListener('click', () => abrirModalEdicion('assigned_projects'));
    document.getElementById('btnEditTotalHours')?.addEventListener('click', () => abrirModalEdicion('total_hours'));
    document.getElementById('btnEditPerformance')?.addEventListener('click', () => abrirModalEdicion('performance'));

    // Botones de modales
    document.getElementById('btnGuardarKPI')?.addEventListener('click', guardarCambiosKPI);
    document.getElementById('btnEnviarReporte')?.addEventListener('click', enviarReporte);

    // Range input para progreso
    document.getElementById('progresoRange')?.addEventListener('input', function () {
        this.nextElementSibling.value = this.value;
    });
}

function initUI() {
    const user = auth.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name || user.username;
        const roleEl = document.getElementById('userRole');
        if (roleEl) roleEl.textContent = 'Trabajador de Construcción';
    }
}

function logout() {
    auth.logout();
}

/**
 * Cargar datos del trabajador
 */
async function loadWorkerData() {
    try {
        const user = auth.getCurrentUser();

        // Mock data para demostración
        workerData = {
            completedTasks: 24,
            activeTasks: 3,
            assignedProjects: 4,
            totalHours: 168,
            todayHours: 6.5,
            performance: 92,
            proyectos: [
                { id: 1, nombre: 'Casa Moderna', ubicacion: 'Providencia', estado: 'activo', rol: 'Albañil Senior' },
                { id: 2, nombre: 'Edificio Costanera', ubicacion: 'Las Condes', estado: 'activo', rol: 'Especialista Hormigón' },
                { id: 3, nombre: 'Condominio Norte', ubicacion: 'Vitacura', estado: 'pausado', rol: 'Apoyo General' },
                { id: 4, nombre: 'Centro Comercial Sur', ubicacion: 'La Florida', estado: 'activo', rol: 'Supervisor Turno' }
            ],
            tareas: [
                { id: 1, nombre: 'Hormigonado losa nivel 3', proyecto: 'Edificio Costanera', prioridad: 'alta', estado: 'pendiente' },
                { id: 2, nombre: 'Instalación tuberías baño', proyecto: 'Casa Moderna', prioridad: 'media', estado: 'en_progreso' },
                { id: 3, nombre: 'Revisión estructural', proyecto: 'Condominio Norte', prioridad: 'baja', estado: 'pendiente' },
                { id: 4, nombre: 'Pintura fachada este', proyecto: 'Casa Moderna', prioridad: 'media', estado: 'pendiente' }
            ],
            documentos: [
                { id: 1, nombre: 'Manual de Seguridad 2024', tipo: 'pdf', fecha: '2024-01-15' },
                { id: 2, nombre: 'Planos Estructurales v2', tipo: 'dwg', fecha: '2024-02-20' },
                { id: 3, nombre: 'Especificaciones Técnicas', tipo: 'pdf', fecha: '2024-03-01' },
                { id: 4, nombre: 'Normativa Construcción', tipo: 'pdf', fecha: '2024-03-10' }
            ],
            herramientas: [
                { id: 1, nombre: 'Calculadora de Hormigón', icono: 'fa-calculator', color: 'blue' },
                { id: 2, nombre: 'Conversor de Unidades', icono: 'fa-exchange-alt', color: 'green' },
                { id: 3, nombre: 'Checklist de Seguridad', icono: 'fa-clipboard-check', color: 'orange' },
                { id: 4, nombre: 'Registro de Horas', icono: 'fa-clock', color: 'purple' }
            ]
        };

        updateWorkerStats();

    } catch (error) {
        console.error('Error cargando datos del trabajador:', error);
    }
}

function updateWorkerStats() {
    if (!workerData) return;

    document.getElementById('statCompletedTasks').textContent = workerData.completedTasks;
    document.getElementById('activeTasks').textContent = workerData.activeTasks;
    document.getElementById('statAssignedProjects').textContent = workerData.assignedProjects;
    document.getElementById('statTotalHours').textContent = `${workerData.totalHours}h`;
    document.getElementById('todayHours').textContent = `${workerData.todayHours}h`;
    document.getElementById('statPerformance').textContent = `${workerData.performance}%`;
}

function initCharts() {
    if (typeof visualService !== 'undefined') {
        visualService.renderWorkerHoursChart('workerHoursChart');
    }
}

/**
 * Inicializar widget de chat con gerencia
 */
function initChatWidget() {
    let chatContainer = document.getElementById('chatWidgetContainer');
    if (!chatContainer) {
        chatContainer = document.createElement('div');
        chatContainer.id = 'chatWidgetContainer';
        chatContainer.className = 'fixed bottom-6 right-6 z-50';
        chatContainer.innerHTML = `
            <button id="btnOpenChat" class="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all">
                <i class="fas fa-comments text-xl"></i>
                <span id="chatUnreadBadge" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center hidden">0</span>
            </button>
        `;
        document.body.appendChild(chatContainer);

        document.getElementById('btnOpenChat').addEventListener('click', abrirChatGerencia);
    }
}

// ==================== ACCIONES DE BOTONES ====================

/**
 * Ver proyectos asignados
 */
window.verProyectos = function () {
    if (!workerData) return;

    const estadoClasses = {
        'activo': 'bg-emerald-500',
        'pausado': 'bg-orange-500',
        'completado': 'bg-blue-500'
    };

    const modalHtml = `
        <div class="modal fade" id="modalProyectos" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-list-check text-emerald-400 me-2"></i>Mis Proyectos Asignados</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-3">
                            ${workerData.proyectos.map(p => `
                                <div class="col-md-6">
                                    <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h6 class="text-white mb-0">${p.nombre}</h6>
                                            <span class="badge ${estadoClasses[p.estado]}">${p.estado}</span>
                                        </div>
                                        <p class="text-slate-400 small mb-1"><i class="fas fa-map-marker-alt me-1"></i>${p.ubicacion}</p>
                                        <p class="text-emerald-400 small mb-0"><i class="fas fa-user-hard-hat me-1"></i>${p.rol}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalProyectos')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalProyectos')).show();
};

/**
 * Ver tareas pendientes
 */
window.verTareas = function () {
    if (!workerData) return;

    const prioridadClasses = {
        'alta': { bg: 'bg-red-500/20', text: 'text-red-400', icon: 'fa-exclamation-circle' },
        'media': { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: 'fa-minus-circle' },
        'baja': { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'fa-arrow-circle-down' }
    };

    const modalHtml = `
        <div class="modal fade" id="modalTareas" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-tasks text-orange-400 me-2"></i>Mis Tareas</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="list-group">
                            ${workerData.tareas.map(t => {
        const p = prioridadClasses[t.prioridad];
        return `
                                <div class="list-group-item d-flex justify-content-between align-items-center" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                    <div>
                                        <div class="d-flex align-items-center gap-2 mb-1">
                                            <i class="fas ${p.icon} ${p.text}"></i>
                                            <strong>${t.nombre}</strong>
                                        </div>
                                        <small class="text-slate-400">${t.proyecto}</small>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <span class="badge ${p.bg} ${p.text}">${t.prioridad}</span>
                                        <button class="btn btn-sm btn-outline-success" onclick="marcarTareaCompleta(${t.id})">
                                            <i class="fas fa-check"></i>
                                        </button>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalTareas')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalTareas')).show();
};

window.marcarTareaCompleta = function (tareaId) {
    alert(`Tarea #${tareaId} marcada como completada. (En producción, esto actualizaría el backend)`);
    workerData.completedTasks++;
    workerData.activeTasks--;
    updateWorkerStats();
};

/**
 * Ver documentos
 */
window.verDocumentos = function () {
    if (!workerData) return;

    const tipoIcons = {
        'pdf': { icon: 'fa-file-pdf', color: 'text-red-400' },
        'dwg': { icon: 'fa-file-image', color: 'text-purple-400' },
        'doc': { icon: 'fa-file-word', color: 'text-blue-400' }
    };

    const modalHtml = `
        <div class="modal fade" id="modalDocumentos" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-file-alt text-purple-400 me-2"></i>Documentos Técnicos</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="list-group">
                            ${workerData.documentos.map(d => {
        const t = tipoIcons[d.tipo] || { icon: 'fa-file', color: 'text-slate-400' };
        return `
                                <div class="list-group-item d-flex justify-content-between align-items-center" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                    <div>
                                        <i class="fas ${t.icon} ${t.color} me-2"></i>
                                        ${d.nombre}
                                        <small class="text-slate-400 d-block">${d.fecha}</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-light" onclick="descargarDocumento(${d.id})">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalDocumentos')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalDocumentos')).show();
};

window.descargarDocumento = function (docId) {
    alert(`Descargando documento #${docId}... (En producción, esto iniciaría la descarga real)`);
};

/**
 * Ver mensajes / Chat con gerencia
 */
window.verMensajes = function () {
    abrirChatGerencia();
};

/**
 * Abrir chat con gerencia
 */
window.abrirChatGerencia = function () {
    const modalHtml = `
        <div class="modal fade" id="modalChatGerencia" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1); height: 500px;">
                    <div class="modal-header border-white/10" style="background: linear-gradient(135deg, #059669, #10b981);">
                        <h5 class="modal-title font-bold text-white"><i class="fas fa-comments me-2"></i>Chat con Gerencia</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-0 d-flex flex-column" style="height: calc(100% - 120px);">
                        <div id="chatMessagesWorker" class="flex-grow-1 p-3 overflow-auto" style="background: #0f172a;">
                            <div class="text-center text-slate-500 py-4">
                                <i class="fas fa-comments fa-2x mb-2"></i>
                                <p>Comunícate con tu supervisor</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-white/10 p-2">
                        <div class="input-group">
                            <input type="text" id="chatInputWorker" class="form-control" style="background: #0f172a; border-color: rgba(255,255,255,0.1); color: white;" placeholder="Escribe un mensaje...">
                            <button class="btn btn-success" onclick="enviarMensajeChatWorker()"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalChatGerencia')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalChatGerencia')).show();

    document.getElementById('chatInputWorker').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensajeChatWorker();
    });
};

window.enviarMensajeChatWorker = function () {
    const input = document.getElementById('chatInputWorker');
    const msg = input.value.trim();
    if (!msg) return;

    const container = document.getElementById('chatMessagesWorker');

    if (container.querySelector('.text-center')) {
        container.innerHTML = '';
    }

    container.insertAdjacentHTML('beforeend', `
        <div class="d-flex justify-content-end mb-2">
            <div class="p-2 rounded-lg" style="background: #059669; max-width: 75%;">
                <p class="mb-0 small text-white">${msg}</p>
                <small class="text-emerald-200" style="font-size: 10px;">Ahora</small>
            </div>
        </div>
    `);

    input.value = '';
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        container.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-start mb-2">
                <div class="p-2 rounded-lg" style="background: rgba(255,255,255,0.1); max-width: 75%;">
                    <small class="text-emerald-400 d-block" style="font-size: 10px;">Supervisor</small>
                    <p class="mb-0 small text-white">Recibido. Te responderemos a la brevedad.</p>
                    <small class="text-slate-400" style="font-size: 10px;">Ahora</small>
                </div>
            </div>
        `);
        container.scrollTop = container.scrollHeight;
    }, 1000);
};

/**
 * Ver herramientas
 */
window.verHerramientas = function () {
    if (!workerData) return;

    const colorClasses = {
        'blue': 'bg-blue-600/30 text-blue-400',
        'green': 'bg-emerald-600/30 text-emerald-400',
        'orange': 'bg-orange-600/30 text-orange-400',
        'purple': 'bg-purple-600/30 text-purple-400'
    };

    const modalHtml = `
        <div class="modal fade" id="modalHerramientas" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-tools text-slate-400 me-2"></i>Herramientas de Trabajo</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-3">
                            ${workerData.herramientas.map(h => `
                                <div class="col-6">
                                    <button class="w-100 p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);" onclick="abrirHerramienta('${h.nombre}')">
                                        <div class="w-12 h-12 rounded-xl ${colorClasses[h.color]} mx-auto mb-2 d-flex align-items-center justify-content-center">
                                            <i class="fas ${h.icono} text-xl"></i>
                                        </div>
                                        <p class="text-white small mb-0">${h.nombre}</p>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalHerramientas')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalHerramientas')).show();
};

window.abrirHerramienta = function (nombre) {
    alert(`Abriendo: ${nombre}\n(En producción, esto abriría la herramienta correspondiente)`);
};

// Lógica de Reportes
function abrirModalReporte() {
    const modalEl = document.getElementById('modalReporte');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function enviarReporte() {
    const btn = event.target;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        alert('Reporte enviado con éxito al supervisor.');

        const modalEl = document.getElementById('modalReporte');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        document.getElementById('formReporte').reset();

        btn.innerHTML = 'Enviar Reporte';
        btn.disabled = false;
    }, 1000);
}

// Lógica de Edición de KPIs (Trabajador)
window.abrirModalEdicion = function (fieldId) {
    const modalEl = document.getElementById('modalEdicionKPI');
    const modal = new bootstrap.Modal(modalEl);

    const kpiFieldId = document.getElementById('kpiFieldId');
    const kpiLabel = document.getElementById('kpiLabel');
    const kpiValue = document.getElementById('kpiValue');
    const kpiTitle = document.getElementById('kpiModalTitle');

    const fieldMap = {
        'completed_tasks': { label: 'Tareas Completadas', title: 'Actualizar Tareas' },
        'assigned_projects': { label: 'Proyectos Activos', title: 'Actualizar Proyectos' },
        'total_hours': { label: 'Horas Totales', title: 'Corregir Horas' },
        'performance': { label: 'Desempeño (%)', title: 'Ajustar Desempeño' }
    };

    const config = fieldMap[fieldId];
    if (config) {
        kpiFieldId.value = fieldId;
        kpiLabel.textContent = config.label;
        kpiTitle.textContent = config.title;

        let elementId = '';
        if (fieldId === 'completed_tasks') elementId = 'statCompletedTasks';
        if (fieldId === 'assigned_projects') elementId = 'statAssignedProjects';
        if (fieldId === 'total_hours') elementId = 'statTotalHours';
        if (fieldId === 'performance') elementId = 'statPerformance';

        const currentEl = document.getElementById(elementId);
        if (currentEl) {
            let val = currentEl.textContent.replace(/[%h]/g, '').trim();
            kpiValue.value = parseFloat(val) || 0;
        }
        modal.show();
    }
};

window.guardarCambiosKPI = function () {
    const fieldId = document.getElementById('kpiFieldId').value;
    const newValue = document.getElementById('kpiValue').value;

    let elementId = '';
    let suffix = '';

    if (fieldId === 'completed_tasks') { elementId = 'statCompletedTasks'; if (workerData) workerData.completedTasks = parseInt(newValue); }
    if (fieldId === 'assigned_projects') { elementId = 'statAssignedProjects'; if (workerData) workerData.assignedProjects = parseInt(newValue); }
    if (fieldId === 'total_hours') { elementId = 'statTotalHours'; suffix = 'h'; if (workerData) workerData.totalHours = parseInt(newValue); }
    if (fieldId === 'performance') { elementId = 'statPerformance'; suffix = '%'; if (workerData) workerData.performance = parseInt(newValue); }

    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = newValue + suffix;
    }

    const modalEl = document.getElementById('modalEdicionKPI');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
};
