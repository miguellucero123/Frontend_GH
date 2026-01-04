/**
 * Utilidades de Debug
 * Ayuda a diagnosticar problemas
 */

window.debugLogin = function() {
    console.log('=== DEBUG LOGIN ===');
    console.log('CONFIG:', window.CONFIG);
    console.log('DEMO_MODE:', window.CONFIG?.DEMO_MODE);
    console.log('demoMode:', window.demoMode);
    console.log('auth:', typeof auth !== 'undefined' ? auth : 'NO DEFINIDO');
    console.log('api:', typeof api !== 'undefined' ? api : 'NO DEFINIDO');
    console.log('Utils:', typeof Utils !== 'undefined' ? Utils : 'NO DEFINIDO');
    
    const loginForm = document.getElementById('loginForm');
    console.log('loginForm:', loginForm ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    if (loginForm) {
        console.log('Formulario tiene', loginForm.elements.length, 'elementos');
    }
    
    return {
        config: window.CONFIG,
        demoMode: window.demoMode,
        auth: typeof auth !== 'undefined',
        api: typeof api !== 'undefined',
        utils: typeof Utils !== 'undefined',
        form: !!loginForm
    };
};

// Auto-ejecutar cuando se carga la página
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    window.addEventListener('load', () => {
        console.log('🔍 Para debug, ejecuta: debugLogin()');
    });
}

