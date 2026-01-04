/**
 * ============================================================
 * DASHBOARD CLIENTE GAMIFICADO - FASE 4
 * ============================================================
 * 
 * Dashboard lúdico y colorido para clientes con:
 * - Progreso visual animado
 * - Estado de partidas
 * - Encuesta de satisfacción
 * - Buzón de sugerencias
 */

// Panel de debugging visible
function debugLog(message, type = 'info') {
    const debugPanel = document.getElementById('debugPanel');
    const debugLog = document.getElementById('debugLog');
    
    if (debugPanel && debugLog) {
        const time = new Date().toLocaleTimeString();
        const color = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `color: ${color}; margin: 2px 0;`;
        logEntry.textContent = `[${time}] ${message}`;
        debugLog.appendChild(logEntry);
        
        // Auto-scroll
        debugPanel.scrollTop = debugPanel.scrollHeight;
        
        // Mantener solo últimos 50 mensajes
        while (debugLog.children.length > 50) {
            debugLog.removeChild(debugLog.firstChild);
        }
    }
    
    // También mostrar en consola si está disponible
    if (typeof console !== 'undefined') {
        if (type === 'error') {
            console.error(message);
        } else if (type === 'success') {
            console.log('✅', message);
        } else {
            console.log('ℹ️', message);
        }
    }
}

// Crear indicador visual de debugging
function createDebugIndicator(message, type = 'info') {
    debugLog(message, type);
    
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debugIndicator';
    debugDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    debugDiv.textContent = message;
    document.body.appendChild(debugDiv);
    
    // Auto-remover después de 5 segundos (excepto errores)
    if (type !== 'error') {
        setTimeout(() => {
            if (debugDiv.parentNode) {
                debugDiv.parentNode.removeChild(debugDiv);
            }
        }, 5000);
    }
}

function updateDebugIndicator(message, type = 'info') {
    debugLog(message, type);
    
    const existing = document.getElementById('debugIndicator');
    if (existing) {
        existing.textContent = message;
        existing.style.background = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
    } else {
        createDebugIndicator(message, type);
    }
}

