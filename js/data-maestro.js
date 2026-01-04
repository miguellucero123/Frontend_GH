/**
 * ============================================================================
 * ESTRUCTURA JSON MAESTRO - ERP CONSTRUCTORA G&H
 * ============================================================================
 * Sistema integral de gestión de proyectos de construcción
 * Arquitecto: Senior Full Stack Developer
 * Versión: 1.0.0
 * ============================================================================
 */

// ============================================================================
// OBJETO MAESTRO - PROYECTO
// ============================================================================
const proyectoMaestro = {
  id: "PROYECTO_001",
  nombre: "Casa Moderna - Proyecto Residencial",
  descripcion: "Construcción de vivienda residencial de alta gama en Nueva Providencia",
  estado: "en_progreso", // en_progreso, completado, pausado, cancelado
  
  // ========== FASE 1: DATOS DE GERENCIA ==========
  datosGerencia: {
    // Información Básica
    ubicacion: {
      direccion: "Sector Nueva Providencia, Santiago",
      comuna: "Providencia",
      region: "Metropolitana",
      latitud: -33.4372,
      longitud: -70.6093,
      codigoProyecto: "GH-2024-001"
    },
    
    // Métricas Financieras Complejas
    financiero: {
      // Presupuesto Inicial
      presupuestoInicial: {
        monto: 850000,
        moneda: "USD",
        fecha: "2024-06-01",
        descripcion: "Presupuesto aprobado por mandante"
      },
      
      // Gastos Extra
      gastosExtras: [
        {
          id: "GE-001",
          descripcion: "Cambio de especificación de piso",
          monto: 15000,
          fecha: "2024-08-15",
          estado: "aprobado",
          responsable: "Jefe de Proyecto"
        },
        {
          id: "GE-002",
          descripcion: "Refuerzo estructural adicional",
          monto: 22500,
          fecha: "2024-09-10",
          estado: "pendiente_aprobacion",
          responsable: "Supervisor de Obra"
        }
      ],
      totalGastosExtras: 37500,
      
      // Costo Final Estimado
      costoFinalEstimado: {
        monto: 887500, // inicial + extras
        variacion: 37500,
        porcentajeVariacion: 4.41,
        estado: "estimado"
      },
      
      // Desglose de Costos
      desgloseCostos: {
        materiales: {
          monto: 425000,
          porcentaje: 50,
          items: [
            { concepto: "Hormigón y acero", monto: 125000 },
            { concepto: "Cerámicas y pisos", monto: 105000 },
            { concepto: "Pintura y acabados", monto: 95000 },
            { concepto: "Tuberías y sanitarios", monto: 100000 }
          ]
        },
        manoDeObra: {
          monto: 255000,
          porcentaje: 30,
          items: [
            { concepto: "Maestros constructores", monto: 85000 },
            { concepto: "Operarios", monto: 120000 },
            { concepto: "Supervisión", monto: 50000 }
          ]
        },
        equipoMaquinaria: {
          monto: 106000,
          porcentaje: 12.5,
          items: [
            { concepto: "Arriendos maquinaria", monto: 65000 },
            { concepto: "Herramientas especializadas", monto: 41000 }
          ]
        },
        administracion: {
          monto: 106000,
          porcentaje: 12.5,
          items: [
            { concepto: "Gastos administrativos", monto: 53000 },
            { concepto: "Seguros", monto: 35000 },
            { concepto: "Permisos y trámites", monto: 18000 }
          ]
        }
      },
      
      // Pagos Realizados
      pagosRealizados: {
        total: 487500,
        porcentajePagado: 57.36,
        historial: [
          { numero: "Cuota 1", monto: 170000, fecha: "2024-06-15", estado: "pagado" },
          { numero: "Cuota 2", monto: 170000, fecha: "2024-08-15", estado: "pagado" },
          { numero: "Cuota 3", monto: 147500, fecha: "2024-10-15", estado: "pagado" }
        ]
      },
      
      // Saldo Pendiente
      saldoPendiente: {
        monto: 362500,
        porcentaje: 42.64,
        vencimiento: "2025-02-15"
      }
    },
    
    // Cronograma y Fechas
    cronograma: {
      fechaInicio: "2024-06-01",
      fechaTerminoEstimado: "2025-01-31",
      fechaTerminoReal: null,
      duracionPlanificada: 244, // días
      duracionReal: null,
      
      // Hitos Principales
      hitos: [
        {
          id: "HITO_001",
          nombre: "Excavación y cimentación",
          fechaProgramada: "2024-07-15",
          fechaReal: "2024-07-18",
          estado: "completado",
          avance: 100
        },
        {
          id: "HITO_002",
          nombre: "Estructura y hormigonado",
          fechaProgramada: "2024-09-30",
          fechaReal: null,
          estado: "en_progreso",
          avance: 72
        },
        {
          id: "HITO_003",
          nombre: "Instalaciones (agua, luz, gas)",
          fechaProgramada: "2024-11-30",
          fechaReal: null,
          estado: "pendiente",
          avance: 0
        },
        {
          id: "HITO_004",
          nombre: "Terminaciones y limpieza final",
          fechaProgramada: "2025-01-31",
          fechaReal: null,
          estado: "pendiente",
          avance: 0
        }
      ]
    },
    
    // Detalles Técnicos
    detallesTecnicos: {
      // Cubicación
      cubicacion: {
        areaConstruida: 320, // m²
        areaTerreno: 450, // m²
        volumenesMateriales: {
          hormigon: 85, // m³
          acero: 18, // toneladas
          ladrillo: 45000, // unidades
          madera: 2500 // p²
        }
      },
      
      // Metodología
      metodologia: {
        sistema: "Construcción convencional con hormigón armado",
        normas: ["NCH 430", "NCH 2369", "INN-EM 2010"],
        enfoqueCalidad: "ISO 9001:2015",
        planISST: "Implementado según DS 594"
      },
      
      // Especificaciones Técnicas
      especificaciones: {
        estructura: {
          tipo: "Hormigón armado",
          pisos: 2,
          sotano: 1,
          resistencia: "H30 (f'c = 300 kg/cm²)"
        },
        envolvente: {
          fachada: "Hormigón visto + revestimiento cerámica",
          ventanas: "Aluminio anodizado con vidrio termo panel",
          aislacion: "Poliestireno expandido 40mm + lana mineral"
        },
        coberturas: {
          techumbre: "Tejas cerámicas sobre estructura de madera",
          impermeabilizacion: "Membrana asfáltica autoprotegida"
        },
        interiores: {
          pisos: "Cerámica de alta resistencia + alfombra",
          muros: "Yeso cartón pintado + tabiquería liviana",
          cielos: "Yeso cartón suspendido + pintura latex"
        },
        sanitarios: {
          inodoros: "Porcelana vitrificada de primera calidad",
          lavamanos: "Cerámica importada",
          duchas: "Muebles cromados con termostato"
        },
        instalaciones: {
          electricidad: "2x4 mm² circuitos + 3x10 mm² principal (220V)",
          agua: "Cobre tipo M + válvulas esféricas",
          gas: "Cobre tipo K (si aplica)",
          climatizacion: "Split inverter 24.000 BTU por zona"
        }
      }
    },
    
    // Responsables
    responsables: [
      {
        id: "USER_001",
        nombre: "Ing. Carlos Mendoza",
        rol: "Jefe de Proyecto",
        email: "cmendoza@gyh.cl",
        telefono: "+56 9 1234 5678",
        experiencia: "15 años",
        titulo: "Ingeniero en Construcción"
      },
      {
        id: "USER_002",
        nombre: "Supervisor Técnico",
        rol: "Supervisor de Obra",
        email: "supervisor@gyh.cl",
        telefono: "+56 9 2234 5678",
        experiencia: "10 años"
      }
    ]
  },
  
  // ========== FASE 2: GESTIÓN DOCUMENTAL ==========
  gestorDocumental: {
    // Carpeta del Mandante (Cliente)
    carpetaMandante: {
      nombre: "Documentación Mandante",
      permisos: ["gerencia", "cliente"],
      documentos: [
        {
          id: "DOC_001",
          nombre: "Contrato de construcción",
          tipo: "PDF",
          tamaño: "2.4 MB",
          fechaCarga: "2024-06-01",
          modificado: "2024-06-01",
          autor: "Gerencia",
          estado: "firmado"
        },
        {
          id: "DOC_002",
          nombre: "Especificaciones técnicas cliente",
          tipo: "PDF",
          tamaño: "1.8 MB",
          fechaCarga: "2024-06-05",
          modificado: "2024-06-05",
          autor: "Cliente"
        },
        {
          id: "DOC_003",
          nombre: "Cotización inicial",
          tipo: "XLSX",
          tamaño: "0.5 MB",
          fechaCarga: "2024-05-20",
          modificado: "2024-06-01"
        }
      ],
      subcarpetas: [
        {
          nombre: "Contratos y acuerdos",
          documentos: []
        },
        {
          nombre: "Planos cliente",
          documentos: []
        }
      ]
    },
    
    // Carpeta de Obra (Trabajadores)
    carpetaObra: {
      nombre: "Documentación de Obra",
      permisos: ["gerencia", "trabajador"],
      documentos: [
        {
          id: "DOC_004",
          nombre: "Plan de ISST",
          tipo: "PDF",
          tamaño: "3.2 MB",
          fechaCarga: "2024-06-01",
          modificado: "2024-09-15",
          autor: "Prevencionista"
        },
        {
          id: "DOC_005",
          nombre: "Bitácora de obra - Septiembre",
          tipo: "PDF",
          tamaño: "1.5 MB",
          fechaCarga: "2024-10-01",
          modificado: "2024-10-15"
        }
      ],
      subcarpetas: [
        {
          nombre: "Planos de ejecución",
          documentos: []
        },
        {
          nombre: "Reportes diarios",
          documentos: []
        },
        {
          nombre: "Registros de seguridad",
          documentos: []
        }
      ]
    }
  },
  
  // ========== FASE 3: CANALES DE COMUNICACIÓN ==========
  comunicacion: {
    // Chat con Cliente
    chatCliente: {
      id: "CHAT_CLIENT_001",
      participantes: [
        { id: "USER_001", nombre: "Ing. Carlos Mendoza", rol: "gerencia" }
      ],
      mensajes: [
        {
          id: "MSG_001",
          remitente: "USER_001",
          contenido: "Saludos, el proyecto va en un 72% de avance",
          fecha: "2024-10-15T10:30:00Z",
          leido: true
        }
      ],
      estado: "activo"
    },
    
    // Chat con Trabajadores
    chatTrabajadores: {
      id: "CHAT_WORK_001",
      participantes: [
        { id: "USER_002", nombre: "Supervisor Técnico", rol: "gerencia" }
      ],
      mensajes: [
        {
          id: "MSG_002",
          remitente: "USER_002",
          contenido: "Completar excavación hoy",
          fecha: "2024-10-15T08:00:00Z",
          leido: true
        }
      ],
      estado: "activo"
    },
    
    // Notificaciones
    notificaciones: [
      {
        id: "NOT_001",
        tipo: "documento",
        titulo: "Nuevo documento subido",
        mensaje: "Se ha compartido 'Cotización adicional'",
        fecha: "2024-10-15T14:30:00Z",
        leido: false
      }
    ]
  },
  
  // ========== FASE 4: DATOS CLIENTE ==========
  datosCliente: {
    id: "CLIENT_001",
    nombre: "María González García",
    email: "maria.gonzalez@email.com",
    telefono: "+56 9 8765 4321",
    rut: "15.456.789-9",
    direccion: "Sector Nueva Providencia, Santiago",
    
    // Satisfacción
    encuestaSatisfaccion: {
      respuestas: [],
      estado: "pendiente" // pendiente, completado
    },
    
    // Sugerencias
    buzónSugerencias: [
      {
        id: "SUG_001",
        titulo: "Mejorar acceso a obra",
        descripcion: "Solicito mejorar el acceso vehicular a la obra",
        fecha: "2024-10-10",
        estado: "recibido"
      }
    ]
  },
  
  // ========== FASE 5: DATOS TRABAJADOR ==========
  datosEquipo: [
    {
      id: "EMP_001",
      nombre: "Juan Carlos López",
      puesto: "Maestro Constructor",
      especialidad: "Estructuras",
      horasAsignadas: 160,
      horasRealizadas: 115,
      tareas: [
        {
          id: "TAREA_001",
          titulo: "Excavación de cimientos",
          descripcion: "Excavación según planos de cimentación",
          estado: "completado",
          fechaInicio: "2024-06-10",
          fechaTermino: "2024-07-18",
          avance: 100
        },
        {
          id: "TAREA_002",
          titulo: "Hormigonado de losa",
          descripcion: "Hormigonado de losa primer piso",
          estado: "en_progreso",
          fechaInicio: "2024-08-01",
          fechaTermino: "2024-10-30",
          avance: 65
        }
      ],
      recursosApoyo: [
        {
          id: "REC_001",
          tipo: "video",
          titulo: "Técnica de hormigonado correcta",
          url: "videos/hormigonado.mp4",
          duracion: 12
        },
        {
          id: "REC_002",
          tipo: "imagen",
          titulo: "Especificación de acero",
          url: "imagenes/acero-spec.jpg"
        }
      ]
    }
  ],
  
  // ========== FASE 6: AUTOMATIZACIÓN ==========
  configuracionExcel: {
    estado: "no_importado",
    ultimaImportacion: null,
    plantillaUrl: "templates/plantilla-erp.xlsx",
    campos_mapeados: [
      "presupuestoInicial",
      "gastosExtras",
      "hitos",
      "especificaciones"
    ]
  },
  
  // Metadata
  metadata: {
    version: "1.0.0",
    ultimaActualizacion: new Date().toISOString(),
    creado: "2024-06-01",
    activo: true
  }
};

