# 🐍 Anaconda + Docker para ERP Constructora

## 📋 Resumen

Este proyecto usa **Anaconda** para el backend Python y **Docker** para n8n (automatización).

## 🔧 Componentes

### 1. Backend (Anaconda)
- **Entorno**: Python con Anaconda
- **Framework**: FastAPI
- **Puerto**: 8002
- **Archivo**: `backend/run_server.py`

### 2. Frontend (Node.js)
- **Framework**: React + Vite
- **Puerto**: 5173
- **Comando**: `npm run dev`

### 3. n8n (Docker)
- **Plataforma**: Docker
- **Puerto**: 5678
- **Comando**: `iniciar-n8n.bat`

## 🚀 Inicio Rápido

### Opción 1: Script Integrado (Recomendado)
```bash
iniciar-todo-con-anaconda.bat
```

Este script:
- ✅ Verifica Anaconda
- ✅ Verifica Docker
- ✅ Activa entorno Anaconda
- ✅ Inicia backend con Anaconda
- ✅ Inicia n8n con Docker
- ✅ Inicia frontend con Node.js

### Opción 2: Manual

#### Paso 1: Activar Anaconda y Backend
```bash
# Activar entorno (si existe)
conda activate erp-constructora

# O usar base
conda activate base

# Ir a backend
cd backend

# Instalar dependencias (si es necesario)
pip install -r requirements.txt

# Iniciar servidor
python run_server.py
```

#### Paso 2: Iniciar n8n (Docker)
```bash
# En otra terminal
cd frontend
iniciar-n8n.bat
```

#### Paso 3: Iniciar Frontend
```bash
# En otra terminal
cd frontend/app
npm run dev
```

## 📝 Configuración de Entorno Anaconda

### Crear Entorno Específico (Opcional)
```bash
# Crear entorno
conda create -n erp-constructora python=3.9

# Activar entorno
conda activate erp-constructora

# Instalar dependencias
cd backend
pip install -r requirements.txt
```

### Usar Entorno Existente
```bash
# Activar entorno base
conda activate base

# O cualquier otro entorno
conda activate tu_entorno
```

## 🔍 Verificar Instalación

### Anaconda
```bash
conda --version
python --version
```

### Docker
```bash
docker --version
docker info
```

### Node.js
```bash
node --version
npm --version
```

## ⚠️ Notas Importantes

1. **Docker es independiente de Anaconda**
   - Docker Desktop debe estar instalado y corriendo
   - n8n se ejecuta en Docker, no necesita Anaconda

2. **Anaconda es para el backend**
   - Gestiona el entorno Python
   - Instala dependencias del backend
   - No afecta a n8n (que está en Docker)

3. **Ambos pueden trabajar juntos**
   - Backend: Anaconda
   - n8n: Docker
   - Frontend: Node.js

## 🛠️ Solución de Problemas

### Problema: Conda no encontrado
```bash
# Agregar Anaconda al PATH
# O usar la ruta completa:
D:\Miguel\Anaconda_AIEP\Scripts\conda.exe activate base
```

### Problema: Docker no corre
- Abrir Docker Desktop
- Esperar a que inicie completamente
- Verificar con `docker info`

### Problema: Puerto ocupado
```bash
# Cambiar puerto en run_server.py o docker-compose.n8n.yml
```

## ✅ Ventajas de esta Configuración

1. **Anaconda**: Gestión fácil de entornos Python
2. **Docker**: n8n aislado y fácil de gestionar
3. **Separación**: Cada componente en su entorno
4. **Flexibilidad**: Fácil cambiar versiones

## 📚 Archivos Relacionados

- `iniciar-todo-con-anaconda.bat` - Script integrado
- `iniciar-n8n.bat` - Solo n8n (Docker)
- `INICIAR_TODO.bat` - Sin Anaconda (alternativa)
- `docker-compose.n8n.yml` - Configuración Docker

## 🎯 Resumen

- ✅ **Backend**: Anaconda (Python)
- ✅ **n8n**: Docker (automatización)
- ✅ **Frontend**: Node.js
- ✅ **Todo integrado**: Script único para iniciar todo

¿Necesitas ayuda con alguna configuración específica?

