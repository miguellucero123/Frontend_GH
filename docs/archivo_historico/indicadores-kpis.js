// Sistema de Indicadores Personalizados

const gestorIndicadores = {
    tiposIndicadores: {
        numerico: {
            formato: 'number',
            operaciones: ['suma', 'promedio', 'maximo', 'minimo', 'conteo'],
            visualizacion: ['numero-grande', 'gauge', 'termometro']
        },
        porcentaje: {
            formato: 'percentage',
            operaciones: ['division', 'proporcion'],
            visualizacion: ['barra-progreso', 'circulo', 'semicirculo']
        },
        monetario: {
            formato: 'currency',
            operaciones: ['suma', 'resta', 'promedio'],
            visualizacion: ['numero-grande', 'comparativa', 'tendencia']
        },
        temporal: {
            formato: 'date-diff',
            operaciones: ['dias-entre', 'dias-restantes', 'retraso'],
            visualizacion: ['cuenta-regresiva', 'calendario', 'linea-tiempo']
        }
    },

    crearIndicador: function(configuracion) {
        return {
            id: this.generarUID(),
            nombre: configuracion.nombre,
            descripcion: configuracion.descripcion,
            tipo: configuracion.tipo,
            fuentesDatos: configuracion.fuentesDatos,
            formula: configuracion.formula,
            visualizacion: configuracion.visualizacion,
            actualizacion: configuracion.actualizacion,
            visiblePara: configuracion.visiblePara
        };
    },

    generarUID: function() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    },

    calcularIndicador: function(indicador, datos) {
        try {
            const resultado = indicador.formula(datos);
            console.log(`Resultado del indicador ${indicador.nombre}:`, resultado);
            return resultado;
        } catch (error) {
            console.error(`Error al calcular el indicador ${indicador.nombre}:`, error);
            return null;
        }
    }
};

// Ejemplo de uso
const nuevoIndicador = gestorIndicadores.crearIndicador({
    nombre: 'Eficiencia de Costos',
    descripcion: 'Porcentaje de eficiencia en el uso del presupuesto',
    tipo: 'porcentaje',
    fuentesDatos: [
        { tabla: 'proyectos', campo: 'presupuestoInicial' },
        { tabla: 'proyectos', campo: 'costoReal' }
    ],
    formula: function(datos) {
        return (datos.presupuestoInicial / datos.costoReal) * 100;
    },
    visualizacion: {
        tipo: 'barra-progreso',
        color: '#27AE60',
        umbralAlerta: 80,
        umbralCritico: 50
    },
    actualizacion: 'diaria',
    visiblePara: ['gerencia']
});

gestorIndicadores.calcularIndicador(nuevoIndicador, {
    presupuestoInicial: 1000000,
    costoReal: 900000
});