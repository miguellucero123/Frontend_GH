/**
 * ============================================================
 * SERVICIO DE AUTOMATIZACIÓN
 * ============================================================
 * 
 * Cliente para interactuar con n8n y otros sistemas de automatización
 */

class AutomationService {
    constructor() {
        // URL de n8n (configurable)
        this.n8nBaseURL = window.CONFIG?.N8N_BASE_URL || 'http://localhost:5678';
        this.enabled = window.CONFIG?.AUTOMATION_ENABLED !== false;
    }

    /**
     * Verificar si la automatización está disponible
     */
    async checkAvailability() {
        if (!this.enabled) {
            return { available: false, reason: 'Automation disabled' };
        }

        try {
            const response = await fetch(`${this.n8nBaseURL}/health`, {
                method: 'GET',
                timeout: 3000
            });
            return { available: response.ok, reason: response.ok ? 'Connected' : 'Not available' };
        } catch (error) {
            return { available: false, reason: error.message };
        }
    }

    /**
     * Procesar archivo Excel a través de n8n
     */
    async processExcelFile(file, projectId) {
        if (!this.enabled) {
            throw new Error('Automation is disabled');
        }

        try {
            // Crear FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('project_id', projectId);
            formData.append('type', 'excel');

            // Enviar a n8n webhook
            const response = await fetch(`${this.n8nBaseURL}/webhook/process-excel`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error processing file: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error processing Excel through n8n:', error);
            throw error;
        }
    }

    /**
     * Procesar archivo Word a través de n8n
     */
    async processWordFile(file, projectId) {
        if (!this.enabled) {
            throw new Error('Automation is disabled');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('project_id', projectId);
            formData.append('type', 'word');

            const response = await fetch(`${this.n8nBaseURL}/webhook/process-word`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error processing file: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error processing Word through n8n:', error);
            throw error;
        }
    }

    /**
     * Disparar evento para automatización
     */
    async triggerEvent(eventType, eventData) {
        if (!this.enabled) {
            return { success: false, reason: 'Automation disabled' };
        }

        try {
            const response = await fetch(`${this.n8nBaseURL}/webhook/trigger-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event: eventType,
                    data: eventData,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Error triggering event: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error triggering automation event:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtener estado de workflows
     */
    async getWorkflowStatus() {
        if (!this.enabled) {
            return { available: false };
        }

        try {
            const response = await fetch(`${this.n8nBaseURL}/api/v1/workflows`, {
                method: 'GET',
                headers: {
                    'X-N8N-API-KEY': window.CONFIG?.N8N_API_KEY || ''
                }
            });

            if (!response.ok) {
                return { available: false, error: response.statusText };
            }

            const workflows = await response.json();
            return { available: true, workflows };
        } catch (error) {
            return { available: false, error: error.message };
        }
    }
}

// Instancia global
const automationService = new AutomationService();

