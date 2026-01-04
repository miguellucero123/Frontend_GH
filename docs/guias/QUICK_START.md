# Inicio Rápido

Guía rápida para poner en marcha el frontend en 5 minutos.

## ⚡ Pasos Rápidos

### 1. Configurar Backend (1 minuto)

Edita `js/config.js` y cambia la URL de tu backend:

```javascript
API_BASE_URL: 'http://localhost:8002/api',  // Puerto 8002 según run_server.py
```

### 2. Iniciar Servidor (30 segundos)

```bash
# Opción más simple - Python
cd frontend
python -m http.server 8080
```

### 3. Abrir en Navegador (10 segundos)

Abre: `http://localhost:8080`

### 4. Personalizar (Opcional - 2 minutos)

- **Logo:** Reemplaza `assets/logo-constructora.svg`
- **Colores:** Edita variables en `css/styles.css`
- **Configuración:** Ajusta `js/config.js` según necesidad

## ✅ Verificación

1. ✅ Abre `index.html` → Debe mostrar el login
2. ✅ Abre consola (F12) → No debe haber errores
3. ✅ Intenta login → Debe conectar con backend

## 🎯 Siguiente Paso

Lee `INSTALL.md` para configuración detallada.

---

**¿Problemas?** Revisa `INSTALL.md` sección "Solución de Problemas".

