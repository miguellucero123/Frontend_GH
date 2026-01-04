/**
 * Módulo de Comunicación con la API
 * Maneja todas las peticiones HTTP al backend
 */

class APIClient {
    constructor() {
        // URL base de la API (usar configuración global si está disponible)
        this.baseURL = window.CONFIG?.API_BASE_URL || 'http://localhost:8002/api';
        this.timeout = window.CONFIG?.API_TIMEOUT || 30000;
    }

    /**
     * Obtener headers con autenticación
     */
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (includeAuth && auth.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${auth.getToken()}`;
        }

        return headers;
    }

    /**
     * Realizar petición HTTP
     */
    async request(endpoint, options = {}) {
        // Lógica de Modo DEMO (Mejora Fase 4)
        if (window.CONFIG?.DEMO_MODE) {
            console.log(`[DEMO] Interceptando: ${endpoint}`);
            return this.getDemoResponse(endpoint, options.method);
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(options.includeAuth !== false),
                ...options.headers
            }
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Manejar respuesta
            let data = {};
            try {
                const text = await response.text();
                if (text) data = JSON.parse(text);
            } catch (e) {
                data = { message: 'Respuesta no válida' };
            }

            if (!response.ok) {
                // Manejar error 401 (Sesión expirada) - Intentar refresh token
                if (response.status === 401 && auth && auth.isAuthenticated()) {
                    const refreshToken = localStorage.getItem('auth_refresh_token');
                    if (refreshToken && typeof auth.refreshAccessToken === 'function') {
                        console.warn('Access token expirado, intentando refresh...');
                        try {
                            await auth.refreshAccessToken(refreshToken);
                            // Reintentar la petición original con el nuevo token
                            config.headers['Authorization'] = `Bearer ${auth.getToken()}`;
                            const retryResponse = await fetch(url, config);
                            const retryText = await retryResponse.text();
                            const retryData = retryText ? JSON.parse(retryText) : {};
                            if (retryResponse.ok) {
                                return retryData;
                            }
                        } catch (refreshError) {
                            console.error('Error al refrescar token:', refreshError);
                        }
                    }
                    // Si el refresh falla, limpiar sesión y redirigir
                    console.warn('Sesión expirada. Redirigiendo...');
                    if (window.auth) auth.clearSession();
                    if (!window.location.pathname.includes('index.html')) {
                        window.location.href = 'index.html';
                    }
                }
                throw { status: response.status, message: data.detail || data.message || 'Error API' };
            }

            return data;
        } catch (error) {
            console.error('Error en API Request:', error);
            throw error;
        }
    }

    /**
     * Obtener tipo de operación para rate limiting
     */
    getOperationType(endpoint, method) {
        if (endpoint.includes('/auth/login')) return 'login';
        if (endpoint.includes('/chat')) return 'chat';
        if (endpoint.includes('/files/upload')) return 'upload';
        if (endpoint.includes('/search')) return 'search';
        return 'api';
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        // Usar retry manager si está disponible
        if (window.retryManager && options.retry !== false) {
            return retryManager.executeWithRetry(
                () => this.request(endpoint, {
                    method: 'GET',
                    ...options
                }),
                options.retryConfig
            );
        }

        return this.request(endpoint, {
            method: 'GET',
            ...options
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data, options = {}) {
        // Validar datos antes de enviar
        if (options.validate !== false && window.validator) {
            // Validación básica de datos
            if (data && typeof data === 'object') {
                // Sanitizar strings
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'string') {
                        data[key] = validator.sanitizeString(data[key]);
                    }
                });

                // Agregar validación adicional para prevenir XSS
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'string') {
                        // Sanitizar entradas para prevenir XSS
                        data[key] = validator.sanitizeString(data[key]);
                        data[key] = data[key].replace(/<script.*?>.*?<\/script>/gi, ''); // Remover scripts
                        data[key] = data[key].replace(/javascript:/gi, ''); // Remover URIs peligrosas
                    }
                });
            }
        }

        // Usar retry manager si está disponible
        if (window.retryManager && options.retry !== false) {
            return retryManager.executeWithRetry(
                () => this.request(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    ...options
                }),
                options.retryConfig
            );
        }

        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options
        });
    }

    /**
     * Upload file (método interno)
     */
    async _uploadFileInternal(endpoint, file, folderId = null, onProgress = null) {
        // Validación de Modo Demo
        if (window.CONFIG?.DEMO_MODE) {
            return new Promise(resolve => {
                console.log(`[DEMO] Simulando subida de archivo: ${file.name}`);
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 20;
                    if (onProgress) onProgress(progress);
                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve({
                            message: 'Archivo subido exitosamente (Demo)',
                            file_id: Date.now(),
                            url: 'https://via.placeholder.com/150' // URL Mock
                        });
                    }
                }, 150);
            });
        }

        const formData = new FormData();
        formData.append('file', file);
        if (folderId) {
            formData.append('folder_id', folderId);
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Progreso de carga
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve({});
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject(new Error(error.message || 'Error al subir archivo'));
                    } catch (e) {
                        reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Error de red al subir archivo'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Carga cancelada'));
            });

            xhr.open('POST', `${this.baseURL}${endpoint}`);

            // Agregar token de autenticación
            if (auth.isAuthenticated()) {
                xhr.setRequestHeader('Authorization', `Bearer ${auth.getToken()}`);
            }

            xhr.send(formData);
        });
    }

    // ========== ENDPOINTS DE AUTENTICACIÓN ==========

    /**
     * Login
     * Acepta username o email (el backend espera email)
     */
    async login(username, password) {
        // Si el username contiene @, es un email, sino convertir
        const email = username.includes('@') ? username : `${username}@constructora.com`;

        return this.post('/auth/login', {
            email: email,
            password: password
        }, { includeAuth: false });
    }

    /**
     * Registro
     */
    async register(userData) {
        return this.post('/auth/register', userData, { includeAuth: false });
    }

    /**
     * Logout
     */
    async logout() {
        return this.post('/auth/logout', {}, { includeAuth: true });
    }

    // ========== ENDPOINTS DE PROYECTOS ==========

    /**
     * Obtener todos los proyectos (solo admin)
     */
    async getProjects() {
        return this.get('/projects');
    }

    /**
     * Obtener proyecto por ID (Ruta corregida Fase 4)
     */
    async getProject(projectId) {
        return this.get(`/projects/${projectId}`);
    }

    /**
     * Crear proyecto
     */
    async createProject(projectData) {
        return this.post('/projects', projectData);
    }

    /**
     * Actualizar proyecto
     */
    async updateProject(projectId, projectData) {
        return this.put(`/projects/${projectId}`, projectData);
    }

    /**
     * Eliminar proyecto
     */
    async deleteProject(projectId) {
        return this.delete(`/projects/${projectId}`);
    }

    /**
     * Obtener estructura de archivos del proyecto
     */
    async getProjectStructure(projectId, folderId = null) {
        const endpoint = folderId
            ? `/projects/${projectId}/structure?folder_id=${folderId}`
            : `/projects/${projectId}/structure`;
        return this.get(endpoint);
    }

    // ========== ENDPOINTS DE ARCHIVOS ==========

    /**
     * Subir archivo
     */
    async uploadFile(file, projectId, folderId = null, onProgress = null) {
        return this._uploadFileInternal(`/files/upload?project_id=${projectId}`, file, folderId, onProgress);
    }

    /**
     * Crear carpeta
     */
    async createFolder(projectId, name, parentFolderId = null) {
        return this.post('/folders', {
            project_id: projectId,
            name,
            parent_folder_id: parentFolderId
        });
    }

    /**
     * Actualizar permisos de archivo/carpeta
     */
    async updatePermissions(itemId, itemType, permissions) {
        const endpoint = itemType === 'folder' ? '/folders' : '/files';
        return this.put(`${endpoint}/${itemId}/permissions`, permissions);
    }

    /**
     * Eliminar archivo
     */
    async deleteFile(fileId) {
        return this.delete(`/files/${fileId}`);
    }

    /**
     * Eliminar carpeta
     */
    async deleteFolder(folderId) {
        return this.delete(`/folders/${folderId}`);
    }

    /**
     * Descargar archivo
     */
    getDownloadURL(fileId) {
        return `${this.baseURL}/files/${fileId}/download?token=${auth.getToken()}`;
    }

    // ========== ENDPOINTS DE CHAT ==========

    /**
     * Enviar mensaje
     */
    async sendMessage(projectId, receiverId, content) {
        return this.post('/chat/send', {
            project_id: projectId,
            receiver_id: receiverId,
            content
        });
    }

    /**
     * Obtener mensajes de un proyecto
     */
    async getMessages(projectId) {
        return this.get(`/chat/messages?project_id=${projectId}`);
    }

    /**
     * Obtener todos los mensajes (admin)
     */
    async getAllMessages(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/chat/messages/all?${params}`);
    }

    /**
     * Marcar mensaje como leído
     */
    async markAsRead(messageId) {
        return this.put(`/chat/messages/${messageId}/read`, {});
    }

    // ========== ENDPOINTS DE USUARIOS ==========

    /**
     * Obtener usuarios pendientes (Ruta: /auth/pending)
     */
    async getPendingUsers() {
        return this.get('/auth/pending');
    }

    /**
     * Obtener usuarios aprobados (Ruta: /auth/users?estado=approved)
     */
    async getApprovedUsers() {
        return this.get('/auth/users?estado=approved');
    }

    /**
     * Aprobar/Rechazar usuario (Ruta: /auth/approve)
     */
    async approveUser(userId, role = 'trabajador', approved = true) {
        return this.post('/auth/approve', {
            user_id: parseInt(userId),
            approved: approved
        });
    }

    /**
     * Rechazar usuario (Llama a approveUser con approved=false)
     */
    async rejectUser(userId) {
        return this.approveUser(userId, null, false);
    }

    // ========== ENDPOINTS DE ESTADÍSTICAS ==========

    /**
     * Obtener estadísticas del dashboard (Ruta: /projects/stats/global)
     */
    async getDashboardStats() {
        return this.get('/projects/stats/global');
    }

    /**
     * MOCK DATA para Modo DEMO
     */
    async getDemoResponse(endpoint, method) {
        // Simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 400));

        if (endpoint.includes('/projects/stats/global')) {
            return {
                total_projects: 12,
                active_projects: 8,
                total_cost: 154500000,
                total_users: 24,
                unread_messages: 5
            };
        }

        if (endpoint.includes('/projects')) {
            return [
                {
                    project_id: 1,
                    mandante_nombre: 'Edificio Los Alerces',
                    costo_inicial: 50000000,
                    costo_final: 52000000,
                    fecha_inicio: '2023-01-15',
                    fecha_termino_estimada: '2023-12-15',
                    estado: 'En Progreso',
                    avance: 75
                },
                {
                    project_id: 2,
                    mandante_nombre: 'Condominio El Faro',
                    costo_inicial: 85000000,
                    costo_final: 45000000,
                    fecha_inicio: '2023-03-20',
                    fecha_termino_estimada: '2024-02-20',
                    estado: 'En Progreso',
                    avance: 45
                },
                {
                    project_id: 3,
                    mandante_nombre: 'Puente Bicentenario',
                    costo_inicial: 120000000,
                    costo_final: 120000000,
                    fecha_inicio: '2023-06-10',
                    fecha_termino_estimada: '2023-11-30',
                    estado: 'Terminado',
                    avance: 100
                }
            ];
        }

        // MOCK: Update Project (Gantt)
        if (endpoint.match(/\/projects\/\d+$/) && method === 'PUT') {
            return { message: 'Proyecto actualizado correctamente', ...options.body };
        }

        // MOCK: File Upload
        if (endpoint.includes('/files/upload')) {
            return {
                message: 'Archivo subido exitosamente',
                file_id: Date.now(),
                url: 'https://via.placeholder.com/150', // Placeholder for demo
                size: 50000 // Mock size
            };
        }

        // MOCK: Chat Send
        if (endpoint.includes('/chat/send')) {
            return { message: 'Mensaje enviado correctamente', message_id: Date.now(), timestamp: new Date().toISOString() };
        }

        // MOCK: Files Structure
        if (endpoint.includes('/structure')) {
            return {
                carpeta_mandante: {
                    id: 'mandante', nombre: 'Carpeta Cliente',
                    archivos: [{ id: 1, name: 'Contrato.pdf', size: 2500000, type: 'pdf' }],
                    permisos: { cliente: true, trabajador: false, gerencia: true }
                },
                carpeta_obra: {
                    id: 'obra', nombre: 'Carpeta Obra',
                    archivos: [{ id: 2, name: 'Planos_v1.dwg', size: 15000000, type: 'dwg' }],
                    permisos: { cliente: false, trabajador: true, gerencia: true }
                },
                carpeta_gerencia: {
                    id: 'gerencia', nombre: 'Carpeta Gerencia',
                    archivos: [{ id: 3, name: 'Presupuestos.xlsx', size: 45000, type: 'xlsx' }],
                    permisos: { cliente: false, trabajador: false, gerencia: true }
                }
            };
        }

        // MOCK: Chat Messages
        if (endpoint.includes('/chat/messages')) {
            return {
                messages: [
                    { message_id: 1, sender_name: 'Sistema', content: 'Bienvenido al canal de comunicación.', timestamp: new Date().toISOString(), is_read: true }
                ]
            };
        }

        if (endpoint.includes('/auth/pending')) {
            return [
                { user_id: 101, name: 'Carlos Ruiz', email: 'carlos@obra.com', created_at: new Date().toISOString() },
                { user_id: 102, name: 'Ana Silva', email: 'ana@ejemplo.com', created_at: new Date().toISOString() }
            ];
        }

        if (endpoint.includes('/auth/users')) {
            return [
                { user_id: 1, name: 'Juan Pérez', role: 'trabajador', email: 'juan@constructora.com' },
                { user_id: 2, name: 'María García', role: 'jefe', email: 'admin@constructora.com' }
            ];
        }

        return {};
    }
}

// Instancia global
const api = new APIClient();

