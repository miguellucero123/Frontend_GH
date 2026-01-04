/**
 * Lógica del Panel de Usuario (Trabajador/Cliente)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!auth.requireAuth()) {
        return;
    }

    // Verificar que no sea admin
    if (auth.isAdmin()) {
        window.location.href = 'panel-jefe.html';
        return;
    }

    const currentUser = auth.getCurrentUser();
    const projectTitle = document.getElementById('projectTitle');
    const userName = document.getElementById('userName');
    const btnLogout = document.getElementById('btnLogout');
    const btnGridView = document.getElementById('btnGridView');
    const btnListView = document.getElementById('btnListView');

    // Configurar usuario
    if (userName) {
        userName.textContent = currentUser?.name || currentUser?.username || 'Usuario';
    }

    // Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                auth.logout();
            }
        });
    }

    // Cargar proyecto asignado
    let projectId = currentUser?.project_id;
    if (!projectId) {
        // Si no tiene proyecto asignado, intentar obtenerlo
        try {
            const projects = await api.getProjects();
            if (projects.length > 0) {
                projectId = projects[0].project_id;
            }
        } catch (error) {
            console.error('Error al cargar proyecto:', error);
        }
    }

    if (!projectId) {
        alert('No tienes un proyecto asignado. Contacta al administrador.');
        return;
    }

    // Cargar información del proyecto
    await loadProjectInfo(projectId);

    // Inicializar gestor de archivos (FASE 2: Sistema con carpetas separadas)
    const userRole = currentUser?.role || currentUser?.rol || 'cliente';
    
    // Usar nuevo sistema de archivos si está disponible
    if (typeof fileSystemManager !== 'undefined') {
        fileSystemManager.init(projectId, 'filesContainer', userRole);
    } else {
        // Fallback al sistema anterior
        fileManager.init(projectId, 'filesContainer', 'breadcrumb');
    }

    // Inicializar chat - FASE 3: Sistema de canales separados
    const userRole = currentUser?.role || currentUser?.rol || 'cliente';
    
    // Usar nuevo sistema de canales si está disponible
    if (typeof chatChannelsManager !== 'undefined') {
        chatChannelsManager.init(projectId, 'chatChannelsContainer', userRole);
    } else {
        // Fallback al sistema anterior
        const jefeId = await getJefeId();
        if (jefeId && typeof chatManager !== 'undefined') {
            chatManager.init(projectId, jefeId);
        }
    }

    // Cambiar vista
    if (btnGridView) {
        btnGridView.addEventListener('click', () => {
            fileManager.setView('grid');
            btnGridView.classList.add('active');
            if (btnListView) btnListView.classList.remove('active');
        });
    }

    if (btnListView) {
        btnListView.addEventListener('click', () => {
            fileManager.setView('list');
            btnListView.classList.add('active');
            if (btnGridView) btnGridView.classList.remove('active');
        });
    }

    /**
     * Cargar información del proyecto
     */
    async function loadProjectInfo(projectId) {
        try {
            const project = await api.getProject(projectId);

            // Actualizar título
            if (projectTitle) {
                projectTitle.textContent = project.mandante_nombre || 'Proyecto';
            }

            // Actualizar metadatos
            updateMetadata(project);
        } catch (error) {
            console.error('Error al cargar información del proyecto:', error);
        }
    }

    /**
     * Actualizar metadatos en el sidebar
     */
    function updateMetadata(project) {
        const elements = {
            metadataMandante: project.mandante_nombre,
            metadataDireccion: project.direccion,
            metadataCiudad: project.ciudad,
            metadataDescripcion: project.descripcion || 'Sin descripción',
            metadataFechaInicio: formatDate(project.fecha_inicio),
            metadataFechaFin: formatDate(project.fecha_termino_estimada)
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id] || '-';
            }
        });
    }

    /**
     * Obtener ID del Jefe
     */
    async function getJefeId() {
        try {
            // En una implementación real, esto vendría del backend
            // Por ahora, retornamos null y el chat funcionará sin WebSocket
            return null;
        } catch (error) {
            console.error('Error al obtener ID del jefe:', error);
            return null;
        }
    }

    /**
     * Formatear fecha
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
});

