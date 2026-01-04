/**
 * ============================================================
 * DOCUMENT SERVICE (Enterprise Edition - Phase 3)
 * ============================================================
 * Gestión avanzada de documentos, previsualización y versiones.
 */

class DocumentService {
    constructor(api, state) {
        this.api = api;
        this.state = state;
    }

    /**
     * Previsualizar un archivo sin descargar
     */
    async previewFile(fileId, fileName, fileUrl) {
        const extension = fileName.split('.').pop().toLowerCase();
        const modal = this.createPreviewModal();
        const contentContainer = modal.querySelector('#previewContent');

        contentContainer.innerHTML = '<div class="flex items-center justify-center h-full"><i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i></div>';

        try {
            if (extension === 'pdf') {
                contentContainer.innerHTML = `<iframe src="${fileUrl}" class="w-full h-full border-none"></iframe>`;
            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                contentContainer.innerHTML = `<div class="flex items-center justify-center h-full p-4"><img src="${fileUrl}" class="max-w-full max-h-full object-contain rounded-lg shadow-lg"></div>`;
            } else if (['docx', 'xlsx', 'pptx'].includes(extension)) {
                // Utilizar el visor oficial de Microsoft para Office Online
                const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
                contentContainer.innerHTML = `<iframe src="${officeUrl}" class="w-full h-full border-none"></iframe>`;
            } else {
                contentContainer.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-slate-400">
                        <i class="fas fa-file-alt text-6xl mb-4"></i>
                        <p class="text-lg">Previsualización no disponible para este tipo de archivo.</p>
                        <a href="${fileUrl}" download="${fileName}" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">Descargar para ver</a>
                    </div>`;
            }
        } catch (error) {
            console.error('Error al previsualizar:', error);
            contentContainer.innerHTML = '<p class="text-red-500 text-center">Error al cargar la previsualización.</p>';
        }
    }

    createPreviewModal() {
        let modal = document.getElementById('enterprisePreviewModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'enterprisePreviewModal';
            modal.className = 'fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-all';
            modal.innerHTML = `
                <div class="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                    <div class="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                        <h4 class="text-xl font-bold text-white flex items-center gap-2">
                            <i class="fas fa-eye text-blue-400"></i>
                            Visor Enterprise
                        </h4>
                        <button onclick="document.getElementById('enterprisePreviewModal').remove()" class="w-10 h-10 rounded-full hover:bg-white/10 text-white transition-all">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="previewContent" class="flex-grow bg-slate-950"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        return modal;
    }

    /**
     * Sistema de control de versiones (Simulado para Phase 3)
     */
    async listVersions(fileId) {
        // En una app real, esto consultaría una tabla de versiones
        return [
            { version: 2, date: '2025-12-30', user: 'Admin', comment: 'Corrección de medidas' },
            { version: 1, date: '2025-12-25', user: 'Ing. Carlos', comment: 'Versión inicial' }
        ];
    }
}

window.documentService = new DocumentService(window.api, window.coreState);
