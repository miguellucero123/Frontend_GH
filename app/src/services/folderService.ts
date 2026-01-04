import { apiClient as api } from './apiClient';

export interface Folder {
    id: number;
    nombre: string;
    proyecto_id: number;
    carpeta_padre_id?: number | null;
    creado_por_id: number;
    fecha_creacion: string;
    subcarpetas?: Folder[];
}

export const folderService = {
    // Obtener árbol de carpetas de un proyecto
    getTree: async (projectId: number) => {
        const response = await api.get<Folder[]>(`/folders/project/${projectId}/tree`);
        return response.data;
    },

    // Listar carpetas (opcional filtro por padre)
    list: async (projectId: number, parentId?: number) => {
        let url = `/folders/project/${projectId}`;
        if (parentId) {
            url += `?parent_id=${parentId}`;
        }
        const response = await api.get<Folder[]>(url);
        return response.data;
    },

    // Crear carpeta
    create: async (data: { nombre: string, proyecto_id: number, carpeta_padre_id?: number }) => {
        const response = await api.post<Folder>('/folders', data);
        return response.data;
    },

    // Eliminar carpeta
    delete: async (id: number) => {
        await api.delete(`/folders/${id}`);
    }
};
