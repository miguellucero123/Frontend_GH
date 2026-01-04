/**
 * ============================================================================
 * FASE 1: MÓDULO DE GESTIÓN DE DATOS DE GERENCIA
 * ============================================================================
 * Gestión de métricas financieras, cronograma y detalles técnicos
 * Versión: 1.0.0
 * ============================================================================
 */

class GestorGerencia {
  constructor(proyecto = proyectoMaestro) {
    this.proyecto = proyecto;
    this.datosGerencia = proyecto.datosGerencia;
  }

  // ========== MÉTRICAS FINANCIERAS ==========

  /**
   * Obtener resumen financiero completo
   * @returns {object}
   */
  obtenerResumenFinanciero() {
    const financiero = this.datosGerencia.financiero;
    
    return {
      presupuestoInicial: financiero.presupuestoInicial.monto,
      gastosExtrasAprobados: financiero.gastosExtras
        .filter(g => g.estado === 'aprobado')
        .reduce((sum, g) => sum + g.monto, 0),
      gastosExtrasPendientes: financiero.gastosExtras
        .filter(g => g.estado === 'pendiente_aprobacion')
        .reduce((sum, g) => sum + g.monto, 0),
      totalGastosExtras: financiero.totalGastosExtras,
      costoFinal: financiero.costoFinalEstimado.monto,
      variacionPorcentaje: financiero.costoFinalEstimado.porcentajeVariacion,
      pagosRealizados: financiero.pagosRealizados.total,
      porcentajePagado: financiero.pagosRealizados.porcentajePagado,
      saldoPendiente: financiero.saldoPendiente.monto,
      fechaVencimiento: financiero.saldoPendiente.vencimiento
    };
  }

  /**
   * Obtener desglose de costos por categoría
   * @returns {array}
   */
  obtenerDesgloseCostos() {
    const desglose = this.datosGerencia.financiero.desgloseCostos;
    const presupuesto = this.datosGerencia.financiero.presupuestoInicial.monto;
    
    return Object.entries(desglose).map(([categoria, datos]) => ({
      categoria: this.formatearCategoria(categoria),
      monto: datos.monto,
      porcentaje: datos.porcentaje,
      porcentajeDelTotal: ((datos.monto / presupuesto) * 100).toFixed(2),
      items: datos.items
    }));
  }

  /**
   * Obtener historial de pagos
   * @returns {array}
   */
  obtenerHistorialPagos() {
    return this.datosGerencia.financiero.pagosRealizados.historial.map((pago, index) => ({
      numero: index + 1,
      descripcion: pago.numero,
      monto: pago.monto,
      fecha: this.formatearFecha(pago.fecha),
      estado: pago.estado,
      porcentajePagado: ((pago.monto / this.datosGerencia.financiero.presupuestoInicial.monto) * 100).toFixed(2)
    }));
  }

  /**
   * Agregar gasto extra
   * @param {object} gasto
   */
  agregarGastoExtra(gasto) {
    const nuevoGasto = {
      id: `GE-${String(this.datosGerencia.financiero.gastosExtras.length + 1).padStart(3, '0')}`,
      descripcion: gasto.descripcion,
      monto: parseFloat(gasto.monto),
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente_aprobacion',
      responsable: gasto.responsable || 'Pendiente'
    };
    
    this.datosGerencia.financiero.gastosExtras.push(nuevoGasto);
    this.actualizarTotalGastosExtras();
    this.guardar();
    
    return nuevoGasto;
  }

  /**
   * Aprobar gasto extra
   * @param {string} idGasto
   */
  aprobarGastoExtra(idGasto) {
    const gasto = this.datosGerencia.financiero.gastosExtras.find(g => g.id === idGasto);
    if (gasto) {
      gasto.estado = 'aprobado';
      this.actualizarTotalGastosExtras();
      this.actualizarCostoFinal();
      this.guardar();
    }
    return gasto;
  }

  /**
   * Actualizar total de gastos extras
   */
  actualizarTotalGastosExtras() {
    this.datosGerencia.financiero.totalGastosExtras = 
      this.datosGerencia.financiero.gastosExtras.reduce((sum, g) => sum + g.monto, 0);
  }

  /**
   * Actualizar costo final estimado
   */
  actualizarCostoFinal() {
    const inicial = this.datosGerencia.financiero.presupuestoInicial.monto;
    const extras = this.datosGerencia.financiero.totalGastosExtras;
    const costoFinal = inicial + extras;
    
    this.datosGerencia.financiero.costoFinalEstimado = {
      monto: costoFinal,
      variacion: extras,
      porcentajeVariacion: parseFloat(((extras / inicial) * 100).toFixed(2)),
      estado: 'estimado'
    };
  }

