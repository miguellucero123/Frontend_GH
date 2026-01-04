/**
 * Modo Demo - Permite probar el sistema sin backend
 * Activar en config.js: CONFIG.DEMO_MODE = true
 */

class DemoMode {
    constructor() {
        // Si DEMO_MODE es null, detectar automáticamente
        const configMode = window.CONFIG?.DEMO_MODE;
        if (configMode === null || configMode === undefined) {
            // Auto-detección: intentar conectar al backend
            this.isActive = false; // Se activará después de verificar
            this.autoDetect = true;
        } else {
            this.isActive = configMode === true;
            this.autoDetect = false;
        }
        
        this.demoUsers = [
            {
                user_id: 1,
                username: 'admin',
                email: 'admin@constructora.com',
                name: 'Administrador',
                role: 'jefe',
                status: 'approved'
            },
            {
                user_id: 2,
                username: 'trabajador',
                email: 'trabajador@constructora.com',
                name: 'Juan Pérez',
                role: 'trabajador',
                status: 'approved',
                project_id: 1
            },
            {
                user_id: 3,
                username: 'cliente',
                email: 'cliente@constructora.com',
                name: 'María González',
                role: 'cliente',
                status: 'approved',
                project_id: 1
            }
        ];
        
        if (this.isActive) {
            this.init();
        } else if (this.autoDetect) {
            // Verificar si el backend está disponible
            this.checkBackendAvailability();
        }
    }

