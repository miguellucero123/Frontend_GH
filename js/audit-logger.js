/**
 * ============================================================================
 * SISTEMA DE AUDITORÍA Y LOGS - MEJORA FASE 1
 * ============================================================================
 * Registro de acciones del usuario y cambios en el sistema
 * Versión: 1.0.0
 * ============================================================================
 */

class AuditLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.init();
    }

    /**
     * Inicializar logger
     */
    init() {
        this.loadLogs();
        this.setupAutoSave();
    }

    /**
     * Registrar acción
     */
    log(action, details = {}) {
        const logEntry = {
            id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: Date.now(),
            user: this.getCurrentUser(),
            action,
            details,
            ip: this.getIP(),
            userAgent: navigator.userAgent
        };

        this.logs.push(logEntry);

        // Mantener solo últimos N logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Auto-guardar cada 10 logs
        if (this.logs.length % 10 === 0) {
            this.saveLogs();
        }

        return logEntry;
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        if (typeof auth !== 'undefined' && auth.getCurrentUser) {
            const user = auth.getCurrentUser();
            return {
                id: user?.id || user?.user_id,
                name: user?.name || user?.username,
                role: user?.role || user?.rol
            };
        }
        return { id: 'unknown', name: 'Usuario Desconocido', role: 'guest' };
    }

    /**
     * Obtener IP (simulado)
     */
    getIP() {
        // En producción, esto vendría del backend
        return '127.0.0.1';
    }

    /**
     * Log de creación
     */
    logCreate(entity, entityId, data) {
        return this.log('CREATE', {
            entity,
            entityId,
            data: this.sanitizeData(data)
        });
    }

    /**
     * Log de actualización
     */
    logUpdate(entity, entityId, oldData, newData) {
        return this.log('UPDATE', {
            entity,
            entityId,
            changes: this.getChanges(oldData, newData)
        });
    }

    /**
     * Log de eliminación
     */
    logDelete(entity, entityId) {
        return this.log('DELETE', {
            entity,
            entityId
        });
    }

    /**
     * Log de acceso
     */
    logAccess(resource, action) {
        return this.log('ACCESS', {
            resource,
            action
        });
    }

    /**
     * Log de exportación
     */
    logExport(type, format, data) {
        return this.log('EXPORT', {
            type,
            format,
            recordCount: data?.length || 0
        });
    }

    /**
     * Log de login
     */
    logLogin(success, reason = null) {
        return this.log(success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED', {
            reason
        });
    }

    /**
     * Log de logout
     */
    logLogout() {
        return this.log('LOGOUT', {});
    }

    /**
     * Obtener cambios entre datos
     */
    getChanges(oldData, newData) {
        const changes = {};
        Object.keys(newData).forEach(key => {
            if (oldData[key] !== newData[key]) {
                changes[key] = {
                    old: oldData[key],
                    new: newData[key]
                };
            }
        });
        return changes;
    }

    /**
     * Sanitizar datos (remover información sensible)
     */
    sanitizeData(data) {
        const sensitive = ['password', 'token', 'secret', 'key'];
        const sanitized = { ...data };
        
        sensitive.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        });

        return sanitized;
    }

    /**
     * Obtener logs
     */
    getLogs(filters = {}) {
        let filtered = [...this.logs];

        if (filters.user) {
            filtered = filtered.filter(log => 
                log.user.id === filters.user || log.user.name === filters.user
            );
        }

        if (filters.action) {
            filtered = filtered.filter(log => log.action === filters.action);
        }

        if (filters.entity) {
            filtered = filtered.filter(log => log.details.entity === filters.entity);
        }

        if (filters.startDate) {
            filtered = filtered.filter(log => log.timestamp >= filters.startDate);
        }

        if (filters.endDate) {
            filtered = filtered.filter(log => log.timestamp <= filters.endDate);
        }

        return filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Obtener estadísticas
     */
    getStats() {
        const stats = {
            total: this.logs.length,
            byAction: {},
            byUser: {},
            byEntity: {},
            recent: this.logs.slice(-10)
        };

        this.logs.forEach(log => {
            // Por acción
            stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

            // Por usuario
            const userId = log.user.id;
            stats.byUser[userId] = (stats.byUser[userId] || 0) + 1;

            // Por entidad
            if (log.details.entity) {
                stats.byEntity[log.details.entity] = (stats.byEntity[log.details.entity] || 0) + 1;
            }
        });

        return stats;
    }

    /**
     * Exportar logs
     */
    exportLogs(format = 'json', filters = {}) {
        const logs = this.getLogs(filters);

        if (format === 'json') {
            const json = JSON.stringify(logs, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } else if (format === 'csv') {
            const csv = this.convertToCSV(logs);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Convertir a CSV
     */
    convertToCSV(logs) {
        const headers = ['Timestamp', 'User', 'Action', 'Entity', 'Details'];
        const rows = logs.map(log => [
            new Date(log.timestamp).toISOString(),
            log.user.name,
            log.action,
            log.details.entity || '',
            JSON.stringify(log.details)
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
    }

    /**
     * Limpiar logs antiguos
     */
    cleanOldLogs(daysToKeep = 30) {
        const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
        this.logs = this.logs.filter(log => log.timestamp >= cutoff);
        this.saveLogs();
    }

    /**
     * Configurar auto-guardado
     */
    setupAutoSave() {
        // Guardar cada 30 segundos
        setInterval(() => {
            this.saveLogs();
        }, 30000);

        // Guardar al cerrar página
        window.addEventListener('beforeunload', () => {
            this.saveLogs();
        });
    }

    /**
     * Guardar logs
     */
    saveLogs() {
        try {
            localStorage.setItem('auditLogs', JSON.stringify(this.logs));
        } catch (error) {
            console.warn('Error guardando logs:', error);
            // Si excede el límite, limpiar logs antiguos
            if (error.name === 'QuotaExceededError') {
                this.cleanOldLogs(7);
            }
        }
    }

    /**
     * Cargar logs
     */
    loadLogs() {
        try {
            const saved = localStorage.getItem('auditLogs');
            if (saved) {
                this.logs = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Error cargando logs:', error);
            this.logs = [];
        }
    }
}

// Inicializar logger
if (typeof window !== 'undefined') {
    window.auditLogger = new AuditLogger();

    // Interceptar acciones comunes
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('ACTION:')) {
            window.auditLogger.log('SYSTEM', { message: args.join(' ') });
        }
        originalLog.apply(console, args);
    };
}