// Asegurar que el contenido sea visible SIEMPRE
function ensureContentVisible() {
    const clientMain = document.getElementById('clientMain');
    if (clientMain) {
        clientMain.style.display = 'block';
        clientMain.style.visibility = 'visible';
        clientMain.style.opacity = '1';
        clientMain.style.width = '100%';
        clientMain.style.minHeight = '100vh';
        clientMain.style.position = 'relative';
        clientMain.style.zIndex = '1';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Asegurar visibilidad inmediata
    ensureContentVisible();
    
    debugLog('🔄 DOM cargado - Inicializando dashboard...', 'info');
    createDebugIndicator('🔄 Inicializando dashboard...', 'info');
    
    // Esperar un momento para que auth se inicialice completamente
    setTimeout(() => {
        updateDebugIndicator('🔐 Verificando autenticación...', 'info');
        
        // Verificar autenticación
        if (!auth.isAuthenticated()) {
            updateDebugIndicator('❌ No autenticado - Redirigiendo...', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            updateDebugIndicator('❌ Usuario no encontrado - Redirigiendo...', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        updateDebugIndicator(`✅ Usuario: ${currentUser.name || currentUser.username}`, 'success');

        // Verificar que sea cliente
        const userRole = currentUser.role || currentUser.rol;
        if (userRole !== 'cliente') {
            // Redirigir según rol
            if (userRole === 'jefe' || userRole === 'admin') {
                window.location.href = 'panel-jefe.html';
            } else {
                window.location.href = 'panel-usuario.html';
            }
            return;
        }

        // Inicializar layout con diseño React
        if (typeof layoutManager !== 'undefined') {
            updateDebugIndicator('🎨 Creando layout...', 'info');
            
            try {
                layoutManager.init('cliente');
            } catch (error) {
                updateDebugIndicator('⚠️ Error creando layout: ' + error.message, 'error');
                // Continuar sin layout
                setTimeout(() => {
                    initDashboard();
                }, 500);
                return;
            }
            
            // Esperar a que el layout se cree (aumentar tiempo si es necesario)
            let attempts = 0;
            const maxAttempts = 100; // 5 segundos (100 * 50ms)
            
            const checkLayout = setInterval(() => {
                attempts++;
                const layoutContainer = document.getElementById('layoutContainer');
                const mainContent = document.getElementById('mainContent');
                const clientMain = document.getElementById('clientMain');
                
                if (layoutContainer && mainContent) {
                    clearInterval(checkLayout);
                    updateDebugIndicator('✅ Layout creado', 'success');
                    
                    if (clientMain) {
                        // Mover todos los hijos de clientMain al mainContent
                        const children = Array.from(clientMain.children);
                        updateDebugIndicator(`📦 Moviendo ${children.length} elementos...`, 'info');
                        
                        try {
                            children.forEach((child) => {
                                mainContent.appendChild(child);
                            });
                            
                            clientMain.remove();
                            updateDebugIndicator('✅ Contenido movido', 'success');
                            
                            // Forzar re-renderizado
                            mainContent.style.display = 'none';
                            setTimeout(() => {
                                mainContent.style.display = '';
                                updateDebugIndicator('✅ Inicializando dashboard...', 'info');
                                
                                // Inicializar dashboard DESPUÉS de mover el contenido
                                setTimeout(() => {
                                    initDashboard();
                                }, 100);
                            }, 10);
                        } catch (error) {
                            updateDebugIndicator('⚠️ Error moviendo contenido: ' + error.message, 'error');
                            // Continuar de todas formas
                            initDashboard();
                        }
                    } else {
                        updateDebugIndicator('⚠️ clientMain no encontrado - Continuando...', 'error');
                        // Inicializar dashboard de todas formas
                        initDashboard();
                    }
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkLayout);
                    updateDebugIndicator('⚠️ Layout timeout - Continuando sin layout', 'error');
                    // Asegurar que el contenido sea visible
                    const clientMain = document.getElementById('clientMain');
                    if (clientMain) {
                        clientMain.style.display = 'block';
                        clientMain.style.visibility = 'visible';
                        clientMain.style.opacity = '1';
                    }
                    initDashboard();
                } else {
                    if (attempts % 10 === 0) { // Actualizar cada 500ms
                        updateDebugIndicator(`⏳ Esperando layout... (${attempts}/${maxAttempts})`, 'info');
                    }
                }
            }, 50);
        } else {
            updateDebugIndicator('⚠️ Sin layout manager - Usando modo simple', 'error');
            // Asegurar que el contenido sea visible
            ensureContentVisible();
            // Si no hay layout manager, inicializar directamente
            setTimeout(() => {
                initDashboard();
            }, 500);
        }
        
        // Asegurar visibilidad después de un momento (por si acaso)
        setTimeout(() => {
            ensureContentVisible();
        }, 1000);
    }, 100);
});

/**
 * Inicializar dashboard
 */
function initDashboard() {
    updateDebugIndicator('🚀 Inicializando dashboard...', 'info');
    const currentUser = auth.getCurrentUser();
    
    // Actualizar nombre del cliente
    const clientNameEl = document.getElementById('clientName');
    if (clientNameEl) {
        clientNameEl.textContent = currentUser.name || currentUser.nombre || 'Cliente';
    }

    // Configurar event listeners
    setupEventListeners();

    // Cargar datos del dashboard
    loadDashboardData();
    
    // Ocultar indicador después de un momento
    setTimeout(() => {
        updateDebugIndicator('✅ Dashboard listo', 'success');
        setTimeout(() => {
            const debugDiv = document.getElementById('debugIndicator');
            if (debugDiv) {
                debugDiv.style.transition = 'opacity 0.5s';
                debugDiv.style.opacity = '0';
                setTimeout(() => {
                    if (debugDiv.parentNode) {
                        debugDiv.parentNode.removeChild(debugDiv);
                    }
                }, 500);
            }
        }, 2000);
    }, 1000);
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

    // Formulario de encuesta
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) {
        surveyForm.addEventListener('submit', handleSubmitSurvey);
    }

    // Formulario de sugerencias
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSubmitSuggestion);
        
        // Contador de caracteres
        const suggestionText = document.getElementById('suggestionText');
        const charCount = document.getElementById('charCount');
        if (suggestionText && charCount) {
            suggestionText.addEventListener('input', () => {
                charCount.textContent = suggestionText.value.length;
            });
        }
    }

    // Modal de encuesta
    const btnCloseSurvey = document.getElementById('btnCloseSurvey');
    const btnCancelSurvey = document.getElementById('btnCancelSurvey');
    const surveyModal = document.getElementById('surveyModal');
    
    if (btnCloseSurvey) {
        btnCloseSurvey.addEventListener('click', () => {
            if (surveyModal) surveyModal.style.display = 'none';
        });
    }
    
    if (btnCancelSurvey) {
        btnCancelSurvey.addEventListener('click', () => {
            if (surveyModal) surveyModal.style.display = 'none';
        });
    }

    if (surveyModal) {
        surveyModal.addEventListener('click', (e) => {
            if (e.target === surveyModal) {
                surveyModal.style.display = 'none';
            }
        });
    }
}

