/**
 * ============================================================================
 * ANÁLISIS PREDICTIVO - MEJORA FASE 1
 * ============================================================================
 * Forecasting de costos, fechas y escenarios
 * Versión: 1.0.0
 * ============================================================================
 */

class PredictiveAnalysis {
    constructor(gestorGerencia) {
        this.gestorGerencia = gestorGerencia;
    }

    /**
     * Predecir costo final basado en tendencias
     */
    predecirCostoFinal() {
        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        const historial = this.gestorGerencia.obtenerHistorialPagos();
        const gastosExtras = this.gestorGerencia.datosGerencia.financiero.gastosExtras;

        // Calcular tendencia de gastos
        const tendencia = this.calcularTendenciaGastos(historial, gastosExtras);
        
        // Proyección lineal simple
        const diasTranscurridos = this.gestorGerencia.calcularDiasTranscurridos();
        const duracionTotal = this.gestorGerencia.datosGerencia.cronograma.duracionPlanificada;
        const porcentajeTiempo = (diasTranscurridos / duracionTotal) * 100;

        // Si ya pasó más del 50% del tiempo, usar tendencia actual
        let costoProyectado;
        if (porcentajeTiempo > 50) {
            // Proyección basada en velocidad actual
            const velocidadActual = resumen.pagosRealizados / porcentajeTiempo;
            costoProyectado = velocidadActual * 100;
        } else {
            // Proyección basada en tendencia
            costoProyectado = resumen.costoFinal * (1 + tendencia.factorVariacion);
        }

        // Calcular rango de confianza (±10%)
        const rangoConfianza = costoProyectado * 0.1;
        const costoMinimo = costoProyectado - rangoConfianza;
        const costoMaximo = costoProyectado + rangoConfianza;

        // Probabilidad de exceder presupuesto
        const probabilidadExceder = costoProyectado > resumen.presupuestoInicial 
            ? Math.min(100, ((costoProyectado - resumen.presupuestoInicial) / resumen.presupuestoInicial) * 100)
            : 0;

        return {
            costoProyectado: Math.round(costoProyectado),
            costoMinimo: Math.round(costoMinimo),
            costoMaximo: Math.round(costoMaximo),
            rangoConfianza: Math.round(rangoConfianza),
            probabilidadExceder: Math.round(probabilidadExceder),
            tendencia: tendencia.direccion, // 'ascendente', 'descendente', 'estable'
            recomendaciones: this.generarRecomendaciones(costoProyectado, resumen.presupuestoInicial, probabilidadExceder)
        };
    }

    /**
     * Calcular tendencia de gastos
     */
    calcularTendenciaGastos(historial, gastosExtras) {
        if (historial.length < 2) {
            return {
                direccion: 'estable',
                factorVariacion: 0,
                velocidad: 0
            };
        }

        // Calcular gastos mensuales
        const gastosMensuales = [];
        const meses = {};

        historial.forEach(pago => {
            const fecha = new Date(pago.fecha);
            const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;
            
            if (!meses[mesKey]) {
                meses[mesKey] = 0;
            }
            meses[mesKey] += pago.monto;
        });

        Object.values(meses).forEach(monto => {
            gastosMensuales.push(monto);
        });

        // Calcular tendencia (regresión lineal simple)
        const n = gastosMensuales.length;
        let sumaX = 0, sumaY = 0, sumaXY = 0, sumaX2 = 0;

        gastosMensuales.forEach((monto, index) => {
            const x = index + 1;
            sumaX += x;
            sumaY += monto;
            sumaXY += x * monto;
            sumaX2 += x * x;
        });

        const pendiente = (n * sumaXY - sumaX * sumaY) / (n * sumaX2 - sumaX * sumaX);
        const promedio = sumaY / n;

        // Determinar dirección
        let direccion = 'estable';
        if (pendiente > promedio * 0.05) direccion = 'ascendente';
        else if (pendiente < -promedio * 0.05) direccion = 'descendente';

        return {
            direccion,
            factorVariacion: pendiente / promedio,
            velocidad: pendiente
        };
    }

    /**
     * Predecir fecha de término
     */
    predecirFechaTermino() {
        const cronograma = this.gestorGerencia.obtenerCronograma();
        const hitos = this.gestorGerencia.obtenerHitos();
        
        // Calcular velocidad de avance
        const hitosCompletados = hitos.filter(h => h.estado === 'completado').length;
        const diasTranscurridos = cronograma.diasTranscurridos;
        const velocidadHitos = hitosCompletados / diasTranscurridos; // hitos por día

        // Calcular días restantes estimados
        const hitosPendientes = hitos.length - hitosCompletados;
        const diasRestantesEstimados = velocidadHitos > 0 
            ? Math.ceil(hitosPendientes / velocidadHitos)
            : cronograma.diasRestantes;

        // Fecha estimada
        const fechaEstimada = new Date();
        fechaEstimada.setDate(fechaEstimada.getDate() + diasRestantesEstimados);

        // Comparar con fecha programada
        const fechaProgramada = new Date(cronograma.fechaTerminoEstimado);
        const diferenciaDias = Math.ceil((fechaEstimada - fechaProgramada) / (1000 * 60 * 60 * 24));

        return {
            fechaEstimada: fechaEstimada.toISOString().split('T')[0],
            fechaProgramada: cronograma.fechaTerminoEstimado,
            diasRestantes: diasRestantesEstimados,
            diferenciaDias,
            estado: diferenciaDias > 7 ? 'retraso' : diferenciaDias < -7 ? 'adelantado' : 'normal',
            velocidadActual: velocidadHitos,
            confianza: this.calcularConfianzaPrediccion(hitos, diasTranscurridos)
        };
    }

