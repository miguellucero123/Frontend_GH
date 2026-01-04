/**
 * ============================================================================
 * GESTOR DE EXPORTACIÓN - MEJORA FASE 1
 * ============================================================================
 * Exportación a PDF y Excel
 * Versión: 1.0.0
 * ============================================================================
 */

class ExportManager {
    constructor(gestorGerencia) {
        this.gestorGerencia = gestorGerencia;
    }

    /**
     * Exportar a PDF
     */
    async exportToPDF(type = 'dashboard') {
        try {
            // Cargar jsPDF dinámicamente
            if (typeof window.jspdf === 'undefined') {
                await this.loadJSPDF();
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            switch (type) {
                case 'dashboard':
                    await this.exportDashboardPDF(doc);
                    break;
                case 'financial':
                    await this.exportFinancialPDF(doc);
                    break;
                case 'milestones':
                    await this.exportMilestonesPDF(doc);
                    break;
                default:
                    await this.exportDashboardPDF(doc);
            }

            // Guardar PDF
            const filename = `ERP_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);

            // Notificar éxito
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.add({
                    type: 'success',
                    priority: 'low',
                    title: '✅ PDF Exportado',
                    message: `El reporte se ha descargado como ${filename}`
                });
            }

        } catch (error) {
            console.error('Error exportando PDF:', error);
            alert('Error al exportar PDF. Por favor, intente nuevamente.');
        }
    }

    /**
     * Exportar dashboard a PDF
     */
    async exportDashboardPDF(doc) {
        doc.setFontSize(20);
        doc.text('ERP Constructora - Dashboard', 20, 20);

        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 35);

        // Resumen financiero
        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        let y = 50;

        doc.setFontSize(16);
        doc.text('Resumen Financiero', 20, y);
        y += 10;

        doc.setFontSize(11);
        doc.text(`Presupuesto Inicial: $${this.formatNumber(resumen.presupuestoInicial)}`, 20, y);
        y += 7;
        doc.text(`Gastos Extras: $${this.formatNumber(resumen.totalGastosExtras)}`, 20, y);
        y += 7;
        doc.text(`Costo Final: $${this.formatNumber(resumen.costoFinal)}`, 20, y);
        y += 7;
        doc.text(`Variación: ${resumen.variacionPorcentaje.toFixed(2)}%`, 20, y);
        y += 15;

        // KPIs
        const kpis = this.gestorGerencia.obtenerKPIs();
        doc.setFontSize(16);
        doc.text('Indicadores Clave (KPIs)', 20, y);
        y += 10;

        doc.setFontSize(11);
        doc.text(`Avance Financiero: ${kpis.avanceFinanciero.toFixed(2)}%`, 20, y);
        y += 7;
        doc.text(`Avance Cronológico: ${kpis.avanceCronologico.toFixed(2)}%`, 20, y);
        y += 7;
        doc.text(`Avance de Hitos: ${kpis.avanceHitos.toFixed(2)}%`, 20, y);
    }

    /**
     * Exportar información financiera a PDF
     */
    async exportFinancialPDF(doc) {
        doc.setFontSize(20);
        doc.text('Reporte Financiero', 20, 20);

        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        const desglose = this.gestorGerencia.obtenerDesgloseCostos();
        const historial = this.gestorGerencia.obtenerHistorialPagos();

        let y = 35;

        // Resumen
        doc.setFontSize(14);
        doc.text('Resumen', 20, y);
        y += 10;

        doc.setFontSize(11);
        doc.text(`Presupuesto: $${this.formatNumber(resumen.presupuestoInicial)}`, 20, y);
        y += 7;
        doc.text(`Costo Final: $${this.formatNumber(resumen.costoFinal)}`, 20, y);
        y += 7;
        doc.text(`Variación: ${resumen.variacionPorcentaje.toFixed(2)}%`, 20, y);
        y += 15;

        // Desglose
        doc.setFontSize(14);
        doc.text('Desglose por Categoría', 20, y);
        y += 10;

        doc.setFontSize(11);
        desglose.forEach(cat => {
            doc.text(`${cat.categoria}: $${this.formatNumber(cat.monto)} (${cat.porcentaje}%)`, 20, y);
            y += 7;
        });
    }

    /**
     * Exportar hitos a PDF
     */
    async exportMilestonesPDF(doc) {
        doc.setFontSize(20);
        doc.text('Reporte de Hitos', 20, 20);

        const hitos = this.gestorGerencia.obtenerHitos();
        let y = 35;

        doc.setFontSize(11);
        hitos.forEach((hito, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.text(`${index + 1}. ${hito.nombre}`, 20, y);
            y += 7;
            doc.text(`   Estado: ${hito.estado} | Avance: ${hito.avance}%`, 20, y);
            y += 7;
            doc.text(`   Fecha Programada: ${hito.fechaProgramada}`, 20, y);
            y += 10;
        });
    }

    /**
     * Exportar a Excel
     */
    async exportToExcel(type = 'dashboard') {
        try {
            // Cargar SheetJS dinámicamente
            if (typeof window.XLSX === 'undefined') {
                await this.loadSheetJS();
            }

            const workbook = window.XLSX.utils.book_new();

            switch (type) {
                case 'dashboard':
                    this.exportDashboardExcel(workbook);
                    break;
                case 'financial':
                    this.exportFinancialExcel(workbook);
                    break;
                case 'milestones':
                    this.exportMilestonesExcel(workbook);
                    break;
                default:
                    this.exportDashboardExcel(workbook);
            }

            // Guardar archivo
            const filename = `ERP_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            window.XLSX.writeFile(workbook, filename);

            // Notificar éxito
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.add({
                    type: 'success',
                    priority: 'low',
                    title: '✅ Excel Exportado',
                    message: `El reporte se ha descargado como ${filename}`
                });
            }

        } catch (error) {
            console.error('Error exportando Excel:', error);
            alert('Error al exportar Excel. Por favor, intente nuevamente.');
        }
    }

