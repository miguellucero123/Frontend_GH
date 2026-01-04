/**
 * Módulo de Progressive Web App
 * Maneja la instalación, actualizaciones y funcionalidades PWA
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = false;
        this.init();
    }

    init() {
        // Verificar si ya está instalada
        this.checkInstallation();
        
        // Registrar eventos de instalación
        this.registerInstallEvents();
        
        // Registrar Service Worker
        this.registerServiceWorker();
        
        // Verificar actualizaciones
        this.checkForUpdates();
    }

    /**
     * Verificar si la app está instalada
     */
    checkInstallation() {
        // Verificar si está en modo standalone (instalada)
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');

        // Verificar si está en la lista de apps instaladas
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then((apps) => {
                this.isInstalled = apps.length > 0;
            });
        }

        // Mostrar/ocultar botón de instalación según corresponda
        this.updateInstallButton();
    }

    /**
     * Registrar eventos de instalación
     */
    registerInstallEvents() {
        // Evento beforeinstallprompt (Chrome, Edge)
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.updateInstallButton();
        });

        // Evento appinstalled (cuando se instala)
        window.addEventListener('appinstalled', () => {
            console.log('PWA instalada exitosamente');
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.updateInstallButton();
            Utils.showNotification('¡Aplicación instalada exitosamente!', 'success');
        });
    }

    /**
     * Registrar Service Worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('Service Worker registrado:', registration.scope);

                // Verificar actualizaciones periódicamente
                setInterval(() => {
                    registration.update();
                }, 60000); // Cada minuto

                // Manejar actualizaciones del Service Worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nueva versión disponible
                            this.showUpdateNotification();
                        }
                    });
                });

            } catch (error) {
                console.error('Error al registrar Service Worker:', error);
            }
        } else {
            console.warn('Service Worker no soportado en este navegador');
        }
    }

    /**
     * Mostrar prompt de instalación
     */
    async promptInstall() {
        if (!this.deferredPrompt) {
            Utils.showNotification('La aplicación ya está instalada o no está disponible para instalar', 'info');
            return;
        }

        // Mostrar el prompt
        this.deferredPrompt.prompt();

        // Esperar respuesta del usuario
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('Usuario aceptó instalar la PWA');
            Utils.showNotification('Instalando aplicación...', 'info');
        } else {
            console.log('Usuario rechazó instalar la PWA');
        }

        this.deferredPrompt = null;
        this.updateInstallButton();
    }

    /**
     * Actualizar botón de instalación
     */
    updateInstallButton() {
        const installButton = document.getElementById('btnInstallApp');
        
        if (!installButton) return;

        if (this.isInstalled || this.isStandalone) {
            installButton.style.display = 'none';
        } else if (this.deferredPrompt) {
            installButton.style.display = 'flex';
            installButton.addEventListener('click', () => this.promptInstall());
        } else {
            // No disponible en este navegador
            installButton.style.display = 'none';
        }
    }

    /**
     * Verificar actualizaciones
     */
    async checkForUpdates() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            
            if (registration) {
                await registration.update();
            }
        }
    }

    /**
     * Mostrar notificación de actualización
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>Nueva versión disponible</span>
                <button class="btn btn-primary btn-sm" onclick="pwaManager.reloadApp()">
                    Actualizar
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
        `;
        
        document.body.appendChild(notification);
    }

    /**
     * Recargar aplicación con nueva versión
     */
    reloadApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
    }

    /**
     * Obtener información de la app
     */
    getAppInfo() {
        return {
            isInstalled: this.isInstalled,
            isStandalone: this.isStandalone,
            canInstall: !!this.deferredPrompt,
            platform: this.getPlatform()
        };
    }

    /**
     * Detectar plataforma
     */
    getPlatform() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        if (/android/i.test(userAgent)) {
            return 'android';
        }
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }
        
        return 'other';
    }

    /**
     * Compartir contenido (Web Share API)
     */
    async share(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error al compartir:', error);
                }
                return false;
            }
        } else {
            // Fallback: copiar al portapapeles
            if (data.url) {
                await Utils.copyToClipboard(data.url);
                Utils.showNotification('Enlace copiado al portapapeles', 'info');
            }
            return false;
        }
    }
}

// Instancia global
const pwaManager = new PWAManager();

