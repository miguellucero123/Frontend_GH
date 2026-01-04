import { apiClient } from './apiClient';

export interface WorkHour {
    id: number;
    user_id: number;
    project_id?: number;
    task_id?: number;
    fecha: string;
    hora_entrada: string;
    hora_salida?: string;
    horas_trabajadas?: number;
    descripcion?: string;
    estado: 'activo' | 'completado' | 'pausado';
    tipo: 'normal' | 'extra' | 'feriado';
}

export interface WorkHourCreate {
    project_id?: number;
    task_id?: number;
    fecha: string;
    hora_entrada: string;
    descripcion?: string;
    tipo?: 'normal' | 'extra' | 'feriado';
}

export interface WorkHourUpdate {
    hora_salida?: string;
    horas_trabajadas?: number;
    descripcion?: string;
    estado?: 'activo' | 'completado' | 'pausado';
}

export interface WorkHourStats {
    horas_hoy: number;
    horas_semana: number;
    horas_mes: number;
    dias_trabajados: number;
    promedio_diario: number;
    horas_extras: number;
}

export const workHoursService = {
    // Registrar entrada de trabajo
    clockIn: async (data: WorkHourCreate): Promise<WorkHour> => {
        const response = await apiClient.post<WorkHour>('/work-hours/clock-in', data);
        return response.data;
    },

    // Registrar salida de trabajo
    clockOut: async (workHourId: number, data: WorkHourUpdate): Promise<WorkHour> => {
        const response = await apiClient.patch<WorkHour>(`/work-hours/${workHourId}/clock-out`, data);
        return response.data;
    },

    // Obtener horas trabajadas del usuario actual
    getMyWorkHours: async (fecha_inicio?: string, fecha_fin?: string): Promise<WorkHour[]> => {
        const params = new URLSearchParams();
        if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
        if (fecha_fin) params.append('fecha_fin', fecha_fin);
        
        const response = await apiClient.get<WorkHour[]>(`/work-hours/my?${params.toString()}`);
        return response.data;
    },

    // Obtener estadísticas de horas trabajadas
    getMyStats: async (periodo: 'dia' | 'semana' | 'mes' = 'mes'): Promise<WorkHourStats> => {
        const response = await apiClient.get<WorkHourStats>(`/work-hours/my/stats?periodo=${periodo}`);
        return response.data;
    },

    // Obtener horas activas (entrada sin salida)
    getActiveWorkHour: async (): Promise<WorkHour | null> => {
        try {
            const response = await apiClient.get<WorkHour>('/work-hours/my/active');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    // Actualizar hora de trabajo
    update: async (workHourId: number, data: WorkHourUpdate): Promise<WorkHour> => {
        const response = await apiClient.patch<WorkHour>(`/work-hours/${workHourId}`, data);
        return response.data;
    },

    // Eliminar registro de horas
    delete: async (workHourId: number): Promise<void> => {
        await apiClient.delete(`/work-hours/${workHourId}`);
    }
};

