# 📱 Guía Completa: Generar APK → Google Drive → QR Code

## 🎯 Objetivo
Generar un APK de la aplicación ERP Constructora, subirlo a Google Drive y crear un código QR para compartirlo fácilmente.

---

## 📋 Paso 1: Revisión Completa del Proyecto

### ✅ Verificación de Archivos Principales

**Archivos verificados:**
- ✅ `vite.config.ts` - Configuración de Vite
- ✅ `package.json` - Dependencias y scripts
- ✅ `src/App.tsx` - Componente principal
- ✅ `src/main.tsx` - Punto de entrada
- ✅ `public/manifest.json` - Manifest PWA
- ✅ `src/services/apiClient.ts` - Configuración API
- ✅ Backend configurado en puerto 8002

**Estado:** ✅ Todo configurado correctamente

---

## 🔧 Paso 2: Instalar Capacitor (Para Generar APK)

### Requisitos Previos

1. **Node.js** instalado (v18 o superior)
2. **Java JDK** instalado (para Android SDK)
3. **Android Studio** instalado (para Android SDK)
4. **Android SDK** configurado

### Instalación

```bash
cd frontend/app

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Inicializar Capacitor
npx cap init "ERP Constructora" "com.constructora.erp"
```

### Configuración de Capacitor

Edita `capacitor.config.ts` (se creará automáticamente):

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.constructora.erp',
  appName: 'ERP Constructora',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Para desarrollo local, descomenta:
    // url: 'http://localhost:5173',
    // cleartext: true
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined, // Para producción, especifica ruta
    }
  }
};

export default config;
```

---

## 🏗️ Paso 3: Build de la Aplicación

### 3.1 Build de Producción

```bash
cd frontend/app

# Build de producción
npm run build
```

Esto generará la carpeta `dist/` con todos los archivos optimizados.

### 3.2 Sincronizar con Capacitor

```bash
# Sincronizar archivos con Android
npx cap sync android
```

---

## 📱 Paso 4: Generar APK

### Opción A: APK de Debug (Rápido, para pruebas)

```bash
cd frontend/app

# Abrir Android Studio
npx cap open android

# En Android Studio:
# 1. Build → Build Bundle(s) / APK(s) → Build APK(s)
# 2. Espera a que termine
# 3. El APK estará en: android/app/build/outputs/apk/debug/app-debug.apk
```

### Opción B: APK Firmado (Para distribución)

#### 4.1 Generar Keystore

```bash
# Generar keystore (solo primera vez)
keytool -genkey -v -keystore erp-constructora.keystore -alias erp-constructora -keyalg RSA -keysize 2048 -validity 10000

# Guarda la contraseña y los datos que te pida
```

#### 4.2 Configurar Firma en Android

Edita `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../erp-constructora.keystore')
            storePassword 'TU_PASSWORD'
            keyAlias 'erp-constructora'
            keyPassword 'TU_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

#### 4.3 Generar APK Firmado

```bash
cd frontend/app/android

# Generar APK firmado
./gradlew assembleRelease

# El APK estará en: app/build/outputs/apk/release/app-release.apk
```

---

## ☁️ Paso 5: Subir a Google Drive

### 5.1 Preparar el APK

1. **Ubicación del APK:**
   - Debug: `frontend/app/android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `frontend/app/android/app/build/outputs/apk/release/app-release.apk`

2. **Renombrar (opcional):**
   ```
   ERP-Constructora-v1.0.apk
   ```

### 5.2 Subir a Google Drive

1. **Abre Google Drive:** https://drive.google.com

2. **Crea una carpeta:**
   - Nombre: `ERP Constructora APK`
   - O usa una carpeta existente

3. **Sube el APK:**
   - Arrastra el archivo `.apk` a la carpeta
   - O haz clic en "Nuevo" → "Subir archivo"

4. **Configurar permisos:**
   - Clic derecho en el archivo APK
   - "Obtener enlace"
   - Cambiar a: **"Cualquiera con el enlace"**
   - Copiar el enlace

**Ejemplo de enlace:**
```
https://drive.google.com/file/d/1ABC123XYZ456/view?usp=sharing
```

### 5.3 Obtener Enlace Directo de Descarga

Para que el QR code funcione directamente, necesitas el enlace de descarga directa:

1. **Opción 1: Modificar el enlace**
   ```
   De: https://drive.google.com/file/d/1ABC123XYZ456/view?usp=sharing
   A:  https://drive.google.com/uc?export=download&id=1ABC123XYZ456
   ```

2. **Opción 2: Usar herramienta online**
   - Ve a: https://sites.google.com/site/gdocs2direct/
   - Pega el enlace de compartir
   - Obtén el enlace directo

---

## 📲 Paso 6: Crear Código QR

### Opción A: Generador Online (Recomendado)

1. **QR Code Generator:**
   - https://www.qr-code-generator.com/
   - https://qr-code-generator.com/
   - https://www.the-qrcode-generator.com/

2. **Pasos:**
   - Selecciona "URL"
   - Pega el enlace directo de Google Drive
   - Genera el QR
   - Descarga la imagen (PNG o SVG)

### Opción B: Usar Python (Si tienes Python instalado)

```bash
# Instalar librería
pip install qrcode[pil]

