/**
 * ============================================================
 * SISTEMA DE GESTIÓN DOCUMENTAL - FASE 2
 * ============================================================
 * 
 * Sistema de archivos con separación por roles:
 * - carpeta_mandante: Cliente y Gerencia
 * - carpeta_obra: Trabajador y Gerencia
 * - carpeta_gerencia: Solo Gerencia
 * 
 * Validación de permisos en frontend
 */

class FileSystemManager {
    constructor() {
        this.currentProjectId = null;
        this.currentFolderId = null;
        this.currentFolderType = null; // 'mandante', 'obra', 'gerencia'
        this.currentUserRole = null;
        this.files = [];
        this.folders = [];
        this.projectStructure = null;
    }

    /**
     * Inicializar sistema de archivos
     */
    init(projectId, containerId, userRole) {
        this.currentProjectId = projectId;
        this.currentUserRole = userRole || this.getUserRole();
        this.container = document.getElementById(containerId);

        if (!this.container) {
            console.error('Container no encontrado');
            return;
        }

        this.loadProjectStructure();
    }

    /**
     * Obtener rol del usuario actual
     */
    getUserRole() {
        if (typeof auth !== 'undefined' && auth.getCurrentUser) {
            const user = auth.getCurrentUser();
            return user?.role || user?.rol || 'cliente';
        }
        return 'cliente';
    }

    /**
     * Cargar estructura del proyecto desde el modelo de datos
     */
    async loadProjectStructure() {
        if (!this.currentProjectId) {
            console.error('No hay proyecto seleccionado');
            return;
        }

        try {
            // Intentar cargar desde API
            if (typeof api !== 'undefined' && api.getProject) {
                const project = await api.getProject(this.currentProjectId);
                this.projectStructure = project.sistema_archivos || this.createDefaultStructure();
            } else {
                // Usar estructura del modelo de datos
                if (window.PROJECT_DATA_MODEL) {
                    const project = window.PROJECT_DATA_MODEL.createProject({
                        project_id: this.currentProjectId
                    });
                    this.projectStructure = project.sistema_archivos || this.createDefaultStructure();
                } else {
                    this.projectStructure = this.createDefaultStructure();
                }
            }

            this.renderFolderStructure();
        } catch (error) {
            console.error('Error al cargar estructura:', error);
            this.projectStructure = this.createDefaultStructure();
            this.renderFolderStructure();
        }
    }

    /**
     * Crear estructura por defecto
     */
    createDefaultStructure() {
        return {
            carpeta_mandante: {
                id: 'mandante',
                nombre: 'Carpeta Cliente',
                archivos: [],
                subcarpetas: [],
                permisos: {
                    cliente: true,
                    trabajador: false,
                    gerencia: true
                }
            },
            carpeta_obra: {
                id: 'obra',
                nombre: 'Carpeta Obra',
                archivos: [],
                subcarpetas: [],
                permisos: {
                    cliente: false,
                    trabajador: true,
                    gerencia: true
                }
            },
            carpeta_gerencia: {
                id: 'gerencia',
                nombre: 'Carpeta Gerencia',
                archivos: [],
                subcarpetas: [],
                permisos: {
                    cliente: false,
                    trabajador: false,
                    gerencia: true
                }
            }
        };
    }

    /**
     * Verificar si el usuario tiene acceso a una carpeta
     */
    hasAccessToFolder(folderType) {
        if (!this.projectStructure || !this.projectStructure[folderType]) {
            return false;
        }

        const folder = this.projectStructure[folderType];
        const role = this.currentUserRole;

        // Gerencia tiene acceso a todo
        if (role === 'jefe' || role === 'admin') {
            return true;
        }

        // Verificar permisos específicos
        return folder.permisos[role] === true;
    }

