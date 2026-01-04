# 🗺️ MAPA DE NAVEGACIÓN - ERP CONSTRUCTORA

> **Última actualización**: 30 de Diciembre de 2024  
> **Versión**: 1.0.0  
> **Estado**: ✅ COMPLETO

---

## 🧭 ENCUENTRE LO QUE BUSCA

### 🚀 "Quiero empezar AHORA (2 minutos)"
👉 **Ir a**: [QUICK_START.md](QUICK_START.md)
- Instrucciones paso a paso
- Credenciales de prueba
- Primeros comandos de consola
- Solución rápida de problemas

---

### 📊 "Quiero entender la arquitectura"
👉 **Ir a**: [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)
- Arquitectura en capas visual
- Flujo de datos
- Matriz de funcionalidades
- Paleta de colores
- Roadmap de 6 fases

**Complementario**:
- [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md) - Detalles técnicos de cada fase

---

### 👨‍💻 "Soy desarrollador y quiero extender el código"
👉 **Ir a**: [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)
- Explicación de capas
- Estructura de archivos
- Patrones implementados
- Cómo agregar nuevas funcionalidades
- Debugging guide
- Performance tips
- Ejemplos de código

**Complementario**:
- Abre la consola (F12) e inspecciona el código
- Revisa `js/data-maestro.js` para entender datos
- Revisa `js/modulos-fase1.js` para entender lógica

---

### 📈 "Quiero saber qué está completado"
👉 **Ir a**: [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md)
- Status actual detallado
- Checklist de funcionalidades
- Métricas finales
- Próximos hitos
- Validación completada

**Complementario**:
- [RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md) - Estado previo a finalización
- [INDICE_MAESTRO.md](INDICE_MAESTRO.md) - Índice completo del proyecto

---

### 🎯 "Necesito un resumen ejecutivo"
👉 **Ir a**: [INDICE_MAESTRO.md](INDICE_MAESTRO.md)
- Tabla de contenidos completa
- Estructura de archivos
- Métricas del proyecto
- Links a toda la documentación
- Guía de 5 minutos para cada rol

---

### 🔧 "Quiero implementar FASE 2"
👉 **Ir a**: [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md) sección "FASE 2"
- Especificación completa
- Estructura JSON
- Métodos necesarios
- Interfaz sugerida
- Ejemplos de código

**Pasos**:
1. Lee sección FASE 2 en [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md)
2. Crea `js/modulos-fase2.js` siguiendo patrón de FASE 1
3. Lee [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) sección "Cómo Extender"
4. Implementa métodos
5. Crea interfaz en nuevo HTML o agrégalo a panel existente

---

### ❌ "Tengo un problema"
👉 **Ir a**: [QUICK_START.md](QUICK_START.md) sección "Troubleshooting"

**Problemas comunes**:
- Página no carga → Reinicia servidor
- Login no funciona → Limpia localStorage
- Datos no se guardan → Verifica localStorage
- Estilos rotos → Recarga sin caché (Ctrl+Shift+R)

**Para problemas técnicos**:
- Abre DevTools (F12)
- Revisa consola
- Consulta [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) sección "Debugging"

---

### 💼 "Soy gerente/stakeholder"
👉 **Ir a**: [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md)
- Resumen ejecutivo
- Entregables completados
- Métricas alcanzadas
- ROI del proyecto
- Próximos hitos

**Para presentaciones**:
- Usa [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) como visual
- Comparte [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md) como reporte

---

### 📚 "Quiero entender los datos de prueba"
👉 **Ir a**: [RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md)
- Proyecto ejemplo: Casa Moderna
- Valores de prueba explicados
- Desglose financiero
- Cronograma completo
- Especificaciones técnicas

---

### 🎓 "Quiero aprender el código desde cero"
**Ruta de aprendizaje**:
1. Leer [QUICK_START.md](QUICK_START.md) (2 min)
2. Ejecutar y explorar en navegador (5 min)
3. Abrир DevTools y ejecutar comandos (5 min)
4. Leer [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) (30 min)
5. Revisar código en `js/data-maestro.js` (10 min)
6. Revisar código en `js/modulos-fase1.js` (15 min)
7. Intentar agregar una métrica propia (30 min)

**Total**: ~1.5 horas

---

### 🌍 "Quiero ver la estructura completa del proyecto"
👉 **Ir a**: [INDICE_MAESTRO.md](INDICE_MAESTRO.md) sección "Estructura de archivos"
O ejecutar en terminal:
```bash
tree /A  # Windows
tree -L 3  # Linux/Mac
```

---

## 📁 ARCHIVOS DEL PROYECTO

### Código (Carpeta: `js/`)

| Archivo | Líneas | Contenido | Lee si... |
|---------|--------|----------|-----------|
| `data-maestro.js` | 650 | Datos maestros + utilidades | Quieres entender la estructura |
| `modulos-fase1.js` | 600 | Lógica de gerencia (25+ métodos) | Quieres entender los cálculos |

