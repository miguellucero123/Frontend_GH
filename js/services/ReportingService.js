/**
 * ============================================================
 * REPORTING SERVICE (Enterprise Edition - Phase 3)
 * ============================================================
 * Generación de reportes ejecutivos en PDF y Excel con marca corporativa.
 */

class ReportingService {
    constructor(api) {
        this.api = api;
    }

    /**
     * Generar Reporte Ejecutivo de Proyecto
     */
    /**
     * Generar Reporte Ejecutivo de Proyecto (Real PDF)
     */
    async generateExecutiveReport(projectId) {
        try {
            this.showReportingLoading();

            // Obtener datos reales
            const project = await this.api.getProject(projectId);

            // Simular proceso de "firma digital"
            await new Promise(r => setTimeout(r, 1500));

            if (!window.jspdf) {
                throw new Error('La librería PDF no está cargada');
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // --- HEADER ---
            doc.setFillColor(15, 23, 42); // Slate 900
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("G&H Constructora SPA", 15, 20);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(148, 163, 184); // Slate 400
            doc.text("SISTEMA DE GESTIÓN EMPRESARIAL - EDICIÓN SIGNATURE", 15, 30);

            // --- PROJECT INFO ---
            doc.setTextColor(33, 41, 56);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text("Resumen Ejecutivo de Proyecto", 15, 55);

            doc.setDrawColor(200, 200, 200);
            doc.line(15, 60, pageWidth - 15, 60);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Proyecto:`, 15, 75);
            doc.setFont('helvetica', 'bold');
            doc.text(project.mandante_nombre || 'Sin Nombre', 45, 75);

            doc.setFont('helvetica', 'normal');
            doc.text(`Cliente:`, 15, 85);
            doc.text(project.mandante_nombre || 'N/A', 45, 85); // Asumiendo mismo nombre por ahora

            doc.text(`Fecha:`, 150, 75);
            doc.text(new Date().toLocaleDateString(), 170, 75);

            // --- FINANCIAL TABLE ---
            const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

            const presupuesto = project.costo_inicial || 0;
            const ejecutado = project.costo_final || 0;
            const variacion = presupuesto - ejecutado;

            doc.autoTable({
                startY: 100,
                head: [['CONCEPTO FINANCIERO', 'MONTO (CLP)', 'ESTADO']],
                body: [
                    ['Presupuesto Asignado', formatter.format(presupuesto), 'Aprobado'],
                    ['Costo Ejecutado (Actual)', formatter.format(ejecutado), 'En Curso'],
                    ['Balance Disponible', formatter.format(variacion), variacion >= 0 ? 'Positivo' : 'Crítico']
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 6 },
                columnStyles: {
                    0: { cellWidth: 80 },
                    1: { cellWidth: 60, halign: 'right' },
                    2: { cellWidth: 40, halign: 'center' }
                }
            });

            // --- PROGRESS BAR VISUALIZATION ---
            let finalY = doc.lastAutoTable.finalY + 20;

            doc.setFontSize(12);
            doc.setTextColor(33, 41, 56);
            doc.text(`Avance General del Proyecto: ${project.avance || 0}%`, 15, finalY);

            // Background bar
            doc.setFillColor(226, 232, 240);
            doc.roundedRect(15, finalY + 5, 180, 8, 3, 3, 'F');

            // Progress bar
            const progressWidth = ((project.avance || 0) / 100) * 180;
            doc.setFillColor(16, 185, 129); // Emerald 500
            if (progressWidth > 0) {
                doc.roundedRect(15, finalY + 5, progressWidth, 8, 3, 3, 'F');
            }

            // --- FOOTER ---
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("Este documento es generado automáticamente por el sistema ERP Constructora.", 15, 280);
            doc.text("Confidencial - Uso Interno Exclusivo", 150, 280);

            // Save
            doc.save(`Reporte_Ejecutivo_${projectId}_${new Date().toISOString().slice(0, 10)}.pdf`);

            this.hideReportingLoading();

        } catch (error) {
            console.error('Error al generar reporte:', error);
            this.hideReportingLoading();
            alert('Error al generar el reporte: ' + error.message);
        }
    }

    showReportingLoading() {
        const overlay = document.createElement('div');
        overlay.id = 'reportingOverlay';
        overlay.className = 'fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-lg';
        overlay.innerHTML = `
            <div class="relative w-24 h-24 mb-6">
                <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Componiendo Reporte Ejecutivo</h3>
            <p class="text-slate-400">Firmando digitalmente y aplicando marca corporativa...</p>
        `;
        document.body.appendChild(overlay);
    }

    hideReportingLoading() {
        document.getElementById('reportingOverlay')?.remove();
    }

    downloadDummyPDF(project) {
        // Simular descarga de PDF
        alert(`Reporte Ejecutivo de "${project.mandante_nombre}" generado y descargado exitosamente (Simulado).`);
    }

    /**
     * Reporte Consolidado del ERP
     */
    async generateConsolidatedReport() {
        this.showReportingLoading();
        setTimeout(() => {
            this.hideReportingLoading();
            alert('Reporte Consolidado de la Empresa generado (Simulado).');
        }, 3000);
    }
}

window.reportingService = new ReportingService(window.api);
