# 🚀 Guía Rápida: Generar APK HOY

## ⚡ Pasos Rápidos (15-30 minutos)

### 1️⃣ Instalar Capacitor (5 min)

```bash
cd frontend/app
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "ERP Constructora" "com.constructora.erp" --web-dir=dist
```

### 2️⃣ Build y Sincronizar (5 min)

```bash
npm run build
npx cap sync android
```

### 3️⃣ Generar APK (10-15 min)

**Opción A: Script Automático (Windows)**
```bash
generar-apk.bat
```

**Opción B: Manual**
```bash
npx cap open android
# En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**Ubicación del APK:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4️⃣ Subir a Google Drive (2 min)

1. Abre Google Drive
2. Sube el archivo `app-debug.apk`
3. Clic derecho → "Obtener enlace"
4. Cambiar a: **"Cualquiera con el enlace"**
5. Copiar enlace

### 5️⃣ Convertir a Enlace Directo (1 min)

**Formato:**
```
https://drive.google.com/uc?export=download&id=TU_ID_AQUI
```

**Cómo obtener el ID:**
- Del enlace: `https://drive.google.com/file/d/ID_AQUI/view`
- O usa: https://sites.google.com/site/gdocs2direct/

### 6️⃣ Crear QR Code (2 min)

**Opción A: Usar herramienta incluida**
```bash
# Abre en navegador:
frontend/app/crear-qr.html
```

**Opción B: Online**
- https://www.qr-code-generator.com/
- Pega el enlace directo
- Descarga el QR

### 7️⃣ Compartir (1 min)

- ✅ Imprimir y pegar en oficina
- ✅ Enviar por WhatsApp
- ✅ Compartir en email

---

## ✅ Checklist Final

- [ ] APK generado
- [ ] APK probado en dispositivo
- [ ] Subido a Google Drive
- [ ] Permisos: "Cualquiera con el enlace"
- [ ] Enlace directo obtenido
- [ ] QR Code generado
- [ ] QR Code probado
- [ ] QR Code compartido

---

## 🆘 Problemas Comunes

### "Android SDK not found"
- Instala Android Studio
- Abre Android Studio y deja que descargue componentes

### "Gradle build failed"
- Abre Android Studio
- File → Sync Project with Gradle Files
- Espera a que termine

### "APK no se instala"
- Configuración → Seguridad → Orígenes desconocidos (habilitar)

---

**¡Listo!** En 15-30 minutos tendrás el APK listo para compartir 🎉