/**
 * Cargar datos del dashboard
 */
async function loadDashboardData() {
    console.log('📥 Iniciando carga de datos del dashboard...');
    try {
        // Cargar desde modelo de datos o API
        const projectData = await getProjectData();
        
        // Renderizar progreso general
        renderMainProgress(projectData);
        
        // Renderizar partidas
        renderPartidas(projectData);
        
        // Renderizar encuesta
        renderSurvey(projectData);
        
        // Cargar sugerencias
        loadSuggestions(projectData);
        
        // Renderizar proyectos
        renderProjects(projectData);
        
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
        cliente_ux: {
            partidas_totales: 10,
            partidas_completadas: 4,
            estado_avance_general: 45,
            estado_partidas: [
                { nombre: 'Fundaciones', avance: 100, estado: 'completado', fecha_fin: '2023-02-28' },
                { nombre: 'Estructura Nivel 1', avance: 80, estado: 'en_progreso', fecha_fin: '2023-04-30' },
                { nombre: 'Instalaciones Eléctricas', avance: 20, estado: 'pendiente', fecha_fin: '2023-05-15' },
                { nombre: 'Acabados', avance: 0, estado: 'pendiente', fecha_fin: '2023-06-30' }
            ],
            encuesta_satisfaccion: {
                preguntas: [
                    { id: 1, texto: '¿Está satisfecho con la comunicación del equipo?', tipo: 'rating', respuesta: null },
                    { id: 2, texto: '¿Considera que el avance del proyecto es el esperado?', tipo: 'boolean', respuesta: null },
                    { id: 3, texto: '¿Tiene alguna sugerencia para mejorar nuestro servicio?', tipo: 'text', respuesta: null }
                ],
                ultima_respuesta: null
            },
            buzon_sugerencias: []
        }
    };
}

/**
 * Renderizar progreso principal
 */
function renderMainProgress(projectData) {
    const clienteUx = projectData.cliente_ux || {};
    const progress = clienteUx.estado_avance_general || 0;
    const partidas = clienteUx.estado_partidas || [];
    
    // Actualizar porcentaje
    const progressPercentage = document.getElementById('mainProgressPercentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${progress}%`;
    }

    // Actualizar círculo de progreso
    const progressCircle = document.getElementById('mainProgressCircle');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressCircle.classList.add('animated');
    }

    // Calcular estadísticas
    const completed = partidas.filter(p => p.estado === 'completado').length;
    const inProgress = partidas.filter(p => p.estado === 'en_progreso').length;
    const pending = partidas.filter(p => p.estado === 'pendiente').length;

    // Actualizar estadísticas
    const completedEl = document.getElementById('completedTasks');
    const inProgressEl = document.getElementById('inProgressTasks');
    const pendingEl = document.getElementById('pendingTasks');

    if (completedEl) completedEl.textContent = completed;
    if (inProgressEl) inProgressEl.textContent = inProgress;
    if (pendingEl) pendingEl.textContent = pending;

    // Animación de números
    animateValue(completedEl, 0, completed, 1000);
    animateValue(inProgressEl, 0, inProgress, 1000);
    animateValue(pendingEl, 0, pending, 1000);
}

/**
 * Renderizar partidas
 */
function renderPartidas(projectData) {
    const clienteUx = projectData.cliente_ux || {};
    const partidas = clienteUx.estado_partidas || [];
    const container = document.getElementById('partidasGrid');
    
    if (!container) return;

    container.innerHTML = '';

    if (partidas.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay partidas registradas</p>';
        return;
    }

    partidas.forEach((partida, index) => {
        const card = createPartidaCard(partida, index);
        container.appendChild(card);
    });
}

/**
 * Crear tarjeta de partida
 */
