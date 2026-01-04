// Sistema de Importación de Datos

const importadorDatos = {
    // Plantilla esperada para Excel
    plantillaEsperada: {
        hojas: {
            'Información General': {
                columnas: ['Campo', 'Valor'],
                camposRequeridos: ['Nombre Proyecto', 'Cliente', 'Fecha Inicio', 'Presupuesto Inicial']
            },
            'Cubicación': {
                columnas: ['Item', 'Unidad', 'Cantidad', 'Precio Unitario', 'Total']
            },
            'Mano de Obra': {
                columnas: ['Categoría', 'Cantidad', 'Costo Diario', 'Días Trabajados', 'Total']
            },
            'Materiales': {
                columnas: ['Categoría', 'Nombre', 'Unidad', 'Cantidad', 'Precio Unitario', 'Total']
            }
        }
    },

    // Procesar archivo Excel
    procesarArchivo: async function(archivoExcel) {
        try {
            const workbook = XLSX.read(archivoExcel, { type: 'binary' });

            // Validar estructura
            this.validarEstructura(workbook);

            // Extraer datos
            const datosProyecto = {
                informacionGeneral: this.procesarHoja(workbook, 'Información General'),
                cubicacion: this.procesarHoja(workbook, 'Cubicación'),
                manoObra: this.procesarHoja(workbook, 'Mano de Obra'),
                materiales: this.procesarHoja(workbook, 'Materiales')
            };

            console.log('Datos procesados:', datosProyecto);
            return {
                exito: true,
                datos: datosProyecto
            };
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            return {
                exito: false,
                error: error.message
            };
        }
    },

    // Validar estructura del archivo
    validarEstructura: function(workbook) {
        const hojasRequeridas = Object.keys(this.plantillaEsperada.hojas);
        hojasRequeridas.forEach(hoja => {
            if (!workbook.SheetNames.includes(hoja)) {
                throw new Error(`Falta la hoja requerida: ${hoja}`);
            }
        });
    },

    // Procesar una hoja específica
    procesarHoja: function(workbook, nombreHoja) {
        const hoja = workbook.Sheets[nombreHoja];
        return XLSX.utils.sheet_to_json(hoja);
    }
};

// Ejemplo de uso
// const archivo = ...; // Obtener archivo desde input
// importadorDatos.procesarArchivo(archivo).then(resultado => console.log(resultado));