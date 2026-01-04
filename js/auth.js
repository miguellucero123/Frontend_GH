/**
 * Módulo de Autenticación y Gestión de Sesión
 * Maneja el login, logout y verificación de roles
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    init() {
        // Cargar sesión guardada
        this.loadSession();
    }

    /**
     * Cargar sesión desde localStorage
     */
    /**
     * Cargar sesión desde localStorage con validación de seguridad
     */
    loadSession() {
        try {
            const savedToken = localStorage.getItem('auth_token');
            const savedRefreshToken = localStorage.getItem('auth_refresh_token');
            const savedUser = localStorage.getItem('auth_user');
            const sessionExpiry = localStorage.getItem('auth_expiry');

            if (savedToken && savedUser && sessionExpiry) {
                // Verificar expiración del access token
                if (new Date().getTime() > parseInt(sessionExpiry)) {
                    console.warn('Access token expirado, intentando refresh...');
                    // Intentar refresh si hay refresh token
                    if (savedRefreshToken) {
                        this.refreshAccessToken(savedRefreshToken);
                        return;
                    } else {
                        this.clearSession();
                        return;
                    }
                }

                this.token = savedToken;
                this.refreshToken = savedRefreshToken;
                try {
                    this.currentUser = JSON.parse(savedUser);
                } catch (e) {
                    console.error('Error al parsear usuario guardado:', e);
                    this.clearSession();
                }
            } else {
                this.loadSessionFromSessionStorage();
            }
        } catch (error) {
            console.error('Error al cargar sesión:', error);
            this.clearSession();
        }
    }

    /**
     * Refrescar access token usando refresh token
     */
    async refreshAccessToken(refreshToken) {
        try {
            if (typeof api === 'undefined') {
                console.warn('API no disponible para refresh token');
                this.clearSession();
                return;
            }

            const response = await api.refreshToken(refreshToken);
            
            if (response.access_token) {
                // Actualizar tokens
                this.token = response.access_token;
                this.refreshToken = response.refresh_token || refreshToken;
                
                // Guardar nuevos tokens
                const accessExpiry = new Date().getTime() + (15 * 60 * 1000);
                localStorage.setItem('auth_token', this.token);
                localStorage.setItem('auth_expiry', accessExpiry.toString());
                
                if (response.refresh_token) {
                    const refreshExpiry = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
                    localStorage.setItem('auth_refresh_token', this.refreshToken);
                    localStorage.setItem('auth_refresh_expiry', refreshExpiry.toString());
                }
                
                console.log('Token refrescado exitosamente');
            } else {
                throw new Error('No se recibió access_token en la respuesta');
            }
        } catch (error) {
            console.error('Error al refrescar token:', error);
            this.clearSession();
            // Redirigir a login si estamos en una página protegida
            if (!window.location.pathname.includes('index.html')) {
                window.location.href = 'index.html';
            }
        }
    }

    /**
     * Cargar sesión desde sessionStorage (fallback)
     */
    loadSessionFromSessionStorage() {
        try {
            const savedToken = sessionStorage.getItem('auth_token');
            const savedUser = sessionStorage.getItem('auth_user');

            if (savedToken && savedUser) {
                this.token = savedToken;
                this.currentUser = JSON.parse(savedUser);
                // Restaurar persistencia si es válida
                this.saveSession(savedToken, this.currentUser);
            }
        } catch (error) {
            console.error('Error al cargar sesión desde sessionStorage:', error);
        }
    }

    /**
     * Guardar sesión en localStorage con tokens JWT
     * Backend FastAPI devuelve: { access_token, refresh_token, token_type }
     */
    saveSession(accessToken, user, refreshToken = null) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.currentUser = user;

        // Access token expira en 15 minutos (900000 ms)
        const accessExpiry = new Date().getTime() + (15 * 60 * 1000);
        // Refresh token expira en 7 días
        const refreshExpiry = refreshToken ? new Date().getTime() + (7 * 24 * 60 * 60 * 1000) : null;

        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_expiry', accessExpiry.toString());
        
        if (refreshToken) {
            localStorage.setItem('auth_refresh_token', refreshToken);
            if (refreshExpiry) {
                localStorage.setItem('auth_refresh_expiry', refreshExpiry.toString());
            }
        }
    }

    /**
     * Limpiar sesión y tokens
     */
    clearSession() {
        this.token = null;
        this.refreshToken = null;
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_expiry');
        localStorage.removeItem('auth_refresh_expiry');
        sessionStorage.clear();
    }

    /**
     * Verificar si el usuario está autenticado y la sesión es válida
     */
    isAuthenticated() {
        if (!this.token || !this.currentUser) {
            this.loadSession();
        }
        return this.token !== null && this.currentUser !== null;
    }

    /**
     * Obtener el rol del usuario actual
     */
    getUserRole() {
        if (!this.currentUser) return null;
        return this.currentUser.role || this.currentUser.rol || null;
    }

    /**
     * Verificar si el usuario es Jefe/Admin
     */
    isAdmin() {
        return ['jefe', 'admin'].includes(this.getUserRole());
    }

    /**
     * Verificar si el usuario es Trabajador
     */
    isWorker() {
        return this.getUserRole() === 'trabajador';
    }

    /**
     * Verificar si el usuario es Cliente
     */
    isClient() {
        return this.getUserRole() === 'cliente';
    }

    /**
     * Obtener el token de autenticación
     */
    getToken() {
        return this.token;
    }

    /**
     * Obtener información del usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Redirigir según el rol del usuario
     */
    redirectByRole() {
        if (!this.isAuthenticated()) {
            if (typeof window.router !== 'undefined') {
                window.router.navigate('login');
            } else {
                window.location.href = 'index.html';
            }
            return;
        }

        const role = this.getUserRole();

        // Usar router si está disponible
        if (typeof window.router !== 'undefined') {
            switch (role) {
                case 'jefe':
                case 'admin':
                    window.router.navigate('dashboard-jefe');
                    break;
                case 'cliente':
                    window.router.navigate('dashboard-cliente');
                    break;
                case 'trabajador':
                    window.router.navigate('dashboard-trabajador');
                    break;
                default:
                    window.router.navigate('login');
            }
        } else {
            // Fallback sin router
            switch (role) {
                case 'jefe':
                case 'admin':
                    if (!window.location.href.includes('panel-jefe.html')) window.location.href = 'panel-jefe.html';
                    break;
                case 'cliente':
                    if (!window.location.href.includes('dashboard-cliente.html')) window.location.href = 'dashboard-cliente.html';
                    break;
                case 'trabajador':
                    if (!window.location.href.includes('dashboard-trabajador.html')) window.location.href = 'dashboard-trabajador.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        }
    }

    /**
     * Cerrar sesión
     */
    logout() {
        this.clearSession();
        window.location.href = 'index.html';
    }

    /**
     * Requerir autenticación (proteger rutas)
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.warn('Acceso denegado: Usuario no autenticado');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    /**
     * Requerir rol específico
     */
    requireRole(role) {
        if (!this.requireAuth()) return false;

        const currentRole = this.getUserRole();
        if (currentRole !== role) {
            console.warn(`Acceso denegado: Rol requerido ${role}, rol actual ${currentRole}`);
            this.redirectByRole(); // Redirige a su panel correcto si intenta entrar a otro
            return false;
        }
        return true;
    }
}

// Instancia global
const auth = new AuthManager();

// Protección de rutas automática
/*
const currentPath = window.location.pathname;
if (currentPath.includes('panel-jefe')) auth.requireRole('jefe');
if (currentPath.includes('dashboard-cliente')) auth.requireRole('cliente');
if (currentPath.includes('dashboard-trabajador')) auth.requireRole('trabajador');
*/

