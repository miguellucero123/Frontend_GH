import { apiClient } from './apiClient';
// Nota: jwt-decode puede no estar instalado, pero para MVP podemos simplemente decodificar base64 o confiar en el backend user info
// Por simplicidad, usaremos el endpoint /auth/me para obtener el usuario

export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'jefe' | 'trabajador' | 'cliente';
    estado: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        // El backend ahora espera JSON con email y password (no OAuth2PasswordRequestForm)
        const response = await apiClient.post<LoginResponse>('/auth/login', {
            email: email,
            password: password
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            
            // Asegurar que el usuario tenga el formato correcto
            const user = response.data.user;
            if (user) {
                // Normalizar el rol a minúsculas por si acaso
                const normalizedUser = {
                    ...user,
                    rol: user.rol?.toLowerCase() || user.rol
                };
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                console.log('✅ Usuario guardado en localStorage:', normalizedUser);
            } else {
                console.error('❌ No se recibió información del usuario en la respuesta');
            }
        } else {
            console.error('❌ No se recibió token de acceso');
        }

        return response.data;
    },

    register: async (userData: {
        nombre: string;
        email: string;
        password: string;
        telefono?: string;
        rol: 'jefe' | 'trabajador' | 'cliente';
        metadata?: any;
    }) => {
        // Enviar solo los campos que el backend acepta
        const payload: any = {
            nombre: userData.nombre,
            email: userData.email,
            password: userData.password,
            telefono: userData.telefono || '',
            rol: userData.rol
        };
        
        // Si hay metadata, agregarla (aunque el backend puede ignorarla por ahora)
        if (userData.metadata) {
            // Los campos adicionales se pueden enviar pero el backend solo procesará los campos del schema
            Object.assign(payload, userData.metadata);
        }
        
        const response = await apiClient.post('/auth/register', payload);
        return response.data;
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                console.log('⚠️ No hay usuario en localStorage');
                return null;
            }
            
            const user = JSON.parse(userStr) as User;
            
            // Validar que el usuario tenga los campos necesarios
            if (!user.id || !user.email || !user.rol) {
                console.error('❌ Usuario en localStorage incompleto:', user);
                // Limpiar datos inválidos
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                return null;
            }
            
            // Normalizar el rol
            user.rol = user.rol.toLowerCase() as 'jefe' | 'trabajador' | 'cliente';
            
            console.log('✅ Usuario obtenido de localStorage:', user);
            return user;
        } catch (error) {
            console.error('❌ Error al leer usuario de localStorage:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
};