    /**
     * Verificar si el backend está disponible
     */
    async checkBackendAvailability() {
        const apiURL = window.CONFIG?.API_BASE_URL || 'http://localhost:8002/api';
        const healthURL = apiURL.replace('/api', '') || 'http://localhost:8002';
        
        console.log('🔍 Verificando disponibilidad del backend...');
        
        try {
            // Intentar conectar al endpoint de health o docs
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
            
            const response = await fetch(`${healthURL}/docs`, {
                method: 'GET',
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok || response.status === 200) {
                console.log('✅ Backend disponible - Usando API real');
                this.isActive = false;
                return;
            }
        } catch (error) {
            console.log('⚠️ Backend no disponible - Activando modo DEMO automáticamente');
            console.log('   Error:', error.message);
        }
        
        // Si llegamos aquí, el backend no está disponible
        this.isActive = true;
        this.init();
        
        // Mostrar notificación
        if (typeof window.Utils !== 'undefined' && window.Utils.showNotification) {
            window.Utils.showNotification(
                'Backend no disponible - Modo DEMO activado automáticamente',
                'warning',
                6000
            );
        } else if (typeof notificationManager !== 'undefined' && notificationManager.warning) {
            notificationManager.warning('Backend no disponible - Modo DEMO activado automáticamente');
        } else {
            console.warn('⚠️ Backend no disponible - Modo DEMO activado automáticamente');
        }
    }

    init() {
        console.log('🎭 Modo DEMO activado - El sistema funcionará sin backend');
        
        // Interceptar llamadas a la API
        this.interceptAPI();
        
        // Mostrar notificación
        if (typeof window.Utils !== 'undefined' && window.Utils.showNotification) {
            window.Utils.showNotification(
                'Modo DEMO activado - Usa: admin@constructora.com/admin123, trabajador@constructora.com/trabajador123, cliente@constructora.com/cliente123',
                'info',
                8000
            );
        } else if (typeof notificationManager !== 'undefined' && notificationManager.info) {
            notificationManager.info('Modo DEMO activado - Usa: admin@constructora.com/admin123, trabajador@constructora.com/trabajador123, cliente@constructora.com/cliente123');
        } else {
            console.info('🎭 Modo DEMO activado - Usa: admin@constructora.com/admin123, trabajador@constructora.com/trabajador123, cliente@constructora.com/cliente123');
        }
    }

    interceptAPI() {
        // Esperar a que api.js se cargue
        const checkAPI = () => {
            if (window.api && window.api.login) {
                // Guardar método original
                const originalLogin = window.api.login.bind(window.api);
                
                // Interceptar login
                window.api.login = async (username, password) => {
                    // Si está en modo demo, usar demo
                    if (this.isActive) {
                        return this.handleLogin(username, password);
                    }
                    // Si no, usar API real
                    return originalLogin(username, password);
                };
            } else {
                // Reintentar después de 100ms
                setTimeout(checkAPI, 100);
            }
        };
        
        checkAPI();
    }

    async handleLogin(username, password) {
        console.log('🔐 Intentando login en modo DEMO:', username);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Credenciales demo
        const demoCredentials = {
            'admin': 'admin123',  // Cambiada a 8 caracteres para cumplir validación
            'admin@constructora.com': 'admin123',  // También acepta email
            'trabajador1': 'trabajador123',
            'trabajador@constructora.com': 'trabajador123',
            'cliente1': 'cliente123',
            'cliente@constructora.com': 'cliente123'
        };
        
        // Normalizar username (case insensitive)
        let normalizedUsername = username.toLowerCase().trim();
        
        // Si es un email, extraer el username antes del @
        if (normalizedUsername.includes('@')) {
            normalizedUsername = normalizedUsername.split('@')[0];
        }
        
        // Verificar credenciales (tanto username como email completo)
        const originalInput = username.toLowerCase().trim();
        const validPassword = demoCredentials[originalInput] || demoCredentials[normalizedUsername];
        
        if (validPassword && validPassword === password) {
            // Buscar usuario por username o email
            const user = this.demoUsers.find(u => 
                u.username === normalizedUsername || 
                u.email.toLowerCase() === originalInput
            );
            
            if (user) {
                console.log('✅ Login exitoso para:', user.name, 'Rol:', user.role);
                return {
                    success: true,
                    data: {
                        token: `demo_token_${user.user_id}_${Date.now()}`,
                        user: user
                    },
                    message: 'Login exitoso (Modo Demo)'
                };
            }
        }
        
        console.log('❌ Credenciales incorrectas');
        // Error de credenciales - Asegurar que el mensaje sea string
        const error = new Error('Usuario o contraseña incorrectos');
        error.type = 'api';
        error.status = 401;
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    getDemoData(type) {
        const data = {
            projects: [
                {
                    project_id: 1,
                    mandante_nombre: 'Constructora ABC S.A.',
                    direccion: 'Av. Principal 123',
                    ciudad: 'Santiago',
                    descripcion: 'Edificio residencial de 20 pisos',
                    fecha_inicio: '2024-01-15',
                    fecha_termino_estimada: '2024-12-31',
                    fecha_termino_real: null,
                    costo_inicial: 500000000,
                    costo_adicionales: 50000000,
                    costo_extras: 25000000,
                    costo_final: 575000000,
                    status: 'en_progreso'
                }
            ],
            users: [
                {
                    user_id: 2,
                    username: 'trabajador1',
                    email: 'trabajador@constructora.com',
                    name: 'Juan Pérez',
                    role: 'trabajador',
                    status: 'approved'
                },
                {
                    user_id: 4,
                    username: 'nuevo_user',
                    email: 'nuevo@constructora.com',
                    name: 'Usuario Nuevo',
                    role: 'trabajador',
                    status: 'pending'
                }
            ],
            files: [
                {
                    file_id: 1,
                    name: 'Plano_Estructural.pdf',
                    file_type: 'PDF',
                    folder_id: 1,
                    uploaded_at: '2024-01-20T10:30:00Z'
                },
                {
                    file_id: 2,
                    name: 'Memoria_Calculo.xlsx',
                    file_type: 'XLSX',
                    folder_id: 1,
                    uploaded_at: '2024-01-21T14:20:00Z'
                }
            ],
            messages: [
                {
                    message_id: 1,
                    project_id: 1,
                    sender_id: 2,
                    receiver_id: 1,
                    content: 'Buenos días, necesito revisar el plano eléctrico',
                    is_read: false,
                    timestamp: '2024-01-22T09:15:00Z'
                }
            ]
        };
        
        return data[type] || [];
    }
}

// Instancia global
const demoMode = new DemoMode();

// Exportar para uso en otros módulos
window.demoMode = demoMode;

