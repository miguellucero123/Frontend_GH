/**
 * ============================================================
 * USER SERVICE (Enterprise Edition)
 * ============================================================
 * Centraliza la gestión de usuarios, aprobaciones y perfiles.
 */

class UserService {
    constructor(api, state) {
        this.api = api;
        this.state = state;
    }

    /**
     * Cargar usuarios según estado (pendiente/aprobado)
     */
    async fetchUsers(type = 'pending') {
        try {
            this.state.setState(`loading.users.${type}`, true);
            const users = type === 'pending'
                ? await this.api.getPendingUsers()
                : await this.api.getApprovedUsers();

            this.state.setState(`users.${type}`, users);
            return users;
        } catch (error) {
            this.state.setState(`errors.users.${type}`, error.message);
            throw error;
        } finally {
            this.state.setState(`loading.users.${type}`, false);
        }
    }

    /**
     * Aprobar un usuario con un rol específico
     */
    async approveUser(userId, role = 'trabajador') {
        try {
            await this.api.approveUser(userId, role);
            // Refrescar ambas listas
            await this.fetchUsers('pending');
            await this.fetchUsers('approved');
            return true;
        } catch (error) {
            console.error('Error al aprobar usuario:', error);
            throw error;
        }
    }

    /**
     * Rechazar/Eliminar un usuario
     */
    async rejectUser(userId) {
        try {
            await this.api.rejectUser(userId);
            await this.fetchUsers('pending');
            return true;
        } catch (error) {
            console.error('Error al rechazar usuario:', error);
            throw error;
        }
    }

    /**
     * Obtener el perfil del usuario actual desde el estado
     */
    getCurrentUser() {
        return this.state.getState('user');
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserService;
} else {
    window.UserService = UserService;
}
