/**
 * Sistema de Validación Robusto
 * Validación completa de datos del lado del cliente
 */

class Validator {
    constructor() {
        this.rules = new Map();
        this.initDefaultRules();
    }

    initDefaultRules() {
        // Reglas por defecto
        this.registerRule('required', (value) => {
            if (value === null || value === undefined || value === '') {
                return 'Este campo es requerido';
            }
            return true;
        });

        this.registerRule('email', (value) => {
            if (value && !Utils.isValidEmail(value)) {
                return 'Ingresa un email válido';
            }
            return true;
        });

        this.registerRule('minLength', (value, min) => {
            if (value && value.length < min) {
                return `Mínimo ${min} caracteres`;
            }
            return true;
        });

        this.registerRule('maxLength', (value, max) => {
            if (value && value.length > max) {
                return `Máximo ${max} caracteres`;
            }
            return true;
        });

        this.registerRule('numeric', (value) => {
            if (value && isNaN(value)) {
                return 'Debe ser un número';
            }
            return true;
        });

        this.registerRule('positive', (value) => {
            if (value && parseFloat(value) <= 0) {
                return 'Debe ser un número positivo';
            }
            return true;
        });

        this.registerRule('date', (value) => {
            if (value && isNaN(Date.parse(value))) {
                return 'Fecha inválida';
            }
            return true;
        });

        this.registerRule('dateFuture', (value) => {
            if (value && new Date(value) <= new Date()) {
                return 'La fecha debe ser futura';
            }
            return true;
        });

        this.registerRule('datePast', (value) => {
            if (value && new Date(value) >= new Date()) {
                return 'La fecha debe ser pasada';
            }
            return true;
        });

        this.registerRule('url', (value) => {
            if (value) {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return 'URL inválida';
                }
            }
            return true;
        });

        this.registerRule('pattern', (value, pattern) => {
            if (value && !new RegExp(pattern).test(value)) {
                return 'Formato inválido';
            }
            return true;
        });

        this.registerRule('fileSize', (file, maxSize) => {
            if (file && file.size > maxSize) {
                return `El archivo excede el tamaño máximo de ${Utils.formatFileSize(maxSize)}`;
            }
            return true;
        });

        this.registerRule('fileType', (file, allowedTypes) => {
            if (file) {
                const types = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
                if (!types.includes(file.type)) {
                    return `Tipo de archivo no permitido. Permitidos: ${types.join(', ')}`;
                }
            }
            return true;
        });
    }

    /**
     * Registrar regla personalizada
     */
    registerRule(name, rule) {
        this.rules.set(name, rule);
    }

    /**
     * Validar campo
     */
    validateField(value, rules) {
        const errors = [];
        
        if (!rules || rules.length === 0) {
            return { valid: true, errors: [] };
        }

        for (const rule of rules) {
            let ruleName, ruleValue;
            
            if (typeof rule === 'string') {
                ruleName = rule;
                ruleValue = null;
            } else if (Array.isArray(rule)) {
                [ruleName, ruleValue] = rule;
            } else if (typeof rule === 'object') {
                ruleName = rule.name;
                ruleValue = rule.value;
            }

            const ruleFunction = this.rules.get(ruleName);
            
            if (!ruleFunction) {
                console.warn(`Regla de validación no encontrada: ${ruleName}`);
                continue;
            }

            const result = ruleFunction(value, ruleValue);
            
            if (result !== true) {
                errors.push(result);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validar formulario completo
     */
    validateForm(formData, schema) {
        const errors = {};
        let isValid = true;

        for (const [field, rules] of Object.entries(schema)) {
            const value = formData[field];
            const validation = this.validateField(value, rules);
            
            if (!validation.valid) {
                errors[field] = validation.errors;
                isValid = false;
            }
        }

        return {
            valid: isValid,
            errors
        };
    }

    /**
     * Sanitizar string (XSS prevention)
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Sanitizar HTML
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') return html;
        
        // Crear elemento temporal
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    /**
     * Validar y sanitizar input
     */
    validateAndSanitize(value, type = 'string') {
        let sanitized = value;
        
        if (type === 'string') {
            sanitized = this.sanitizeString(value);
        } else if (type === 'number') {
            sanitized = parseFloat(value);
            if (isNaN(sanitized)) {
                throw new Error('Valor no es un número válido');
            }
        } else if (type === 'email') {
            sanitized = this.sanitizeString(value).toLowerCase().trim();
            if (!Utils.isValidEmail(sanitized)) {
                throw new Error('Email inválido');
            }
        } else if (type === 'url') {
            sanitized = this.sanitizeString(value).trim();
            try {
                new URL(sanitized);
            } catch {
                throw new Error('URL inválida');
            }
        }
        
        return sanitized;
    }

    /**
     * Validar archivo
     */
    validateFile(file, options = {}) {
        const errors = [];
        const config = {
            maxSize: options.maxSize || CONFIG?.MAX_FILE_SIZE || 100 * 1024 * 1024,
            allowedTypes: options.allowedTypes || CONFIG?.ALLOWED_FILE_TYPES || [],
            ...options
        };

        // Validar tamaño
        if (!Utils.isValidFileSize(file)) {
            errors.push(`El archivo excede el tamaño máximo de ${Utils.formatFileSize(config.maxSize)}`);
        }

        // Validar tipo
        if (config.allowedTypes.length > 0 && !Utils.isValidFileType(file)) {
            errors.push(`Tipo de archivo no permitido. Permitidos: ${config.allowedTypes.join(', ')}`);
        }

        // Validar nombre
        if (config.maxNameLength && file.name.length > config.maxNameLength) {
            errors.push(`El nombre del archivo es demasiado largo (máximo ${config.maxNameLength} caracteres)`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Esquema de validación para proyectos
     */
    getProjectSchema() {
        return {
            mandante_nombre: [['required'], ['minLength', 3], ['maxLength', 255]],
            direccion: [['required'], ['minLength', 5], ['maxLength', 500]],
            ciudad: [['required'], ['minLength', 2], ['maxLength', 100]],
            descripcion: [['maxLength', 2000]],
            fecha_inicio: [['required'], ['date']],
            fecha_termino_estimada: [['required'], ['date']],
            fecha_termino_real: [['date']],
            costo_inicial: [['required'], ['numeric'], ['positive']],
            costo_adicionales: [['numeric'], ['positive']],
            costo_extras: [['numeric'], ['positive']]
        };
    }

    /**
     * Esquema de validación para usuarios
     */
    getUserSchema() {
        return {
            username: [['required'], ['minLength', 3], ['maxLength', 50], ['pattern', '^[a-zA-Z0-9_]+$']],
            email: [['required'], ['email'], ['maxLength', 255]],
            password: [['required'], ['minLength', 8], ['pattern', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$']],
            name: [['required'], ['minLength', 2], ['maxLength', 100]]
        };
    }
}

// Instancia global
const validator = new Validator();