    /**
     * Renderizar estructura de carpetas según permisos
     */
    renderFolderStructure() {
        if (!this.container) return;

        this.container.innerHTML = '';

        // Crear contenedor principal de carpetas
        const foldersContainer = document.createElement('div');
        foldersContainer.className = 'folders-structure';
        foldersContainer.id = 'foldersStructure';

        // Renderizar cada carpeta según permisos
        Object.keys(this.projectStructure).forEach(folderKey => {
            const folder = this.projectStructure[folderKey];
            const folderType = folderKey.replace('carpeta_', '');

            if (this.hasAccessToFolder(folderKey)) {
                const folderElement = this.createFolderCard(folder, folderType);
                foldersContainer.appendChild(folderElement);
            }
        });

        this.container.appendChild(foldersContainer);

        // Si no hay carpetas visibles, mostrar mensaje
        if (foldersContainer.children.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No tienes acceso a ninguna carpeta de este proyecto</p>
                </div>
            `;
        }
    }

    /**
     * Crear tarjeta de carpeta
     */
    createFolderCard(folder, folderType) {
        const card = document.createElement('div');
        card.className = 'folder-card';
        card.dataset.folderId = folder.id;
        card.dataset.folderType = folderType;

        // Determinar icono y color según tipo
        const folderConfig = this.getFolderConfig(folderType);

        card.innerHTML = `
            <div class="folder-card-header">
                <div class="folder-icon-wrapper" style="background: ${folderConfig.color}20; border-color: ${folderConfig.color}">
                    <i class="${folderConfig.icon}" style="color: ${folderConfig.color}"></i>
                </div>
                <div class="folder-info">
                    <h4 class="folder-name">${this.escapeHtml(folder.nombre)}</h4>
                    <p class="folder-description">${folderConfig.description}</p>
                </div>
            </div>
            <div class="folder-card-body">
                <div class="folder-stats">
                    <div class="stat-item">
                        <i class="fas fa-file"></i>
                        <span>${folder.archivos?.length || 0} archivos</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-folder"></i>
                        <span>${folder.subcarpetas?.length || 0} subcarpetas</span>
                    </div>
                </div>
            </div>
            <div class="folder-card-footer">
                <button class="btn btn-primary btn-open-folder" data-folder-type="${folderType}">
                    <i class="fas fa-folder-open"></i> Abrir Carpeta
                </button>
            </div>
        `;

        // Event listener para abrir carpeta
        const btnOpen = card.querySelector('.btn-open-folder');
        btnOpen.addEventListener('click', () => {
            this.openFolder(folderType);
        });

        return card;
    }

    /**
     * Obtener configuración de carpeta según tipo
     */
    getFolderConfig(folderType) {
        const configs = {
            'mandante': {
                icon: 'fas fa-user-tie',
                color: '#8b5cf6',
                description: 'Archivos y comunicación entre Cliente y Gerencia'
            },
            'obra': {
                icon: 'fas fa-hard-hat',
                color: '#f59e0b',
                description: 'Archivos y documentación técnica para Trabajadores'
            },
            'gerencia': {
                icon: 'fas fa-briefcase',
                color: '#2563eb',
                description: 'Archivos administrativos y de gestión (Solo Gerencia)'
            }
        };

        return configs[folderType] || {
            icon: 'fas fa-folder',
            color: '#6b7280',
            description: 'Carpeta de archivos'
        };
    }

    /**
     * Abrir carpeta y mostrar contenido
     */
    openFolder(folderType) {
        if (!this.hasAccessToFolder(`carpeta_${folderType}`)) {
            alert('⚠️ No tienes permiso para acceder a esta carpeta');
            return;
        }

        this.currentFolderType = folderType;
        const folder = this.projectStructure[`carpeta_${folderType}`];
        this.currentFolderId = folder.id;

        // Renderizar contenido de la carpeta
        this.renderFolderContent(folder);
    }

    /**
     * Renderizar contenido de carpeta
     */
    renderFolderContent(folder) {
        if (!this.container) return;

        // Crear breadcrumb
        const breadcrumb = this.createBreadcrumb(folder);

        // Crear contenedor de archivos
        const filesContainer = document.createElement('div');
        filesContainer.className = 'files-container';
        filesContainer.id = 'filesContainer';

        // Botones de acción (solo para gerencia)
        if (this.currentUserRole === 'jefe' || this.currentUserRole === 'admin') {
            const actionsBar = document.createElement('div');
            actionsBar.className = 'files-actions-bar';
            actionsBar.innerHTML = `
                <button class="btn btn-secondary" id="btnNewSubfolder">
                    <i class="fas fa-folder-plus"></i> Nueva Subcarpeta
                </button>
                <button class="btn btn-secondary" id="btnUploadFile">
                    <i class="fas fa-upload"></i> Subir Archivo
                </button>
                <button class="btn btn-secondary" id="btnBackToFolders">
                    <i class="fas fa-arrow-left"></i> Volver a Carpetas
                </button>
            `;
            filesContainer.appendChild(actionsBar);

            // Event listeners
            const btnBack = actionsBar.querySelector('#btnBackToFolders');
            if (btnBack) {
                btnBack.addEventListener('click', () => {
                    this.renderFolderStructure();
                });
            }

            const btnUpload = actionsBar.querySelector('#btnUploadFile');
            if (btnUpload) {
                btnUpload.addEventListener('click', () => {
                    this.showUploadDialog();
                });
            }

            const btnNewSubfolder = actionsBar.querySelector('#btnNewSubfolder');
            if (btnNewSubfolder) {
                btnNewSubfolder.addEventListener('click', () => {
                    this.showNewSubfolderDialog();
                });
            }
        } else {
            // Botón de volver para clientes y trabajadores
            const backButton = document.createElement('button');
            backButton.className = 'btn btn-secondary';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver a Carpetas';
            backButton.addEventListener('click', () => {
                this.renderFolderStructure();
            });
            filesContainer.appendChild(backButton);
        }

        // Renderizar breadcrumb
        filesContainer.appendChild(breadcrumb);

        // Renderizar archivos
        const filesGrid = document.createElement('div');
        filesGrid.className = 'files-grid';
        filesGrid.id = 'filesGrid';

        if (folder.archivos && folder.archivos.length > 0) {
            folder.archivos.forEach(file => {
                const fileElement = this.createFileElement(file);
                filesGrid.appendChild(fileElement);
            });
        } else {
            filesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>Esta carpeta está vacía</p>
                </div>
            `;
        }

        filesContainer.appendChild(filesGrid);

        // Renderizar subcarpetas
        if (folder.subcarpetas && folder.subcarpetas.length > 0) {
            const subfoldersContainer = document.createElement('div');
            subfoldersContainer.className = 'subfolders-container';
            subfoldersContainer.innerHTML = '<h5>Subcarpetas</h5>';

            folder.subcarpetas.forEach(subfolder => {
                const subfolderElement = this.createSubfolderElement(subfolder);
                subfoldersContainer.appendChild(subfolderElement);
            });

            filesContainer.appendChild(subfoldersContainer);
        }

        // Reemplazar contenido
        this.container.innerHTML = '';
        this.container.appendChild(filesContainer);
    }