### HTML (Raíz: `frontend/`)

| Archivo | Propósito | Accede desde |
|---------|-----------|--------------|
| `index.html` | Login | Inicio del sitio |
| `panel-jefe.html` | Dashboard gerencia | admin@constructora.com |
| `dashboard-trabajador.html` | Dashboard trabajador | trabajador@... |
| `dashboard-cliente.html` | Dashboard cliente | cliente@... |

### Documentación (Raíz: `frontend/`)

| Archivo | Líneas | Audiencia | Leer primero |
|---------|--------|-----------|-------------|
| `QUICK_START.md` | 250 | Todos | ✅ SÍ |
| `DIAGRAMA_ARQUITECTURA.md` | 400 | Arquitectos | 📊 Segunda |
| `INDICE_MAESTRO.md` | 300 | Administradores | 📚 Referencia |
| `RESUMEN_FASE1_FINAL.md` | 350 | Ejecutivos | 📈 Status |
| `ARQUITECTURA_FASES.md` | 500 | Desarrolladores | 🔧 Implementación |
| `GUIA_DESARROLLADOR.md` | 400 | Programadores | 👨‍💻 Extensión |
| `RESUMEN_IMPLEMENTACION.md` | 300 | Stakeholders | 📋 Detalles |
| `MAPA_NAVEGACION.md` | Este | Todos | 🗺️ Orientación |

---

## 🔄 FLUJOS TÍPICOS

### Flujo 1: Usuario Nuevo (5 minutos)
```
1. Abre http://localhost:5174
   ↓
2. Lee [QUICK_START.md](QUICK_START.md)
   ↓
3. Ingresa credenciales (admin@constructora.com / admin123)
   ↓
4. Explora dashboard
   ↓
5. Abre consola (F12) y prueba comandos
   ↓
✅ Completado
```

### Flujo 2: Desarrollador Nuevo (1 hora)
```
1. Lee [QUICK_START.md](QUICK_START.md)
   ↓
2. Prueba en navegador
   ↓
3. Lee [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)
   ↓
4. Lee [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)
   ↓
5. Revisa código en `js/data-maestro.js`
   ↓
6. Revisa código en `js/modulos-fase1.js`
   ↓
7. Intenta agregar una funcionalidad
   ↓
✅ Listo para desarrollar
```

### Flujo 3: Implementar FASE 2 (4 horas)
```
1. Lee FASE 2 en [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md)
   ↓
2. Lee sección "Cómo Extender" en [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)
   ↓
3. Crea `js/modulos-fase2.js`
   ↓
4. Implementa clase GestorDocumental (8 métodos)
   ↓
5. Crea `panel-documentos.html` o agrega a panel existente
   ↓
6. Integra en index del proyecto
   ↓
7. Prueba en navegador
   ↓
✅ FASE 2 completada
```

### Flujo 4: Presentar a Ejecutivos (20 minutos)
```
1. Abre dashboard en navegador
   ↓
2. Comparte pantalla mostrando:
   - KPIs en tiempo real
   - Financiero (resumen, desglose, pagos)
   - Cronograma con hitos
   - Sistema de alertas
   ↓
3. Abre [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) en otra pestaña
   ↓
4. Comparte [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md) como documento
   ↓
5. Responde preguntas usando [INDICE_MAESTRO.md](INDICE_MAESTRO.md)
   ↓
✅ Presentación completada
```

---

## 🎯 POR OBJETIVO

### Objetivo: Usar el Sistema
1. [QUICK_START.md](QUICK_START.md) (2 min)
2. Ingresar credenciales
3. Explorar dashboard
4. Consultar problemas en Troubleshooting

### Objetivo: Entender la Arquitectura
1. [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) (10 min)
2. [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md) (20 min)
3. Revisar código
4. Abrir DevTools y explorar

### Objetivo: Desarrollar / Extender
1. [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) (30 min)
2. Revisar `js/data-maestro.js` (10 min)
3. Revisar `js/modulos-fase1.js` (15 min)
4. Intentar agregar funcionalidad
5. Consultar patrones en sección "Cómo Extender"

### Objetivo: Implementar FASE 2
1. [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md) sección "FASE 2" (15 min)
2. [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) sección "Crear Nueva Fase" (10 min)
3. Crear estructura de archivos
4. Implementar métodos
5. Crear interfaz
6. Integrar y probar

### Objetivo: Reportar a Directivos
1. [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md) (5 min)
2. [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) (10 min)
3. Dashboard en vivo
4. Preparar presentación
5. Responder preguntas técnicas

---

## 📞 REFERENCIAS CRUZADAS

### Palabras Clave → Documentos

