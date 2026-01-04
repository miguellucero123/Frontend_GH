/**
 * ============================================================================
 * CORE APP - SISTEMA MODULAR RECURSIVO
 * ============================================================================
 * Inicialización centralizada y gestión de módulos
 * Versión: 1.0.0
 * ============================================================================
 */

class App {
    constructor() {
        this.modules = new Map();
        this.config = {
            debug: false,
            version: '6.0.0',
            environment: 'production'
        };
        this.init();
    }

    /**
     * Inicializar aplicación
     */
    async init() {
        try {
            // Cargar configuración
            this.loadConfig();

            // Inicializar Asset Manager
            if (typeof AssetManager !== 'undefined') {
                await this.initializeAssets();
            }

            // Registrar módulos base
            this.registerCoreModules();

            // Inicializar módulos
            await this.initializeModules();

            // Listo
            this.ready();
        } catch (error) {
            console.error('Error inicializando aplicación:', error);
            this.handleError(error);
        }
    }

    /**
     * Inicializar assets
     */
    async initializeAssets() {
        if (typeof assetManager !== 'undefined') {
            try {
                // Cargar Bootstrap 5.3.3
                await assetManager.loadBootstrap({
                    version: '5.3.3',
                    css: true,
                    js: true,
                    icons: true
                });

                // Preload críticos
                assetManager.preloadCritical();
            } catch (error) {
                // Si falla Bootstrap, continuar sin él (modo degradado)
                console.warn('No se pudo cargar Bootstrap, continuando sin él:', error);
            }
        }
    }

    /**
     * Registrar módulos core
     */
    registerCoreModules() {
        // Módulos base
        this.registerModule('auth', 'js/core/auth.js');
        this.registerModule('api', 'js/core/api.js');
        this.registerModule('state', 'js/core/state.js');

        // Módulos de UI
        this.registerModule('layout', 'js/core/layout.js');
        this.registerModule('navigation', 'js/core/navigation.js');

        // Módulos empresariales
        this.registerModule('projectService', 'js/services/ProjectService.js');
        this.registerModule('userService', 'js/services/UserService.js');
        this.registerModule('documentService', 'js/services/DocumentService.js');
    }

    /**
     * Registrar módulo
     */
    registerModule(name, path, dependencies = []) {
        this.modules.set(name, {
            name,
            path,
            dependencies,
            loaded: false,
            instance: null
        });
    }

    /**
     * Inicializar módulos
     */
    async initializeModules() {
        const modulesToLoad = Array.from(this.modules.values());
        
        for (const module of modulesToLoad) {
            if (!module.loaded) {
                await this.loadModule(module);
            }
        }
    }

    /**
     * Cargar módulo recursivamente
     */
    async loadModule(module) {
        // Cargar dependencias primero
        for (const depName of module.dependencies) {
            const dep = this.modules.get(depName);
            if (dep && !dep.loaded) {
                await this.loadModule(dep);
            }
        }

        // Cargar el módulo
        if (typeof assetManager !== 'undefined') {
            await assetManager.loadJS(module.path, `module-${module.name}`);
        }

        module.loaded = true;
    }

    /**
     * Aplicación lista
     */
    ready() {
        document.dispatchEvent(new CustomEvent('app:ready', {
            detail: { app: this }
        }));

        if (this.config.debug) {
            console.log('✅ Aplicación inicializada correctamente', {
                version: this.config.version,
                modules: Array.from(this.modules.keys())
            });
        }
    }

    /**
     * Manejar errores
     */
    handleError(error) {
        console.error('Error en aplicación:', error);
        
        // Notificar al usuario si hay sistema de notificaciones
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'error',
                priority: 'high',
                title: 'Error de Inicialización',
                message: 'Hubo un problema al cargar la aplicación. Por favor, recarga la página.'
            });
        }
    }

    /**
     * Cargar configuración
     */
    loadConfig() {
        const saved = localStorage.getItem('appConfig');
        if (saved) {
            try {
                this.config = { ...this.config, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Error cargando configuración:', error);
            }
        }
    }

    /**
     * Obtener módulo
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Verificar si módulo está cargado
     */
    isModuleLoaded(name) {
        const module = this.modules.get(name);
        return module && module.loaded;
    }
}

// Inicializar aplicación
if (typeof window !== 'undefined') {
    window.app = new App();
}