    /**
     * Generar escenarios "qué pasaría si"
     */
    generarEscenarios(variaciones) {
        const resumen = this.gestorGerencia.obtenerResumenFinanciero();
        const escenarios = [];

        variaciones.forEach(variacion => {
            const nuevoCosto = resumen.costoFinal * (1 + variacion.porcentaje / 100);
            const impacto = nuevoCosto - resumen.costoFinal;
            const nuevaVariacion = ((nuevoCosto - resumen.presupuestoInicial) / resumen.presupuestoInicial) * 100;

            escenarios.push({
                nombre: variacion.nombre,
                descripcion: variacion.descripcion,
                costoFinal: Math.round(nuevoCosto),
                impacto: Math.round(impacto),
                variacionPorcentaje: nuevaVariacion.toFixed(2),
                factibilidad: this.evaluarFactibilidad(variacion, nuevaVariacion),
                recomendacion: this.generarRecomendacionEscenario(nuevaVariacion)
            });
        });

        return escenarios;
    }

    /**
     * Evaluar factibilidad de escenario
     */
    evaluarFactibilidad(variacion, nuevaVariacion) {
        if (nuevaVariacion > 20) return 'baja';
        if (nuevaVariacion > 10) return 'media';
        return 'alta';
    }

    /**
     * Generar recomendación para escenario
     */
    generarRecomendacionEscenario(variacionPorcentaje) {
        if (variacionPorcentaje > 15) {
            return 'Revisar y optimizar costos urgentemente';
        } else if (variacionPorcentaje > 10) {
            return 'Monitorear de cerca y buscar ahorros';
        } else if (variacionPorcentaje > 5) {
            return 'Mantener control y buscar eficiencias';
        } else {
            return 'Proyecto en rango aceptable';
        }
    }

    /**
     * Generar recomendaciones basadas en predicción
     */
    generarRecomendaciones(costoProyectado, presupuestoInicial, probabilidadExceder) {
        const recomendaciones = [];

        if (probabilidadExceder > 50) {
            recomendaciones.push({
                tipo: 'critica',
                mensaje: 'Alta probabilidad de exceder presupuesto. Revisar gastos extras pendientes.',
                accion: 'revisar_gastos'
            });
        }

        if (costoProyectado > presupuestoInicial * 1.1) {
            recomendaciones.push({
                tipo: 'alta',
                mensaje: 'Costo proyectado supera el 10% del presupuesto. Buscar optimizaciones.',
                accion: 'optimizar_costos'
            });
        }

        if (probabilidadExceder < 20) {
            recomendaciones.push({
                tipo: 'baja',
                mensaje: 'Proyecto en rango aceptable. Mantener control actual.',
                accion: 'mantener'
            });
        }

        return recomendaciones;
    }

    /**
     * Calcular confianza de predicción
     */
    calcularConfianzaPrediccion(hitos, diasTranscurridos) {
        if (hitos.length === 0 || diasTranscurridos === 0) return 0;

        const hitosCompletados = hitos.filter(h => h.estado === 'completado').length;
        const ratioCompletados = hitosCompletados / hitos.length;
        
        // Más hitos completados = mayor confianza
        // Más días transcurridos = mayor confianza
        const confianza = Math.min(100, (ratioCompletados * 0.6 + (diasTranscurridos / 100) * 0.4) * 100);
        
        return Math.round(confianza);
    }

    /**
     * Obtener resumen predictivo completo
     */
    obtenerResumenPredictivo() {
        const costo = this.predecirCostoFinal();
        const fecha = this.predecirFechaTermino();

        return {
            costo,
            fecha,
            alertas: this.identificarAlertas(costo, fecha),
            resumen: this.generarResumenTexto(costo, fecha)
        };
    }

    /**
     * Identificar alertas basadas en predicciones
     */
    identificarAlertas(costo, fecha) {
        const alertas = [];

        if (costo.probabilidadExceder > 50) {
            alertas.push({
                tipo: 'critica',
                titulo: 'Riesgo Alto de Exceder Presupuesto',
                mensaje: `Probabilidad del ${costo.probabilidadExceder}% de exceder el presupuesto inicial.`,
                accion: 'revisar_finanzas'
            });
        }

        if (fecha.estado === 'retraso' && fecha.diferenciaDias > 14) {
            alertas.push({
                tipo: 'alta',
                titulo: 'Retraso Significativo Proyectado',
                mensaje: `El proyecto podría terminar con ${fecha.diferenciaDias} días de retraso.`,
                accion: 'revisar_cronograma'
            });
        }

        return alertas;
    }

    /**
     * Generar resumen en texto
     */
    generarResumenTexto(costo, fecha) {
        return `
            <strong>Predicción de Costo:</strong> $${this.formatNumber(costo.costoProyectado)} 
            (Rango: $${this.formatNumber(costo.costoMinimo)} - $${this.formatNumber(costo.costoMaximo)})<br>
            <strong>Probabilidad de Exceder:</strong> ${costo.probabilidadExceder}%<br>
            <strong>Fecha Estimada de Término:</strong> ${fecha.fechaEstimada}<br>
            <strong>Estado:</strong> ${fecha.estado === 'retraso' ? '⚠️ Retraso' : fecha.estado === 'adelantado' ? '✅ Adelantado' : '✓ Normal'}
        `;
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
    window.PredictiveAnalysis = PredictiveAnalysis;
}

