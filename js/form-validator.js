/**
 * Validador de Formularios Mejorado
 * Integración con el sistema de validación
 */

class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.fields = new Map();
        this.init();
    }

    init() {
        // Encontrar todos los campos con validación
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('data-validate')) {
                this.registerField(input);
            }
        });

        // Validación en tiempo real
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', Utils.debounce(() => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            }, 300));
        });

        // Validación al enviar
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    /**
     * Registrar campo
     */
    registerField(input) {
        const rules = this.parseRules(input.getAttribute('data-validate'));
        this.fields.set(input.name || input.id, {
            input,
            rules
        });
    }

    /**
     * Parsear reglas desde atributo
     */
    parseRules(rulesString) {
        const rules = [];
        const parts = rulesString.split('|');
        
        parts.forEach(part => {
            const [name, value] = part.split(':');
            if (value) {
                rules.push([name, value]);
            } else {
                rules.push(name);
            }
        });
        
        return rules;
    }

    /**
     * Validar campo
     */
    validateField(input) {
        const field = this.fields.get(input.name || input.id);
        if (!field) return true;

        const value = input.type === 'file' ? input.files[0] : input.value;
        const validation = validator.validateField(value, field.rules);

        // Actualizar UI
        this.updateFieldUI(input, validation);

        return validation.valid;
    }

    /**
     * Actualizar UI del campo
     */
    updateFieldUI(input, validation) {
        // Remover clases anteriores
        input.classList.remove('is-valid', 'is-invalid');
        
        // Remover feedback anterior
        const existingFeedback = input.parentElement.querySelector('.invalid-feedback, .valid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        if (validation.valid) {
            input.classList.add('is-valid');
        } else {
            input.classList.add('is-invalid');
            
            // Agregar mensaje de error
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = validation.errors[0];
            input.parentElement.appendChild(feedback);
        }
    }

    /**
     * Validar formulario completo
     */
    validateForm() {
        let isValid = true;

        this.fields.forEach((field, name) => {
            if (!this.validateField(field.input)) {
                isValid = false;
            }
        });

        // Scroll al primer error
        if (!isValid) {
            const firstError = this.form.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }

        return isValid;
    }

    /**
     * Resetear validación
     */
    reset() {
        this.fields.forEach(field => {
            field.input.classList.remove('is-valid', 'is-invalid');
            const feedback = field.input.parentElement.querySelector('.invalid-feedback, .valid-feedback');
            if (feedback) {
                feedback.remove();
            }
        });
    }
}

// Helper para inicializar validación en formularios
window.initFormValidation = (formSelector) => {
    const form = document.querySelector(formSelector);
    if (form) {
        return new FormValidator(form);
    }
    return null;
};

