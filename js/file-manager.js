/**
 * Módulo de Gestión de Archivos
 * Maneja la visualización y navegación de archivos y carpetas
 */

class FileManager {
    constructor() {
        this.currentProjectId = null;
        this.currentFolderId = null;
        this.currentView = 'grid'; // 'grid' o 'list'
        this.files = [];
        this.folders = [];
    }

    /**
     * Inicializar gestor de archivos
     */
    init(projectId, containerId, breadcrumbId) {
        this.currentProjectId = projectId;
        this.container = document.getElementById(containerId);
        this.breadcrumb = document.getElementById(breadcrumbId);
        
        if (!this.container) {
            console.error('Container no encontrado');
            return;
        }

        this.loadStructure();
    }

    /**
     * Cargar estructura de archivos
     */
    async loadStructure(folderId = null) {
        if (!this.currentProjectId) {
            console.error('No hay proyecto seleccionado');
            return;
        }

        try {
            const data = await api.getProjectStructure(this.currentProjectId, folderId);
            
            this.files = data.files || [];
            this.folders = data.folders || [];
            this.currentFolderId = folderId;

            this.render();
            this.updateBreadcrumb(data.breadcrumb || []);
        } catch (error) {
            console.error('Error al cargar estructura:', error);
            this.showError('Error al cargar los archivos');
        }
    }

    /**
     * Renderizar archivos y carpetas
     */
    render() {
        if (!this.container) return;

        const emptyState = this.container.querySelector('.empty-state');
        const filesGrid = this.container.querySelector('.files-grid') || this.container;

        // Limpiar contenedor
        if (filesGrid) {
            filesGrid.innerHTML = '';
        }

        // Si no hay archivos ni carpetas
        if (this.folders.length === 0 && this.files.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Aplicar clase de vista
        if (filesGrid) {
            filesGrid.className = `files-grid ${this.currentView}-view`;
        }

        // Renderizar carpetas
        this.folders.forEach(folder => {
            const folderElement = this.createFolderElement(folder);
            if (filesGrid) {
                filesGrid.appendChild(folderElement);
            }
        });

        // Renderizar archivos
        this.files.forEach(file => {
            const fileElement = this.createFileElement(file);
            if (filesGrid) {
                filesGrid.appendChild(fileElement);
            }
        });
    }

    /**
     * Crear elemento de carpeta
     */
    createFolderElement(folder) {
        const div = document.createElement('div');
        div.className = 'folder-item';
        div.dataset.folderId = folder.folder_id;
        div.dataset.folderName = folder.name;

        const icon = document.createElement('i');
        icon.className = 'fas fa-folder folder-icon';
        icon.style.color = '#f59e0b';

        const name = document.createElement('div');
        name.className = 'folder-name';
        name.textContent = folder.name;

        div.appendChild(icon);
        div.appendChild(name);

        // Event listener para abrir carpeta
        div.addEventListener('click', () => {
            this.loadStructure(folder.folder_id);
        });

        return div;
    }

    /**
     * Crear elemento de archivo
     */
    createFileElement(file) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.dataset.fileId = file.file_id;
        div.dataset.fileName = file.name;

        const icon = this.getFileIcon(file.file_type);
        const iconElement = document.createElement('i');
        iconElement.className = `fas ${icon} file-icon`;
        iconElement.style.color = this.getFileColor(file.file_type);

        const name = document.createElement('div');
        name.className = 'file-name';
        name.textContent = file.name;

        const size = document.createElement('div');
        size.className = 'file-size';
        size.textContent = this.formatFileSize(file.size || 0);

        div.appendChild(iconElement);
        div.appendChild(name);
        div.appendChild(size);

        // Event listener para abrir/descargar archivo
        div.addEventListener('click', () => {
            this.handleFileClick(file);
        });

        return div;
    }

