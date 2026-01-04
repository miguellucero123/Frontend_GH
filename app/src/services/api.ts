// Usar variable de entorno si está disponible, sino usar localhost por defecto
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api';

export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
}

export interface Task {
    id: number;
    name: string;
    wbs_code: string;
    duration: number;
    start_date?: string;
    end_date?: string;
    progress?: number;
    dependencies?: string[];
    project_id: number;
    is_critical?: boolean;
}

export const api = {
    getProjects: async (): Promise<Project[]> => {
        // For now, since we might not have data, we can mock if fetch fails or just fetch
        try {
            const res = await fetch(`${API_URL}/projects/`);  // API_URL ya incluye /api
            if (!res.ok) throw new Error('Failed to fetch projects');
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    createProject: async (project: Omit<Project, 'id'>) => {
        const res = await fetch(`${API_URL}/projects/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        });
        if (!res.ok) throw new Error('Failed to create project');
        return await res.json();
    },

    getProjectTasks: async (projectId: number): Promise<Task[]> => {
        // This endpoint needs to be implemented in backend if not exists, 
        // but for now we assume we might need to fetch tasks differently or add the endpoint
        // Let's assume we can fetch tasks for a project. 
        // The current backend router might not have a direct "get tasks by project" list endpoint 
        // that returns purely list of tasks easily without building it. 
        // Let's add that to backend if needed, or use what we have.
        // Checking backend... router has create_task but maybe not list. 
        // We will add list tasks to backend in a moment.
        const res = await fetch(`${API_URL}/projects/${projectId}/tasks/`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return await res.json();
    },

    createTask: async (projectId: number, task: { name: string, duration: number, wbs_code?: string }) => {
        const res = await fetch(`${API_URL}/projects/${projectId}/tasks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error('Failed to create task');
        return await res.json();
    }
};