function createPartidaCard(partida, index) {
    const card = document.createElement('div');
    card.className = 'partida-card';
    
    const statusClass = partida.estado === 'completado' ? 'completado' :
                       partida.estado === 'en_progreso' ? 'en-progreso' : 'pendiente';
    const statusText = partida.estado === 'completado' ? 'Completado' :
                      partida.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente';

    card.innerHTML = `
        <div class="partida-header">
            <h3 class="partida-name">${escapeHtml(partida.nombre)}</h3>
            <span class="partida-status ${statusClass}">${statusText}</span>
        </div>
        <div class="partida-progress">
            <div class="partida-progress-label">
                <span>Progreso</span>
                <span>${partida.avance}%</span>
            </div>
            <div class="partida-progress-bar">
                <div class="partida-progress-fill" style="width: ${partida.avance}%"></div>
            </div>
        </div>
        ${partida.fecha_fin ? `
            <div class="partida-date">
                <i class="fas fa-calendar"></i>
                <span>Fecha estimada: ${formatDate(partida.fecha_fin)}</span>
            </div>
        ` : ''}
    `;

    // Animación de entrada
    setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, index * 100);

    return card;
}

/**
 * Renderizar encuesta
 */
function renderSurvey(projectData) {
    const clienteUx = projectData.cliente_ux || {};
    const encuesta = clienteUx.encuesta_satisfaccion || {};
    const container = document.getElementById('surveyBody');
    
    if (!container) return;

    if (encuesta.ultima_respuesta) {
        // Ya respondió
        container.innerHTML = `
            <div class="survey-completed">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem;"></i>
                <p style="font-size: 1.125rem; font-weight: 600; color: #111827;">
                    ¡Gracias por tu opinión!
                </p>
                <p style="color: #6b7280; margin-top: 0.5rem;">
                    Respondiste esta encuesta el ${formatDate(encuesta.ultima_respuesta)}
                </p>
            </div>
        `;
    } else {
        // No ha respondido
        container.innerHTML = `
            <div class="survey-prompt">
                <p>Ayúdanos a mejorar compartiendo tu experiencia</p>
                <button class="btn-start-survey" onclick="openSurveyModal()">
                    <i class="fas fa-star"></i> Responder Encuesta
                </button>
            </div>
        `;
    }
}

/**
 * Abrir modal de encuesta
 */
window.openSurveyModal = function() {
    const modal = document.getElementById('surveyModal');
    const questionsContainer = document.getElementById('surveyQuestions');
    
    if (!modal || !questionsContainer) return;

    // Cargar preguntas
    loadSurveyQuestions(questionsContainer);
    
    modal.style.display = 'flex';
};

/**
 * Cargar preguntas de encuesta
 */
function loadSurveyQuestions(container) {
    // Obtener preguntas del proyecto
    getProjectData().then(projectData => {
        const clienteUx = projectData.cliente_ux || {};
        const encuesta = clienteUx.encuesta_satisfaccion || {};
        const preguntas = encuesta.preguntas || [];

        container.innerHTML = '';

        preguntas.forEach((pregunta, index) => {
            const questionEl = createQuestionElement(pregunta, index);
            container.appendChild(questionEl);
        });
    });
}

/**
 * Crear elemento de pregunta
 */
function createQuestionElement(pregunta, index) {
    const div = document.createElement('div');
    div.className = 'survey-question';
    div.style.marginBottom = '2rem';

    let inputHTML = '';

    if (pregunta.tipo === 'rating') {
        inputHTML = `
            <div class="rating-input">
                ${[1, 2, 3, 4, 5].map(rating => `
                    <label class="rating-star">
                        <input type="radio" name="question_${pregunta.id}" value="${rating}" required>
                        <i class="fas fa-star"></i>
                    </label>
                `).join('')}
            </div>
        `;
    } else if (pregunta.tipo === 'boolean') {
        inputHTML = `
            <div class="boolean-input">
                <label class="boolean-option">
                    <input type="radio" name="question_${pregunta.id}" value="si" required>
                    <span>Sí</span>
                </label>
                <label class="boolean-option">
                    <input type="radio" name="question_${pregunta.id}" value="no" required>
                    <span>No</span>
                </label>
            </div>
        `;
    } else if (pregunta.tipo === 'text') {
        inputHTML = `
            <textarea 
                name="question_${pregunta.id}" 
                rows="4" 
                class="form-control"
                placeholder="Escribe tu respuesta aquí..."
                required
            ></textarea>
        `;
    }

    div.innerHTML = `
        <label class="question-label">
            <span class="question-number">${index + 1}.</span>
            ${escapeHtml(pregunta.texto)}
        </label>
        ${inputHTML}
    `;

    return div;
}

/**
 * Manejar envío de sugerencia
 */
