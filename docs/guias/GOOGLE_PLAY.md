# Guía de Publicación en Google Play Store

Esta guía te ayudará a publicar tu aplicación ERP Constructora en Google Play Store como una Trusted Web Activity (TWA).

## 📋 Requisitos Previos

1. **Cuenta de Desarrollador de Google Play**
   - Costo: $25 USD (pago único)
   - Registro: https://play.google.com/console/signup

2. **Aplicación Android nativa (TWA)**
   - Necesitarás crear un wrapper Android mínimo
   - Usaremos Bubblewrap (herramienta oficial de Google)

3. **Dominio verificado**
   - Tu aplicación debe estar en HTTPS
   - Debe tener un dominio propio (no puede ser localhost)

## 🚀 Paso 1: Crear la Aplicación Android (TWA)

### Opción A: Usando Bubblewrap (Recomendado)

Bubblewrap es la herramienta oficial de Google para crear TWAs.

#### Instalación

```bash
npm install -g @bubblewrap/cli
bubblewrap init
```

#### Configuración

Durante la inicialización, proporciona:

- **URL de la aplicación:** `https://tu-dominio.com`
- **Nombre de la aplicación:** `ERP Constructora`
- **Nombre del paquete:** `com.tudominio.erpconstructora` (debe ser único)
- **Icono:** Ruta a tu icono de 512x512px
- **Splash screen:** Opcional

#### Generar APK/AAB

```bash
# Para desarrollo
bubblewrap build

# Para producción
bubblewrap build --release
```

Esto generará un archivo `.aab` (Android App Bundle) listo para subir a Google Play.

### Opción B: Usando Android Studio (Manual)

1. Descarga Android Studio
2. Crea un nuevo proyecto "Empty Activity"
3. Agrega la dependencia de Trusted Web Activity:

```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

4. Configura `AndroidManifest.xml`:

```xml
<activity
    android:name="com.google.androidbrowserhelper.trusted.LauncherActivity">
    <meta-data
        android:name="android.support.customtabs.trusted.DEFAULT_URL"
        android:value="https://tu-dominio.com" />
    
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

## 🔐 Paso 2: Verificar Dominio (Digital Asset Links)

Google requiere que verifiques que eres el dueño del dominio.

### 1. Generar archivo de verificación

Crea un archivo `.well-known/assetlinks.json` en tu servidor:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tudominio.erpconstructora",
    "sha256_cert_fingerprints": [
      "TU_HUELLA_DIGITAL_AQUI"
    ]
  }
}]
```

### 2. Obtener huella digital del certificado

```bash
# Para debug
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Para release (después de firmar)
keytool -list -v -keystore tu-keystore.jks -alias tu-alias
```

### 3. Verificar

Visita: `https://tu-dominio.com/.well-known/assetlinks.json`

Debe ser accesible y devolver el JSON correcto.

## 📦 Paso 3: Preparar para Google Play

### 1. Generar Icono de Alta Resolución

- **Tamaño:** 512x512px
- **Formato:** PNG
- **Fondo:** Transparente o sólido
- **Ubicación:** `assets/icons/icon-512x512.png`

### 2. Crear Screenshots

Necesitas screenshots en diferentes tamaños:

**Teléfono:**
- Mínimo 2, máximo 8
- Tamaño: 320-3840px de ancho
- Aspecto: 16:9 o 9:16

**Tablet (opcional):**
- Mínimo 2, máximo 8
- Tamaño: 320-3840px de ancho
- Aspecto: 16:9 o 9:16

**Recomendación:** Toma screenshots de:
- Pantalla de login
- Dashboard principal
- Vista de archivos
- Chat

### 3. Crear Descripción

Prepara:
- **Título:** Máximo 50 caracteres
- **Descripción corta:** Máximo 80 caracteres
- **Descripción completa:** Máximo 4000 caracteres
- **Palabras clave:** Relevantes para búsqueda

### 4. Clasificación de Contenido

Selecciona la clasificación apropiada:
- **Categoría:** Productividad / Negocios
- **Clasificación de contenido:** PEGI 3 / Everyone

## 📤 Paso 4: Subir a Google Play Console

1. **Crear nueva aplicación**
   - Ve a Google Play Console
   - Clic en "Crear aplicación"
   - Completa información básica

2. **Configurar Store Listing**
   - Agrega icono (512x512px)
   - Sube screenshots
   - Completa descripción
   - Agrega gráficos promocionales (opcional)

3. **Configurar Producción**
   - Ve a "Producción" → "Crear versión"
   - Sube el archivo `.aab` generado
   - Completa notas de la versión

4. **Configurar Contenido**
   - Clasificación de contenido
   - Política de privacidad (requerida)
   - Datos de la app

5. **Revisar y Publicar**
   - Revisa toda la información
   - Envía para revisión
   - Espera aprobación (1-7 días típicamente)

## ✅ Checklist Pre-Publicación

- [ ] Aplicación funciona correctamente en HTTPS
- [ ] Digital Asset Links configurado y verificado
- [ ] Icono de 512x512px creado
- [ ] Screenshots preparados (mínimo 2)
- [ ] Descripción y metadatos completos
- [ ] Política de privacidad publicada
- [ ] APK/AAB firmado correctamente
- [ ] Probado en diferentes dispositivos Android
- [ ] Versión de prueba interna realizada

## 🔧 Configuración Adicional

### Política de Privacidad

Debes tener una política de privacidad accesible públicamente. Debe incluir:

- Qué datos recopilas
- Cómo usas los datos
- Con quién compartes datos
- Cómo los usuarios pueden acceder/eliminar sus datos

### Configuración de TWA en manifest.json

Asegúrate de que tu `manifest.json` tenga:

```json
{
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

### Optimizaciones para Móvil

- ✅ Viewport configurado correctamente
- ✅ Touch targets de al menos 44x44px
- ✅ Sin zoom no deseado
- ✅ Funciona offline (Service Worker)
- ✅ Carga rápida (< 3 segundos)

## 📱 Pruebas

### Dispositivos de Prueba

Prueba en:
- Android 8.0+ (mínimo recomendado)
- Diferentes tamaños de pantalla
- Diferentes fabricantes (Samsung, Xiaomi, etc.)

### Pruebas Internas

1. Crea un track de prueba interna en Play Console
2. Agrega testers
3. Comparte el enlace de prueba
4. Recopila feedback

## 🐛 Solución de Problemas

### Error: "Digital Asset Links no verificado"

- Verifica que el archivo esté en `/.well-known/assetlinks.json`
- Verifica que sea accesible vía HTTPS
- Verifica que el JSON sea válido
- Usa: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://tu-dominio.com

### Error: "La aplicación no se abre"

- Verifica que la URL en el TWA sea correcta
- Verifica que el dominio esté en HTTPS
- Revisa los logs de Android Studio

### Error: "Icono no válido"

- Debe ser exactamente 512x512px
- Formato PNG
- Sin transparencia (para Google Play)

## 📚 Recursos Adicionales

- [Documentación de TWA](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
- [Google Play Console](https://play.google.com/console)
- [Digital Asset Links](https://developers.google.com/digital-asset-links)

## 💡 Tips

1. **Beta Testing:** Usa tracks de prueba antes de producción
2. **Actualizaciones:** Planifica actualizaciones regulares
3. **Feedback:** Responde a comentarios de usuarios
4. **Analytics:** Integra Google Analytics para métricas
5. **Notificaciones:** Implementa notificaciones push para engagement

---

**Nota:** El proceso de revisión de Google Play puede tomar de 1 a 7 días. Sé paciente y asegúrate de que todo esté correcto antes de enviar.

