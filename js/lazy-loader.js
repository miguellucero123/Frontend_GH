/**
 * ============================================================================
 * LAZY LOADER - MEJORA FASE 1
 * ============================================================================
 * Carga diferida de componentes y recursos
 * Versión: 1.0.0
 * ============================================================================
 */

class LazyLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.observers = new Map();
        this.init();
    }

    /**
     * Inicializar lazy loader
     */
    init() {
        this.setupIntersectionObserver();
        this.lazyLoadImages();
        this.lazyLoadCharts();
    }

    /**
     * Configurar Intersection Observer
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadComponent(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    /**
     * Cargar componente
     */
    loadComponent(element) {
        const componentType = element.dataset.lazyComponent;
        
        switch (componentType) {
            case 'chart':
                this.loadChart(element);
                break;
            case 'table':
                this.loadTable(element);
                break;
            case 'modal':
                this.loadModal(element);
                break;
            default:
                this.loadGeneric(element);
        }
    }

    /**
     * Lazy load de imágenes
     */
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Lazy load de gráficos
     */
    lazyLoadCharts() {
        const chartContainers = document.querySelectorAll('[data-lazy-component="chart"]');
        chartContainers.forEach(container => {
            this.observer.observe(container);
        });
    }

    /**
     * Cargar gráfico
     */
    loadChart(container) {
        if (this.loadedComponents.has(container.id)) return;

        // Los gráficos se inicializan automáticamente por DashboardInteractive
        // Este método puede usarse para gráficos adicionales
        this.loadedComponents.add(container.id);
    }

    /**
     * Cargar tabla
     */
    loadTable(container) {
        if (this.loadedComponents.has(container.id)) return;

        // Cargar datos de tabla de forma diferida
        const dataSource = container.dataset.dataSource;
        if (dataSource && typeof window[dataSource] === 'function') {
            window[dataSource]().then(data => {
                this.renderTable(container, data);
            });
        }

        this.loadedComponents.add(container.id);
    }

    /**
     * Renderizar tabla
     */
    renderTable(container, data) {
        // Implementación básica
        console.log('Renderizando tabla:', data);
    }

    /**
     * Cargar modal
     */
    loadModal(container) {
        if (this.loadedComponents.has(container.id)) return;

        // Los modales se cargan cuando se necesitan
        this.loadedComponents.add(container.id);
    }

    /**
     * Cargar genérico
     */
    loadGeneric(element) {
        // Cargar contenido genérico
        const src = element.dataset.src;
        if (src) {
            fetch(src)
                .then(response => response.text())
                .then(html => {
                    element.innerHTML = html;
                    this.loadedComponents.add(element.id || element.className);
                });
        }
    }

    /**
     * Precargar componente
     */
    preload(componentId) {
        const element = document.getElementById(componentId);
        if (element) {
            this.loadComponent(element);
        }
    }

    /**
     * Verificar si está cargado
     */
    isLoaded(componentId) {
        return this.loadedComponents.has(componentId);
    }
}

// Inicializar lazy loader
if (typeof window !== 'undefined') {
    window.lazyLoader = new LazyLoader();
}

