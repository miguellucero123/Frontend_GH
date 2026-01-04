/**
 * ============================================================================
 * SISTEMA DE COMENTARIOS Y ANOTACIONES - MEJORA FASE 1
 * ============================================================================
 * Comentarios contextuales para proyectos y documentos
 * Versión: 1.0.0
 * ============================================================================
 */

class CommentsSystem {
    constructor() {
        this.comments = new Map();
        this.init();
    }

    /**
     * Inicializar sistema de comentarios
     */
    init() {
        this.loadComments();
        this.createCommentButton();
        this.setupCommentListeners();
    }

    /**
     * Crear botón de comentarios
     */
    createCommentButton() {
        // Botón flotante para agregar comentarios
        const btn = document.createElement('button');
        btn.id = 'btnAddComment';
        btn.className = 'fixed bottom-20 right-4 z-40 glass-effect rounded-full w-14 h-14 text-white hover:bg-white/10 transition-all flex items-center justify-center shadow-lg';
        btn.innerHTML = '<i class="fas fa-comment-dots"></i>';
        btn.title = 'Agregar Comentario';
        btn.onclick = () => this.showCommentModal();
        document.body.appendChild(btn);
    }

    /**
     * Configurar listeners
     */
    setupCommentListeners() {
        // Agregar botones de comentario a proyectos
        document.addEventListener('click', (e) => {
            const commentBtn = e.target.closest('[data-comment-target]');
            if (commentBtn) {
                const targetId = commentBtn.dataset.commentTarget;
                const targetType = commentBtn.dataset.commentType || 'project';
                this.showCommentModal(targetId, targetType);
            }
        });
    }

    /**
     * Mostrar modal de comentarios
     */
    showCommentModal(targetId = null, targetType = 'project') {
        const modal = document.createElement('div');
        modal.id = 'commentsModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="this.closest('#commentsModal').remove()"></div>
            <div class="relative glass-effect rounded-xl p-6 border border-white/10 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <i class="fas fa-comments text-blue-400"></i>
                        Comentarios
                    </h3>
                    <button onclick="this.closest('#commentsModal').remove()" 
                        class="text-slate-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="mb-4">
                    <label class="block text-sm text-slate-300 mb-2">Agregar Comentario</label>
                    <textarea id="commentText" 
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        rows="3"
                        placeholder="Escribe tu comentario aquí..."></textarea>
                    <div class="flex items-center gap-2 mt-2">
                        <select id="commentPriority" 
                            class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm">
                            <option value="normal">Normal</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                        </select>
                        <button onclick="commentsSystem.addComment('${targetId}', '${targetType}')"
                            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm">
                            <i class="fas fa-paper-plane"></i> Enviar
                        </button>
                    </div>
                </div>

                <div id="commentsList" class="space-y-3">
                    ${this.renderComments(targetId, targetType)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Renderizar comentarios
     */
    renderComments(targetId, targetType) {
        const key = `${targetType}_${targetId}`;
        const comments = this.comments.get(key) || [];

        if (comments.length === 0) {
            return '<p class="text-slate-400 text-center py-4">No hay comentarios aún</p>';
        }

        return comments.map((comment, index) => `
            <div class="glass-effect rounded-lg p-4 border border-white/5">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                            ${comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="text-white font-semibold text-sm">${comment.author}</p>
                            <p class="text-slate-400 text-xs">${this.formatDate(comment.timestamp)}</p>
                        </div>
                    </div>
                    <span class="badge badge-${comment.priority} text-xs">${comment.priority}</span>
                </div>
                <p class="text-slate-300 text-sm">${this.escapeHtml(comment.text)}</p>
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="mt-3 ml-4 space-y-2">
                        ${comment.replies.map(reply => `
                            <div class="glass-effect rounded p-2 border border-white/5">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-xs text-slate-400">${reply.author}</span>
                                    <span class="text-xs text-slate-500">${this.formatDate(reply.timestamp)}</span>
                                </div>
                                <p class="text-slate-300 text-xs">${this.escapeHtml(reply.text)}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    /**
     * Agregar comentario
     */
    addComment(targetId, targetType) {
        const text = document.getElementById('commentText')?.value.trim();
        const priority = document.getElementById('commentPriority')?.value || 'normal';

        if (!text) {
            alert('Por favor, escribe un comentario');
            return;
        }

        const key = `${targetType}_${targetId || 'general'}`;
        const comments = this.comments.get(key) || [];

        const comment = {
            id: `comment_${Date.now()}`,
            text,
            author: this.getCurrentUser(),
            timestamp: Date.now(),
            priority,
            replies: []
        };

        comments.push(comment);
        this.comments.set(key, comments);
        this.saveComments();

        // Actualizar UI
        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
            commentsList.innerHTML = this.renderComments(targetId, targetType);
        }

        // Limpiar textarea
        const textarea = document.getElementById('commentText');
        if (textarea) textarea.value = '';

        // Notificar
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Comentario Agregado',
                message: 'Tu comentario ha sido guardado.'
            });
        }
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        if (typeof auth !== 'undefined' && auth.getCurrentUser) {
            const user = auth.getCurrentUser();
            return user?.name || user?.username || 'Usuario';
        }
        return 'Usuario';
    }

    /**
     * Formatear fecha
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Hace un momento';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} minutos`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;
        if (diff < 604800000) return `Hace ${Math.floor(diff / 86400000)} días`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    /**
     * Escapar HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Guardar comentarios
     */
    saveComments() {
        const data = Object.fromEntries(this.comments);
        localStorage.setItem('commentsData', JSON.stringify(data));
    }

    /**
     * Cargar comentarios
     */
    loadComments() {
        const saved = localStorage.getItem('commentsData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.comments = new Map(Object.entries(data));
            } catch (error) {
                console.warn('Error cargando comentarios:', error);
            }
        }
    }

    /**
     * Obtener comentarios para un target
     */
    getComments(targetId, targetType) {
        const key = `${targetType}_${targetId}`;
        return this.comments.get(key) || [];
    }

    /**
     * Obtener contador de comentarios
     */
    getCommentCount(targetId, targetType) {
        return this.getComments(targetId, targetType).length;
    }
}

// Inicializar sistema de comentarios
if (typeof window !== 'undefined') {
    window.commentsSystem = new CommentsSystem();
}

