# 📋 Requisitos del Sistema - ERP Constructora

## ✅ Requisitos Principales

### 1. Anaconda o Miniconda
- **Versión**: Cualquier versión reciente
- **Descarga**: https://www.anaconda.com/products/distribution
- **Alternativa**: Miniconda desde https://docs.conda.io/en/latest/miniconda.html
- **Uso**: Gestionar entorno Python para el backend

### 2. Python
- **Versión**: 3.8 o superior
- **Incluido**: Viene con Anaconda
- **Verificar**: `python --version`
- **Uso**: Backend FastAPI

### 3. Docker Desktop
- **Versión**: Cualquier versión reciente
- **Descarga**: https://www.docker.com/products/docker-desktop
- **Requisito**: Debe estar corriendo
- **Uso**: n8n (automatización)

### 4. Node.js
- **Versión**: 14.0 o superior (recomendado 18+)
- **Descarga**: https://nodejs.org/
- **Incluido**: npm viene con Node.js
- **Uso**: Frontend React

## 🔍 Verificación Rápida

### Script Automático
```bash
verificar-requisitos.bat
```

Este script verifica:
- ✅ Anaconda/Conda
- ✅ Python
- ✅ Docker
- ✅ Node.js
- ✅ npm
- ✅ Dependencias del backend
- ✅ Dependencias del frontend

### Verificación Manual

#### Anaconda
```bash
conda --version
```

#### Python
```bash
python --version
```

#### Docker
```bash
docker --version
docker info  # Verifica que esté corriendo
```

#### Node.js
```bash
node --version
npm --version
```

## 📦 Dependencias Adicionales

### Backend (Python)
```bash
cd backend
pip install -r requirements.txt
```

**Principales dependencias**:
- FastAPI
- SQLAlchemy
- python-jose (autenticación)
- passlib (hash de contraseñas)
- httpx (para n8n)

### Frontend (Node.js)
```bash
cd app
npm install
```

**Principales dependencias**:
- React
- Vite
- React Router
- Axios
- Recharts

## 🚀 Inicio del Sistema

### Opción 1: Con Anaconda (Recomendado)
```bash
iniciar-todo-con-anaconda.bat
```

### Opción 2: Sin Anaconda
```bash
INICIAR_TODO.bat
```

### Opción 3: Solo n8n
```bash
iniciar-n8n.bat
```

## ⚠️ Solución de Problemas

### Problema: Anaconda no encontrado
**Solución**:
1. Instalar Anaconda desde el sitio oficial
2. O agregar Anaconda al PATH del sistema
3. O usar la ruta completa en los scripts

### Problema: Docker no corre
**Solución**:
1. Abrir Docker Desktop
2. Esperar a que inicie completamente
3. Verificar con `docker info`

### Problema: Node.js no encontrado
**Solución**:
1. Instalar Node.js desde nodejs.org
2. O usar Node.js de Anaconda (si está instalado)
3. Verificar PATH del sistema

### Problema: Dependencias faltantes
**Solución Backend**:
```bash
conda activate base  # o tu entorno
cd backend
pip install -r requirements.txt
```

**Solución Frontend**:
```bash
cd app
npm install
```

## 📊 Checklist de Instalación

- [ ] Anaconda instalado
- [ ] Python 3.8+ disponible
- [ ] Docker Desktop instalado y corriendo
- [ ] Node.js instalado
- [ ] npm disponible
- [ ] Dependencias del backend instaladas
- [ ] Dependencias del frontend instaladas
- [ ] Scripts de inicio funcionando

## ✅ Verificación Completa

Ejecuta el script de verificación:
```bash
verificar-requisitos.bat
```

Este script te dirá:
- ✅ Qué está instalado correctamente
- ⚠️ Qué tiene advertencias
- ❌ Qué falta instalar

## 🎯 Próximos Pasos

1. **Ejecutar verificación**: `verificar-requisitos.bat`
2. **Instalar faltantes**: Según las indicaciones
3. **Iniciar sistema**: `iniciar-todo-con-anaconda.bat`

## 📝 Notas

- **Anaconda**: Opcional pero recomendado para backend
- **Docker**: Requerido para n8n
- **Node.js**: Requerido para frontend
- **Python**: Requerido para backend (viene con Anaconda)

¿Necesitas ayuda con alguna instalación específica?

