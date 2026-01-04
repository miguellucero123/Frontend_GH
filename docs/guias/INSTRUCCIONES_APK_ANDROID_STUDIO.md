# 📱 Instrucciones para Generar APK en Android Studio

## ✅ Estado Actual

- ✅ Capacitor instalado
- ✅ Plataforma Android agregada
- ✅ Proyecto sincronizado
- ✅ Build de producción completado

## 🚀 Pasos para Generar el APK

### 1. Android Studio se Abrió Automáticamente

Si Android Studio se abrió, continúa con el paso 2.

Si no se abrió, ábrelo manualmente:
```bash
cd frontend/app
npx cap open android
```

### 2. Esperar a que Gradle Sincronice

- Android Studio descargará dependencias automáticamente
- Espera a que termine la sincronización (barra inferior)
- Puede tomar 5-10 minutos la primera vez

### 3. Generar el APK

**Opción A: Desde el Menú (Recomendado)**
1. En la barra superior: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Espera a que termine (verás notificación en la esquina inferior derecha)
3. Haz clic en **"locate"** en la notificación para abrir la carpeta del APK

**Opción B: Desde la Terminal de Android Studio**
1. Abre la terminal en Android Studio (View → Tool Windows → Terminal)
2. Ejecuta:
```bash
./gradlew assembleDebug
```

### 4. Ubicación del APK

El APK estará en:
```
frontend/app/android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. Probar el APK

**En un dispositivo Android:**
1. Transfiere el APK al dispositivo (USB, email, etc.)
2. Abre el archivo en el dispositivo
3. Si aparece "Instalar desde orígenes desconocidos":
   - Configuración → Seguridad → Permitir instalación de apps de orígenes desconocidos
4. Instala el APK

**En un emulador:**
1. En Android Studio: Run → Run 'app'
2. Selecciona un dispositivo virtual
3. El APK se instalará automáticamente

---

## 🔧 Solución de Problemas

### Error: "Gradle sync failed"

**Solución:**
1. File → Invalidate Caches / Restart
2. Espera a que reinicie
3. File → Sync Project with Gradle Files

### Error: "SDK not found"

**Solución:**
1. File → Settings → Appearance & Behavior → System Settings → Android SDK
2. Instala los SDK necesarios (marcados en rojo)
3. Apply → OK

### Error: "JAVA_HOME not set"

**Solución:**
1. Android Studio detectará Java automáticamente
2. Si no, File → Project Structure → SDK Location
3. Configura la ruta de JDK

### El APK no se genera

**Solución:**
1. Build → Clean Project
2. Build → Rebuild Project
3. Intenta generar el APK de nuevo

---

## 📋 Checklist

- [ ] Android Studio abierto
- [ ] Gradle sincronizado (sin errores)
- [ ] APK generado exitosamente
- [ ] APK ubicado en: `android/app/build/outputs/apk/debug/app-debug.apk`
- [ ] APK probado en dispositivo o emulador

---

## 🎯 Siguiente Paso

Una vez tengas el APK:

1. **Subir a Google Drive:**
   - Sube `app-debug.apk`
   - Configura permisos: "Cualquiera con el enlace"
   - Obtén enlace directo

2. **Crear QR Code:**
   - Abre `frontend/app/crear-qr.html`
   - Pega el enlace directo
   - Descarga el QR

3. **Compartir:**
   - Imprime el QR
   - Envía por WhatsApp
   - Comparte en email

---

**¡El proyecto está listo para generar el APK!** 🚀

