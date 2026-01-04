/**
 * Lógica del Dashboard de Cliente
 * Refactorizado para Fase 1: Centralización
 * Versión Completa con todas las funcionalidades
 * Sin onclick inline - Todos los eventos centralizados
 */

let clientProject = null;

// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', () => {
    if (auth.requireRole('cliente')) {
        initUI();
        loadClientProject();
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
    document.getElementById('btnVerDetallesEstado')?.addEventListener('click', verDetallesEstado);
    document.getElementById('btnVerReportes')?.addEventListener('click', verReportes);
    document.getElementById('btnVerGaleria')?.addEventListener('click', verGaleria);
    document.getElementById('btnVerPresupuesto')?.addEventListener('click', verPresupuesto);
    document.getElementById('btnVerCronograma')?.addEventListener('click', verCronograma);
    document.getElementById('btnAbrirContacto')?.addEventListener('click', abrirModalContacto);

    // Botones de edición KPI
    document.getElementById('btnEditProjectStatus')?.addEventListener('click', () => abrirModalEdicion('project_status'));
    document.getElementById('btnEditBudget')?.addEventListener('click', () => abrirModalEdicion('budget'));

    // Botones de modales
    document.getElementById('btnEnviarMensaje')?.addEventListener('click', enviarMensaje);
    document.getElementById('btnGuardarKPI')?.addEventListener('click', guardarCambiosKPI);
}

function initUI() {
    const user = auth.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name || user.username;
        const roleEl = document.getElementById('userRole');
        if (roleEl) roleEl.textContent = 'Cliente - Propietario';
    }
}

function logout() {
    auth.logout();
}

/**
 * Cargar datos del proyecto asignado al cliente
 */