// ============================================================================
// UTILIDADES Y FUNCIONES AUXILIARES
// ============================================================================

/**
 * Validar permisos de acceso a documentos
 * @param {string} userType - Tipo de usuario (gerencia, cliente, trabajador)
 * @param {string} carpeta - Tipo de carpeta (carpetaMandante, carpetaObra)
 * @returns {boolean}
 */
function validarPermisoDocumento(userType, carpeta) {
  const permisos = {
    carpetaMandante: ["gerencia", "cliente"],
    carpetaObra: ["gerencia", "trabajador"]
  };
  
  return permisos[carpeta]?.includes(userType) || false;
}

/**
 * Calcular variación de costos
 * @returns {object}
 */
function calcularVariacionCostos() {
  const inicial = proyectoMaestro.datosGerencia.financiero.presupuestoInicial.monto;
  const extras = proyectoMaestro.datosGerencia.financiero.totalGastosExtras;
  const variacion = ((extras / inicial) * 100).toFixed(2);
  
  return {
    monto: extras,
    porcentaje: parseFloat(variacion),
    estado: variacion > 10 ? "crítico" : variacion > 5 ? "atención" : "normal"
  };
}

/**
 * Calcular progreso general del proyecto
 * @returns {number} Porcentaje de avance
 */
function calcularAvanceGeneral() {
  const hitos = proyectoMaestro.datosGerencia.cronograma.hitos;
  const promedio = hitos.reduce((acc, hito) => acc + hito.avance, 0) / hitos.length;
  return Math.round(promedio);
}

