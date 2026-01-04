# 🏗️ ERP CONSTRUCTORA G&H - ARQUITECTURA DE FASES

## 📋 ÍNDICE DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estructura JSON Maestro](#estructura-json-maestro)
3. [Fase 1: Datos de Gerencia](#fase-1-datos-de-gerencia)
4. [Fase 2: Gestión Documental](#fase-2-gestión-documental)
5. [Fase 3: Canales de Comunicación](#fase-3-canales-de-comunicación)
6. [Fase 4: UX Cliente](#fase-4-ux-cliente)
7. [Fase 5: UX Trabajador](#fase-5-ux-trabajador)
8. [Fase 6: Automatización](#fase-6-automatización)
9. [Guía de Implementación](#guía-de-implementación)

---

## 📊 RESUMEN EJECUTIVO

Este documento describe la arquitectura completa de un **ERP para gestión integral de proyectos de construcción**. El sistema está diseñado con **separación estricta de roles** y sigue principios de arquitectura **modular y escalable**.

### Roles del Sistema
- **Gerencia (Jefe)**: Acceso total a datos, decisiones financieras y operacionales
- **Trabajador**: Acceso a tareas, recursos y comunicación interna
- **Cliente**: Acceso a estado del proyecto y documentación autorizada

---

## 🗂️ ESTRUCTURA JSON MAESTRO

### Ubicación del Archivo
```
frontend/js/data-maestro.js
```

### Objeto Principal
```javascript
proyectoMaestro {
  id: "PROYECTO_001",
  nombre: "Casa Moderna - Proyecto Residencial",
  datosGerencia: { ... },           // FASE 1
  gestorDocumental: { ... },         // FASE 2
  comunicacion: { ... },             // FASE 3
  datosCliente: { ... },             // FASE 4
  datosEquipo: [ ... ],              // FASE 5
  configuracionExcel: { ... }        // FASE 6
}
```

---

## 💰 FASE 1: DATOS DE GERENCIA

### Descripción
Gestión integral de métricas financieras complejas, cronograma de proyecto y especificaciones técnicas.

### Componentes

#### 1.1 Métricas Financieras

**Estructura de Datos**
```javascript
financiero: {
  presupuestoInicial: {
    monto: 850000,          // USD
    moneda: "USD",
    fecha: "2024-06-01",
    descripcion: "Presupuesto aprobado"
  },
  
  gastosExtras: [
    {
      id: "GE-001",
      descripcion: "Cambio de especificación",
      monto: 15000,
      fecha: "2024-08-15",
      estado: "aprobado|pendiente_aprobacion|rechazado",
      responsable: "Jefe de Proyecto"
    }
  ],
  
  costoFinalEstimado: {
    monto: 887500,                    // presupuestoInicial + gastosExtras
    variacion: 37500,                 // monto extra
    porcentajeVariacion: 4.41,        // porcentaje del presupuesto inicial
    estado: "estimado|finalizado"
  },
  
  desgloseCostos: {
    materiales: {
      monto: 425000,
      porcentaje: 50,
      items: [ ... ]
    },
    manoDeObra: { ... },
    equipoMaquinaria: { ... },
    administracion: { ... }
  },
  
  pagosRealizados: {
    total: 487500,
    porcentajePagado: 57.36,
    historial: [ ... ]
  },
  
  saldoPendiente: {
    monto: 362500,
    porcentaje: 42.64,
    vencimiento: "2025-02-15"
  }
}
```

**Métodos del GestorGerencia**
```javascript
// Obtener resumen financiero completo
obtenerResumenFinanciero() → {
  presupuestoInicial,
  gastosExtrasAprobados,
  gastosExtrasPendientes,
  totalGastosExtras,
  costoFinal,
  variacionPorcentaje,
  pagosRealizados,
  porcentajePagado,
  saldoPendiente,
  fechaVencimiento
}

// Obtener desglose por categoría
obtenerDesgloseCostos() → array[{
  categoria,
  monto,
  porcentaje,
  porcentajeDelTotal,
  items
}]

// Registrar nuevo gasto extra
agregarGastoExtra(gasto) → {id, descripcion, monto, ...}

// Aprobar gasto pendiente
aprobarGastoExtra(idGasto) → gasto actualizado
```

#### 1.2 Cronograma y Fechas

**Estructura**
```javascript
cronograma: {
  fechaInicio: "2024-06-01",
  fechaTerminoEstimado: "2025-01-31",
  fechaTerminoReal: null,
  duracionPlanificada: 244,           // días
  
  hitos: [
    {
      id: "HITO_001",
      nombre: "Excavación y cimentación",
      fechaProgramada: "2024-07-15",
      fechaReal: "2024-07-18",
      estado: "completado|en_progreso|pendiente",
      avance: 100                      // 0-100%
    }
  ]
}
```

**Métodos**
```javascript
// Obtener cronograma completo con análisis
obtenerCronograma() → {
  fechas,
  diasTranscurridos,
  diasRestantes,
  avanceChronologico,
  hitos: [ ... ]
}

// Actualizar progreso de hito
actualizarProgresohito(idHito, avance) → hito

// Identificar retrasos
calcularRetrasoHito(hito) → días retrasos
```

#### 1.3 Especificaciones Técnicas

**Cubicación**
```javascript
cubicacion: {
  areaConstruida: 320,        // m²
  areaTerreno: 450,           // m²
  volumenesMateriales: {
    hormigon: 85,             // m³
    acero: 18,                // toneladas
    ladrillo: 45000,          // unidades
    madera: 2500              // p²
  }
}
```

**Metodología**
```javascript
metodologia: {
  sistema: "Construcción convencional con hormigón armado",
  normas: ["NCH 430", "NCH 2369", "INN-EM 2010"],
  enfoqueCalidad: "ISO 9001:2015",
  planISST: "Implementado según DS 594"
}
```

**Especificaciones Técnicas Detalladas**
```javascript
especificaciones: {
  estructura: { tipo, pisos, sotano, resistencia },
  envolvente: { fachada, ventanas, aislacion },
  coberturas: { techumbre, impermeabilizacion },
  interiores: { pisos, muros, cielos },
  sanitarios: { inodoros, lavamanos, duchas },
  instalaciones: { electricidad, agua, gas, climatizacion }
}
```

#### 1.4 KPIs y Alertas

**KPIs Calculados**
```javascript
obtenerKPIs() → {
  avanceFinanciero,           // % pagado
  variacionCostos,            // % variación
  saldoPendiente,             // monto
  avanceChronologico,         // % del tiempo transcurrido
  avanceHitos,                // % promedio de hitos
  diasRestantes,              // días hasta término
  riesgosIdentificados: [ ],
  alertas: [ ]
}
```

**Identificación de Riesgos**
- Variación de costos > 10% → **RIESGO ALTO**
- Retraso en hitos > 7 días → **RIESGO MEDIO**
- Gastos pendientes de aprobación → **RIESGO MEDIO**

**Alertas Operacionales**
- Vencimiento de pago < 30 días → **ALERTA ALTA**

---

## 📁 FASE 2: GESTIÓN DOCUMENTAL

### Descripción
Sistema simulado de gestión de archivos con validación de permisos según rol.

### Estructura

**Carpeta del Mandante** (visible para: gerencia, cliente)
```javascript
carpetaMandante: {
  nombre: "Documentación Mandante",
  permisos: ["gerencia", "cliente"],
  documentos: [ ... ],
  subcarpetas: [ ... ]
}
```

**Carpeta de Obra** (visible para: gerencia, trabajador)
```javascript
carpetaObra: {
  nombre: "Documentación de Obra",
  permisos: ["gerencia", "trabajador"],
  documentos: [ ... ],
  subcarpetas: [ ... ]
}
```

**Modelo de Documento**
```javascript
{
  id: "DOC_001",
  nombre: "Contrato de construcción",
  tipo: "PDF|XLSX|IMG|VIDEO",
  tamaño: "2.4 MB",
  fechaCarga: "2024-06-01",
  modificado: "2024-06-01",
  autor: "Gerencia",
  estado: "firmado|pendiente|rechazado"
}
```

### Métodos de Control

```javascript
validarPermisoDocumento(userType, carpeta) 
  → boolean (acceso permitido o denegado)

// Implementación en frontend
if (validarPermisoDocumento(user.role, 'carpetaObra')) {
  // Mostrar documentos
} else {
  // Ocultar contenedor
}
```

---

## 💬 FASE 3: CANALES DE COMUNICACIÓN

### Descripción
Sistema de chat dual e independiente para cliente y trabajadores, con vista unificada para gerencia.

### Estructura

**Chat Cliente-Gerencia**
```javascript
chatCliente: {
  id: "CHAT_CLIENT_001",
  participantes: [
    { id: "USER_001", nombre: "...", rol: "gerencia" }
  ],
  mensajes: [
    {
      id: "MSG_001",
      remitente: "USER_001",
      contenido: "Mensaje",
      fecha: "2024-10-15T10:30:00Z",
      leido: true
    }
  ],
  estado: "activo|pausado|cerrado"
}
```

**Chat Trabajadores-Gerencia**
```javascript
chatTrabajadores: {
  id: "CHAT_WORK_001",
  participantes: [ ... ],
  mensajes: [ ... ],
  estado: "activo"
}
```

**Validación de Aislamiento**
```javascript
// Los arrays de mensajes NUNCA se cruzan
chatCliente.mensajes.length === 0 || chatTrabajadores.mensajes.length === 0
  // Son independientes

// Vista de Gerencia con pestañas
<tab id="chat-cliente">...</tab>
<tab id="chat-trabajadores">...</tab>
```

---

## 🎨 FASE 4: UX CLIENTE - DASHBOARD GAMIFICADO

### Ubicación
```
frontend/dashboard-cliente.html
```

### Características

**Diseño Gamificado**
- Colores vivos y vibrantes
- Barras de progreso animadas
- Iconos grandes y atractivos
- Animaciones suaves

**Módulos Incluidos**

1. **Estado de Avance Visual**
   - Gráfico circular de progreso
   - Desglose por etapas
   - Hitos completados con badges

2. **Encuesta de Satisfacción**
   - Formulario interactivo
   - Preguntas sobre satisfacción
   - Rating visual con estrellas

3. **Buzón de Sugerencias**
   - Envío de comentarios
   - Estado de sugerencias anteriores
   - Respuestas de gerencia

4. **Galería del Proyecto**
   - Fotos antes y después
   - Galería de progreso
   - Timeline visual

### Estructura de Datos

```javascript
datosCliente: {
  id: "CLIENT_001",
  nombre: "María González",
  email: "maria@email.com",
  encuestaSatisfaccion: {
    respuestas: [ ... ],
    estado: "pendiente|completado"
  },
  buzónSugerencias: [
    {
      id: "SUG_001",
      titulo: "Mejorar acceso",
      descripcion: "...",
      fecha: "2024-10-10",
      estado: "recibido|en_proceso|resuelto"
    }
  ]
}
```

---

## 👷 FASE 5: UX TRABAJADOR - DASHBOARD OPERATIVO

### Ubicación
```
frontend/dashboard-trabajador.html
```

### Características

**Diseño Operativo y Claro**
- Información concisa
- Enfoque en tareas
- Acceso rápido a recursos

**Módulos**

1. **Mis Tareas**
   - Lista de tareas asignadas
   - Estados (pendiente, en progreso, completado)
   - Prioridades

2. **Mis Proyectos**
   - Proyectos asignados
   - Avance actual
   - Supervisor asignado

3. **Recursos de Apoyo**
   - Videos técnicos
   - Imágenes especificadas
   - Modales con contenido al hacer clic

4. **Reportes Diarios**
   - Horas trabajadas
   - Tareas completadas
   - Comentarios

### Estructura de Datos

```javascript
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
        titulo: "Excavación",
        descripcion: "...",
        estado: "completado|en_progreso|pendiente",
        fechaInicio: "2024-06-10",
        fechaTermino: "2024-07-18",
        avance: 100
      }
    ],
    recursosApoyo: [
      {
        id: "REC_001",
        tipo: "video|imagen|documento",
        titulo: "...",
        url: "...",
        duracion: 12  // minutos
      }
    ]
  }
]
```

---

## 📊 FASE 6: AUTOMATIZACIÓN - CARGA DE EXCEL

### Descripción
Permitir que gerencia cargue un archivo Excel estandarizado que pueble automáticamente los indicadores.

### Archivos Necesarios

1. **Plantilla Excel** (`templates/plantilla-erp.xlsx`)
   - Hojas: Presupuesto, Cronograma, Especificaciones
   - Encabezados estandarizados

2. **Librería SheetJS**
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"></script>
   ```

3. **Código de Importación**
   ```javascript
   function cargarExcel(file) {
     const reader = new FileReader();
     reader.onload = (e) => {
       const data = new Uint8Array(e.target.result);
       const workbook = XLSX.read(data, { type: 'array' });
       
       // Procesar hojas
       const presupuesto = XLSX.utils.sheet_to_json(workbook.Sheets['Presupuesto']);
       const cronograma = XLSX.utils.sheet_to_json(workbook.Sheets['Cronograma']);
       
       // Actualizar proyectoMaestro
       proyectoMaestro.datosGerencia.financiero = procesarPresupuesto(presupuesto);
       proyectoMaestro.datosGerencia.cronograma = procesarCronograma(cronograma);
       
       guardarProyecto();
     };
     reader.readAsArrayBuffer(file);
   }
   ```

### Campos Mapeados
- Presupuesto Inicial
- Gastos Extras
- Hitos
- Especificaciones
- Cronograma

---

## 🔧 GUÍA DE IMPLEMENTACIÓN

### Estructura de Carpetas

```
frontend/
├── index.html                    (Login)
├── panel-jefe.html              (Dashboard Gerencia - Fase 1)
├── dashboard-trabajador.html    (Dashboard Operativo - Fase 5)
├── dashboard-cliente.html       (Dashboard Gamificado - Fase 4)
├── js/
│   ├── data-maestro.js          (JSON Maestro + utilidades)
│   ├── modulos-fase1.js         (Clase GestorGerencia)
│   ├── modulos-fase2.js         (Gestor Documental) [PENDIENTE]
│   ├── modulos-fase3.js         (Gestor Comunicación) [PENDIENTE]
│   ├── modulos-fase4.js         (Módulos Cliente) [PENDIENTE]
│   ├── modulos-fase5.js         (Módulos Trabajador) [PENDIENTE]
│   └── modulos-fase6.js         (Automatización Excel) [PENDIENTE]
└── templates/
    └── plantilla-erp.xlsx       (Template para Fase 6)
```

### Integración en HTML

```html
<!-- En el <head> -->
<script src="js/data-maestro.js" defer></script>
<script src="js/modulos-fase1.js" defer></script>
<script src="js/modulos-fase2.js" defer></script>
<!-- ... etc -->

<!-- Uso en el <script> -->
<script>
  const gestor = new GestorGerencia();
  const kpis = gestor.obtenerKPIs();
  // Renderizar datos
</script>
```

### Validación de Roles

```javascript
function verificarAcceso(userRole, requerido) {
  const acceso = {
    'gerencia': ['gerencia', 'cliente', 'trabajador'],
    'cliente': ['cliente'],
    'trabajador': ['trabajador']
  };
  
  return acceso[userRole]?.includes(requerido) || false;
}

// Uso en HTML
if (verificarAcceso(user.role, 'carpetaObra')) {
  mostrarDocumentos();
}
```

### Persistencia de Datos

```javascript
// Guardar a localStorage
function guardarProyecto() {
  localStorage.setItem('proyectoMaestro', JSON.stringify(proyectoMaestro));
}

// Cargar desde localStorage
function cargarProyecto() {
  const datos = localStorage.getItem('proyectoMaestro');
  return datos ? JSON.parse(datos) : proyectoMaestro;
}
```

---

## 📱 RESPONSIVE DESIGN

Todos los dashboards utilizan **Tailwind CSS** con grid responsivo:

```
Mobile: 1 columna
Tablet: 2 columnas (md:)
Desktop: 3-4 columnas (lg:)
```

---

## 🔐 SEGURIDAD

- ✅ Validación de roles en frontend
- ✅ localStorage para sesión
- ✅ Tokens simulados (auth_token)
- ⚠️ **Nota**: En producción, implementar backend con JWT

---

## 📈 PRÓXIMAS FASES

| Fase | Nombre | Estado | Prioridad |
|------|--------|--------|-----------|
| 1 | Datos de Gerencia | ✅ COMPLETADA | Alta |
| 2 | Gestión Documental | ⏳ PENDIENTE | Alta |
| 3 | Comunicación | ⏳ PENDIENTE | Media |
| 4 | UX Cliente | ⏳ PENDIENTE | Media |
| 5 | UX Trabajador | ⏳ PENDIENTE | Media |
| 6 | Automatización Excel | ⏳ PENDIENTE | Baja |

---

## 📞 SOPORTE

Para consultas sobre la arquitectura:
- Revisar `data-maestro.js` para estructura JSON
- Revisar `modulos-fase1.js` para métodos de gerencia
- Consultar comentarios en código (// ========== SECCIÓN)

---

**Última actualización**: 30 de Diciembre de 2024  
**Versión**: 1.0.0  
**Arquitecto**: Senior Full Stack Developer
