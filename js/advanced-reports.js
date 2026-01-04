/**
 * ============================================================================
 * SISTEMA DE REPORTES AVANZADOS - MEJORA FASE 1
 * ============================================================================
 * Reportes programados, plantillas personalizables y exportación múltiple
 * Versión: 1.0.0
 * ============================================================================
 */

class AdvancedReports {
    constructor() {
        this.reports = [];
        this.templates = new Map();
        this.scheduledReports = [];
        this.init();
    }

    /**
     * Inicializar sistema de reportes
     */
    init() {
        this.loadReports();
        this.loadTemplates();
        this.loadScheduledReports();
        this.createReportsButton();
    }

    /**
     * Crear botón de reportes avanzados
     */
    createReportsButton() {
        const btn = document.createElement('button');
        btn.id = 'btnAdvancedReports';
        btn.className = 'fixed top-32 right-4 z-40 glass-effect rounded-lg px-4 py-2 text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2';
        btn.innerHTML = '<i class="fas fa-file-chart-line"></i> Reportes Avanzados';
        btn.onclick = () => this.showReportsPanel();
        document.body.appendChild(btn);
    }

    /**
     * Mostrar panel de reportes
     */
    showReportsPanel() {
        const modal = document.createElement('div');
        modal.id = 'advancedReportsModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="this.closest('#advancedReportsModal').remove()"></div>
            <div class="relative glass-effect rounded-xl p-6 border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-white flex items-center gap-2">
                        <i class="fas fa-file-chart-line text-blue-400"></i>
                        Reportes Avanzados
                    </h3>
                    <button onclick="this.closest('#advancedReportsModal').remove()" 
                        class="text-slate-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button onclick="advancedReports.showCreateReport()"
                        class="glass-effect rounded-lg p-4 border border-white/5 hover:border-blue-500 transition-all text-left">
                        <i class="fas fa-plus-circle text-blue-400 text-2xl mb-2"></i>
                        <h4 class="text-white font-semibold mb-1">Crear Reporte</h4>
                        <p class="text-slate-400 text-sm">Generar nuevo reporte personalizado</p>
                    </button>
                    <button onclick="advancedReports.showTemplates()"
                        class="glass-effect rounded-lg p-4 border border-white/5 hover:border-emerald-500 transition-all text-left">
                        <i class="fas fa-file-alt text-emerald-400 text-2xl mb-2"></i>
                        <h4 class="text-white font-semibold mb-1">Plantillas</h4>
                        <p class="text-slate-400 text-sm">Usar o crear plantillas</p>
                    </button>
                    <button onclick="advancedReports.showScheduled()"
                        class="glass-effect rounded-lg p-4 border border-white/5 hover:border-purple-500 transition-all text-left">
                        <i class="fas fa-clock text-purple-400 text-2xl mb-2"></i>
                        <h4 class="text-white font-semibold mb-1">Programados</h4>
                        <p class="text-slate-400 text-sm">Reportes automáticos</p>
                    </button>
                </div>

                <div id="reportsContent">
                    ${this.renderReportsList()}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Renderizar lista de reportes
     */
    renderReportsList() {
        if (this.reports.length === 0) {
            return '<p class="text-slate-400 text-center py-8">No hay reportes guardados</p>';
        }

        return `
            <div class="space-y-3">
                ${this.reports.map(report => `
                    <div class="glass-effect rounded-lg p-4 border border-white/5 hover:border-blue-500 transition-all">
                        <div class="flex items-center justify-between">
                            <div class="flex-grow">
                                <h4 class="text-white font-semibold mb-1">${report.name}</h4>
                                <p class="text-slate-400 text-sm mb-2">${report.description || ''}</p>
                                <div class="flex items-center gap-4 text-xs text-slate-500">
                                    <span><i class="fas fa-calendar"></i> ${this.formatDate(report.createdAt)}</span>
                                    <span><i class="fas fa-file"></i> ${report.format.toUpperCase()}</span>
                                    <span><i class="fas fa-project-diagram"></i> ${report.projectCount || 0} proyectos</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="advancedReports.generateReport('${report.id}')"
                                    class="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">
                                    <i class="fas fa-download"></i> Generar
                                </button>
                                <button onclick="advancedReports.editReport('${report.id}')"
                                    class="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="advancedReports.deleteReport('${report.id}')"
                                    class="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Mostrar formulario de creación
     */
    showCreateReport() {
        const content = document.getElementById('reportsContent');
        if (!content) return;

        content.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm text-slate-300 mb-2">Nombre del Reporte</label>
                    <input type="text" id="reportName" 
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        placeholder="Ej: Reporte Mensual Enero 2024">
                </div>

                <div>
                    <label class="block text-sm text-slate-300 mb-2">Descripción</label>
                    <textarea id="reportDescription" 
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        rows="2"
                        placeholder="Descripción del reporte..."></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-slate-300 mb-2">Formato</label>
                        <select id="reportFormat" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-slate-300 mb-2">Plantilla</label>
                        <select id="reportTemplate" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                            <option value="">Sin plantilla</option>
                            ${Array.from(this.templates.values()).map(t => 
                                `<option value="${t.id}">${t.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm text-slate-300 mb-2">Secciones a Incluir</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="reportSection" value="financial" checked>
                            <span class="text-white">Datos Financieros</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="reportSection" value="timeline" checked>
                            <span class="text-white">Cronograma e Hitos</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="reportSection" value="resources">
                            <span class="text-white">Recursos y Personal</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="reportSection" value="risks">
                            <span class="text-white">Riesgos y Alertas</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="reportSection" value="predictions">
                            <span class="text-white">Análisis Predictivo</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="scheduleReport">
                        <span class="text-white">Programar Reporte Automático</span>
                    </label>
                    <div id="scheduleOptions" class="mt-2 hidden space-y-2">
                        <select id="scheduleFrequency" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                            <option value="daily">Diario</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                            <option value="quarterly">Trimestral</option>
                        </select>
                        <input type="time" id="scheduleTime" 
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                    </div>
                </div>

                <div class="flex gap-2 pt-4">
                    <button onclick="advancedReports.saveReport()"
                        class="flex-grow px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        <i class="fas fa-save"></i> Guardar y Generar
                    </button>
                    <button onclick="advancedReports.showReportsPanel()"
                        class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white">
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        // Toggle schedule options
        document.getElementById('scheduleReport')?.addEventListener('change', (e) => {
            const options = document.getElementById('scheduleOptions');
            if (options) {
                options.classList.toggle('hidden', !e.target.checked);
            }
        });
    }

    /**
     * Guardar reporte
     */
    saveReport() {
        const name = document.getElementById('reportName')?.value.trim();
        if (!name) {
            alert('Por favor, ingresa un nombre para el reporte');
            return;
        }

        const sections = Array.from(document.querySelectorAll('.reportSection:checked'))
            .map(cb => cb.value);

        const report = {
            id: `report_${Date.now()}`,
            name,
            description: document.getElementById('reportDescription')?.value || '',
            format: document.getElementById('reportFormat')?.value || 'pdf',
            template: document.getElementById('reportTemplate')?.value || null,
            sections,
            createdAt: Date.now(),
            projectCount: this.getProjectCount()
        };

        this.reports.push(report);
        this.saveReports();

        // Programar si está activado
        if (document.getElementById('scheduleReport')?.checked) {
            this.scheduleReport(report);
        }

        // Generar reporte
        this.generateReport(report.id);

        // Notificar
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.add({
                type: 'success',
                priority: 'low',
                title: '✅ Reporte Creado',
                message: `El reporte "${name}" ha sido creado y generado.`
            });
        }
    }

    /**
     * Generar reporte
     */
    generateReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Usar exportManager si está disponible
        if (typeof window.exportManager !== 'undefined') {
            window.exportManager.exportReport(report);
        } else {
            // Fallback básico
            this.generateBasicReport(report);
        }
    }

    /**
     * Generar reporte básico
     */
    generateBasicReport(report) {
        const data = this.collectReportData(report);
        
        if (report.format === 'pdf') {
            this.exportToPDF(data, report);
        } else if (report.format === 'excel') {
            this.exportToExcel(data, report);
        } else if (report.format === 'csv') {
            this.exportToCSV(data, report);
        } else {
            this.exportToJSON(data, report);
        }
    }

    /**
     * Recolectar datos del reporte
     */
    collectReportData(report) {
        const data = {
            metadata: {
                name: report.name,
                description: report.description,
                generatedAt: new Date().toISOString(),
                format: report.format
            },
            sections: {}
        };

        if (report.sections.includes('financial')) {
            data.sections.financial = this.getFinancialData();
        }
        if (report.sections.includes('timeline')) {
            data.sections.timeline = this.getTimelineData();
        }
        if (report.sections.includes('resources')) {
            data.sections.resources = this.getResourcesData();
        }
        if (report.sections.includes('risks')) {
            data.sections.risks = this.getRisksData();
        }
        if (report.sections.includes('predictions')) {
            data.sections.predictions = this.getPredictionsData();
        }

        return data;
    }

    /**
     * Obtener datos financieros
     */
    getFinancialData() {
        if (typeof window.gestorGerencia !== 'undefined') {
            return window.gestorGerencia.obtenerResumenFinanciero();
        }
        return {};
    }

    /**
     * Obtener datos de cronograma
     */
    getTimelineData() {
        if (typeof window.gestorGerencia !== 'undefined') {
            return window.gestorGerencia.obtenerCronograma();
        }
        return {};
    }

    /**
     * Obtener datos de recursos
     */
    getResourcesData() {
        return { message: 'Datos de recursos no disponibles' };
    }

    /**
     * Obtener datos de riesgos
     */
    getRisksData() {
        if (typeof window.risksPanel !== 'undefined') {
            return window.risksPanel.getRisksSummary();
        }
        return {};
    }

    /**
     * Obtener datos predictivos
     */
    getPredictionsData() {
        if (typeof window.predictiveAnalysis !== 'undefined') {
            return window.predictiveAnalysis.obtenerResumenPredictivo();
        }
        return {};
    }

    /**
     * Exportar a PDF
     */
    exportToPDF(data, report) {
        // Usar jsPDF si está disponible
        if (typeof window.jsPDF !== 'undefined') {
            const doc = new window.jsPDF();
            doc.text(report.name, 20, 20);
            doc.text(`Generado: ${new Date().toLocaleString()}`, 20, 30);
            doc.save(`${report.name}.pdf`);
        } else {
            alert('Generando PDF... (jsPDF no disponible)');
        }
    }

    /**
     * Exportar a Excel
     */
    exportToExcel(data, report) {
        // Usar SheetJS si está disponible
        if (typeof window.XLSX !== 'undefined') {
            const ws = window.XLSX.utils.json_to_sheet([data]);
            const wb = window.XLSX.utils.book_new();
            window.XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
            window.XLSX.writeFile(wb, `${report.name}.xlsx`);
        } else {
            alert('Generando Excel... (SheetJS no disponible)');
        }
    }

    /**
     * Exportar a CSV
     */
    exportToCSV(data, report) {
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.name}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Exportar a JSON
     */
    exportToJSON(data, report) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.name}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Convertir a CSV
     */
    convertToCSV(data) {
        // Implementación básica
        return JSON.stringify(data);
    }

    /**
     * Programar reporte
     */
    scheduleReport(report) {
        const frequency = document.getElementById('scheduleFrequency')?.value;
        const time = document.getElementById('scheduleTime')?.value;

        const scheduled = {
            id: `scheduled_${Date.now()}`,
            reportId: report.id,
            frequency,
            time,
            enabled: true,
            lastRun: null,
            nextRun: this.calculateNextRun(frequency, time)
        };

        this.scheduledReports.push(scheduled);
        this.saveScheduledReports();
    }

    /**
     * Calcular próxima ejecución
     */
    calculateNextRun(frequency, time) {
        const now = new Date();
        const [hours, minutes] = time.split(':');
        
        let next = new Date();
        next.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (frequency === 'daily') {
            if (next <= now) {
                next.setDate(next.getDate() + 1);
            }
        } else if (frequency === 'weekly') {
            next.setDate(next.getDate() + 7);
        } else if (frequency === 'monthly') {
            next.setMonth(next.getMonth() + 1);
        } else if (frequency === 'quarterly') {
            next.setMonth(next.getMonth() + 3);
        }

        return next.getTime();
    }

    /**
     * Obtener cantidad de proyectos
     */
    getProjectCount() {
        if (typeof window.gestorGerencia !== 'undefined') {
            return window.gestorGerencia.obtenerProyectos().length;
        }
        return 0;
    }

    /**
     * Formatear fecha
     */
    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('es-ES');
    }

    /**
     * Guardar reportes
     */
    saveReports() {
        localStorage.setItem('advancedReports', JSON.stringify(this.reports));
    }

    /**
     * Cargar reportes
     */
    loadReports() {
        const saved = localStorage.getItem('advancedReports');
        if (saved) {
            this.reports = JSON.parse(saved);
        }
    }

    /**
     * Guardar plantillas
     */
    saveTemplates() {
        const data = Object.fromEntries(this.templates);
        localStorage.setItem('reportTemplates', JSON.stringify(data));
    }

    /**
     * Cargar plantillas
     */
    loadTemplates() {
        const saved = localStorage.getItem('reportTemplates');
        if (saved) {
            const data = JSON.parse(saved);
            this.templates = new Map(Object.entries(data));
        }
    }

    /**
     * Guardar reportes programados
     */
    saveScheduledReports() {
        localStorage.setItem('scheduledReports', JSON.stringify(this.scheduledReports));
    }

    /**
     * Cargar reportes programados
     */
    loadScheduledReports() {
        const saved = localStorage.getItem('scheduledReports');
        if (saved) {
            this.scheduledReports = JSON.parse(saved);
        }
    }

    /**
     * Editar reporte
     */
    editReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            this.showCreateReport();
            // Llenar formulario con datos del reporte
            setTimeout(() => {
                document.getElementById('reportName').value = report.name;
                document.getElementById('reportDescription').value = report.description || '';
                document.getElementById('reportFormat').value = report.format;
            }, 100);
        }
    }

    /**
     * Eliminar reporte
     */
    deleteReport(reportId) {
        if (confirm('¿Estás seguro de eliminar este reporte?')) {
            this.reports = this.reports.filter(r => r.id !== reportId);
            this.saveReports();
            this.showReportsPanel();
        }
    }

    /**
     * Mostrar plantillas
     */
    showTemplates() {
        // Implementar vista de plantillas
        alert('Vista de plantillas - En desarrollo');
    }

    /**
     * Mostrar programados
     */
    showScheduled() {
        // Implementar vista de programados
        alert('Vista de reportes programados - En desarrollo');
    }
}

// Inicializar sistema de reportes avanzados
if (typeof window !== 'undefined') {
    window.advancedReports = new AdvancedReports();
}

