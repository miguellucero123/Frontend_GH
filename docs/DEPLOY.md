# Guía de Despliegue (Deployment)

Esta guía te ayudará a desplegar tu aplicación PWA en producción.

## 📋 Pre-requisitos

- ✅ Aplicación funcionando localmente
- ✅ Backend API configurado y funcionando
- ✅ Dominio con HTTPS configurado
- ✅ Iconos generados y colocados
- ✅ Manifest.json validado

## 🚀 Opción 1: Despliegue Manual

### Paso 1: Build de Producción

```bash
cd frontend
npm install
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos optimizados.

### Paso 2: Validar Build

```bash
npm run validate-manifest
```

Verifica que no haya errores en el manifest.

### Paso 3: Subir Archivos

Sube todo el contenido de la carpeta `dist/` a tu servidor web:

**FTP/SFTP:**
```bash
# Usando scp
scp -r dist/* usuario@servidor:/ruta/del/servidor/

# Usando rsync
rsync -avz dist/ usuario@servidor:/ruta/del/servidor/
```

**Panel de Control:**
- Accede a tu panel de hosting
- Sube los archivos vía File Manager
- Asegúrate de mantener la estructura de carpetas

### Paso 4: Configurar Servidor

#### Apache (.htaccess)

El archivo `.htaccess` ya está incluido en el build. Asegúrate de que:

1. Apache tenga `mod_rewrite` habilitado
2. El archivo `.htaccess` esté en la raíz
3. Los permisos sean correctos (644)

#### Nginx

Si usas Nginx, agrega esta configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    # Redirección HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;
    
    root /ruta/a/tu/app;
    index index.html;
    
    # SSL
    ssl_certificate /ruta/al/certificado.crt;
    ssl_certificate_key /ruta/al/private.key;
    
    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # Service Worker - No cachear
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # Manifest - Cache corto
    location = /manifest.json {
        add_header Cache-Control "public, max-age=3600";
    }
    
    # Archivos estáticos - Cache largo
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA - Todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Digital Asset Links
    location /.well-known/assetlinks.json {
        add_header Content-Type "application/json";
        add_header Access-Control-Allow-Origin "*";
    }
}
```

## 🔐 Opción 2: Despliegue con CI/CD

### GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
```

### GitLab CI

Crea `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - rsync -avz dist/ usuario@servidor:/ruta/del/servidor/
  only:
    - main
```

## ☁️ Opción 3: Servicios en la Nube

### Netlify

1. Conecta tu repositorio
2. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Variables de entorno (si es necesario)
4. Deploy automático

### Vercel

1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones
4. Configuración automática de HTTPS

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Deploy
firebase deploy
```

### AWS S3 + CloudFront

1. Crea bucket S3
2. Sube archivos de `dist/`
3. Configura CloudFront
4. Configura SSL/TLS
5. Configura dominio

## ✅ Checklist Post-Despliegue

- [ ] Aplicación accesible vía HTTPS
- [ ] Manifest.json accesible
- [ ] Service Worker registrado correctamente
- [ ] Iconos cargando correctamente
- [ ] API backend funcionando
- [ ] Digital Asset Links configurado (para TWA)
- [ ] Pruebas en diferentes dispositivos
- [ ] Lighthouse score > 90
- [ ] Funcionamiento offline verificado

## 🔍 Verificación

### 1. Verificar HTTPS

```bash
curl -I https://tu-dominio.com
```

Debe devolver código 200.

### 2. Verificar Manifest

```bash
curl https://tu-dominio.com/manifest.json
```

Debe devolver JSON válido.

### 3. Verificar Service Worker

Abre DevTools → Application → Service Workers

Debe mostrar el Service Worker activo.

### 4. Lighthouse Audit

```bash
npm run test-pwa
```

O usa Lighthouse en Chrome DevTools.

## 🐛 Solución de Problemas

### Error: "Service Worker no se registra"

**Causas:**
- No está en HTTPS
- Ruta incorrecta
- Error en el código del SW

**Solución:**
1. Verifica HTTPS
2. Revisa ruta en `pwa.js`
3. Revisa consola para errores

### Error: "Manifest no encontrado"

**Causas:**
- Archivo no subido
- Ruta incorrecta
- Permisos incorrectos

**Solución:**
1. Verifica que `manifest.json` esté en la raíz
2. Verifica permisos (644)
3. Verifica ruta en HTML

### Error: "Iconos no cargan"

**Causas:**
- Archivos no subidos
- Rutas incorrectas
- Formato incorrecto

**Solución:**
1. Verifica que iconos estén en `assets/icons/`
2. Verifica rutas en `manifest.json`
3. Verifica formato PNG

## 📊 Monitoreo

### Google Analytics

Agrega tracking:

```html
<!-- En index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Error Tracking

Considera integrar:
- Sentry
- LogRocket
- Bugsnag

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz cambios en el código
2. Ejecuta `npm run build`
3. Sube nuevos archivos
4. El Service Worker actualizará automáticamente

**Nota:** Cambia `CACHE_NAME` en `sw.js` para forzar actualización.

---

**Última actualización:** 2024

