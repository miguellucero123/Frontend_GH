# 📱 Instalar Android Studio para Generar APK

## ⚠️ Android Studio No Encontrado

Android Studio no está instalado o no está en la ruta esperada. Necesitas instalarlo para generar el APK.

## 🔽 Opción 1: Instalar Android Studio (Recomendado)

### Pasos:

1. **Descargar Android Studio:**
   - Ve a: https://developer.android.com/studio
   - Descarga la versión para Windows
   - Ejecuta el instalador

2. **Instalación:**
   - Sigue el asistente de instalación
   - Acepta los términos
   - Selecciona componentes (Android SDK, Android SDK Platform, etc.)
   - Espera a que descargue e instale (puede tomar 20-30 minutos)

3. **Primera Configuración:**
   - Abre Android Studio
   - Sigue el asistente de configuración inicial
   - Descarga los componentes adicionales que solicite

4. **Generar el APK:**
   ```bash
   cd frontend/app
   npx cap open android
   ```
   - En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

---

## 🔧 Opción 2: Generar APK con Gradle CLI (Sin Android Studio)

Si tienes Java y Android SDK instalados, puedes generar el APK desde la línea de comandos.

### Requisitos:
- Java JDK 11 o superior
- Android SDK instalado
- Variables de entorno configuradas

### Pasos:

1. **Configurar JAVA_HOME:**
   ```powershell
   # Verificar Java instalado
   java -version
   
   # Configurar JAVA_HOME (reemplaza con tu ruta)
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
   ```

2. **Configurar ANDROID_HOME:**
   ```powershell
   # Si Android SDK está instalado (ej: en AppData)
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
   ```

3. **Generar APK:**
   ```powershell
   cd frontend/app\android
   .\gradlew.bat assembleDebug
   ```

4. **Ubicación del APK:**
   ```
   frontend/app/android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 🌐 Opción 3: Usar Servicio Online (Alternativa)

Si no puedes instalar Android Studio, puedes usar servicios online que generan APK desde código:

1. **PWA Builder (Microsoft):**
   - https://www.pwabuilder.com/
   - Sube tu PWA
   - Genera APK automáticamente

2. **Bubblewrap (Google):**
   - https://github.com/GoogleChromeLabs/bubblewrap
   - Herramienta CLI para generar TWA (Trusted Web Activity)

---

## ✅ Estado Actual del Proyecto

El proyecto está **100% listo** para generar el APK:

- ✅ Capacitor instalado
- ✅ Plataforma Android agregada
- ✅ Build de producción completado
- ✅ Proyecto sincronizado
- ✅ Archivos Android generados en `frontend/app/android/`

**Solo necesitas Android Studio para generar el APK final.**

---

## 📋 Checklist

- [ ] Android Studio instalado
- [ ] Android SDK configurado
- [ ] Proyecto abierto en Android Studio
- [ ] Gradle sincronizado
- [ ] APK generado

---

## 🚀 Después de Instalar Android Studio

1. **Abrir el proyecto:**
   ```bash
   cd frontend/app
   npx cap open android
   ```

2. **Generar APK:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

3. **Ubicación:**
   - `android/app/build/outputs/apk/debug/app-debug.apk`

---

**Una vez tengas Android Studio instalado, el proceso tomará solo 5 minutos.** ⚡