  // ========== CRONOGRAMA Y FECHAS ==========

  /**
   * Obtener cronograma completo
   * @returns {object}
   */
  obtenerCronograma() {
    const cronograma = this.datosGerencia.cronograma;
    const diasTranscurridos = this.calcularDiasTranscurridos();
    const diasTotales = cronograma.duracionPlanificada;
    const avanceChronos = (diasTranscurridos / diasTotales) * 100;
    
    return {
      fechaInicio: this.formatearFecha(cronograma.fechaInicio),
      fechaTerminoEstimado: this.formatearFecha(cronograma.fechaTerminoEstimado),
      fechaTerminoReal: cronograma.fechaTerminoReal ? this.formatearFecha(cronograma.fechaTerminoReal) : 'Pendiente',
      duracionPlanificada: cronograma.duracionPlanificada,
      diasTranscurridos: diasTranscurridos,
      diasRestantes: Math.max(0, diasTotales - diasTranscurridos),
      avanceChronologico: Math.round(avanceChronos),
      hitos: this.obtenerHitos()
    };
  }

  /**
   * Obtener hitos con formato
   * @returns {array}
   */
  obtenerHitos() {
    return this.datosGerencia.cronograma.hitos.map(hito => ({
      id: hito.id,
      nombre: hito.nombre,
      fechaProgramada: this.formatearFecha(hito.fechaProgramada),
      fechaReal: hito.fechaReal ? this.formatearFecha(hito.fechaReal) : 'Pendiente',
      estado: hito.estado,
      avance: hito.avance,
      retraso: this.calcularRetrasoHito(hito),
      estadoVisual: this.obtenerEstadoVisualHito(hito)
    }));
  }

  /**
   * Actualizar progreso de hito
   * @param {string} idHito
   * @param {number} avance (0-100)
   */
  actualizarProgresohito(idHito, avance) {
    const hito = this.datosGerencia.cronograma.hitos.find(h => h.id === idHito);
    if (hito) {
      hito.avance = Math.max(0, Math.min(100, avance));
      if (avance === 100 && hito.estado === 'en_progreso') {
        hito.estado = 'completado';
        hito.fechaReal = new Date().toISOString().split('T')[0];
      }
      this.guardar();
    }
    return hito;
  }

