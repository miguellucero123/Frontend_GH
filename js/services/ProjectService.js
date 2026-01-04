/**
 * ============================================================
 * PROJECT SERVICE (Enterprise Edition)
 * ============================================================
 * Centraliza toda la lógica de negocio relacionada con proyectos.
 */

class ProjectService {
    constructor(api, state) {
        this.api = api;
        this.state = state;
        this.projects = [];
    }

    /**
     * Cargar todos los proyectos y actualizar el estado global.
     */
    async fetchProjects() {
        try {
            this.state.setState('loading.projects', true);
            const data = await this.api.getProjects();
            this.projects = data;
            this.state.setState('projects', data);

            // Calcular estadísticas globales de proyectos
            this.updateProjectStats(data);

            return data;
        } catch (error) {
            this.state.setState('errors.projects', error.message);
            throw error;
        } finally {
            this.state.setState('loading.projects', false);
        }
    }

    /**
     * Calcular y actualizar estadísticas en el estado
     */
    updateProjectStats(projects) {
        const stats = {
            total: projects.length,
            active: projects.filter(p => !p.fecha_termino_real).length,
            totalCost: projects.reduce((acc, p) => acc + (p.costo_final || 0), 0)
        };
        this.state.setState('stats.projects', stats);
    }

    /**
     * Obtener un proyecto por ID
     */
    async getProjectById(projectId) {
        try {
            return await this.api.getProject(projectId);
        } catch (error) {
            console.error(`Error al obtener proyecto ${projectId}:`, error);
            throw error;
        }
    }

    /**
     * Guardar o actualizar un proyecto
     */
    async saveProject(projectData) {
        try {
            const isUpdate = !!projectData.project_id;
            let result;

            if (isUpdate) {
                result = await this.api.updateProject(projectData.project_id, projectData);
            } else {
                result = await this.api.createProject(projectData);
            }

            // Refrescar lista de proyectos
            await this.fetchProjects();
            return result;
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
            throw error;
        }
    }

    /**
     * Eliminar (o archivar) un proyecto
     */
    async archiveProject(projectId) {
        // Implementar lógica de archivado si el backend lo soporta
        console.warn('Archivado de proyectos no implementado en API v1');
    }

    /**
     * Actualizar fechas de un proyecto (d&d desde Gantt)
     */
    async updateProjectDates(projectId, start, end) {
        const project = this.projects.find(p => p.project_id.toString() === projectId.toString());
        if (!project) return;

        // Actualización optimista
        project.fecha_inicio = start.toISOString().split('T')[0];
        project.fecha_termino_estimada = end.toISOString().split('T')[0];
        this.state.setState('projects', [...this.projects]);

        // Persistir cambio
        try {
            await this.api.updateProject(projectId, {
                fecha_inicio: project.fecha_inicio,
                fecha_termino_estimada: project.fecha_termino_estimada
            });
        } catch (error) {
            console.error('Error al actualizar fechas:', error);
            // Revertir en caso de error (opcional)
            await this.fetchProjects(); // Recargar estado real
        }
    }

    /**
     * Actualizar progreso de un proyecto (desde Gantt)
     */
    async updateProjectProgress(projectId, progress) {
        // Nota: En la estructura actual de proyectos, no hay un campo explícito 'progreso' en porcentaje
        // Se asume que podría agregarse o mapearse a algún estado.
        // Por ahora, solo lo logeamos o guardamos si la API lo soporta.
        console.log(`Actualizando progreso proyecto ${projectId} a ${progress}%`);

        /* 
        Si existiera el campo:
        const project = this.projects.find(p => p.project_id.toString() === projectId.toString());
        if (project) {
            project.avance = progress;
            this.state.setState('projects', [...this.projects]);
            await this.api.updateProject(projectId, { avance: progress });
        }
        */
    }
}

// Exportar para uso modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectService;
} else {
    // Para uso en el navegador sin módulos
    window.ProjectService = ProjectService;
}
