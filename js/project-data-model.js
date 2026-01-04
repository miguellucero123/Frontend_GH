/**
 * ============================================================
 * OBJETO JSON MAESTRO - G&H Construcciones SPA
 * ============================================================
 * 
 * Este objeto centraliza toda la información de un proyecto
 * y es la fuente única de verdad para el sistema ERP.
 * 
 * Arquitectura: Single Source of Truth (SSOT)
 * Versión: 1.0.0
 */

const PROJECT_DATA_MODEL = {
    /**
     * Estructura completa de un proyecto
     */
    projectSchema: {
        // ========== IDENTIFICACIÓN BÁSICA ==========
        project_id: null,                    // ID único del proyecto
        nombre_mandante: "",                  // Nombre del cliente/mandante
        direccion: "",                        // Dirección completa
        ciudad: "",                           // Ciudad
        descripcion: "",                      // Descripción general
        
        // ========== FECHAS ==========
        fecha_inicio: null,                   // Date: Fecha de inicio real
        fecha_termino_estimado: null,         // Date: Fecha de término estimada original
        fecha_termino_modificada: null,       // Date: Fecha de término modificada (si hubo cambios)
        fecha_termino_real: null,             // Date: Fecha de término real (cuando se completa)
        
        // ========== MÉTRICAS FINANCIERAS ==========
        presupuesto: {
            inicial: 0,                       // Presupuesto inicial aprobado
            adicionales: 0,                   // Presupuesto adicional aprobado
            gastos_extras: 0,                 // Gastos extras no presupuestados
            costo_final: 0,                   // Costo final calculado (inicial + adicionales + extras)
            desviacion: 0,                    // Diferencia entre final e inicial
            porcentaje_desviacion: 0          // Porcentaje de desviación
        },
        
        // ========== INFORMACIÓN TÉCNICA DETALLADA ==========
        informacion_tecnica: {
            // Ubicación detallada
            ubicacion: {
                direccion_completa: "",       // Dirección completa con referencias
                coordenadas: {
                    latitud: null,
                    longitud: null
                },
                comuna: "",
                region: "",
                codigo_postal: ""
            },
            
            // Descripción y especialidades
            descripcion_detallada: "",        // Descripción completa del proyecto
            especialidades_requeridas: [],    // Array: ["Estructura", "Instalaciones", "Acabados"]
            
            // Cubicación
            cubicacion: {
                total_m2: 0,                 // Metros cuadrados totales
                m2_construidos: 0,            // M2 construidos
                m2_terreno: 0,                // M2 de terreno
                volumen_m3: 0,                // Volumen en metros cúbicos
                pisos: 0,                     // Número de pisos
                unidades: 0                   // Número de unidades (si aplica)
            },
            
            // Metodología constructiva
            metodologia_constructiva: {
                tipo_estructura: "",          // "Hormigón armado", "Acero", "Mixta", etc.
                sistema_constructivo: "",     // "Tradicional", "Prefabricado", "Industrializado"
                tecnicas_especiales: [],      // Array de técnicas especiales
                normativas_aplicables: []     // Array: ["NCh433", "DS60", etc.]
            },
            
            // Especificaciones técnicas
            especificaciones_tecnicas: {
                resistencia_hormigon: "",     // Ej: "H25", "H30"
                acero_estructura: "",         // Tipo y calibre de acero
                aislacion_termica: "",        // Especificaciones de aislación
                aislacion_acustica: "",       // Especificaciones acústicas
                instalaciones: {
                    electrica: "",
                    sanitaria: "",
                    gas: "",
                    climatizacion: ""
                },
                acabados: {
                    pisos: "",
                    muros: "",
                    cielos: "",
                    carpinteria: ""
                }
            },
            
            // Maquinaria, herramientas y equipos
            recursos_equipamiento: {
                maquinaria: [                 // Array de objetos
                    {
                        nombre: "",
                        tipo: "",             // "Excavadora", "Grúa", "Hormigonera", etc.
                        cantidad: 0,
                        costo_alquiler: 0,
                        periodo_uso: ""       // "Inicio", "Medio", "Final", "Todo el proyecto"
                    }
                ],
                herramientas: [               // Array de objetos
                    {
                        nombre: "",
                        tipo: "",             // "Manual", "Eléctrica", "Neumática"
                        cantidad: 0,
                        costo: 0
                    }
                ],
                equipos: [                    // Array de objetos
                    {
                        nombre: "",
                        tipo: "",             // "Medición", "Seguridad", "Comunicación"
                        cantidad: 0,
                        costo: 0
                    }
                ],
                costo_total_equipamiento: 0   // Suma total
            },
            
            // Mano de obra
            mano_de_obra: {
                tipo_requerida: [],           // Array: ["Oficiales", "Especialistas", "Supervisores"]
                desglose: [                   // Array de objetos
                    {
                        categoria: "",        // "Arquitecto", "Ingeniero", "Maestro", "Oficial"
                        cantidad: 0,
                        horas_estimadas: 0,
                        costo_hora: 0,
                        costo_total: 0
                    }
                ],
                costo_total_mano_obra: 0      // Suma total
            },
            
            // Costos desglosados
            costos: {
                mano_obra: 0,                 // Costo total mano de obra
                materiales: 0,                 // Costo total materiales
                maquinaria_herramientas: 0,    // Costo total maquinaria y herramientas
                servicios: 0,                  // Servicios externos
                gastos_generales: 0,           // Gastos generales y utilidades
                imprevistos: 0,                // Reserva para imprevistos
                total: 0                       // Total calculado
            }
        },
        
        // ========== GESTIÓN DOCUMENTAL ==========
        sistema_archivos: {
            carpeta_mandante: {               // Solo visible para Cliente y Gerencia
                id: null,
                nombre: "Carpeta Cliente",
                archivos: [],                 // Array de objetos File
                subcarpetas: [],
                permisos: {
                    cliente: true,
                    trabajador: false,
                    gerencia: true
                }
            },
            carpeta_obra: {                   // Solo visible para Trabajador y Gerencia
                id: null,
                nombre: "Carpeta Obra",
                archivos: [],                 // Array de objetos File
                subcarpetas: [],
                permisos: {
                    cliente: false,
                    trabajador: true,
                    gerencia: true
                }
            },
            carpeta_gerencia: {                // Solo visible para Gerencia
                id: null,
                nombre: "Carpeta Gerencia",
                archivos: [],
                subcarpetas: [],
                permisos: {
                    cliente: false,
                    trabajador: false,
                    gerencia: true
                }
            }
        },
        
        // ========== CANALES DE COMUNICACIÓN ==========
        comunicacion: {
            canal_cliente_gerencia: {          // Chat Cliente ↔ Gerencia
                id: null,
                mensajes: [],                  // Array de objetos Message
                participantes: [],             // Array de user_ids
                ultimo_mensaje: null,
                no_leidos: 0
            },
            canal_trabajador_gerencia: {       // Chat Trabajador ↔ Gerencia
                id: null,
                mensajes: [],
                participantes: [],
                ultimo_mensaje: null,
                no_leidos: 0
            }
        },
        
        // ========== ESTADO Y PROGRESO ==========
        estado: {
            activo: true,
            progreso_porcentaje: 0,           // 0-100
            partidas: [],                      // Array de objetos Partida
            fecha_ultima_actualizacion: null
        },
        
        // ========== METADATOS ==========
        metadata: {
            creado_por_id: null,
            fecha_creacion: null,
            modificado_por_id: null,
            fecha_modificacion: null,
            version: "1.0.0"
        }
    },
    
    /**
     * Estructura de un archivo
     */
    fileSchema: {
        file_id: null,
        nombre: "",
        tipo: "",                              // "pdf", "excel", "word", "imagen", "video"
        ruta: "",
        tamaño: 0,                             // En bytes
        carpeta_id: null,                      // ID de la carpeta padre
        proyecto_id: null,
        subido_por_id: null,
        fecha_subida: null,
        permisos: {
            cliente: false,
            trabajador: false,
            gerencia: true
        }
    },
    
    /**
     * Estructura de un mensaje
     */
    messageSchema: {
        message_id: null,
        canal_id: null,                        // ID del canal (cliente-gerencia o trabajador-gerencia)
        remitente_id: null,
        destinatario_id: null,
        contenido: "",
        tipo: "text",                          // "text", "file", "image"
        archivo_adjunto: null,                 // Si tipo es "file" o "image"
        fecha_envio: null,
        leido: false,
        fecha_lectura: null
    },
    
    /**
     * Estructura de una partida
     */
    partidaSchema: {
        partida_id: null,
        codigo: "",                            // Ej: "01.01.001"
        nombre: "",
        descripcion: "",
        unidad: "",                            // "m2", "m3", "unidad", etc.
        cantidad: 0,
        precio_unitario: 0,
        precio_total: 0,
        estado: "pendiente",                   // "pendiente", "en_progreso", "completada"
        progreso_porcentaje: 0,               // 0-100
        fecha_inicio: null,
        fecha_termino: null
    },
    
    /**
     * Factory: Crear un nuevo proyecto con estructura completa
     */
    createProject(data = {}) {
        const project = JSON.parse(JSON.stringify(this.projectSchema));
        
        // Mergear datos proporcionados
        Object.keys(data).forEach(key => {
            if (project.hasOwnProperty(key)) {
                if (typeof project[key] === 'object' && !Array.isArray(project[key]) && project[key] !== null) {
                    project[key] = { ...project[key], ...data[key] };
                } else {
                    project[key] = data[key];
                }
            }
        });
        
        // Calcular costos automáticamente
        this.calculateCosts(project);
        
        return project;
    },
    
    /**
     * Calcular costos del proyecto
     */
    calculateCosts(project) {
        const presup = project.presupuesto;
        
        // Calcular costo final
        presup.costo_final = presup.inicial + presup.adicionales + presup.gastos_extras;
        
        // Calcular desviación
        presup.desviacion = presup.costo_final - presup.inicial;
        presup.porcentaje_desviacion = presup.inicial > 0 
            ? (presup.desviacion / presup.inicial) * 100 
            : 0;
        
        // Calcular costos técnicos
        const info = project.informacion_tecnica;
        if (info.costos) {
            info.costos.total = 
                info.costos.mano_obra +
                info.costos.materiales +
                info.costos.maquinaria_herramientas +
                info.costos.servicios +
                info.costos.gastos_generales +
                info.costos.imprevistos;
        }
        
        // Calcular costo total de equipamiento
        if (info.recursos_equipamiento) {
            const recursos = info.recursos_equipamiento;
            recursos.costo_total_equipamiento = 
                recursos.maquinaria.reduce((sum, m) => sum + (m.costo_alquiler || 0), 0) +
                recursos.herramientas.reduce((sum, h) => sum + (h.costo || 0), 0) +
                recursos.equipos.reduce((sum, e) => sum + (e.costo || 0), 0);
        }
        
        // Calcular costo total de mano de obra
        if (info.mano_de_obra && info.mano_de_obra.desglose) {
            info.mano_de_obra.costo_total_mano_obra = 
                info.mano_de_obra.desglose.reduce((sum, d) => sum + (d.costo_total || 0), 0);
        }
    },
    
    /**
     * Validar estructura de proyecto
     */
    validateProject(project) {
        const errors = [];
        
        // Validaciones básicas
        if (!project.nombre_mandante) errors.push("Nombre mandante es requerido");
        if (!project.direccion) errors.push("Dirección es requerida");
        if (!project.fecha_inicio) errors.push("Fecha de inicio es requerida");
        if (!project.fecha_termino_estimado) errors.push("Fecha término estimado es requerida");
        if (project.presupuesto.inicial <= 0) errors.push("Presupuesto inicial debe ser mayor a 0");
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Obtener datos del proyecto filtrados por rol
     */
    getProjectDataForRole(project, userRole) {
        const filtered = JSON.parse(JSON.stringify(project));
        
        switch(userRole) {
            case 'cliente':
                // Cliente solo ve información básica y carpeta_mandante
                delete filtered.informacion_tecnica.costos;
                delete filtered.informacion_tecnica.mano_de_obra;
                delete filtered.informacion_tecnica.recursos_equipamiento;
                delete filtered.sistema_archivos.carpeta_obra;
                delete filtered.sistema_archivos.carpeta_gerencia;
                delete filtered.comunicacion.canal_trabajador_gerencia;
                filtered.presupuesto = {
                    inicial: filtered.presupuesto.inicial,
                    costo_final: filtered.presupuesto.costo_final
                };
                break;
                
            case 'trabajador':
                // Trabajador ve información técnica pero no costos detallados
                delete filtered.informacion_tecnica.costos;
                delete filtered.sistema_archivos.carpeta_mandante;
                delete filtered.sistema_archivos.carpeta_gerencia;
                delete filtered.comunicacion.canal_cliente_gerencia;
                delete filtered.presupuesto;
                break;
                
            case 'jefe':
            case 'admin':
                // Gerencia ve todo
                break;
                
            default:
                // Por defecto, mostrar solo información pública
                delete filtered.presupuesto;
                delete filtered.informacion_tecnica.costos;
                delete filtered.sistema_archivos;
                delete filtered.comunicacion;
        }
        
        return filtered;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PROJECT_DATA_MODEL = PROJECT_DATA_MODEL;
}

