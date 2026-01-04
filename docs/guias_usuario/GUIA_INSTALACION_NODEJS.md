# 📥 Guía de Instalación de Node.js

## 🎯 ¿Por qué necesitas Node.js?

Node.js permite ejecutar el servidor local para que el proyecto funcione correctamente con todas sus funcionalidades.

## 📋 Pasos de Instalación

### Paso 1: Descargar Node.js

1. Ve a: **https://nodejs.org/**
2. Descarga la versión **LTS** (Long Term Support) - Recomendada
3. El archivo será algo como: `node-v20.x.x-x64.msi`

### Paso 2: Instalar

1. **Doble click** en el archivo descargado
2. **Siguiente** en todas las pantallas
3. **Acepta** los términos y condiciones
4. **Marca la casilla** "Automatically install the necessary tools" (opcional pero recomendado)
5. **Instalar**
6. Espera a que termine la instalación

### Paso 3: Verificar Instalación

1. **Abre una nueva terminal** (cmd o PowerShell)
2. **Ejecuta:**
   ```bash
   node --version
   ```
3. **Deberías ver:** `v20.x.x` (o similar)
4. **Ejecuta también:**
   ```bash
   npm --version
   ```
5. **Deberías ver:** `10.x.x` (o similar)

### Paso 4: Reiniciar Terminal

**IMPORTANTE:** Cierra y vuelve a abrir la terminal después de instalar Node.js.

### Paso 5: Ejecutar el Proyecto

```bash
cd frontend
npm start
```

## ✅ Verificación Rápida

### ¿Está instalado?
```bash
node --version
npm --version
```

Si ambos muestran versiones, **¡está instalado correctamente!**

## 🐛 Problemas Comunes

### Problema: "node no se reconoce como comando"
**Solución:**
1. Reinicia la terminal completamente
2. Si persiste, reinicia la computadora
3. Verifica que Node.js esté en el PATH

### Problema: Versión muy antigua
**Solución:**
- Descarga la versión LTS más reciente desde nodejs.org
- Desinstala la versión antigua primero

### Problema: Instalación falla
**Solución:**
- Ejecuta el instalador como Administrador
- Verifica que tengas espacio en disco
- Desactiva temporalmente el antivirus

## 🚀 Alternativa: Usar Python

Si no puedes instalar Node.js, el script `EJECUTAR.bat` ahora detecta Python automáticamente y lo usa.

**Verificar Python:**
```bash
python --version
```

Si Python está instalado, simplemente ejecuta `EJECUTAR.bat` nuevamente.

## 📝 Notas

- **Node.js es gratuito** y de código abierto
- **No requiere configuración especial** después de instalar
- **Funciona en Windows, Mac y Linux**
- **La versión LTS es la más estable**

---

**¡Después de instalar Node.js, podrás ejecutar el proyecto sin problemas!** 🚀

