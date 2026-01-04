# 🔧 Solución: Anaconda no encontrado en PATH

## 📋 Problema

El script de verificación no encuentra Anaconda aunque está instalado. Esto significa que Anaconda no está en el PATH del sistema.

## ✅ Soluciones

### Opción 1: Agregar Anaconda al PATH (Recomendado)

1. **Abrir Variables de Entorno**:
   - Presiona `Win + R`
   - Escribe: `sysdm.cpl`
   - Presiona Enter
   - Ve a la pestaña "Opciones avanzadas"
   - Click en "Variables de entorno"

2. **Agregar al PATH**:
   - En "Variables del sistema", busca "Path"
   - Click en "Editar"
   - Click en "Nuevo"
   - Agrega la ruta de Anaconda (según tu instalación):
     - `D:\Miguel\Anaconda_AIEP\Scripts`
     - O `D:\Miguel\Anaconda_AIEP`
     - O `D:\Miguel\Anaconda_AIEP\Library\bin`
   - Click en "Aceptar" en todas las ventanas

3. **Reiniciar Terminal**:
   - Cierra todas las ventanas de terminal/PowerShell
   - Abre una nueva terminal
   - Ejecuta: `conda --version`
   - Debería funcionar ahora

### Opción 2: Usar Anaconda Prompt

Si Anaconda está instalado pero no en PATH:

1. Busca "Anaconda Prompt" en el menú de inicio
2. Abre Anaconda Prompt
3. Desde ahí ejecuta los scripts del proyecto
4. Anaconda Prompt tiene el PATH configurado automáticamente

### Opción 3: Usar la Ruta Completa

Puedes usar Anaconda sin agregarlo al PATH:

```bash
# En lugar de: conda activate
D:\Miguel\Anaconda_AIEP\Scripts\conda.exe activate base

# En lugar de: python
D:\Miguel\Anaconda_AIEP\python.exe
```

## 🔍 Verificar Instalación de Anaconda

### Buscar dónde está instalado:

1. **Buscar en el Explorador**:
   - Busca "conda.exe" en tu disco
   - Las ubicaciones comunes son:
     - `D:\Miguel\Anaconda_AIEP\`
     - `C:\Users\%USERNAME%\anaconda3\`
     - `C:\ProgramData\Anaconda3\`

2. **Desde PowerShell**:
```powershell
Get-ChildItem -Path D:\ -Filter conda.exe -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

## 📝 Verificación Rápida

Después de agregar al PATH:

```bash
# Verificar conda
conda --version

# Verificar Python
python --version

# Verificar pip
pip --version
```

## ✅ Después de Agregar al PATH

1. **Cerrar todas las terminales**
2. **Abrir nueva terminal**
3. **Ejecutar verificación nuevamente**:
   ```bash
   cd frontend
   verificar-requisitos.bat
   ```

## 🎯 Nota Importante

Si Anaconda está instalado pero no en PATH, el script mejorado ahora debería encontrarlo automáticamente en ubicaciones comunes, incluyendo `D:\Miguel\Anaconda_AIEP\`.

**¿Ya agregaste Anaconda al PATH o prefieres que el script lo encuentre automáticamente?**