/**
 * Obtener indicadores clave del proyecto
 * @returns {object}
 */
function obtenerKPIs() {
  return {
    avanceGeneral: calcularAvanceGeneral(),
    variacionCostos: calcularVariacionCostos(),
    saldoPendiente: proyectoMaestro.datosGerencia.financiero.saldoPendiente.monto,
    diasRestantes: calcularDiasRestantes(),
    satisfaccionCliente: obtenerSatisfaccionCliente()
  };
}

/**
 * Calcular días restantes
 * @returns {number}
 */
function calcularDiasRestantes() {
  const termino = new Date(proyectoMaestro.datosGerencia.cronograma.fechaTerminoEstimado);
  const hoy = new Date();
  const diasRestantes = Math.floor((termino - hoy) / (1000 * 60 * 60 * 24));
  return diasRestantes > 0 ? diasRestantes : 0;
}

/**
 * Obtener satisfacción cliente (simulado)
 * @returns {number}
 */
function obtenerSatisfaccionCliente() {
  // Simulado: en Fase 4 se obtendría de la encuesta real
  return 85; // Porcentaje
}

/**
 * Guardar proyecto en localStorage
 */
function guardarProyecto() {
  localStorage.setItem('proyectoMaestro', JSON.stringify(proyectoMaestro));
  proyectoMaestro.metadata.ultimaActualizacion = new Date().toISOString();
}

/**
 * Cargar proyecto desde localStorage
 */
function cargarProyecto() {
  const datos = localStorage.getItem('proyectoMaestro');
  return datos ? JSON.parse(datos) : proyectoMaestro;
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    proyectoMaestro,
    validarPermisoDocumento,
    calcularVariacionCostos,
    calcularAvanceGeneral,
    obtenerKPIs,
    calcularDiasRestantes,
    obtenerSatisfaccionCliente,
    guardarProyecto,
    cargarProyecto
  };
}
