/**
 * Login Style Enforcer
 * Asegura que los estilos de login se mantengan correctos
 * incluso si otros scripts intentan modificarlos
 */

(function() {
    'use strict';
    
    // Solo ejecutar en la página de login
    if (!document.querySelector('#loginForm')) {
        return;
    }
    
    /**
     * Forzar estilos del body
     */
    function enforceBodyStyles() {
        const body = document.body;
        
        // Forzar estilos inline con máxima prioridad
        body.style.setProperty('background-color', '#0f172a', 'important');
        body.style.setProperty('background', '#0f172a', 'important');
        body.style.setProperty('min-height', '100vh', 'important');
        body.style.setProperty('display', 'flex', 'important');
        body.style.setProperty('align-items', 'center', 'important');
        body.style.setProperty('justify-content', 'center', 'important');
        body.style.setProperty('padding', '1rem', 'important');
        body.style.setProperty('margin', '0', 'important');
        body.style.setProperty('position', 'relative', 'important');
        body.style.setProperty('overflow', 'hidden', 'important');
        body.style.setProperty('color', '#ffffff', 'important');
        
        // Asegurar clases de Tailwind
        if (!body.classList.contains('min-h-screen')) {
            body.classList.add('min-h-screen', 'bg-slate-900', 'flex', 'items-center', 'justify-center', 'p-4', 'relative', 'overflow-hidden');
        }
        
        // Remover clases que puedan interferir
        body.classList.remove('dark-mode');
        
        // Remover atributos de tema
        document.documentElement.removeAttribute('data-theme');
    }
    
    /**
     * Observar cambios en el body
     */
    function observeBodyChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Si se modifica el style, volver a aplicar nuestros estilos
                    setTimeout(enforceBodyStyles, 0);
                }
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // Si se modifican las clases, asegurar que las nuestras estén
                    enforceBodyStyles();
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // También observar el html
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    /**
     * Inicializar
     */
    function init() {
        // Aplicar estilos inmediatamente
        enforceBodyStyles();
        
        // Observar cambios
        observeBodyChanges();
        
        // Re-aplicar después de que todos los scripts se carguen
        window.addEventListener('load', function() {
            setTimeout(enforceBodyStyles, 100);
        });
        
        // Re-aplicar periódicamente (por si acaso)
        setInterval(enforceBodyStyles, 1000);
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

