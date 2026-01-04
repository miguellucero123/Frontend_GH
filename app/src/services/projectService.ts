import { apiClient as api } from './apiClient';

export interface Project {
    id: number;
    nombre_mandante: string;
    direccion: string;
    ciudad: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_termino_estimado: string;
    fecha_termino_real?: string;
    costo_inicial?: number;
    costos_adicionales?: number;
    costos_extras?: number;
    costo_final?: number;
    creado_por_id: number;
    fecha_creacion: string;
    activo: boolean;
}

export interface CreateProjectData {
    nombre_mandante: string;
    direccion: string;
    ciudad: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_termino_estimado: string;
    costo_inicial: number;
    costos_adicionales?: number;
    costos_extras?: number;
}

export interface ProjectStats {
    project_id: number;
    nombre_mandante: string;
    usuarios_asignados: number;
    dias_transcurridos: number;
    dias_restantes: number;
    porcentaje_presupuesto: number;
    costo_total: number;
    estado: string;
    finalizado: boolean;
}

export const projectService = {
    // Listar todos los proyectos
    getAll: async (filters?: { activo?: boolean, ciudad?: string }) => {
        const params = new URLSearchParams();
        if (filters?.activo !== undefined) params.append('activo', String(filters.activo));
        if (filters?.ciudad) params.append('ciudad', filters.ciudad);

        const response = await api.get<Project[]>(`/projects?${params.toString()}`);
        return response.data;
    },

    // Obtener un proyecto por ID
    getById: async (id: number) => {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    },

    // Crear un nuevo proyecto
    create: async (data: CreateProjectData) => {
        const response = await api.post<Project>('/projects', data);
        return response.data;
    },

    // Actualizar un proyecto
    update: async (id: number, data: Partial<CreateProjectData>) => {
        const response = await api.patch<Project>(`/projects/${id}`, data);
        return response.data;
    },

    // Eliminar un proyecto
    delete: async (id: number) => {
        await api.delete(`/projects/${id}`);
    },

    // Obtener estadísticas del proyecto
    getStats: async (id: number) => {
        const response = await api.get<ProjectStats>(`/projects/${id}/stats`);
        return response.data;
    },

    // Asignar usuario a proyecto
    assignUser: async (projectId: number, userId: number, permissions: { can_upload: boolean, can_edit: boolean }) => {
        const response = await api.post(`/projects/${projectId}/users`, {
            usuario_id: userId,
            proyecto_id: projectId,
            can_upload_files: permissions.can_upload,
            can_edit_project: permissions.can_edit
        });
        return response.data;
    },

    // Remover usuario de proyecto
    removeUser: async (projectId: number, userId: number) => {
        await api.delete(`/projects/${projectId}/users/${userId}`);
    },

    // Estadísticas globales Dashboard
    getGlobalStats: async () => {
        const response = await api.get<{
            total_projects: number;
            active_projects: number;
            completed_projects: number;
            total_budget: number;
        }>('/projects/stats/global');
        return response.data;
    }
};
