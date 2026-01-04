# 🚀 QUICK START - ERP CONSTRUCTORA G&H

## ⚡ INICIO RÁPIDO (2 minutos)

### 1️⃣ Iniciar el Servidor
```powershell
cd c:\Users\Alicia_Piero\Documents\Repo_AIEP\ERP_Costructora\frontend
python -m http.server 5174
```

### 2️⃣ Acceder a la Aplicación
```
http://localhost:5174
```

### 3️⃣ Credenciales de Prueba

#### Admin (Panel Gerencia - FASE 1)
```
Usuario: admin@constructora.com
Contraseña: admin123
Rol: Jefe de Proyecto
```

#### Trabajador
```
Usuario: trabajador@constructora.com
Contraseña: admin123
Rol: Trabajador
```

#### Cliente
```
Usuario: cliente@constructora.com
Contraseña: admin123
Rol: Cliente
```

---

## 📱 FUNCIONALIDADES PRINCIPALES

### 🏢 Panel de Administración (Gerencia)
**URL**: `http://localhost:5174/panel-jefe.html` (Automático tras login)

**Secciones**:
- ✅ **KPIs Principales**: Avance (72%), Variación (+4.41%), Saldo ($362.5K), Plazo (48 días)
- ✅ **Gestión Financiera**: Presupuesto, Gastos, Pagos, Saldo
- ✅ **Cronograma**: Hitos, Fechas, Avance
- ✅ **Especificaciones**: Cubicación, Responsables
- ✅ **Alertas**: Riesgos identificados automáticamente

### 👷 Dashboard Trabajador
**URL**: `http://localhost:5174/dashboard-trabajador.html`

**Secciones**:
- Mis Proyectos (4 activos)
- Tareas Diarias (8 pendientes)
- Mi Avance (92% desempeño)
- Documentos
- Mensajes
- Herramientas

### 👤 Portal Cliente
**URL**: `http://localhost:5174/dashboard-cliente.html`

**Secciones**:
- Estado del Proyecto (72% completado)
- Reportes Mensuales (12 disponibles)
- Galería (156 fotos)
- Presupuesto ($850K)
- Cronograma
- Contacto

---

## 📊 DATOS DEL PROYECTO

### Información General
```javascript
Nombre: Casa Moderna - Proyecto Residencial
Ubicación: Nueva Providencia, Santiago
Estado: En Progreso (72% avance)
Duración: 244 días (Junio 2024 - Enero 2025)
```

### Financiero
```javascript
Presupuesto Inicial:    $850,000 USD
Gastos Extras:          $37,500 USD (+4.41%)
Costo Final Estimado:   $887,500 USD
Pagado:                 $487,500 USD (57.36%)
Saldo Pendiente:        $362,500 USD (Vence 15 Feb 2025)
```

### Cronograma
```javascript
Inicio:                 1 Junio 2024
Término Estimado:       31 Enero 2025
Avance Cronológico:     75%
Días Restantes:         48
```

### Hitos
```javascript
1. Excavación y cimentación        ✅ 100% Completado
2. Estructura y hormigonado         ⏳ 72% En Progreso
3. Instalaciones                    ⏹️ 0% Pendiente
4. Terminaciones y limpieza         ⏹️ 0% Pendiente
```

---

## 🔧 CÓMO UTILIZAR LA PLATAFORMA

### Acción 1: Ver KPIs de Proyecto

1. Ingresar como Admin
2. Panel se carga automáticamente
3. Observar tarjetas de KPIs en la parte superior
4. Los valores se actualizan automáticamente

### Acción 2: Revisar Estado Financiero

1. En el panel, desplazarse a "Gestión Financiera"
2. Por defecto está activa la pestaña "Resumen"
3. Click en "Desglose" para ver costos por categoría
4. Click en "Historial Pagos" para ver cuotas

### Acción 3: Monitorear Cronograma

1. Desplazarse a "Cronograma y Hitos"
2. Ver fechas clave en tarjetas
3. Revisar estado de cada hito
4. Sistema identifica retrasos automáticamente

### Acción 4: Identificar Riesgos

1. Scroll hasta "Alertas y Riesgos"
2. Sistema genera alertas automáticamente basado en:
   - Variación de costos > 10%
   - Retraso en hitos > 7 días
   - Gastos pendientes de aprobación
   - Vencimiento próximo de pagos

---

## 💻 CONSOLA JAVASCRIPT (Debugging)

Abre **F12** en el navegador y prueba estos comandos:

### Ver todos los KPIs
```javascript
console.log(gestorGerencia.obtenerKPIs());
```

### Ver resumen financiero
```javascript
console.log(gestorGerencia.obtenerResumenFinanciero());
```

### Ver cronograma
```javascript
console.log(gestorGerencia.obtenerCronograma());
```

### Ver todos los hitos
```javascript
console.log(gestorGerencia.obtenerHitos());
```

### Generar reporte completo
```javascript
console.log(gestorGerencia.generarReporte());
```

### Agregar gasto extra
```javascript
gestorGerencia.agregarGastoExtra({
  descripcion: "Nuevas especificaciones de vidrio",
  monto: 9500,
  responsable: "Supervisor"
});
```