  /**
   * Calcular retraso de hito
   * @param {object} hito
   * @returns {number} Días de retraso
   */
  calcularRetrasoHito(hito) {
    const fechaProgramada = new Date(hito.fechaProgramada);
    const fechaReal = hito.fechaReal ? new Date(hito.fechaReal) : new Date();
    const diferencia = (fechaReal - fechaProgramada) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diferencia));
  }

  /**
   * Obtener estado visual de hito (para colores)
   * @param {object} hito
   * @returns {string}
   */
  obtenerEstadoVisualHito(hito) {
    if (hito.estado === 'completado') return 'success';
    if (hito.estado === 'en_progreso') return 'warning';
    const retraso = this.calcularRetrasoHito(hito);
    if (retraso > 0) return 'danger';
    return 'info';
  }

  /**
   * Calcular días transcurridos
   * @returns {number}
   */
  calcularDiasTranscurridos() {
    const inicio = new Date(this.datosGerencia.cronograma.fechaInicio);
    const hoy = new Date();
    return Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
  }

  // ========== DETALLES TÉCNICOS ==========

  /**
   * Obtener cubicación del proyecto
   * @returns {object}
   */
  obtenerCubicacion() {
    return this.datosGerencia.detallesTecnicos.cubicacion;
  }

  /**
   * Obtener metodología del proyecto
   * @returns {object}
   */
  obtenerMetodologia() {
    return this.datosGerencia.detallesTecnicos.metodologia;
  }

  /**
   * Obtener especificaciones técnicas
   * @returns {object}
   */
  obtenerEspecificaciones() {
    return this.datosGerencia.detallesTecnicos.especificaciones;
  }

  /**
   * Obtener información de responsables
   * @returns {array}
   */
  obtenerResponsables() {
    return this.datosGerencia.responsables;
  }

  // ========== KPIs Y INDICADORES ==========

  /**
   * Obtener KPIs de gerencia
   * @returns {object}
   */
  obtenerKPIs() {
    const financiero = this.obtenerResumenFinanciero();
    const cronograma = this.obtenerCronograma();
    
    return {
      // Financiero
      avanceFinanciero: financiero.porcentajePagado,
      variacionCostos: this.datosGerencia.financiero.costoFinalEstimado.porcentajeVariacion,
      saldoPendiente: financiero.saldoPendiente,
      
      // Cronograma
      avanceChronologico: cronograma.avanceChronologico,
      avanceHitos: this.calcularAvancePromedioHitos(),
      diasRestantes: cronograma.diasRestantes,
      
      // Riesgos
      riesgosIdentificados: this.identificarRiesgos(),
      alertas: this.generarAlertas()
    };
  }

  /**
   * Calcular avance promedio de hitos
   * @returns {number}
   */
  calcularAvancePromedioHitos() {
    const hitos = this.datosGerencia.cronograma.hitos;
    const promedio = hitos.reduce((sum, h) => sum + h.avance, 0) / hitos.length;
    return Math.round(promedio);
  }

  /**
   * Identificar riesgos potenciales
   * @returns {array}
   */
  identificarRiesgos() {
    const riesgos = [];
    
    // Riesgo de variación de costos
    if (this.datosGerencia.financiero.costoFinalEstimado.porcentajeVariacion > 10) {
      riesgos.push({
        tipo: 'financiero',
        severidad: 'alto',
        descripcion: 'Variación de costos superior al 10%',
        monto: this.datosGerencia.financiero.costoFinalEstimado.variacion
      });
    }
    
    // Riesgo de retraso
    const hitoretrasado = this.datosGerencia.cronograma.hitos.some(h => {
      const retraso = this.calcularRetrasoHito(h);
      return retraso > 7;
    });
    
    if (hitoretrasado) {
      riesgos.push({
        tipo: 'cronograma',
        severidad: 'medio',
        descripcion: 'Hito con retraso mayor a una semana'
      });
    }
    
    // Riesgo de gastos pendientes
    const gastosPendientes = this.datosGerencia.financiero.gastosExtras
      .filter(g => g.estado === 'pendiente_aprobacion')
      .length;
    
    if (gastosPendientes > 0) {
      riesgos.push({
        tipo: 'financiero',
        severidad: 'medio',
        descripcion: `${gastosPendientes} gasto(s) extra pendiente(s) de aprobación`
      });
    }
    
    return riesgos;
  }

  /**
   * Generar alertas operacionales
   * @returns {array}
   */
  generarAlertas() {
    const alertas = [];
    
    // Alerta de saldo pendiente
    if (this.datosGerencia.financiero.saldoPendiente.monto > 0) {
      const diasAlVencimiento = this.calcularDiasHastaVencimiento();
      if (diasAlVencimiento < 30) {
        alertas.push({
          tipo: 'vencimiento_proximo',
          mensaje: `Saldo pendiente vence en ${diasAlVencimiento} días`,
          prioridad: 'alta'
        });
      }
    }
    
    return alertas;
  }

  /**
   * Calcular días hasta vencimiento de pago
   * @returns {number}
   */
  calcularDiasHastaVencimiento() {
    const vencimiento = new Date(this.datosGerencia.financiero.saldoPendiente.vencimiento);
    const hoy = new Date();
    return Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  }

  // ========== UTILIDADES ==========

  /**
   * Formatear fecha
   * @param {string} fecha ISO string
   * @returns {string} Fecha formateada
   */
  formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear moneda
   * @param {number} monto
   * @returns {string}
   */
  formatearMoneda(monto) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }

  /**
   * Formatear nombre de categoría
   * @param {string} categoria
   * @returns {string}
   */
  formatearCategoria(categoria) {
    const nombres = {
      materiales: 'Materiales',
      manoDeObra: 'Mano de Obra',
      equipoMaquinaria: 'Equipos y Maquinaria',
      administracion: 'Administración'
    };
    return nombres[categoria] || categoria;
  }

  /**
   * Guardar cambios
   */
  guardar() {
    if (typeof guardarProyecto === 'function') {
      guardarProyecto();
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem('proyectoMaestro', JSON.stringify(this.proyecto));
    }
  }

  /**
   * Generar reporte JSON
   * @returns {object}
   */
  generarReporte() {
    return {
      resumenFinanciero: this.obtenerResumenFinanciero(),
      desgloseCostos: this.obtenerDesgloseCostos(),
      cronograma: this.obtenerCronograma(),
      kpis: this.obtenerKPIs(),
      riesgos: this.identificarRiesgos(),
      alertas: this.generarAlertas(),
      responsables: this.obtenerResponsables()
    };
  }
}

// Crear instancia global
const gestorGerencia = new GestorGerencia();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GestorGerencia;
}