    /**
     * Obtener icono según tipo de archivo
     */
    getFileIcon(fileType) {
        const icons = {
            'pdf': 'fa-file-pdf',
            'docx': 'fa-file-word',
            'doc': 'fa-file-word',
            'xlsx': 'fa-file-excel',
            'xls': 'fa-file-excel',
            'txt': 'fa-file-alt',
            'dwg': 'fa-file-image', // AutoCAD
            'jpeg': 'fa-file-image',
            'jpg': 'fa-file-image',
            'png': 'fa-file-image',
            'mp4': 'fa-file-video',
            'video': 'fa-file-video'
        };

        const type = fileType?.toLowerCase() || 'file';
        return icons[type] || 'fa-file';
    }

    /**
     * Obtener color según tipo de archivo
     */
    getFileColor(fileType) {
        const colors = {
            'pdf': '#ef4444',
            'docx': '#2563eb',
            'doc': '#2563eb',
            'xlsx': '#10b981',
            'xls': '#10b981',
            'txt': '#64748b',
            'dwg': '#8b5cf6',
            'jpeg': '#f59e0b',
            'jpg': '#f59e0b',
            'png': '#f59e0b',
            'mp4': '#ec4899',
            'video': '#ec4899'
        };

        const type = fileType?.toLowerCase() || 'file';
        return colors[type] || '#64748b';
    }

    /**
     * Formatear tamaño de archivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Manejar click en archivo
     */
    handleFileClick(file) {
        // Si es imagen o PDF, mostrar vista previa
        const previewTypes = ['pdf', 'jpeg', 'jpg', 'png'];
        const fileType = file.file_type?.toLowerCase();

        if (previewTypes.includes(fileType)) {
            this.showPreview(file);
        } else {
            // Descargar archivo
            this.downloadFile(file);
        }
    }

    /**
     * Mostrar vista previa
     */
    showPreview(file) {
        const modal = document.getElementById('filePreviewModal');
        if (!modal) return;

        const fileName = document.getElementById('previewFileName');
        const previewContent = document.getElementById('previewContent');

        if (fileName) {
            fileName.textContent = file.name;
        }

        if (previewContent) {
            const downloadURL = api.getDownloadURL(file.file_id);
            
            if (file.file_type?.toLowerCase() === 'pdf') {
                previewContent.innerHTML = `
                    <iframe src="${downloadURL}" style="width: 100%; height: 600px; border: none;"></iframe>
                `;
            } else {
                previewContent.innerHTML = `
                    <img src="${downloadURL}" alt="${file.name}" style="max-width: 100%; height: auto;">
                `;
            }
        }

        modal.classList.add('active');

        // Cerrar modal
        const btnClose = document.getElementById('btnClosePreview');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    /**
     * Descargar archivo
     */
    downloadFile(file) {
        const downloadURL = api.getDownloadURL(file.file_id);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Actualizar breadcrumb
     */
    updateBreadcrumb(breadcrumbPath) {
        if (!this.breadcrumb) return;

        this.breadcrumb.innerHTML = '';

        // Agregar "Inicio"
        const homeItem = document.createElement('a');
        homeItem.className = 'breadcrumb-item';
        homeItem.href = '#';
        homeItem.dataset.folderId = '0';
        homeItem.innerHTML = '<i class="fas fa-home"></i> Inicio';
        homeItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadStructure(null);
        });
        this.breadcrumb.appendChild(homeItem);

        // Agregar carpetas del path
        breadcrumbPath.forEach((folder, index) => {
            const separator = document.createTextNode(' / ');
            this.breadcrumb.appendChild(separator);

            const item = document.createElement('a');
            item.className = 'breadcrumb-item';
            item.href = '#';
            item.dataset.folderId = folder.folder_id;
            item.textContent = folder.name;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadStructure(folder.folder_id);
            });
            this.breadcrumb.appendChild(item);
        });
    }

    /**
     * Cambiar vista (grid/list)
     */
    setView(view) {
        this.currentView = view;
        this.render();
    }

    /**
     * Mostrar error
     */
    showError(message) {
        // Implementar notificación de error
        console.error(message);
        alert(message); // Reemplazar con sistema de notificaciones
    }
}

// Instancia global
const fileManager = new FileManager();