# Crear QR
python -c "import qrcode; qr = qrcode.QRCode(); qr.add_data('TU_ENLACE_DIRECTO'); qr.make(); img = qr.make_image(); img.save('qr-erp-constructora.png')"
```

### Opción C: Usar Node.js

```bash
cd frontend/app

# Instalar dependencia
npm install qrcode

# Crear script
node -e "const QRCode = require('qrcode'); QRCode.toFile('qr-erp-constructora.png', 'TU_ENLACE_DIRECTO');"
```

---

## 📋 Paso 7: Compartir el QR

### Opciones de Compartir

1. **Imprimir y pegar en oficina:**
   - Imprime el QR en tamaño A4 o A5
   - Pégalo en un lugar visible
   - Añade instrucciones: "Escanea para descargar la app"

2. **Enviar por WhatsApp:**
   - Envía la imagen del QR al grupo de la empresa
   - O comparte el enlace directamente

3. **Email:**
   - Adjunta el QR en un email
   - Incluye instrucciones de instalación

---

## 🚀 Scripts Automatizados

### Script para Generar APK (Windows)

Crea `frontend/app/generar-apk.bat`:

```batch
@echo off
echo ====================================
echo Generando APK - ERP Constructora
echo ====================================

echo.
echo [1/4] Building proyecto...
call npm run build
if errorlevel 1 (
    echo ERROR: Build fallido
    pause
    exit /b 1
)

echo.
echo [2/4] Sincronizando con Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Sync fallido
    pause
    exit /b 1
)

echo.
echo [3/4] Abriendo Android Studio...
call npx cap open android

echo.
echo [4/4] En Android Studio:
echo   1. Build → Build Bundle(s) / APK(s) → Build APK(s)
echo   2. El APK estara en: android/app/build/outputs/apk/debug/app-debug.apk
echo.
pause
```

### Script para Generar APK (Linux/Mac)

Crea `frontend/app/generar-apk.sh`:

```bash
#!/bin/bash

echo "===================================="
echo "Generando APK - ERP Constructora"
echo "===================================="

echo ""
echo "[1/4] Building proyecto..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build fallido"
    exit 1
fi

echo ""
echo "[2/4] Sincronizando con Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "ERROR: Sync fallido"
    exit 1
fi

echo ""
echo "[3/4] Abriendo Android Studio..."
npx cap open android

echo ""
echo "[4/4] En Android Studio:"
echo "  1. Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "  2. El APK estará en: android/app/build/outputs/apk/debug/app-debug.apk"
```

---

## ✅ Checklist Final

Antes de compartir el APK:

- [ ] APK generado correctamente
- [ ] APK probado en dispositivo Android
- [ ] APK subido a Google Drive
- [ ] Permisos configurados: "Cualquiera con el enlace"
- [ ] Enlace directo de descarga obtenido
- [ ] QR Code generado
- [ ] QR Code probado (escaneado y descarga funciona)
- [ ] QR Code compartido (oficina/WhatsApp/Email)

---

## 🔧 Solución de Problemas

### Error: "Android SDK not found"
```bash
# Configurar ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Error: "Gradle build failed"
- Verifica que Android Studio esté instalado
- Abre Android Studio y deja que descargue componentes
- Ejecuta: `npx cap sync android` de nuevo

### Error: "APK no se instala en dispositivo"
- Verifica que "Orígenes desconocidos" esté habilitado en Android
- Configuración → Seguridad → Orígenes desconocidos

### QR Code no funciona
- Verifica que el enlace sea de descarga directa (no de vista)
- Prueba el enlace en el navegador primero
- Asegúrate de que los permisos de Google Drive sean correctos

---

## 📝 Notas Importantes

1. **Versión del APK:** Actualiza la versión en `package.json` antes de cada build
2. **Backend:** El APK apuntará al backend configurado en `apiClient.ts`
3. **Actualizaciones:** Para actualizar, genera nuevo APK y reemplaza en Drive
4. **Seguridad:** Para producción, usa APK firmado (release)

---

**Última actualización:** Configuración completa para generar APK ✅

