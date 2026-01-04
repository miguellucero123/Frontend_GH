/**
 * ============================================================================
 * INTEGRACIÓN CON BACKEND FASTAPI
 * ============================================================================
 * Extensiones del API client para endpoints del nuevo backend
 * ============================================================================
 */

// Extender APIClient con métodos específicos del backend FastAPI
if (typeof api !== 'undefined') {
    /**
     * Obtener proyectos (Backend FastAPI)
     * GET /api/v1/projects/
     */
    api.getProjects = async function() {
        return this.get('/projects/');
    };

    /**
     * Obtener un proyecto específico
     * GET /api/v1/projects/{id}
     */
    api.getProject = async function(projectId) {
        return this.get(`/projects/${projectId}`);
    };

    /**
     * Crear proyecto (solo jefe)
     * POST /api/v1/projects/
     */
    api.createProject = async function(projectData) {
        return this.post('/projects/', projectData);
    };

    /**
     * Actualizar proyecto (solo jefe)
     * PUT /api/v1/projects/{id}
     */
    api.updateProject = async function(projectId, projectData) {
        return this.put(`/projects/${projectId}`, projectData);
    };

    /**
     * Eliminar proyecto (solo jefe)
     * DELETE /api/v1/projects/{id}
     */
    api.deleteProject = async function(projectId) {
        return this.delete(`/projects/${projectId}`);
    };

    /**
     * Obtener archivos de un proyecto
     * GET /api/v1/files/project/{project_id}
     */
    api.getProjectFiles = async function(projectId) {
        return this.get(`/files/project/${projectId}`);
    };

    /**
     * Subir archivo a un proyecto
     * POST /api/v1/files/upload/{project_id}
     */
    api.uploadFile = async function(projectId, file, onProgress = null) {
        return this.uploadFile(`/files/upload/${projectId}`, file, null, onProgress);
    };

    /**
     * Descargar archivo
     * GET /api/v1/files/download/{file_id}
     */
    api.downloadFile = async function(fileId) {
        const token = auth.getToken();
        return `${this.baseURL}/files/download/${fileId}?token=${token}`;
    };

    /**
     * Eliminar archivo
     * DELETE /api/v1/files/{file_id}
     */
    api.deleteFile = async function(fileId) {
        return this.delete(`/files/${fileId}`);
    };

    /**
     * Obtener historial de chat
     * GET /api/v1/chat/history/{project_id}
     */
    api.getChatHistory = async function(projectId, limit = 50, offset = 0) {
        return this.get(`/chat/history/${projectId}?limit=${limit}&offset=${offset}`);
    };

    /**
     * Obtener información del usuario actual desde el token
     * (El backend no tiene este endpoint, pero podemos decodificar el JWT)
     */
    api.getCurrentUserInfo = async function() {
        // Decodificar JWT para obtener información del usuario
        const token = auth.getToken();
        if (!token) return null;

        try {
            // JWT tiene formato: header.payload.signature
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                email: payload.sub,
                role: payload.role
            };
        } catch (e) {
            console.error('Error decodificando token:', e);
            return null;
        }
    };
}

// Actualizar WebSocket URL para el nuevo backend
if (typeof window.CONFIG !== 'undefined') {
    // El WebSocket del backend está en: ws://localhost:8000/api/v1/chat/ws/{project_id}?token=JWT
    const originalWSBaseURL = window.CONFIG.WS_BASE_URL;
    
    // Función helper para construir URL de WebSocket
    window.getWebSocketURL = function(projectId) {
        const apiURL = window.CONFIG.API_BASE_URL || 'http://localhost:8000/api/v1';
        const wsProtocol = apiURL.startsWith('https') ? 'wss:' : 'ws:';
        const apiHost = apiURL.replace(/^https?:\/\//, '').replace(/\/api.*$/, '');
        const token = auth.getToken();
        return `${wsProtocol}//${apiHost}/api/v1/chat/ws/${projectId}?token=${token}`;
    };
}

console.log('✅ Integración con Backend FastAPI cargada');