### Actualizar avance de hito
```javascript
gestorGerencia.actualizarProgresohito('HITO_002', 85);
```

### Ver riesgos identificados
```javascript
console.log(gestorGerencia.identificarRiesgos());
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
frontend/
├── index.html                    ← Página de Login
├── panel-jefe.html              ← Panel Gerencia (FASE 1) ✅
├── dashboard-trabajador.html    ← Panel Trabajador
├── dashboard-cliente.html       ← Panel Cliente
│
├── js/
│   ├── data-maestro.js          ← Estructura JSON + Utilidades ✅
│   ├── modulos-fase1.js         ← Clase GestorGerencia ✅
│   └── modulos-fase[2-6].js     ← Próximas fases
│
└── ARQUITECTURA_FASES.md        ← Documentación técnica
```

---

## 🎯 DATOS DISPONIBLES EN LOCAL STORAGE

Los datos se guardan automáticamente. Para verificar:

**En Consola (F12)**:
```javascript
// Ver datos guardados
JSON.parse(localStorage.getItem('proyectoMaestro'))

// Ver usuario actual
JSON.parse(localStorage.getItem('auth_user'))

// Ver token de sesión
localStorage.getItem('auth_token')
```

---

## 🔄 CICLO DE VIDA DE UN PROYECTO

### 1. Crear/Cargar Proyecto
```javascript
// Cargar datos desde localStorage
const proyecto = cargarProyecto();

// Crear gestor
const gestor = new GestorGerencia(proyecto);
```

### 2. Monitorear Métricas
```javascript
// KPIs se actualizan automáticamente
const kpis = gestor.obtenerKPIs();
document.getElementById('kpiAvance').textContent = kpis.avanceHitos + '%';
```

### 3. Registrar Cambios
```javascript
// Agregar gasto
gestor.agregarGastoExtra({...});

// Actualizar hito
gestor.actualizarProgresohito('HITO_002', 80);

// Se guarda automáticamente
gestor.guardar();
```

### 4. Generar Reportes
```javascript
// Exportar datos completos
const reporte = gestor.generarReporte();
```

---

## ⚠️ TROUBLESHOOTING

### Problema: El servidor no inicia
```powershell
# Solución: Cambiar puerto
python -m http.server 5175
```

### Problema: localStorage vacío
```javascript
// Solución: Recargar datos de ejemplo
window.location.reload();
```

### Problema: Datos no se actualizan
```javascript
// Solución: Guardar cambios
gestorGerencia.guardar();
// Refrescar
window.location.reload();
```

### Problema: CSS no se carga (Tailwind)
```html
<!-- Verificar en <head> -->
<script src="https://cdn.tailwindcss.com"></script>
```

---

## 📊 ESTADÍSTICAS DEL PROYECTO

| Métrica | Valor |
|---------|-------|
| **Avance General** | 72% |
| **Variación Costos** | +4.41% |
| **Saldo Pendiente** | $362.5K |
| **Días Restantes** | 48 |
| **Hitos Completados** | 1/4 |
| **Satisfacción Cliente** | 85% (simulado) |
| **Empleados** | 47 |
| **Documentos** | 50+ |

---

## 🎓 PRÓXIMAS TAREAS

```
☐ FASE 2: Gestión Documental
  ├─ Crear módulo de carga de archivos
  ├─ Validar permisos por rol
  └─ Mostrar carpetas separadas

☐ FASE 3: Sistema de Chat
  ├─ Chat Cliente-Gerencia
  ├─ Chat Trabajador-Gerencia
  └─ Vista unificada para Jefe

☐ FASE 4: Gamificación Cliente
  ├─ Encuesta de satisfacción
  ├─ Buzón de sugerencias
  └─ Progreso visual interactivo

☐ FASE 5: Dashboard Trabajador
  ├─ Tareas con prioridades
  ├─ Recursos multimedia
  └─ Reportes diarios

☐ FASE 6: Excel Automático
  ├─ Crear plantilla XLSX
  ├─ Integrar SheetJS
  └─ Importar datos automáticamente
```

---

## 📞 SOPORTE RÁPIDO

**¿Cómo veo el avance del proyecto?**  
→ Ve al panel Jefe → Observa la primera tarjeta "Avance General"

**¿Cómo agrego un gasto extra?**  
→ Abre consola (F12) → Usa `gestorGerencia.agregarGastoExtra({...})`

**¿Cómo cambio de usuario?**  
→ Haz click en "Salir" → Ingresa con otra credencial

**¿Los datos se pierden al cerrar?**  
→ No, se guardan en localStorage automáticamente

**¿Cómo veo los datos en JSON?**  
→ Consola (F12) → `console.log(gestorGerencia.generarReporte())`

---

## 🎉 ¡LISTO PARA USAR!

```
1. Servidor corriendo en puerto 5174 ✅
2. Bases de datos inicializadas ✅
3. Componentes renderizados ✅
4. Sistema de roles activo ✅
5. Datos de ejemplo cargados ✅

👉 ¡Accede a http://localhost:5174 y comienza!
```

---

**Versión**: 1.0.0  
**Última actualización**: 30 de Diciembre de 2024  
**Estado**: ✅ OPERACIONAL - FASE 1 COMPLETA
