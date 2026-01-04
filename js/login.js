/**
 * Lógica del Login
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar que los elementos existan
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const btnLogin = document.getElementById('btnLogin');
    const btnLoginText = document.getElementById('btnLoginText');
    const btnLoginIcon = document.getElementById('btnLoginIcon');
    const btnLoader = document.getElementById('btnLoader');
    const backendStatusBadge = document.getElementById('backendStatusBadge');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const credentialsBox = document.getElementById('credentialsBox');
    const rememberMeCheckbox = document.getElementById('rememberMe'); // Puede no existir

    // Validar que los elementos críticos existan
    if (!loginForm) {
        console.error('Error: No se encontró el formulario de login');
        return;
    }

    if (!usernameInput || !passwordInput) {
        console.error('Error: No se encontraron los campos de entrada');
        return;
    }

    // Verificar que auth esté disponible
    if (typeof auth === 'undefined') {
        console.error('Error: auth no está definido. Verifica que auth.js se cargue antes de login.js');
        return;
    }

    // Si ya está autenticado, redirigir
    if (auth.isAuthenticated()) {
        auth.redirectByRole();
        return;
    }

    /**
     * Verificar estado del backend (igual que React)
     */
    async function checkBackendStatus() {
        if (!backendStatusBadge || !statusDot || !statusText) return;
        
        // Inicializar como checking
        updateBackendStatus('checking');
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            let res;
            try {
                res = await fetch('http://localhost:8002/api/health', {
                    method: 'GET',
                    signal: controller.signal
                });
            } catch (e) {
                res = await fetch('http://localhost:8002/health', {
                    method: 'GET',
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeoutId);
            }
            
            if (res.ok) {
                updateBackendStatus('online');
                if (credentialsBox) credentialsBox.classList.add('hidden');
            } else {
                updateBackendStatus('offline');
            }
        } catch (e) {
            updateBackendStatus('offline');
        }
    }

    /**
     * Actualizar estado del backend (igual que React)
     */
    function updateBackendStatus(status) {
        if (!backendStatusBadge || !statusDot || !statusText) return;
        
        if (status === 'online') {
            backendStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 bg-emerald-500/20 text-emerald-400';
            statusDot.className = 'w-2 h-2 rounded-full bg-emerald-500';
            statusText.textContent = 'API: ONLINE';
            if (credentialsBox) credentialsBox.classList.add('hidden');
            if (btnLogin) btnLogin.disabled = false;
        } else if (status === 'offline') {
            backendStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 bg-red-500/20 text-red-400';
            statusDot.className = 'w-2 h-2 rounded-full bg-red-500';
            statusText.textContent = 'API: OFFLINE';
            if (credentialsBox) credentialsBox.classList.remove('hidden');
            if (btnLogin) btnLogin.disabled = false; // Permitir login en modo demo
        } else if (status === 'checking') {
            backendStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 bg-slate-500/20 text-slate-400';
            statusDot.className = 'w-2 h-2 rounded-full bg-slate-500 animate-pulse';
            statusText.textContent = 'API: CHECKING';
            if (btnLogin) btnLogin.disabled = true;
        }
    }

    // Inicializar verificación de backend
    checkBackendStatus();

    // Inicializar efectos visuales de inputs
    const inputWrappers = document.querySelectorAll('.input-wrapper');
    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        if (input) {
            input.addEventListener('focus', () => {
                wrapper.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                wrapper.classList.remove('focused');
            });
        }
    });

    // Inicializar toggle de contraseña
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = togglePassword.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    /**
     * Mostrar error
     */
    function showError(message) {
        // Asegurar que message sea siempre un string
        let errorText = 'Error al iniciar sesión';
        
        if (typeof message === 'string') {
            errorText = message;
        } else if (message && typeof message === 'object') {
            // Intentar extraer mensaje del objeto
            if (message.message && typeof message.message === 'string') {
                errorText = message.message;
            } else if (message.detail && typeof message.detail === 'string') {
                errorText = message.detail;
            } else if (message.error && typeof message.error === 'string') {
                errorText = message.error;
            } else {
                // Fallback: convertir a JSON string
                try {
                    errorText = JSON.stringify(message);
                } catch (e) {
                    errorText = 'Error desconocido';
                }
            }
        } else if (message !== null && message !== undefined) {
            errorText = String(message);
        }
        
        console.log('🔴 Mostrando error:', errorText);
        
        if (!errorMessage || !errorAlert) {
            console.error('No se pueden mostrar errores: elementos no encontrados');
            alert(errorText); // Fallback con string seguro
            return;
        }
        
        // Limpiar contenido anterior
        errorMessage.textContent = '';
        errorMessage.innerText = errorText; // Usar innerText como respaldo
        errorAlert.style.display = 'flex';
        errorAlert.classList.add('alert-error');
        
        // Scroll al error
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            if (errorAlert) {
                errorAlert.style.display = 'none';
            }
        }, 5000);
    }

    /**
     * Ocultar error
     */
    function hideError() {
        errorAlert.style.display = 'none';
    }

    /**
     * Validar formulario
     */
    function validateForm() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username) {
            showError('Por favor ingresa tu usuario o correo');
            usernameInput.focus();
            return false;
        }

        if (!password) {
            showError('Por favor ingresa tu contraseña');
            passwordInput.focus();
            return false;
        }

        if (password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    /**
     * Manejar login
     */
    async function handleLogin(e) {
        console.log('🔘 Botón de login presionado');
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        hideError();

        if (!validateForm()) {
            console.log('❌ Validación del formulario falló');
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

        console.log('📝 Datos del formulario:', { username, passwordLength: password.length, rememberMe });

        // Mostrar loading (diseño React)
        if (btnLogin) {
            btnLogin.disabled = true;
            if (btnLoginText) btnLoginText.textContent = 'Iniciando...';
            if (btnLoginIcon) btnLoginIcon.classList.add('hidden');
            const loader = document.getElementById('btnLoader');
            if (loader) loader.classList.remove('hidden');
        }

        try {
            console.log('🔐 Iniciando proceso de login...');
            console.log('Usuario:', username);
            console.log('DEMO_MODE:', window.CONFIG?.DEMO_MODE);
            console.log('demoMode disponible:', typeof window.demoMode !== 'undefined');
            console.log('demoMode.isActive:', window.demoMode?.isActive);
            
            let response;
            
            // Verificar si está en modo demo (o si el backend falló)
            const useDemo = window.demoMode?.isActive || 
                           (window.CONFIG?.DEMO_MODE === true) ||
                           (window.CONFIG?.DEMO_MODE === null && !window.backendAvailable);
            
            if (useDemo && window.demoMode) {
                console.log('🎭 Usando modo DEMO para login');
                // Usar modo demo directamente
                response = await window.demoMode.handleLogin(username, password);
            } else {
                console.log('🌐 Usando API real para login');
                // Verificar que api esté disponible
                if (typeof api === 'undefined') {
                    console.warn('⚠️ API no disponible, usando modo DEMO como fallback');
                    if (window.demoMode) {
                        response = await window.demoMode.handleLogin(username, password);
                    } else {
                        throw new Error('API no está disponible y modo DEMO no está activo.');
                    }
                } else {
                    try {
                        // Llamada real a la API
                        response = await api.login(username, password);
                        window.backendAvailable = true; // Marcar que el backend funciona
                    } catch (apiError) {
                        // Si falla la API, intentar con modo DEMO como fallback
                        console.warn('⚠️ Error al conectar con backend, usando modo DEMO como fallback');
                        console.warn('   Error:', apiError.message);
                        
                        if (window.demoMode && (apiError.type === 'network' || apiError.code === 'TIMEOUT')) {
                            // Solo usar fallback si es error de red/timeout
                            response = await window.demoMode.handleLogin(username, password);
                        } else {
                            // Re-lanzar el error original si no es de red
                            throw apiError;
                        }
                    }
                }
            }

            console.log('✅ Respuesta del login recibida:', response);

            // Backend FastAPI devuelve: { access_token, refresh_token, token_type }
            // O formato legacy: { success, data: { token, user } }
            if (response && (response.access_token || (response.success && response.data))) {
                let accessToken, refreshToken, userData;
                
                if (response.access_token) {
                    // Formato FastAPI nuevo
                    accessToken = response.access_token;
                    refreshToken = response.refresh_token;
                    
                    // Decodificar JWT para obtener información del usuario
                    try {
                        const payload = JSON.parse(atob(accessToken.split('.')[1]));
                        userData = {
                            email: payload.sub,
                            name: payload.sub.split('@')[0], // Usar email como nombre temporal
                            role: payload.role || 'cliente'
                        };
                    } catch (e) {
                        console.warn('No se pudo decodificar token, usando datos básicos');
                        userData = {
                            email: username,
                            name: username.split('@')[0],
                            role: 'cliente'
                        };
                    }
                } else {
                    // Formato legacy
                    const { token, user } = response.data;
                    accessToken = token;
                    refreshToken = null;
                    userData = user;
                }
                
                console.log('✅ Login exitoso. Usuario:', userData.name, 'Rol:', userData.role);

                // Guardar sesión con ambos tokens
                if (typeof auth !== 'undefined' && auth.saveSession) {
                    auth.saveSession(accessToken, userData, refreshToken);
                    console.log('✅ Sesión guardada en localStorage');
                } else {
                    console.error('❌ auth.saveSession no está disponible');
                    // Fallback: guardar manualmente
                    localStorage.setItem('auth_token', accessToken);
                    localStorage.setItem('auth_user', JSON.stringify(userData));
                    if (refreshToken) {
                        localStorage.setItem('auth_refresh_token', refreshToken);
                    }
                }

                // Mostrar mensaje de éxito
                if (window.Utils && Utils.showNotification) {
                    Utils.showNotification('¡Bienvenido! Redirigiendo...', 'success', 2000);
                } else {
                    console.warn('Utils.showNotification no disponible, usando alert');
                    alert('¡Bienvenido! Redirigiendo...');
                }

                // Redirigir según rol
                console.log('🔄 Redirigiendo según rol...');
                setTimeout(() => {
                    if (typeof auth !== 'undefined' && auth.redirectByRole) {
                        auth.redirectByRole();
                    } else {
                        console.error('❌ auth.redirectByRole no está disponible');
                        // Fallback: redirigir manualmente con dashboards específicos
                        const role = user.role || user.rol;
                        if (role === 'jefe' || role === 'admin') {
                            window.location.href = 'panel-jefe.html';
                        } else if (role === 'cliente') {
                            window.location.href = 'dashboard-cliente.html';
                        } else if (role === 'trabajador') {
                            window.location.href = 'dashboard-trabajador.html';
                        } else {
                            window.location.href = 'panel-usuario.html';
                        }
                    }
                }, 500);
            } else {
                console.error('❌ Respuesta inválida:', response);
                throw new Error(response?.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('❌ Error completo en login:', error);
            console.error('Tipo de error:', typeof error);
            console.error('Error como JSON:', JSON.stringify(error, null, 2));
            
            // Manejar diferentes tipos de errores con extracción exhaustiva
            let errorMsg = 'Error al iniciar sesión. Por favor intenta nuevamente.';
            
            // Extraer mensaje del error de forma segura y exhaustiva
            if (error && typeof error === 'object') {
                // Prioridad 1: Mensaje directo
                if (error.message && typeof error.message === 'string') {
                    errorMsg = error.message;
                }
                // Prioridad 2: Detail (FastAPI)
                else if (error.detail && typeof error.detail === 'string') {
                    errorMsg = error.detail;
                }
                // Prioridad 3: Error (algunas APIs)
                else if (error.error && typeof error.error === 'string') {
                    errorMsg = error.error;
                }
                // Prioridad 4: Data.message
                else if (error.data) {
                    if (typeof error.data === 'string') {
                        errorMsg = error.data;
                    } else if (error.data.message && typeof error.data.message === 'string') {
                        errorMsg = error.data.message;
                    } else if (error.data.detail && typeof error.data.detail === 'string') {
                        errorMsg = error.data.detail;
                    }
                }
                // Prioridad 5: Response.data (axios style)
                else if (error.response && error.response.data) {
                    if (typeof error.response.data === 'string') {
                        errorMsg = error.response.data;
                    } else if (error.response.data.message) {
                        errorMsg = error.response.data.message;
                    } else if (error.response.data.detail) {
                        errorMsg = error.response.data.detail;
                    }
                }
                // Prioridad 6: Códigos de estado conocidos
                else if (error.status === 401 || error.code === 'INVALID_CREDENTIALS') {
                    errorMsg = 'Usuario o contraseña incorrectos';
                } else if (error.status === 403) {
                    errorMsg = 'Tu cuenta está pendiente de aprobación. Contacta al administrador.';
                } else if (error.type === 'network' || error.code === 'NETWORK_ERROR') {
                    errorMsg = 'Error de conexión. Verifica tu conexión a internet.';
                } else if (error.code === 'TIMEOUT') {
                    errorMsg = 'La operación tardó demasiado. Intenta nuevamente.';
                }
                // Prioridad 7: Mensaje genérico con código
                else if (error.status || error.code) {
                    errorMsg = `Error al iniciar sesión (${error.status || error.code})`;
                }
                // Prioridad 8: Último recurso - convertir a string
                else {
                    try {
                        const errorStr = JSON.stringify(error, null, 2);
                        // Si el JSON es muy largo, usar mensaje genérico
                        if (errorStr.length > 200) {
                            errorMsg = 'Error al iniciar sesión. Revisa la consola para más detalles.';
                        } else {
                            errorMsg = `Error: ${errorStr}`;
                        }
                    } catch (e) {
                        errorMsg = 'Error desconocido al iniciar sesión';
                    }
                }
            } else if (typeof error === 'string') {
                errorMsg = error;
            } else if (error !== null && error !== undefined) {
                errorMsg = String(error);
            }

            console.error('📋 Mensaje de error extraído:', errorMsg);
            console.error('📋 Tipo del mensaje:', typeof errorMsg);
            
            // Asegurar que siempre sea string antes de mostrar
            if (typeof errorMsg !== 'string') {
                errorMsg = String(errorMsg);
            }
            
            showError(errorMsg);
            } finally {
                // Ocultar loading (diseño React)
                if (btnLogin) {
                    btnLogin.disabled = false;
                    if (btnLoginText) btnLoginText.textContent = 'Ingresar';
                    if (btnLoginIcon) btnLoginIcon.classList.remove('hidden');
                    const loader = document.getElementById('btnLoader');
                    if (loader) loader.classList.add('hidden');
                }
                console.log('🏁 Proceso de login finalizado');
            }
    }

    /**
     * Manejar Enter en inputs
     */
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }

    // Event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Formulario de login inicializado correctamente');
    } else {
        console.error('❌ Error: No se pudo encontrar el formulario de login');
    }

    if (usernameInput && passwordInput) {
        usernameInput.addEventListener('keypress', handleEnterKey);
        passwordInput.addEventListener('keypress', handleEnterKey);
    }

    // Limpiar error al escribir
    usernameInput.addEventListener('input', hideError);
    passwordInput.addEventListener('input', hideError);

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = togglePassword.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        });
    }

    // Focus inicial
    usernameInput.focus();
    
    // Agregar efecto de focus mejorado
    [usernameInput, passwordInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        }
    });
});

