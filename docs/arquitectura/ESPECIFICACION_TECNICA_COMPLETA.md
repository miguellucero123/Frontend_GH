# 🏗️ ERP Constructora - Especificación Técnica Completa

## Fecha: 23 de Diciembre 2025

---

## 📋 RESUMEN EJECUTIVO

Sistema de gestión de proyectos tipo **Intranet** para constructora, con gestión de usuarios por roles, carpetas de proyectos, gestión documental y sistema de chat integrado.

---

## 👥 TIPOS DE USUARIO

### 1. **JEFE (Administrador)**
- ✅ Acceso total al sistema
- ✅ Crear/editar/eliminar proyectos
- ✅ Aprobar usuarios nuevos
- ✅ Gestionar permisos de archivos
- ✅ Ver todos los chats (trabajadores y clientes)
- ✅ Subir/eliminar archivos en cualquier proyecto
- ✅ Crear subcarpetas
- ✅ Asignar usuarios a proyectos

### 2. **TRABAJADOR**
- ⚠️ Acceso parcial (solo proyectos asignados)
- ✅ Ver información del proyecto asignado (a-d)
- ✅ Ver archivos permitidos por el jefe
- ✅ Chat directo con el jefe
- ✅ Subir archivos (si tiene permiso)
- ❌ No puede ver otros proyectos
- ❌ No puede aprobar usuarios

### 3. **CLIENTE**
- ⚠️ Acceso parcial (solo su proyecto)
- ✅ Ver información de su proyecto (a-d)
- ✅ Ver archivos permitidos por el jefe
- ✅ Chat directo con el jefe
- ✅ Subir documentos (si tiene permiso)
- ❌ No puede ver costos (h-k)
- ❌ No puede ver otros proyectos

---

## 📄 PÁGINAS E INTERFACES

### **P1 - LOGIN**

#### I1: Pantalla de Inicio de Sesión
```
┌─────────────────────────────────────┐
│                                     │
│         [LOGO EMPRESA]              │
│          (Grande)                   │
│                                     │
│    ┌─────────────────────────┐     │
│    │  Email/Usuario          │     │
│    └─────────────────────────┘     │
│    ┌─────────────────────────┐     │
│    │  Contraseña             │     │
│    └─────────────────────────┘     │
│                                     │
│    [ Iniciar Sesión ]               │
│                                     │
│    ¿No tienes cuenta? Solicitar     │
│                                     │
└─────────────────────────────────────┘
```

**Funcionalidad:**
- Reconoce automáticamente el tipo de usuario
- Redirige según rol:
  - Jefe → Dashboard completo (I2.2)
  - Trabajador/Cliente → Vista de proyecto (I2.1)
- Solicitud de cuenta con aprobación del jefe

---

### **P2 - DASHBOARD**

#### I2.1: Vista TRABAJADOR/CLIENTE

```
┌─────────────────────────────────────────────────┐
│  [Logo]  PROYECTO: Torre Residencial ABC        │
│  ───────────────────────────────────────────    │
│                                                  │
│  📋 INFORMACIÓN DEL PROYECTO                     │
│  ├─ Mandante: Juan Pérez                        │
│  ├─ Dirección: Av. Principal 123                │
│  ├─ Ciudad: Santiago                            │
│  └─ Descripción: Edificio residencial...        │
│                                                  │
│  📁 ARCHIVOS PERMITIDOS                          │
│  ┌──────────────────────────────────┐           │
│  │ 📄 Plano Arquitectónico.pdf      │           │
│  │ 📊 Cronograma.xlsx               │           │
│  │ 🖼️ Render_Fachada.jpg            │           │
│  └──────────────────────────────────┘           │
│                                                  │
│  💬 CHAT CON JEFE                                │
│  ┌──────────────────────────────────┐           │
│  │ Jefe: ¿Cómo va el avance?       │ 10:30     │
│  │ Tú: Todo según cronograma        │ 10:35     │
│  │ ─────────────────────────────    │           │
│  │ [Escribe un mensaje...]          │           │
│  └──────────────────────────────────┘           │
└─────────────────────────────────────────────────┘
```

**Características:**
- Solo ve SU proyecto asignado
- Archivos filtrados por permisos
- Chat 1:1 con el jefe
- No ve información financiera (costos)

---

#### I2.2: Vista JEFE (Administrador)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  PANEL DE ADMINISTRACIÓN                            │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  📁 PROYECTOS ACTIVOS (5)                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 📂 Torre Residencial ABC                           │     │
│  │    ├─ 📂 Planos                                    │     │
│  │    ├─ 📂 Presupuestos                              │     │
│  │    └─ 📂 Fotos de Avance                           │     │
│  │                                                     │     │
│  │ 📂 Edificio Comercial XYZ                          │     │
│  │ 📂 Casa Habitación Los Pinos                       │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  💬 CHATS                                                    │
│  ┌─────────────────────┬─────────────────────┐             │
│  │ CLIENTES (3)        │ TRABAJADORES (12)   │             │
│  ├─────────────────────┼─────────────────────┤             │
│  │ 🔴 Juan Pérez       │ 🟢 Carlos Mendoza   │             │
│  │    Torre ABC        │    Torre ABC        │             │
│  │    "¿Cuándo..."     │    "Avance 80%"     │             │
│  │                     │                     │             │
│  │ 🟢 María González   │ 🟡 Pedro Ramírez    │             │
│  │    Edificio XYZ     │    Casa Pinos       │             │
│  └─────────────────────┴─────────────────────┘             │
│                                                              │
│  [+ Nuevo Proyecto]  [👥 Aprobar Usuarios (2)]              │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Ve TODOS los proyectos
- Gestión de carpetas y subcarpetas
- Dos paneles de chat separados:
  - Chat con clientes (por proyecto)
  - Chat con trabajadores (por proyecto)
