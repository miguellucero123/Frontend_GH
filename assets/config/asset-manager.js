/**
 * ============================================================================
 * GESTOR DE ASSETS EMPRESARIAL - SISTEMA MODULAR
 * ============================================================================
 * Gestión centralizada y recursiva de assets (CSS, JS, imágenes)
 * Versión: 1.0.0
 * ============================================================================
 */

class AssetManager {
    constructor() {
        this.config = {
            bootstrap: {
                version: '5.3.3',
                cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@',
                css: true,
                js: true,
                icons: true
            },
            tailwind: {
                version: 'latest',
                cdn: 'https://cdn.tailwindcss.com'
            },
            fontawesome: {
                version: '6.5.1',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/'
            },
            chartjs: {
                version: '4.4.0',
                cdn: 'https://cdn.jsdelivr.net/npm/chart.js@'
            }
        };
        this.loadedAssets = new Set();
        this.init();
    }

    /**
     * Inicializar gestor de assets
     */
    init() {
        this.loadConfig();
        this.setupAssetLoader();
    }

    /**
     * Cargar configuración
     */
    loadConfig() {
        const saved = localStorage.getItem('assetConfig');
        if (saved) {
            try {
                this.config = { ...this.config, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Error cargando configuración de assets:', error);
            }
        }
    }

    /**
     * Configurar cargador de assets
     */
    setupAssetLoader() {
        // Interceptar carga de assets para tracking
        const originalAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function(child) {
            if (child.tagName === 'LINK' && child.rel === 'stylesheet') {
                AssetManager.instance?.trackAsset('css', child.href);
            } else if (child.tagName === 'SCRIPT') {
                AssetManager.instance?.trackAsset('js', child.src);
            }
            return originalAppendChild.call(this, child);
        };
    }

    /**
     * Rastrear asset cargado
     */
    trackAsset(type, url) {
        if (url) {
            this.loadedAssets.add(`${type}:${url}`);
        }
    }

    /**
     * Cargar Bootstrap completo
     */
    loadBootstrap(options = {}) {
        const config = { ...this.config.bootstrap, ...options };
        const version = config.version;
        const baseUrl = `${config.cdn}${version}`;

        return new Promise((resolve, reject) => {
            const promises = [];

            // CSS
            if (config.css) {
                promises.push(this.loadCSS(`${baseUrl}/dist/css/bootstrap.min.css`));
            }

            // JS Bundle
            if (config.js) {
                promises.push(this.loadJS(`${baseUrl}/dist/js/bootstrap.bundle.min.js`));
            }

            // Icons (si se requiere) - Usar CDN alternativo si falla
            if (config.icons) {
                promises.push(
                    this.loadCSS(`${baseUrl}/dist/css/bootstrap-icons.min.css`)
                        .catch(() => {
                            // Fallback a CDN alternativo
                            return this.loadCSS('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css');
                        })
                );
            }

            Promise.all(promises)
                .then(() => {
                    this.loadedAssets.add('bootstrap');
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Cargar CSS
     */
    loadCSS(href, id = null) {
        return new Promise((resolve, reject) => {
            // Verificar si ya está cargado
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }

            const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                .find(link => link.href === href);

            if (existing) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            if (id) link.id = id;

            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Error cargando CSS: ${href}`));

            document.head.appendChild(link);
        });
    }

    /**
     * Cargar JavaScript
     */
    loadJS(src, id = null, defer = false, async = false) {
        return new Promise((resolve, reject) => {
            // Verificar si ya está cargado
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }

            const existing = Array.from(document.querySelectorAll('script'))
                .find(script => script.src === src);

            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            if (id) script.id = id;
            if (defer) script.defer = true;
            if (async) script.async = true;

            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Error cargando JS: ${src}`));

            document.head.appendChild(script);
        });
    }

    /**
     * Cargar módulo recursivo
     */
    async loadModule(moduleName, dependencies = []) {
        // Cargar dependencias primero
        for (const dep of dependencies) {
            await this.loadModule(dep);
        }

        // Cargar el módulo
        const modulePath = `assets/modules/${moduleName}/${moduleName}.js`;
        await this.loadJS(modulePath, `module-${moduleName}`, false, false);

        // Cargar CSS del módulo si existe
        const cssPath = `assets/modules/${moduleName}/${moduleName}.css`;
        try {
            await this.loadCSS(cssPath, `module-${moduleName}-css`);
        } catch (error) {
            // CSS opcional
        }
    }

    /**
     * Cargar assets en paralelo
     */
    async loadAssets(assets) {
        const promises = assets.map(asset => {
            if (asset.type === 'css') {
                return this.loadCSS(asset.href, asset.id);
            } else if (asset.type === 'js') {
                return this.loadJS(asset.src, asset.id, asset.defer, asset.async);
            }
        });

        return Promise.all(promises);
    }

    /**
     * Obtener assets cargados
     */
    getLoadedAssets() {
        return Array.from(this.loadedAssets);
    }

    /**
     * Verificar si un asset está cargado
     */
    isLoaded(assetName) {
        return this.loadedAssets.has(assetName);
    }

    /**
     * Preload de assets críticos
     */
    preloadCritical() {
        const criticalAssets = [
            { type: 'css', href: 'assets/css/main.css' }
            // js/core/app.js removido del preload para evitar 404 en GitHub Pages
        ];

        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            if (asset.type === 'css') {
                link.as = 'style';
                link.href = asset.href;
            } else {
                link.as = 'script';
                link.href = asset.src;
            }
            document.head.appendChild(link);
        });
    }
}

// Singleton
AssetManager.instance = new AssetManager();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.AssetManager = AssetManager;
    window.assetManager = AssetManager.instance;
}