    /**
     * Exportar dashboard a Excel
     */
    exportDashboardExcel(workbook) {
        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        const kpis = this.gestorGerencia.obtenerKPIs();

        // Hoja 1: Resumen
        const resumenData = [
            ['Resumen Financiero', ''],
            ['Presupuesto Inicial', resumen.presupuestoInicial],
            ['Gastos Extras', resumen.totalGastosExtras],
            ['Costo Final', resumen.costoFinal],
            ['Variación %', resumen.variacionPorcentaje],
            ['', ''],
            ['KPIs', ''],
            ['Avance Financiero %', kpis.avanceFinanciero],
            ['Avance Cronológico %', kpis.avanceCronologico],
            ['Avance de Hitos %', kpis.avanceHitos]
        ];

        const resumenSheet = window.XLSX.utils.aoa_to_sheet(resumenData);
        window.XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');

        // Hoja 2: Desglose
        const desglose = this.gestorGerencia.obtenerDesgloseCostos();
        const desgloseData = [
            ['Categoría', 'Monto', 'Porcentaje']
        ].concat(
            desglose.map(cat => [cat.categoria, cat.monto, cat.porcentaje])
        );

        const desgloseSheet = window.XLSX.utils.aoa_to_sheet(desgloseData);
        window.XLSX.utils.book_append_sheet(workbook, desgloseSheet, 'Desglose');
    }

    /**
     * Exportar información financiera a Excel
     */
    exportFinancialExcel(workbook) {
        const historial = this.gestorGerencia.obtenerHistorialPagos();
        
        const data = [
            ['#', 'Descripción', 'Monto', 'Fecha', 'Estado']
        ].concat(
            historial.map(p => [p.numero, p.descripcion, p.monto, p.fecha, p.estado])
        );

        const sheet = window.XLSX.utils.aoa_to_sheet(data);
        window.XLSX.utils.book_append_sheet(workbook, sheet, 'Historial Pagos');
    }

    /**
     * Exportar hitos a Excel
     */
    exportMilestonesExcel(workbook) {
        const hitos = this.gestorGerencia.obtenerHitos();
        
        const data = [
            ['Nombre', 'Estado', 'Avance %', 'Fecha Programada', 'Fecha Real']
        ].concat(
            hitos.map(h => [h.nombre, h.estado, h.avance, h.fechaProgramada, h.fechaReal || ''])
        );

        const sheet = window.XLSX.utils.aoa_to_sheet(data);
        window.XLSX.utils.book_append_sheet(workbook, sheet, 'Hitos');
    }

    /**
     * Cargar jsPDF
     */
    async loadJSPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                window.jspdf = window.jspdf || window.jspdf;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Cargar SheetJS
     */
    async loadSheetJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            script.onload = () => {
                window.XLSX = window.XLSX || window.xlsx;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Formatear número
     */
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ExportManager = ExportManager;
}