| Palabra Clave | Documento |
|---------------|-----------|
| KPI | [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) - Flujo KPIs |
| Cronograma | [RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md) - Datos prueba |
| Financiero | [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md) - FASE 1 |
| Riesgos | [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) - Sistema de Alertas |
| localStorage | [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) - Persistencia |
| Responsive | [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) - Breakpoints |
| GestorGerencia | [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) - Capa Lógica |
| proyectoMaestro | [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) - Estructura Datos |
| Login | [QUICK_START.md](QUICK_START.md) - Credenciales |
| Troubleshooting | [QUICK_START.md](QUICK_START.md) - Problemas |

---

## 🗂️ BÚSQUEDA POR TIPO DE CONTENIDO

### Código
- Estructura JSON: `js/data-maestro.js`
- Métodos: `js/modulos-fase1.js`
- HTML: `panel-jefe.html`, `dashboard-*.html`

### Visual
- Diagramas: [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)
- Flujos: [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)
- Matrices: [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)

### Conceptual
- Arquitectura: [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md)
- Patrones: [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)
- Especificaciones: [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md)

### Práctico
- Cómo usar: [QUICK_START.md](QUICK_START.md)
- Cómo extender: [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)
- Cómo arreglar: [QUICK_START.md](QUICK_START.md) - Troubleshooting

### Administrativo
- Status: [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md)
- Índice: [INDICE_MAESTRO.md](INDICE_MAESTRO.md)
- Datos: [RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md)

---

## ⏱️ TIEMPO DE LECTURA ESTIMADO

| Documento | Lectura Rápida | Lectura Completa |
|-----------|---|---|
| [QUICK_START.md](QUICK_START.md) | 2 min | 5 min |
| [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md) | 5 min | 15 min |
| [INDICE_MAESTRO.md](INDICE_MAESTRO.md) | 5 min | 15 min |
| [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md) | 5 min | 10 min |
| [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md) | 10 min | 25 min |
| [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) | 10 min | 30 min |
| [RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md) | 5 min | 12 min |
| **TOTAL** | **42 min** | **112 min** |

---

## 🔍 BÚSQUEDA RÁPIDA

Presiona `Ctrl+F` en cualquier documento y busca:

- `✅` → Tareas completadas
- `⏳` → Tareas pendientes
- `❌` → Tareas no completadas
- `código` → Ejemplos de código
- `método` → Métodos disponibles
- `FASE 1` → Sección específica de fase
- `clase` → Definiciones de clase
- `flow` / `flujo` → Diagramas de flujo

---

## 📱 PARA DISPOSITIVOS MÓVILES

Si estás leyendo desde celular:

1. **QUICK_START.md** - Abre en primer lugar
2. Ignora diagramas ASCII complejos
3. Usa Ctrl+F para buscar contenido
4. Lee documentos cortos primero
5. Consulta documentación en desktop para código

---

## 💾 DESCARGAR DOCUMENTACIÓN

**Para descargar todo como PDF o imprimir**:
1. Abre cada documento .md
2. Ctrl+P para imprimir
3. Elige "Guardar como PDF"
4. Organiza en carpeta

**Total documentación**: 2,150 líneas (≈ 30 páginas)

---

## 🎓 PROGRAMA DE APRENDIZAJE RECOMENDADO

### Semana 1: Fundamentos
- Día 1-2: Lee [QUICK_START.md](QUICK_START.md) + prueba sistema
- Día 3-4: Lee [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)
- Día 5: Lee [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md)

### Semana 2: Técnico
- Día 1-2: Lee [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md)
- Día 3-5: Lee [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md) + experimenta

### Semana 3: Implementación
- Día 1-4: Implementa una funcionalidad nueva
- Día 5: Código review + documentación

---

## ✨ NOTAS IMPORTANTES

1. **Guarda estos documentos**: Son tu referencia permanente
2. **Comparte QUICK_START.md primero**: Para onboarding de nuevos usuarios
3. **Actualiza DIAGRAMA_ARQUITECTURA.md**: Cuando agregues nuevas fases
4. **Mantén INDICE_MAESTRO.md actualizado**: Es tu tabla de contenidos
5. **Usa GUIA_DESARROLLADOR.md como template**: Para desarrolladores nuevos

---

## 🚀 SIGUIENTE PASO

¿Sabes qué quieres hacer?

- [ ] **Usar el sistema** → [QUICK_START.md](QUICK_START.md)
- [ ] **Entender la arquitectura** → [DIAGRAMA_ARQUITECTURA.md](DIAGRAMA_ARQUITECTURA.md)
- [ ] **Desarrollar/Extender** → [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)
- [ ] **Implementar FASE 2** → [ARQUITECTURA_FASES.md](ARQUITECTURA_FASES.md)
- [ ] **Ver status** → [RESUMEN_FASE1_FINAL.md](RESUMEN_FASE1_FINAL.md)
- [ ] **Encontrar algo específico** → Usa Ctrl+F en este documento

---

**¡Listo para comenzar!** 🎉

Selecciona uno de los links arriba y comienza ahora.

---

*Última actualización: 30 de Diciembre de 2024*  
*Versión: 1.0.0*  
*Estado: ✅ COMPLETO*