function handleSubmitSuggestion(e) {
    e.preventDefault();
    
    const suggestionText = document.getElementById('suggestionText');
    if (!suggestionText) return;

    const text = suggestionText.value.trim();
    if (!text) return;

    // Agregar sugerencia
    const suggestion = {
        id: Date.now(),
        texto: text,
        fecha: new Date().toISOString()
    };

    // Guardar (en producción se enviaría a API)
    saveSuggestion(suggestion);

    // Agregar a la lista
    addSuggestionToList(suggestion);

    // Limpiar formulario
    suggestionText.value = '';
    document.getElementById('charCount').textContent = '0';

    // Mostrar confirmación
    showNotification('¡Sugerencia enviada! Gracias por tu aporte.', 'success');
}

/**
 * Guardar sugerencia
 */
function saveSuggestion(suggestion) {
    // En producción, enviar a API
    // Por ahora, guardar en localStorage
    const suggestions = JSON.parse(localStorage.getItem('clientSuggestions') || '[]');
    suggestions.push(suggestion);
    localStorage.setItem('clientSuggestions', JSON.stringify(suggestions));
}

/**
 * Cargar sugerencias
 */
function loadSuggestions(projectData) {
    const clienteUx = projectData.cliente_ux || {};
    const buzon = clienteUx.buzon_sugerencias || [];
    
    // También cargar de localStorage
    const localSuggestions = JSON.parse(localStorage.getItem('clientSuggestions') || '[]');
    const allSuggestions = [...buzon, ...localSuggestions].sort((a, b) => {
        return new Date(b.fecha || b.date) - new Date(a.fecha || a.date);
    });

    const container = document.getElementById('suggestionsList');
    if (!container) return;

    container.innerHTML = '';

    if (allSuggestions.length === 0) {
        container.innerHTML = '<p class="empty-state">No has enviado sugerencias aún</p>';
        return;
    }

    allSuggestions.forEach(suggestion => {
        const item = createSuggestionItem(suggestion);
        container.appendChild(item);
    });
}

/**
 * Agregar sugerencia a la lista
 */
function addSuggestionToList(suggestion) {
    const container = document.getElementById('suggestionsList');
    if (!container) return;

    const item = createSuggestionItem(suggestion);
    container.insertBefore(item, container.firstChild);
}

/**
 * Crear elemento de sugerencia
 */
function createSuggestionItem(suggestion) {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    
    const fecha = suggestion.fecha || suggestion.date;
    const texto = suggestion.texto || suggestion.text;

    div.innerHTML = `
        <div class="suggestion-item-header">
            <span class="suggestion-item-date">
                <i class="fas fa-clock"></i>
                ${formatDate(fecha)}
            </span>
        </div>
        <div class="suggestion-item-text">${escapeHtml(texto)}</div>
    `;

    return div;
}

/**
 * Renderizar proyectos
 */
function renderProjects(projectData) {
    const container = document.getElementById('projectsGrid');
    if (!container) return;

    // Por ahora mostrar solo el proyecto actual
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <div class="project-card-header">
            <h3 class="project-card-title">${escapeHtml(projectData.nombre_mandante || 'Proyecto')}</h3>
        </div>
        <div class="project-card-body">
            <p>${escapeHtml(projectData.descripcion || 'Sin descripción')}</p>
        </div>
    `;

    container.innerHTML = '';
    container.appendChild(card);
}

/**
 * Utilidades
 */
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Manejar envío de encuesta
 */
function handleSubmitSurvey(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const answers = {};

    // Recopilar respuestas
    formData.forEach((value, key) => {
        if (key.startsWith('question_')) {
            const questionId = key.replace('question_', '');
            answers[questionId] = value;
        }
    });

    // Guardar encuesta
    saveSurvey(answers);

    // Cerrar modal
    const modal = document.getElementById('surveyModal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Actualizar vista
    getProjectData().then(projectData => {
        projectData.cliente_ux.encuesta_satisfaccion.ultima_respuesta = new Date().toISOString();
        renderSurvey(projectData);
    });

    // Mostrar confirmación
    showNotification('¡Gracias por completar la encuesta!', 'success');
}

/**
 * Guardar encuesta
 */
function saveSurvey(answers) {
    // En producción, enviar a API
    // Por ahora, guardar en localStorage
    const surveyData = {
        fecha: new Date().toISOString(),
        respuestas: answers
    };
    localStorage.setItem('clientSurvey', JSON.stringify(surveyData));
}

function showNotification(message, type = 'info') {
    // Usar sistema de notificaciones mejorado
    if (typeof notificationManager !== 'undefined') {
        notificationManager.show(message, type);
    } else {
        // Fallback a alert
        alert(message);
    }
}

