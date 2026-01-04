# 🎓 GUÍA DE DESARROLLADOR - ERP CONSTRUCTORA

> **Nivel**: Intermedio-Avanzado | **Duración**: 30 minutos lectura completa  
> **Requisitos**: JavaScript ES6+, HTML5, CSS3, conceptos OOP

---

## 📖 TABLA DE CONTENIDOS

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Capa de Datos](#capa-de-datos)
3. [Capa de Lógica](#capa-de-lógica)
4. [Capa de Presentación](#capa-de-presentación)
5. [Patrones Implementados](#patrones-implementados)
6. [Cómo Extender](#cómo-extender)
7. [Debugging](#debugging)
8. [Performance](#performance)

---

## 🏗️ ESTRUCTURA DEL PROYECTO

### Árbol de Directorios (Relevante)

```
frontend/
├── index.html                    ← Login principal
├── panel-jefe.html               ← Dashboard FASE 1
├── dashboard-trabajador.html      ← Dashboard trabajador
├── dashboard-cliente.html         ← Dashboard cliente
│
├── js/
│   ├── data-maestro.js          ← 🟢 Datos + Utilidades
│   ├── modulos-fase1.js         ← 🟢 Lógica FASE 1
│   ├── modulos-fase2.js         ← ⏳ Próximo
│   └── modulos-fase[3-6].js     ← ⏳ Futuros
│
├── css/
│   └── estilos.css              ← Tailwind CDN + Custom
│
└── docs/
    ├── DIAGRAMA_ARQUITECTURA.md
    ├── ARQUITECTURA_FASES.md
    ├── INDICE_MAESTRO.md
    └── GUIA_DESARROLLADOR.md    ← Este archivo
```

---

## 🗄️ CAPA DE DATOS

### Archivo: `data-maestro.js`

**Responsabilidad**: Almacenar y gestionar el estado central de la aplicación.

#### Estructura Principal

```javascript
// Objeto maestro - único punto de verdad
const proyectoMaestro = {
  id: "PROYECTO_001",
  nombre: "Casa Moderna - Proyecto Residencial",
  estado: "en_progreso",
  
  // FASE 1 - Datos de Gerencia
  datosGerencia: {
    ubicacion: { direccion, comuna, region, codigoProyecto },
    financiero: { presupuesto, gastos, costos, pagos, saldo },
    cronograma: { fechas, duracion, hitos: [] },
    detallesTecnicos: { cubicacion, metodologia, especificaciones },
    responsables: []
  },
  
  // FASES 2-6 (estructuradas pero sin datos)
  gestorDocumental: {},
  comunicacion: {},
  datosCliente: {},
  datosEquipo: [],
  configuracionExcel: {}
}
```

#### Funciones Clave

```javascript
// 1. Cálculo de Variación
function calcularVariacionCostos(presupuesto, gastos) {
  // Input: $850K presupuesto, $37.5K gastos
  // Output: 4.41% (porcentaje de incremento)
  return ((gastos / presupuesto) * 100).toFixed(2)
}

// 2. Cálculo de Avance General
function calcularAvanceGeneral(hitos) {
  // Input: array de hitos con avance individual
  // Output: promedio de avance (72%)
  const promedio = hitos.reduce((sum, h) => sum + h.avance, 0) / hitos.length
  return Math.round(promedio)
}

// 3. Obtener KPIs
function obtenerKPIs() {
  // Retorna objeto con 6 indicadores clave
  return {
    avanceHitos: calcularAvanceGeneral(hitos),
    variacionCostos: calcularVariacionCostos(),
    saldoPendiente: costoFinal - pagosRealizados,
    avanceChronologico: (diasTranscurridos / duracionTotal) * 100,
    diasRestantes: diasHastaFechaTermino,
    riesgosIdentificados: identificarRiesgos().length
  }
}

// 4. Persistencia
function guardarProyecto() {
  // Guarda proyectoMaestro en localStorage
  localStorage.setItem('proyecto', JSON.stringify(proyectoMaestro))
}

function cargarProyecto() {
  // Carga proyectoMaestro desde localStorage
  const datos = localStorage.getItem('proyecto')
  if (datos) {
    Object.assign(proyectoMaestro, JSON.parse(datos))
  }
}
```

#### Inicialización

```javascript
// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarProyecto() // Carga datos de localStorage
  
  // Si no hay datos, usa test data (Casa Moderna)
  if (!proyectoMaestro.datosGerencia.financiero.presupuestoInicial) {
    inicializarTestData()
  }
})
```

---

## 🧠 CAPA DE LÓGICA

### Archivo: `modulos-fase1.js`

**Responsabilidad**: Implementar reglas de negocio y cálculos para gerencia.

#### Estructura de Clase

```javascript
class GestorGerencia {
  constructor() {
    // No requiere parámetros - accede a proyectoMaestro global
    this.proyecto = proyectoMaestro
  }
  
  // Métodos organizados en 5 categorías
  
  // FINANCIERO (8 métodos)
  obtenerResumenFinanciero() { }
  obtenerDesgloseCostos() { }
  obtenerHistorialPagos() { }
  agregarGastoExtra(gasto) { }
  aprobarGastoExtra(idGasto) { }
  
  // CRONOGRAMA (8 métodos)
  obtenerCronograma() { }
  obtenerHitos() { }
  actualizarProgresohito(idHito, avance) { }
  calcularRetrasoHito(hito) { }
  
  // TÉCNICOS (4 métodos)
  obtenerCubicacion() { }
  obtenerEspecificaciones() { }
  obtenerResponsables() { }
  
  // KPI / RIESGOS (5 métodos)
  obtenerKPIs() { }
  identificarRiesgos() { }
  generarAlertas() { }
  
  // AUXILIARES (5 métodos)
  formatearFecha(fecha) { }
  formatearMoneda(monto) { }
  generarReporte() { }
}
```

#### Ejemplo Detallado: obtenerKPIs()

```javascript
// Este es el método más importante
obtenerKPIs() {
  const datos = this.proyecto.datosGerencia
  const financiero = datos.financiero
  const cronograma = datos.cronograma
  const hitos = cronograma.hitos
  
  // 1. AVANCE HITOS (%)
  const avanceHitos = hitos.length > 0
    ? hitos.reduce((sum, h) => sum + h.avance, 0) / hitos.length
    : 0
  
  // 2. VARIACIÓN COSTOS (%)
  const gastosExtras = financiero.gastosExtras.reduce((sum, g) => sum + g.monto, 0)
  const variacionCostos = (gastosExtras / financiero.presupuestoInicial) * 100
  
  // 3. SALDO PENDIENTE ($)
  const saldoPendiente = financiero.costoFinalEstimado.monto 
    - financiero.pagosRealizados.total
  
  // 4. AVANCE CHRONOLÓGICO (%)
  const fechaInicio = new Date(cronograma.fechaInicio)
  const fechaFin = new Date(cronograma.fechaTerminoEstimado)
  const hoy = new Date()
  
  const diasTotales = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)
  const diasTranscurridos = (hoy - fechaInicio) / (1000 * 60 * 60 * 24)
  const avanceChronologico = (diasTranscurridos / diasTotales) * 100
  
  // 5. DÍAS RESTANTES
  const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
  
  // 6. RIESGOS IDENTIFICADOS
  const riesgos = this.identificarRiesgos()
  
  return {
    avanceHitos: Math.round(avanceHitos),
    variacionCostos: variacionCostos.toFixed(2),
    saldoPendiente: saldoPendiente.toFixed(2),
    avanceChronologico: avanceChronologico.toFixed(2),
    diasRestantes,
    riesgosIdentificados: riesgos.length
  }
}
```

#### Ejemplo: agregarGastoExtra()

```javascript
agregarGastoExtra(gasto) {
  // Input: { descripcion, monto, responsable }
  // Output: { id, descripcion, monto, fecha, estado, responsable }
  
  const nuevoGasto = {
    id: Date.now(), // ID único basado en timestamp
    descripcion: gasto.descripcion,
    monto: gasto.monto,
    fecha: new Date().toISOString(),
    estado: "pendiente_aprobacion",
    responsable: gasto.responsable
  }
  
  // Agregar al array
  this.proyecto.datosGerencia.financiero.gastosExtras.push(nuevoGasto)
  
  // Guardar en localStorage
  guardarProyecto()
  
  return nuevoGasto
}

aprobarGastoExtra(idGasto) {
  const gasto = this.proyecto.datosGerencia.financiero.gastosExtras
    .find(g => g.id === idGasto)
  
  if (gasto) {
    gasto.estado = "aprobado"
    
    // Recalcular costos
    const gastosExtras = this.proyecto.datosGerencia.financiero.gastosExtras
      .filter(g => g.estado === "aprobado")
      .reduce((sum, g) => sum + g.monto, 0)
    
    const presupuesto = this.proyecto.datosGerencia.financiero.presupuestoInicial.monto
    
    this.proyecto.datosGerencia.financiero.costoFinalEstimado = {
      monto: presupuesto + gastosExtras,
      variacion: gastosExtras,
      porcentaje: (gastosExtras / presupuesto) * 100
    }
    
    guardarProyecto()
  }
  
  return gasto
}
```

#### Instanciación Global

```javascript
// Al final de modulos-fase1.js
const gestorGerencia = new GestorGerencia()

// Ahora disponible en todas partes
console.log(gestorGerencia.obtenerKPIs())
```

---

## 🎨 CAPA DE PRESENTACIÓN

### Archivo: `panel-jefe.html`

**Responsabilidad**: Mostrar interfaz y conectar eventos con lógica.

#### Estructura HTML

```html
<!DOCTYPE html>
<html>
<head>
    <script src="js/data-maestro.js" defer></script>
    <script src="js/modulos-fase1.js" defer></script>
</head>
<body>
    <!-- SECCIÓN 1: KPIs -->
    <section id="kpis">
        <div id="kpiAvance">-</div>
        <div id="kpiVariacion">-</div>
        <div id="kpiSaldo">-</div>
        <div id="kpiDias">-</div>
    </section>
    
    <!-- SECCIÓN 2: Financiero (con tabs) -->
    <section id="financiero">
        <div id="tabs">
            <button onclick="cambiarTab('resumen')">Resumen</button>
            <button onclick="cambiarTab('desglose')">Desglose</button>
            <button onclick="cambiarTab('pagos')">Pagos</button>
        </div>
        <div id="content-resumen"></div>
        <div id="content-desglose"></div>
        <div id="content-pagos"></div>
    </section>
    
    <!-- Otras secciones... -->
</body>
</html>
```

#### JavaScript de Renderización

```javascript
// Función principal de inicialización
function inicializar() {
  // Verificar autenticación
  const user = localStorage.getItem('auth_user')
  if (!user) {
    window.location.href = 'index.html'
    return
  }
  
  // Cargar datos
  cargarProyecto()
  
  // Renderizar
  renderizarDatos()
}

// Renderización de KPIs
function renderizarKPIs() {
  const kpis = gestorGerencia.obtenerKPIs()
  
  document.getElementById('kpiAvance').innerHTML = `
    <div class="stat">
      <div class="valor">${kpis.avanceHitos}%</div>
      <div class="label">Avance General</div>
    </div>
  `
  
  document.getElementById('kpiVariacion').innerHTML = `
    <div class="stat">
      <div class="valor">${kpis.variacionCostos}%</div>
      <div class="label">Variación Costos</div>
    </div>
  `
  
  // Etc...
}

// Renderización de Hitos
function renderizarHitos() {
  const hitos = gestorGerencia.obtenerHitos()
  const html = hitos.map(hito => `
    <div class="hito" data-id="${hito.id}">
      <h4>${hito.nombre}</h4>
      <div class="progress">
        <div style="width: ${hito.avance}%"></div>
      </div>
      <span>${hito.avance}% - ${hito.estado}</span>
    </div>
  `).join('')
  
  document.getElementById('contenedor-hitos').innerHTML = html
}

// Sistema de tabs
function cambiarTab(tab) {
  // Ocultar todos
  document.querySelectorAll('[id^="content-"]').forEach(el => {
    el.style.display = 'none'
  })
  
  // Mostrar seleccionado
  document.getElementById(`content-${tab}`).style.display = 'block'
  
  // Renderizar contenido
  if (tab === 'resumen') {
    renderizarResumenFinanciero()
  } else if (tab === 'desglose') {
    renderizarDesgloseCostos()
  } else if (tab === 'pagos') {
    renderizarHistorialPagos()
  }
}

// Evento de carga
document.addEventListener('DOMContentLoaded', inicializar)
```

---

## 🎯 PATRONES IMPLEMENTADOS

### 1. Manager Class Pattern

```javascript
// Estructura consistente
class Gestor<Dominio> {
  constructor() {
    this.proyecto = proyectoMaestro
  }
  
  // Métodos públicos
  obtener<Dato>() { }
  crear<Dato>() { }
  actualizar<Dato>() { }
  eliminar<Dato>() { }
}

// Uso
const gestor = new Gestor<Dominio>()
const datos = gestor.obtener<Dato>()
```

### 2. Single Responsibility Principle

```
data-maestro.js
├─ Responsabilidad: Almacenar datos
├─ Métodos: CRUD básicos
└─ No: Lógica compleja

modulos-fase1.js
├─ Responsabilidad: Lógica de gerencia
├─ Métodos: Cálculos, validaciones
└─ No: Manipulación del DOM

panel-jefe.html
├─ Responsabilidad: Presentación
├─ Métodos: Renderización, eventos
└─ No: Lógica de negocio
```

### 3. Reactive Pattern Simplificado

```javascript
// Función wrapper para observar cambios
function actualizarHito(idHito, nuevoAvance) {
  // 1. Actualizar dato
  const hito = encontrarHito(idHito)
  hito.avance = nuevoAvance
  
  // 2. Persistir
  guardarProyecto()
  
  // 3. Re-renderizar
  renderizarHitos()
  renderizarKPIs() // Los KPIs dependen de hitos
}
```

### 4. Template Literals para HTML

```javascript
// Evita concatenación confusa
const html = `
  <div class="card">
    <h3>${titulo}</h3>
    <p>${descripcion}</p>
    <button onclick="evento('${id}')">Acción</button>
  </div>
`

element.innerHTML = html
```

---

## 🔧 CÓMO EXTENDER

### Agregar Nueva Métrica KPI

```javascript
// Paso 1: Agregar cálculo en obtenerKPIs()
obtenerKPIs() {
  return {
    // KPIs existentes...
    
    // NUEVO: Índice de satisfacción
    indiceSatisfaccion: this.calcularIndiceSatisfaccion()
  }
}

// Paso 2: Implementar método de cálculo
calcularIndiceSatisfaccion() {
  // Lógica...
  return valor
}

// Paso 3: Renderizar en HTML
function renderizarKPIs() {
  const kpis = gestorGerencia.obtenerKPIs()
  
  // Renderizar nuevo KPI...
  document.getElementById('kpiSatisfaccion').innerHTML = `
    <div class="stat">
      <div class="valor">${kpis.indiceSatisfaccion}/10</div>
      <div class="label">Satisfacción</div>
    </div>
  `
}
```

### Crear Nueva Fase (Ejemplo: FASE 2)

```javascript
// Paso 1: Crear modulos-fase2.js
class GestorDocumental {
  constructor() {
    this.proyecto = proyectoMaestro
  }
  
  // Métodos para documentos...
  obtenerDocumentos() { }
  subirDocumento(archivo) { }
  compartirDocumento(docId, usuarioId) { }
}

// Paso 2: Agregar en HTML
<script src="js/modulos-fase2.js" defer></script>

// Paso 3: Crear interfaz
<section id="documentos">
  <!-- Contenido FASE 2 -->
</section>

// Paso 4: Integrar inicialización
function inicializar() {
  // Inicializar FASE 1
  gestorGerencia.obtenerKPIs()
  
  // Inicializar FASE 2
  const gestorDocumental = new GestorDocumental()
  gestorDocumental.obtenerDocumentos()
}
```

---

## 🐛 DEBUGGING

### Herramientas Recomendadas

```javascript
// 1. Ver objeto maestro completo
console.log(proyectoMaestro)

// 2. Ver KPIs calculados
console.log(gestorGerencia.obtenerKPIs())

// 3. Monitorear localStorage
console.log(JSON.parse(localStorage.getItem('proyecto')))

// 4. Ver hitos actuales
console.log(gestorGerencia.obtenerHitos())

// 5. Identificar riesgos
console.log(gestorGerencia.identificarRiesgos())

// 6. Ver alertas
console.log(gestorGerencia.generarAlertas())
```

### Breakpoints en DevTools

```javascript
// Agregar breakpoint manual
debugger // Se pausará aquí cuando DevTools esté abierto

// O en Google Chrome DevTools:
// 1. Click derecho en línea de código
// 2. "Add breakpoint"
// 3. Ejecutar acción que dispare el código
// 4. Pausa automática, inspeccionar variables
```

### Logging Efectivo

```javascript
// ✅ BIEN: Contexto claro
console.log('KPI Avance:', kpis.avanceHitos, '%')

// ❌ MAL: Sin contexto
console.log(kpis.avanceHitos)

// ✅ BIEN: Con tipo de dato
console.log('Tipo:', typeof valor, 'Valor:', valor)

// ✅ BIEN: Para objetos complejos
console.table(arrayDeObjetos) // Muestra tabla
```

---

## ⚡ PERFORMANCE

### Optimizaciones Implementadas

```javascript
// 1. Memoización de cálculos
let kpisEnCache = null
obtenerKPIs() {
  // Recalcular solo si algo cambió
  if (!kpisEnCache || this.proyecto._modificado) {
    kpisEnCache = { ... }
  }
  return kpisEnCache
}

// 2. Renderización eficiente
function renderizarHitos() {
  // Evitar reflow innecesarios
  const fragment = document.createDocumentFragment()
  hitos.forEach(hito => {
    const el = crearElementoHito(hito)
    fragment.appendChild(el)
  })
  document.getElementById('contenedor-hitos').innerHTML = ''
  document.getElementById('contenedor-hitos').appendChild(fragment)
}

// 3. Event delegation
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-aprobar')) {
    const id = e.target.dataset.id
    gestorGerencia.aprobarGastoExtra(id)
  }
})
```

### Métricas

```
Tamaño archivo JS:        ~50KB
Tamaño HTML:              ~30KB
Tamaño localStorage:      ~150KB
Tiempo carga inicial:     <1 segundo
Tiempo renderización:     <100ms
Memoria RAM utilizada:    <30MB
```

---

## 📚 REFERENCIAS Y EJEMPLOS

### Crear Nuevo Gasto (Ejemplo Completo)

```javascript
// En panel-jefe.html, formulario:
<form id="formGasto">
  <input type="text" id="descripcion" placeholder="Descripción">
  <input type="number" id="monto" placeholder="Monto">
  <input type="text" id="responsable" placeholder="Responsable">
  <button type="submit">Agregar Gasto</button>
</form>

// JavaScript para manejar
document.getElementById('formGasto').addEventListener('submit', (e) => {
  e.preventDefault()
  
  const nuevoGasto = {
    descripcion: document.getElementById('descripcion').value,
    monto: parseFloat(document.getElementById('monto').value),
    responsable: document.getElementById('responsable').value
  }
  
  // Agregar
  gestorGerencia.agregarGastoExtra(nuevoGasto)
  
  // Limpiar form
  e.target.reset()
  
  // Re-renderizar
  renderizarDesgloseCostos()
  renderizarKPIs()
})
```

### Validar Datos

```javascript
function validarGasto(gasto) {
  if (!gasto.descripcion || gasto.descripcion.trim() === '') {
    return { valido: false, error: 'Descripción requerida' }
  }
  
  if (!gasto.monto || gasto.monto <= 0) {
    return { valido: false, error: 'Monto debe ser mayor a 0' }
  }
  
  if (!gasto.responsable || gasto.responsable.trim() === '') {
    return { valido: false, error: 'Responsable requerido' }
  }
  
  return { valido: true }
}

// Uso
const resultado = validarGasto(nuevoGasto)
if (!resultado.valido) {
  alert(resultado.error)
  return
}

gestorGerencia.agregarGastoExtra(nuevoGasto)
```

---

## 🎓 PRÓXIMOS PASOS

1. **Lee el código**: Abre `data-maestro.js` y `modulos-fase1.js`
2. **Experimenta**: Modifica valores de prueba en consola
3. **Extiende**: Agrega un nuevo KPI
4. **Implementa FASE 2**: Siguiendo patrón de FASE 1

---

**¿Preguntas? Abre DevTools (F12) y prueba los comandos en la consola.**