- Indicadores de mensajes no leídos
- Acceso a toda la información financiera

---

## 📁 ESTRUCTURA DE CARPETA DE PROYECTO

### Datos Obligatorios:

```typescript
interface Proyecto {
  // Información Básica (visible para todos)
  a_nombreMandante: string;
  b_direccion: string;
  c_ciudad: string;
  d_descripcion: string;
  e_fechaInicio: Date;
  f_fechaTerminoEstimado: Date;
  
  // Información Financiera (solo JEFE)
  g_fechaTerminoReal?: Date;
  h_costoInicial: number;
  i_costosAdicionales: number;
  j_costosExtras: number;
  k_costoFinal: number;
  
  // Gestión
  carpetas: Carpeta[];
  archivos: Archivo[];
  usuariosAsignados: Usuario[];
}
```

### Subcarpetas:
```
Proyecto Torre ABC/
├── 📂 Planos/
│   ├── 📄 Arquitectura.dwg
│   └── 📄 Estructural.dwg
├── 📂 Presupuestos/
│   ├── 📊 Inicial.xlsx
│   └── 📊 Actualizado.xlsx
├── 📂 Fotos de Avance/
│   ├── 🖼️ Semana_01.jpg
│   └── 🖼️ Semana_02.jpg
└── 📂 Documentos Legales/
    └── 📄 Contrato.pdf
```

---

## 📎 TIPOS DE ARCHIVOS SOPORTADOS

### Documentos:
- ✅ Microsoft Office (.docx, .xlsx, .pptx)
- ✅ PDF (.pdf)
- ✅ Texto plano (.txt)

### Diseño:
- ✅ AutoCAD (.dwg, .dxf)
- ✅ Imágenes (.jpg, .jpeg, .png, .gif, .bmp)

### Multimedia:
- ✅ Videos (.mp4, .avi, .mov, .wmv)
- ✅ Audio (.mp3, .wav)

### Comprimidos:
- ✅ Archivos ZIP (.zip, .rar)

**Límite de tamaño:** 100 MB por archivo

---

## 💬 SISTEMA DE CHAT

### Características:

1. **Canales Separados:**
   - Canal Jefe ↔ Cliente (por proyecto)
   - Canal Jefe ↔ Trabajador (por proyecto)
   - Los canales NO se mezclan

2. **Funcionalidades:**
   - ✅ Mensajes en tiempo real (WebSocket)
   - ✅ Historial completo
   - ✅ Indicador de mensajes no leídos
   - ✅ Timestamp de cada mensaje
   - ✅ Notificaciones push
   - ✅ Adjuntar archivos en chat
   - ✅ Búsqueda de mensajes

---

## 🔐 SISTEMA DE PERMISOS

### Matriz de Permisos:

| Acción | Jefe | Trabajador | Cliente |
|--------|------|------------|---------|
| Ver todos los proyectos | ✅ | ❌ | ❌ |
| Ver su proyecto | ✅ | ✅ | ✅ |
| Ver costos (h-k) | ✅ | ❌ | ❌ |
| Crear proyecto | ✅ | ❌ | ❌ |
| Editar proyecto | ✅ | ⚠️ | ❌ |
| Eliminar proyecto | ✅ | ❌ | ❌ |
| Subir archivos | ✅ | ⚠️ | ⚠️ |
| Eliminar archivos | ✅ | ❌ | ❌ |
| Ver archivos | ✅ | ⚠️ | ⚠️ |
| Crear subcarpetas | ✅ | ❌ | ❌ |
| Aprobar usuarios | ✅ | ❌ | ❌ |
| Chat con jefe | ✅ | ✅ | ✅ |
| Ver otros chats | ✅ | ❌ | ❌ |

⚠️ = Según permisos asignados por el jefe

---

## 📊 PLAN DE IMPLEMENTACIÓN POR FASES

### **FASE 1: Autenticación y Roles** (2 semanas)
- [ ] Sistema de login mejorado
- [ ] Registro de usuarios con aprobación
- [ ] Gestión de roles (jefe, trabajador, cliente)
- [ ] Middleware de permisos
- [ ] Dashboard diferenciado por rol

### **FASE 2: Gestión de Proyectos** (3 semanas)
- [ ] CRUD completo de proyectos
- [ ] Formulario con todos los campos (a-k)
- [ ] Sistema de carpetas y subcarpetas
- [ ] Asignación de usuarios a proyectos
- [ ] Vista de proyecto para trabajador/cliente

### **FASE 3: Gestión Documental** (3 semanas)
- [ ] Subida de archivos (todos los tipos)
- [ ] Navegación de carpetas
- [ ] Sistema de permisos por archivo
- [ ] Previsualización de archivos
- [ ] Descarga de archivos
- [ ] Búsqueda de archivos

### **FASE 4: Sistema de Chat** (2 semanas)
- [ ] Chat en tiempo real (WebSocket)
- [ ] Canales separados (cliente/trabajador)
- [ ] Historial de mensajes
- [ ] Notificaciones de mensajes
- [ ] Adjuntar archivos en chat
- [ ] Indicadores de lectura

### **FASE 5: Optimización y Testing** (2 semanas)
- [ ] Testing completo
- [ ] Optimización de rendimiento
- [ ] Seguridad (penetration testing)
- [ ] Documentación de usuario
- [ ] Capacitación

**TOTAL: 12 semanas (3 meses)**

---

**Documento creado:** 23/12/2025 - 20:30 hrs
**Versión:** 1.0