    /**
     * Crear breadcrumb
     */
    createBreadcrumb(folder) {
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb-folder';
        breadcrumb.innerHTML = `
            <a href="#" class="breadcrumb-item" data-action="back-to-folders">
                <i class="fas fa-home"></i> Carpetas
            </a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">${this.escapeHtml(folder.nombre)}</span>
        `;

        const backLink = breadcrumb.querySelector('[data-action="back-to-folders"]');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderFolderStructure();
            });
        }

        return breadcrumb;
    }

    /**
     * Crear elemento de archivo
     */
    createFileElement(file) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.dataset.fileId = file.file_id || file.id;

        const fileType = this.getFileType(file.nombre || file.name);
        const icon = this.getFileIcon(fileType);
        const color = this.getFileColor(fileType);

        div.innerHTML = `
            <div class="file-icon-wrapper" style="background: ${color}20; border-color: ${color}">
                <i class="${icon}" style="color: ${color}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${this.escapeHtml(file.nombre || file.name)}</div>
                <div class="file-meta">
                    <span class="file-size">${this.formatFileSize(file.tamaño || file.size || 0)}</span>
                    ${file.fecha_subida ? `<span class="file-date">${this.formatDate(file.fecha_subida)}</span>` : ''}
                </div>
            </div>
            <div class="file-actions">
                <button class="btn-icon" onclick="fileSystemManager.downloadFile('${file.file_id || file.id}')" title="Descargar">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" onclick="fileSystemManager.showVersionHistory('${file.file_id || file.id}')" title="Historial de Versiones">
                    <i class="fas fa-history"></i>
                </button>
                ${this.currentUserRole === 'jefe' || this.currentUserRole === 'admin' ? `
                <button class="btn-icon" onclick="fileSystemManager.deleteFile('${file.file_id || file.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </div>
        `;

        // Click para abrir/vista previa
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.file-actions')) {
                this.handleFileClick(file);
            }
        });

        return div;
    }

    /**
     * Crear elemento de subcarpeta
     */
    createSubfolderElement(subfolder) {
        const div = document.createElement('div');
        div.className = 'subfolder-item';
        div.dataset.subfolderId = subfolder.id;

        div.innerHTML = `
            <i class="fas fa-folder folder-icon"></i>
            <span class="subfolder-name">${this.escapeHtml(subfolder.nombre || subfolder.name)}</span>
        `;

        div.addEventListener('click', () => {
            // Navegar a subcarpeta (implementar si es necesario)
            console.log('Abrir subcarpeta:', subfolder);
        });

        return div;
    }

    /**
     * Manejar click en archivo
     */
    handleFileClick(file) {
        const fileType = this.getFileType(file.nombre || file.name);
        const previewTypes = ['pdf', 'jpeg', 'jpg', 'png', 'gif'];

        if (previewTypes.includes(fileType)) {
            this.showPreview(file);
        } else {
            this.downloadFile(file.file_id || file.id);
        }
    }

    /**
     * Mostrar vista previa usando DocumentService (Phase 3)
     */
    showPreview(file) {
        if (typeof documentService !== 'undefined') {
            const fileName = file.nombre || file.name;
            const fileUrl = file.url || 'https://via.placeholder.com/150'; // En producción usar URL real de S3/Storage
            documentService.previewFile(file.file_id || file.id, fileName, fileUrl);
        } else {
            alert(`Vista previa de: ${file.nombre || file.name}`);
        }
    }

    /**
     * Mostrar historial de versiones (Fase 3)
     */
    async showVersionHistory(fileId) {
        if (!window.documentService) return;
        const versions = await window.documentService.listVersions(fileId);
        const historyText = versions.map(v => `v${v.version} - ${v.date} (${v.user}): ${v.comment}`).join('\n');
        alert(`Historial de Versiones:\n----------------------\n${historyText}`);
    }

    /**
     * Descargar archivo
     */
    downloadFile(fileId) {
        // Implementar descarga
        console.log('Descargar archivo:', fileId);
        alert('Funcionalidad de descarga en desarrollo');
    }

    /**
     * Eliminar archivo (solo gerencia)
     */
    deleteFile(fileId) {
        if (this.currentUserRole !== 'jefe' && this.currentUserRole !== 'admin') {
            alert('⚠️ Solo la gerencia puede eliminar archivos');
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
            console.log('Eliminar archivo:', fileId);
            // Implementar eliminación
        }
    }

    /**
     * Mostrar diálogo de subida
     */
    showUploadDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.dwg,.mp4';

        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.uploadFiles(files);
        });

        input.click();
    }

    /**
     * Subir archivos
     */
    async uploadFiles(files) {
        if (!window.api) return;

        for (const file of files) {
            try {
                // Integración API Real (Fase 3)
                const resp = await window.api.uploadFile(file, this.currentProjectId, this.currentFolderId);

                // Agregar a la estructura local (Optimistic Update)
                const newFile = {
                    file_id: resp.file_id || Date.now(),
                    nombre: file.name,
                    tipo: this.getFileType(file.name),
                    tamaño: file.size,
                    fecha_subida: new Date().toISOString(),
                    url: resp.url
                };

                const folder = this.projectStructure[`carpeta_${this.currentFolderType}`];
                if (!folder.archivos) {
                    folder.archivos = [];
                }
                folder.archivos.push(newFile);

                this.renderFolderContent(folder);
            } catch (error) {
                console.error('Error al subir archivo:', error);
                alert(`Error al subir ${file.name}: ${error.message}`);
            }
        }
    }

    /**
     * Mostrar diálogo de nueva subcarpeta
     */
    showNewSubfolderDialog() {
        const name = prompt('Nombre de la nueva subcarpeta:');
        if (name && name.trim()) {
            const folder = this.projectStructure[`carpeta_${this.currentFolderType}`];
            if (!folder.subcarpetas) {
                folder.subcarpetas = [];
            }

            folder.subcarpetas.push({
                id: Date.now(),
                nombre: name.trim(),
                archivos: [],
                subcarpetas: []
            });

            this.renderFolderContent(folder);
        }
    }

    /**
     * Utilidades
     */
    getFileType(fileName) {
        if (!fileName) return 'file';
        const extension = fileName.split('.').pop()?.toLowerCase();
        return extension || 'file';
    }

    getFileIcon(fileType) {
        const icons = {
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'xls': 'fa-file-excel',
            'xlsx': 'fa-file-excel',
            'txt': 'fa-file-alt',
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'gif': 'fa-file-image',
            'dwg': 'fa-file-image',
            'mp4': 'fa-file-video',
            'video': 'fa-file-video'
        };
        return icons[fileType] || 'fa-file';
    }

    getFileColor(fileType) {
        const colors = {
            'pdf': '#ef4444',
            'doc': '#2563eb',
            'docx': '#2563eb',
            'xls': '#10b981',
            'xlsx': '#10b981',
            'txt': '#64748b',
            'jpg': '#f59e0b',
            'jpeg': '#f59e0b',
            'png': '#f59e0b',
            'gif': '#f59e0b',
            'dwg': '#8b5cf6',
            'mp4': '#ec4899',
            'video': '#ec4899'
        };
        return colors[fileType] || '#64748b';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instancia global
const fileSystemManager = new FileSystemManager();