async function loadClientProject() {
    try {
        // En producción, esto vendría del backend con el proyecto asignado al cliente
        const user = auth.getCurrentUser();

        // Mock data para demostración
        clientProject = {
            project_id: 1,
            nombre: 'Casa Moderna - Proyecto Residencial',
            ubicacion: 'Sector Nueva Providencia, Santiago',
            area: '320 m² de construcción',
            fecha_inicio: '2024-06-01',
            fecha_entrega: '2025-01-01',
            jefe_proyecto: 'Ing. Carlos Mendoza',
            avance: 72,
            presupuesto: 850000,
            reportes: [
                { id: 1, nombre: 'Reporte Enero 2024', fecha: '2024-01-31' },
                { id: 2, nombre: 'Reporte Febrero 2024', fecha: '2024-02-28' },
                { id: 3, nombre: 'Reporte Marzo 2024', fecha: '2024-03-31' }
            ],
            fotos: [
                { id: 1, url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400', descripcion: 'Fundaciones' },
                { id: 2, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', descripcion: 'Estructura' },
                { id: 3, url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400', descripcion: 'Avance mes 3' }
            ],
            cronograma: [
                { fase: 'Fundaciones', inicio: '2024-06-01', fin: '2024-07-15', completado: true },
                { fase: 'Estructura', inicio: '2024-07-16', fin: '2024-09-30', completado: true },
                { fase: 'Instalaciones', inicio: '2024-10-01', fin: '2024-11-15', completado: false },
                { fase: 'Terminaciones', inicio: '2024-11-16', fin: '2024-12-31', completado: false }
            ]
        };

        // Actualizar UI con datos del proyecto
        updateProjectInfo();

    } catch (error) {
        console.error('Error cargando proyecto:', error);
    }
}

function updateProjectInfo() {
    if (!clientProject) return;

    // Actualizar estadísticas
    const statProgress = document.getElementById('statProjectStatus');
    if (statProgress) statProgress.textContent = `${clientProject.avance}%`;

    const statBudget = document.getElementById('statBudget');
    if (statBudget) statBudget.textContent = `$${(clientProject.presupuesto / 1000).toFixed(0)}K`;

    // Actualizar badges
    const reportBadge = document.querySelector('.bg-blue-500\\/20.text-blue-300');
    if (reportBadge) reportBadge.textContent = `${clientProject.reportes.length} Reportes`;

    const photoBadge = document.querySelector('.bg-emerald-500\\/20.text-emerald-300');
    if (photoBadge) photoBadge.textContent = `${clientProject.fotos.length} Fotos`;
}

// Inicialización de Gráficos
function initCharts() {
    if (typeof visualService !== 'undefined') {
        const avance = clientProject?.avance || 72;
        visualService.renderClientProgressChart('clientProgressChart', avance);
    }
}

/**
 * Inicializar widget de chat con gerencia
 */
function initChatWidget() {
    // Crear contenedor del chat si no existe
    let chatContainer = document.getElementById('chatWidgetContainer');
    if (!chatContainer) {
        chatContainer = document.createElement('div');
        chatContainer.id = 'chatWidgetContainer';
        chatContainer.className = 'fixed bottom-6 right-6 z-50';
        chatContainer.innerHTML = `
            <button id="btnOpenChat" class="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all">
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
 * Ver detalles del estado del proyecto
 */
window.verDetallesEstado = function () {
    if (!clientProject) return;

    const modalHtml = `
        <div class="modal fade" id="modalDetallesEstado" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-chart-line text-purple-400 me-2"></i>Estado Detallado del Proyecto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-6">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.05);">
                                    <h6 class="text-purple-400 mb-3">Avance General</h6>
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="display-4 font-bold text-white">${clientProject.avance}%</div>
                                        <div class="flex-grow-1">
                                            <div class="progress" style="height: 10px; background: rgba(255,255,255,0.1);">
                                                <div class="progress-bar bg-purple-500" style="width: ${clientProject.avance}%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.05);">
                                    <h6 class="text-emerald-400 mb-3">Días Restantes</h6>
                                    <div class="display-4 font-bold text-white">${calcularDiasRestantes()}</div>
                                    <p class="text-slate-400 text-sm mb-0">hasta entrega estimada</p>
                                </div>
                            </div>
                        </div>
                        <h6 class="text-white mt-4 mb-3">Fases del Proyecto</h6>
                        <div class="list-group">
                            ${clientProject.cronograma.map(fase => `
                                <div class="list-group-item d-flex justify-content-between align-items-center" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                    <div>
                                        <i class="fas ${fase.completado ? 'fa-check-circle text-emerald-400' : 'fa-clock text-orange-400'} me-2"></i>
                                        ${fase.fase}
                                    </div>
                                    <span class="badge ${fase.completado ? 'bg-emerald-500' : 'bg-orange-500'}">${fase.completado ? 'Completado' : 'En Progreso'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal existente si hay
    document.getElementById('modalDetallesEstado')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalDetallesEstado')).show();
};

function calcularDiasRestantes() {
    if (!clientProject) return 0;
    const hoy = new Date();
    const entrega = new Date(clientProject.fecha_entrega);
    const diff = Math.ceil((entrega - hoy) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}

/**
 * Descargar reportes
 */
window.verReportes = function () {
    if (!clientProject) return;

    const modalHtml = `
        <div class="modal fade" id="modalReportes" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-file-pdf text-blue-400 me-2"></i>Reportes Mensuales</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="list-group">
                            ${clientProject.reportes.map(r => `
                                <div class="list-group-item d-flex justify-content-between align-items-center" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                    <div>
                                        <i class="fas fa-file-pdf text-red-400 me-2"></i>
                                        ${r.nombre}
                                        <small class="text-slate-400 d-block">${r.fecha}</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-light" onclick="descargarReporte(${r.id})">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalReportes')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalReportes')).show();
};

window.descargarReporte = function (reporteId) {
    alert(`Descargando reporte #${reporteId}... (En producción, esto iniciaría la descarga real del PDF)`);
};

/**
 * Ver galería de fotos
 */
window.verGaleria = function () {
    if (!clientProject) return;

    const modalHtml = `
        <div class="modal fade" id="modalGaleria" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-images text-emerald-400 me-2"></i>Galería del Proyecto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-3">
                            ${clientProject.fotos.map(foto => `
                                <div class="col-md-4">
                                    <div class="card h-100" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);">
                                        <img src="${foto.url}" class="card-img-top" alt="${foto.descripcion}" style="height: 200px; object-fit: cover;">
                                        <div class="card-body">
                                            <p class="card-text text-white text-center">${foto.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalGaleria')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalGaleria')).show();
};

/**
 * Ver presupuesto detallado
 */
window.verPresupuesto = function () {
    if (!clientProject) return;

    const presupuestoData = {
        inicial: clientProject.presupuesto * 0.85,
        adicionales: clientProject.presupuesto * 0.10,
        extras: clientProject.presupuesto * 0.05,
        total: clientProject.presupuesto
    };

    const modalHtml = `
        <div class="modal fade" id="modalPresupuesto" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-wallet text-orange-400 me-2"></i>Desglose de Presupuesto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="list-group mb-4">
                            <div class="list-group-item d-flex justify-content-between" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                <span>Presupuesto Base</span>
                                <strong>$${presupuestoData.inicial.toLocaleString()}</strong>
                            </div>
                            <div class="list-group-item d-flex justify-content-between" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                <span>Adicionales</span>
                                <strong class="text-orange-400">+$${presupuestoData.adicionales.toLocaleString()}</strong>
                            </div>
                            <div class="list-group-item d-flex justify-content-between" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: white;">
                                <span>Extras Aprobados</span>
                                <strong class="text-blue-400">+$${presupuestoData.extras.toLocaleString()}</strong>
                            </div>
                        </div>
                        <div class="p-4 rounded-xl text-center" style="background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.2));">
                            <p class="text-slate-300 mb-1">Total Inversión</p>
                            <h2 class="display-5 font-bold text-orange-400 mb-0">$${presupuestoData.total.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalPresupuesto')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalPresupuesto')).show();
};

/**
 * Ver cronograma
 */
window.verCronograma = function () {
    if (!clientProject) return;

    const modalHtml = `
        <div class="modal fade" id="modalCronograma" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="modal-header border-white/10">
                        <h5 class="modal-title font-bold"><i class="fas fa-calendar-alt text-pink-400 me-2"></i>Cronograma de Obra</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="timeline">
                            ${clientProject.cronograma.map((fase, i) => `
                                <div class="d-flex mb-4">
                                    <div class="me-3">
                                        <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: ${fase.completado ? '#10b981' : '#f59e0b'};">
                                            <i class="fas ${fase.completado ? 'fa-check' : 'fa-clock'} text-white"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1 p-3 rounded-lg" style="background: rgba(255,255,255,0.05);">
                                        <h6 class="text-white mb-1">${fase.fase}</h6>
                                        <p class="text-slate-400 mb-0 small">
                                            <i class="fas fa-calendar me-1"></i> ${fase.inicio} → ${fase.fin}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalCronograma')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalCronograma')).show();
};

/**
 * Abrir chat con gerencia
 */
window.abrirChatGerencia = function () {
    const modalHtml = `
        <div class="modal fade" id="modalChatGerencia" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.1); height: 500px;">
                    <div class="modal-header border-white/10" style="background: linear-gradient(135deg, #7c3aed, #8b5cf6);">
                        <h5 class="modal-title font-bold text-white"><i class="fas fa-comments me-2"></i>Chat con Gerencia</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-0 d-flex flex-column" style="height: calc(100% - 120px);">
                        <div id="chatMessagesClient" class="flex-grow-1 p-3 overflow-auto" style="background: #0f172a;">
                            <div class="text-center text-slate-500 py-4">
                                <i class="fas fa-comments fa-2x mb-2"></i>
                                <p>Inicia una conversación con la gerencia</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-white/10 p-2">
                        <div class="input-group">
                            <input type="text" id="chatInputClient" class="form-control" style="background: #0f172a; border-color: rgba(255,255,255,0.1); color: white;" placeholder="Escribe un mensaje...">
                            <button class="btn btn-primary" onclick="enviarMensajeChat()"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalChatGerencia')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('modalChatGerencia')).show();

    // Listener para Enter
    document.getElementById('chatInputClient').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensajeChat();
    });
};

window.enviarMensajeChat = function () {
    const input = document.getElementById('chatInputClient');
    const msg = input.value.trim();
    if (!msg) return;

    const container = document.getElementById('chatMessagesClient');
    const user = auth.getCurrentUser();

    // Limpiar mensaje de bienvenida
    if (container.querySelector('.text-center')) {
        container.innerHTML = '';
    }

    // Agregar mensaje del usuario
    container.insertAdjacentHTML('beforeend', `
        <div class="d-flex justify-content-end mb-2">
            <div class="p-2 rounded-lg" style="background: #7c3aed; max-width: 75%;">
                <p class="mb-0 small text-white">${msg}</p>
                <small class="text-purple-200" style="font-size: 10px;">Ahora</small>
            </div>
        </div>
    `);

    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Simular respuesta de gerencia
    setTimeout(() => {
        container.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-start mb-2">
                <div class="p-2 rounded-lg" style="background: rgba(255,255,255,0.1); max-width: 75%;">
                    <small class="text-purple-400 d-block" style="font-size: 10px;">Gerencia</small>
                    <p class="mb-0 small text-white">Gracias por su mensaje. Un representante le responderá pronto.</p>
                    <small class="text-slate-400" style="font-size: 10px;">Ahora</small>
                </div>
            </div>
        `);
        container.scrollTop = container.scrollHeight;
    }, 1000);
};

// Lógica del Modal de Contacto
function abrirModalContacto() {
    const modal = new bootstrap.Modal(document.getElementById('modalContacto'));
    modal.show();
}

function enviarMensaje() {
    const btn = event.target;
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        alert('Su mensaje ha sido enviado correctamente a la constructora.');

        const modalEl = document.getElementById('modalContacto');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        document.getElementById('formContacto').reset();

        btn.innerHTML = 'Enviar Mensaje';
        btn.disabled = false;
    }, 1000);
}

// Lógica de Edición de KPIs (Cliente)
window.abrirModalEdicion = function (fieldId) {
    const modalEl = document.getElementById('modalEdicionKPI');
    const modal = new bootstrap.Modal(modalEl);

    const kpiFieldId = document.getElementById('kpiFieldId');
    const kpiLabel = document.getElementById('kpiLabel');
    const kpiValue = document.getElementById('kpiValue');
    const kpiTitle = document.getElementById('kpiModalTitle');

    const fieldMap = {
        'project_status': { label: 'Porcentaje de Avance (%)', title: 'Editar Estado' },
        'budget': { label: 'Inversión Total ($)', title: 'Editar Presupuesto' }
    };

    const config = fieldMap[fieldId];
    if (config) {
        kpiFieldId.value = fieldId;
        kpiLabel.textContent = config.label;
        kpiTitle.textContent = config.title;

        const elementId = fieldId === 'project_status' ? 'statProjectStatus' : 'statBudget';
        const currentEl = document.getElementById(elementId);
        if (currentEl) {
            let val = currentEl.textContent.replace(/[%$K]/g, '').trim();
            kpiValue.value = parseInt(val) || 0;
        }
        modal.show();
    }
};

window.guardarCambiosKPI = function () {
    const fieldId = document.getElementById('kpiFieldId').value;
    const newValue = document.getElementById('kpiValue').value;
    const elementId = fieldId === 'project_status' ? 'statProjectStatus' : 'statBudget';
    const element = document.getElementById(elementId);

    if (element) {
        if (fieldId === 'project_status') {
            element.textContent = `${newValue}%`;
            if (clientProject) clientProject.avance = parseInt(newValue);
            if (typeof visualService !== 'undefined') {
                visualService.renderClientProgressChart('clientProgressChart', parseInt(newValue));
            }
        } else {
            element.textContent = `$${newValue}K`;
            if (clientProject) clientProject.presupuesto = parseInt(newValue) * 1000;
        }
    }

    const modalEl = document.getElementById('modalEdicionKPI');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
};
