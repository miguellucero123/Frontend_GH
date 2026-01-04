# 🔍 Instrucciones para Verificar Requisitos

## 📋 Cómo Ejecutar la Verificación

### Opción 1: Doble Click (Más Fácil)
1. Abre el explorador de Windows
2. Navega a la carpeta `frontend`
3. Haz doble click en `verificar-requisitos.bat`
4. El script se ejecutará y mostrará los resultados

### Opción 2: Desde Terminal
```bash
# Abrir PowerShell o CMD
cd frontend
.\verificar-requisitos.bat
```

## ✅ Qué Verifica el Script

El script `verificar-requisitos.bat` verifica:

1. **Anaconda/Conda**
   - Busca en PATH
   - Busca en ubicaciones comunes (incluyendo D:\Miguel\Anaconda_AIEP)
   - Muestra versión si está instalado

2. **Python**
   - Verifica en PATH
   - Verifica en Anaconda si está disponible
   - Muestra versión

3. **Docker**
   - Verifica instalación
   - Verifica que esté corriendo
   - Muestra versión

4. **Node.js**
   - Busca en PATH
   - Busca en ubicaciones comunes
   - Busca en Anaconda
   - Muestra versión

5. **npm**
   - Verifica que esté disponible
   - Muestra versión

6. **Dependencias del Backend**
   - Verifica requirements.txt
   - Verifica run_server.py
   - Verifica si FastAPI está instalado

7. **Dependencias del Frontend**
   - Verifica package.json
   - Verifica node_modules

## 📊 Resultados

El script mostrará:

- **[OK]**: Componente encontrado y funcionando
- **[ADVERTENCIA]**: Componente encontrado pero con problemas menores
- **[ERROR]**: Componente no encontrado o no funciona
- **[BUSCANDO]**: Buscando en ubicaciones alternativas

## 🎯 Al Final

El script mostrará un resumen:
- ✅ **TODOS LOS REQUISITOS ESTÁN INSTALADOS**: Listo para usar
- ⚠️ **REQUISITOS PRINCIPALES OK, PERO HAY ADVERTENCIAS**: Revisar advertencias
- ❌ **FALTAN REQUISITOS CRÍTICOS**: Instalar componentes faltantes

## 📝 Qué Hacer Según el Resultado

### Si todo está OK ✅
```bash
# Puedes iniciar el sistema
iniciar-todo-con-anaconda.bat
```

### Si hay advertencias ⚠️
1. Revisa las advertencias en el output
2. Sigue las instrucciones mostradas
3. Ejecuta los comandos sugeridos
4. Vuelve a ejecutar la verificación

### Si hay errores ❌
1. Instala los componentes faltantes
2. Sigue los enlaces proporcionados
3. Vuelve a ejecutar la verificación

## 🔧 Solución Rápida de Problemas Comunes

### Anaconda no encontrado
- Instalar desde: https://www.anaconda.com/products/distribution
- O agregar al PATH del sistema

### Docker no encontrado
- Instalar Docker Desktop: https://www.docker.com/products/docker-desktop
- Asegurarse de que esté corriendo

### Node.js no encontrado
- Instalar desde: https://nodejs.org/
- O usar Node.js de Anaconda

### Dependencias faltantes
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd app
npm install
```

## 📚 Documentación Relacionada

- `REQUISITOS_SISTEMA.md` - Lista completa de requisitos
- `README_ANACONDA_DOCKER.md` - Guía de configuración
- `N8N_CON_ANACONDA.md` - Información sobre n8n y Anaconda

## ✅ Ejecuta Ahora

1. Abre el explorador de Windows
2. Ve a la carpeta `frontend`
3. Haz doble click en `verificar-requisitos.bat`
4. Revisa los resultados
5. Sigue las instrucciones según el resultado

¡El script te dirá exactamente qué tienes y qué falta!

