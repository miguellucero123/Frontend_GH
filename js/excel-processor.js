/**
 * ============================================================
 * PROCESADOR DE ARCHIVOS EXCEL/WORD - FASE 6
 * ============================================================
 * 
 * Procesa archivos Excel/Word y actualiza el modelo de datos del proyecto
 * Integrado con n8n para procesamiento automático
 */

class ExcelProcessor {
    constructor() {
        this.supportedFormats = {
            excel: [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel', // .xls
                'application/excel'
            ],
            word: [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                'application/msword' // .doc
            ]
        };
    }

    /**
     * Validar archivo antes de procesar
     */
    validateFile(file) {
        const errors = [];

        // Validar tipo
        const isExcel = this.supportedFormats.excel.includes(file.type);
        const isWord = this.supportedFormats.word.includes(file.type);
        
        if (!isExcel && !isWord) {
            errors.push('Formato no soportado. Solo se aceptan archivos Excel (.xlsx, .xls) o Word (.docx, .doc)');
        }

        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            errors.push(`El archivo es demasiado grande. Tamaño máximo: ${this.formatFileSize(maxSize)}`);
        }

        // Validar extensión
        const extension = this.getFileExtension(file.name);
        if (isExcel && !['xlsx', 'xls'].includes(extension)) {
            errors.push('La extensión del archivo no coincide con el tipo MIME');
        }
        if (isWord && !['docx', 'doc'].includes(extension)) {
            errors.push('La extensión del archivo no coincide con el tipo MIME');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Obtener extensión del archivo
     */
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Formatear tamaño de archivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Procesar archivo Excel usando SheetJS (xlsx)
     */
    async processExcelFile(file) {
        return new Promise((resolve, reject) => {
            // Verificar si SheetJS está disponible
            if (typeof XLSX === 'undefined') {
                // Si no está disponible, usar n8n para procesar
                return this.processWithN8N(file, 'excel')
                    .then(resolve)
                    .catch(reject);
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Procesar cada hoja
                    const sheets = {};
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                            header: 1,
                            defval: null
                        });
                        sheets[sheetName] = jsonData;
                    });

                    resolve({
                        success: true,
                        fileName: file.name,
                        sheets: sheets,
                        sheetNames: workbook.SheetNames
                    });
                } catch (error) {
                    reject({
                        success: false,
                        error: 'Error al procesar el archivo Excel: ' + error.message
                    });
                }
            };

            reader.onerror = () => {
                reject({
                    success: false,
                    error: 'Error al leer el archivo'
                });
            };

            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Procesar archivo Word
     * Nota: El procesamiento de Word es más complejo, se recomienda usar n8n
     */
    async processWordFile(file) {
        // Por ahora, usar n8n para procesar Word
        return this.processWithN8N(file, 'word');
    }

    /**
     * Procesar archivo usando n8n (recomendado)
     */
    async processWithN8N(file, fileType = 'excel') {
        try {
            // Verificar si automationService está disponible
            if (typeof automationService === 'undefined') {
                throw new Error('Servicio de automatización no disponible');
            }

            // Obtener proyecto actual (si está disponible)
            const projectId = this.getCurrentProjectId();

            // Procesar según el tipo
            if (fileType === 'excel') {
                return await automationService.processExcelFile(file, projectId);
            } else if (fileType === 'word') {
                return await automationService.processWordFile(file, projectId);
            } else {
                throw new Error('Tipo de archivo no soportado');
            }
        } catch (error) {
            console.error('Error al procesar con n8n:', error);
            throw {
                success: false,
                error: error.message || 'Error al procesar el archivo con n8n'
            };
        }
    }

    /**
     * Obtener ID del proyecto actual
     */
    getCurrentProjectId() {
        // Intentar obtener del estado global
        if (typeof stateSync !== 'undefined') {
            const currentProject = stateSync.get('currentProject');
            if (currentProject && currentProject.project_id) {
                return currentProject.project_id;
            }
        }

        // Intentar obtener de la URL o del DOM
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project_id');
        if (projectId) return projectId;

        // Por defecto, usar el primer proyecto del modelo
        if (typeof window.PROJECT_DATA_MODEL !== 'undefined') {
            const projects = window.PROJECT_DATA_MODEL.projects || [];
            if (projects.length > 0) {
                return projects[0].project_id;
            }
        }

        return null;
    }

    /**
     * Mapear datos de Excel al modelo de proyecto
     */
    mapExcelToProjectModel(excelData, projectId = null) {
        const project = {
            project_id: projectId || `PROJ${Date.now()}`,
            nombre_mandante: '',
            direccion: '',
            ciudad: '',
            descripcion: '',
            fecha_inicio: null,
            fecha_termino_estimado: null,
            fecha_termino_modificada: null,
            fecha_termino_real: null,
            presupuesto: {
                inicial: 0,
                adicionales: 0,
                gastos_extras: 0,
                costo_final: 0,
                desviacion: 0,
                porcentaje_desviacion: 0
            },
            informacion_tecnica: {
                ubicacion: {
                    direccion_completa: '',
                    coordenadas: { latitud: null, longitud: null },
                    comuna: '',
                    region: '',
                    codigo_postal: ''
                },
                cubicacion: {
                    total_m2: 0,
                    m2_construidos: 0,
                    m2_terreno: 0,
                    volumen_m3: 0,
                    pisos: 0,
                    unidades: 0
                }
            }
        };

        // Procesar cada hoja del Excel
        if (excelData.sheets) {
            Object.keys(excelData.sheets).forEach(sheetName => {
                const sheetData = excelData.sheets[sheetName];
                this.processSheet(sheetName, sheetData, project);
            });
        }

        return project;
    }

    /**
     * Procesar una hoja específica del Excel
     */
    processSheet(sheetName, sheetData, project) {
        const sheetNameLower = sheetName.toLowerCase();

        // Hoja de Información Básica
        if (sheetNameLower.includes('informacion') || sheetNameLower.includes('basica') || sheetNameLower.includes('general')) {
            this.processBasicInfoSheet(sheetData, project);
        }
        
        // Hoja de Presupuesto
        if (sheetNameLower.includes('presupuesto') || sheetNameLower.includes('financiero') || sheetNameLower.includes('costos')) {
            this.processBudgetSheet(sheetData, project);
        }
        
        // Hoja de Fechas
        if (sheetNameLower.includes('fecha') || sheetNameLower.includes('cronograma') || sheetNameLower.includes('tiempo')) {
            this.processDatesSheet(sheetData, project);
        }
        
        // Hoja de Información Técnica
        if (sheetNameLower.includes('tecnica') || sheetNameLower.includes('tecnico') || sheetNameLower.includes('especificaciones')) {
            this.processTechnicalSheet(sheetData, project);
        }
        
        // Hoja de Cubicación
        if (sheetNameLower.includes('cubicacion') || sheetNameLower.includes('metros') || sheetNameLower.includes('dimensiones')) {
            this.processCubicacionSheet(sheetData, project);
        }
    }

    /**
     * Procesar hoja de información básica
     */
    processBasicInfoSheet(sheetData, project) {
        // Buscar valores en la hoja
        sheetData.forEach(row => {
            if (Array.isArray(row) && row.length >= 2) {
                const key = String(row[0]).toLowerCase().trim();
                const value = row[1];

                switch(key) {
                    case 'nombre mandante':
                    case 'mandante':
                    case 'cliente':
                        project.nombre_mandante = String(value || '');
                        break;
                    case 'direccion':
                    case 'dirección':
                        project.direccion = String(value || '');
                        project.informacion_tecnica.ubicacion.direccion_completa = String(value || '');
                        break;
                    case 'ciudad':
                        project.ciudad = String(value || '');
                        break;
                    case 'descripcion':
                    case 'descripción':
                        project.descripcion = String(value || '');
                        break;
                }
            }
        });
    }

    /**
     * Procesar hoja de presupuesto
     */
    processBudgetSheet(sheetData, project) {
        sheetData.forEach(row => {
            if (Array.isArray(row) && row.length >= 2) {
                const key = String(row[0]).toLowerCase().trim();
                const value = parseFloat(row[1]) || 0;

                switch(key) {
                    case 'presupuesto inicial':
                    case 'costo inicial':
                    case 'presupuesto_inicial':
                        project.presupuesto.inicial = value;
                        break;
                    case 'adicionales':
                    case 'presupuesto adicional':
                    case 'adicionales_aprobados':
                        project.presupuesto.adicionales = value;
                        break;
                    case 'gastos extras':
                    case 'extras':
                    case 'gastos_extras':
                        project.presupuesto.gastos_extras = value;
                        break;
                }
            }
        });

        // Calcular costo final
        project.presupuesto.costo_final = 
            project.presupuesto.inicial + 
            project.presupuesto.adicionales + 
            project.presupuesto.gastos_extras;
        
        // Calcular desviación
        project.presupuesto.desviacion = 
            project.presupuesto.costo_final - project.presupuesto.inicial;
        
        project.presupuesto.porcentaje_desviacion = project.presupuesto.inicial > 0
            ? (project.presupuesto.desviacion / project.presupuesto.inicial) * 100
            : 0;
    }

    /**
     * Procesar hoja de fechas
     */
    processDatesSheet(sheetData, project) {
        sheetData.forEach(row => {
            if (Array.isArray(row) && row.length >= 2) {
                const key = String(row[0]).toLowerCase().trim();
                const value = row[1];

                if (value) {
                    const date = this.parseDate(value);
                    if (date) {
                        switch(key) {
                            case 'fecha inicio':
                            case 'inicio':
                            case 'fecha_inicio':
                                project.fecha_inicio = date;
                                break;
                            case 'fecha termino estimado':
                            case 'termino estimado':
                            case 'fecha_termino_estimado':
                                project.fecha_termino_estimado = date;
                                break;
                            case 'fecha termino modificada':
                            case 'termino modificada':
                            case 'fecha_termino_modificada':
                                project.fecha_termino_modificada = date;
                                break;
                            case 'fecha termino real':
                            case 'termino real':
                            case 'fecha_termino_real':
                                project.fecha_termino_real = date;
                                break;
                        }
                    }
                }
            }
        });
    }

    /**
     * Procesar hoja de información técnica
     */
    processTechnicalSheet(sheetData, project) {
        sheetData.forEach(row => {
            if (Array.isArray(row) && row.length >= 2) {
                const key = String(row[0]).toLowerCase().trim();
                const value = row[1];

                // Procesar según el tipo de información técnica
                if (key.includes('comuna')) {
                    project.informacion_tecnica.ubicacion.comuna = String(value || '');
                } else if (key.includes('region') || key.includes('región')) {
                    project.informacion_tecnica.ubicacion.region = String(value || '');
                } else if (key.includes('codigo postal') || key.includes('código postal')) {
                    project.informacion_tecnica.ubicacion.codigo_postal = String(value || '');
                }
            }
        });
    }

    /**
     * Procesar hoja de cubicación
     */
    processCubicacionSheet(sheetData, project) {
        sheetData.forEach(row => {
            if (Array.isArray(row) && row.length >= 2) {
                const key = String(row[0]).toLowerCase().trim();
                const value = parseFloat(row[1]) || 0;

                switch(key) {
                    case 'total m2':
                    case 'metros cuadrados totales':
                    case 'total_m2':
                        project.informacion_tecnica.cubicacion.total_m2 = value;
                        break;
                    case 'm2 construidos':
                    case 'metros construidos':
                    case 'm2_construidos':
                        project.informacion_tecnica.cubicacion.m2_construidos = value;
                        break;
                    case 'm2 terreno':
                    case 'metros terreno':
                    case 'm2_terreno':
                        project.informacion_tecnica.cubicacion.m2_terreno = value;
                        break;
                    case 'volumen m3':
                    case 'metros cubicos':
                    case 'volumen_m3':
                        project.informacion_tecnica.cubicacion.volumen_m3 = value;
                        break;
                    case 'pisos':
                    case 'numero de pisos':
                    case 'nro_pisos':
                        project.informacion_tecnica.cubicacion.pisos = value;
                        break;
                    case 'unidades':
                    case 'numero de unidades':
                    case 'nro_unidades':
                        project.informacion_tecnica.cubicacion.unidades = value;
                        break;
                }
            }
        });
    }

    /**
     * Parsear fecha desde diferentes formatos
     */
    parseDate(value) {
        if (!value) return null;

        // Si es un número (fecha de Excel)
        if (typeof value === 'number') {
            // Excel almacena fechas como números desde 1900-01-01
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
            return date.toISOString().split('T')[0];
        }

        // Si es string, intentar parsear
        if (typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }

        // Si es Date object
        if (value instanceof Date) {
            return value.toISOString().split('T')[0];
        }

        return null;
    }

    /**
     * Actualizar proyecto en el modelo de datos
     */
    async updateProjectFromExcel(projectData) {
        try {
            // Actualizar en el modelo local
            if (typeof window.PROJECT_DATA_MODEL !== 'undefined') {
                const existingProject = window.PROJECT_DATA_MODEL.projects.find(
                    p => p.project_id === projectData.project_id
                );

                if (existingProject) {
                    // Actualizar proyecto existente
                    Object.assign(existingProject, projectData);
                    // Recalcular costos
                    window.PROJECT_DATA_MODEL.calculateCosts(existingProject);
                } else {
                    // Agregar nuevo proyecto
                    window.PROJECT_DATA_MODEL.projects.push(projectData);
                    window.PROJECT_DATA_MODEL.calculateCosts(projectData);
                }
            }

            // Sincronizar estado
            if (typeof stateSync !== 'undefined') {
                stateSync.set('currentProject', projectData);
                stateSync.set('projectUpdated', true);
            }

            // Enviar al backend (si está disponible)
            if (typeof api !== 'undefined' && projectData.project_id) {
                try {
                    await api.put(`/projects/${projectData.project_id}`, projectData);
                } catch (error) {
                    console.warn('No se pudo actualizar en el backend:', error);
                }
            }

            return {
                success: true,
                message: 'Proyecto actualizado correctamente desde Excel',
                project: projectData
            };
        } catch (error) {
            throw {
                success: false,
                error: 'Error al actualizar el proyecto: ' + error.message
            };
        }
    }
}

// Instancia global
const excelProcessor = new ExcelProcessor();

