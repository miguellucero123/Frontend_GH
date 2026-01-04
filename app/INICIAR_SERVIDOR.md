# 🚀 Cómo Iniciar el Servidor de Desarrollo (Puerto 5173)

## ❌ Error: "ERR_CONNECTION_REFUSED"

Este error significa que **el servidor de Vite NO está corriendo**.

## ✅ Solución: Iniciar el Servidor

### Opción 1: Desde la Terminal (Recomendado)

1. **Abre una terminal** en la carpeta del proyecto

2. **Navega a la carpeta de la app:**
   ```bash
   cd frontend/app
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Deberías ver algo como:**
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

5. **Abre tu navegador** en: `http://localhost:5173/`

### Opción 2: Verificar que Node.js esté instalado

Si `npm run dev` no funciona, verifica que tengas Node.js:

```bash
node --version
npm --version
```

Si no tienes Node.js, descárgalo de: https://nodejs.org/

### Opción 3: Instalar Dependencias (si es necesario)

Si es la primera vez que ejecutas el proyecto:

```bash
cd frontend/app
npm install
npm run dev
```

## 🔧 Comandos Útiles

### Iniciar Servidor
```bash
cd frontend/app
npm run dev
```

### Detener Servidor
Presiona `Ctrl + C` en la terminal donde está corriendo

### Verificar que el Servidor Esté Corriendo
- Abre: `http://localhost:5174/` (o el puerto que Vite muestre en la consola)
- Deberías ver la página de login (no el error)

## ⚠️ Problemas Comunes

### Error: "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module"
**Solución:** Ejecuta `npm install` en la carpeta `frontend/app`

### Error: "Port 5173 already in use"
**Solución:** 
- Cierra el proceso que está usando el puerto 5173
- O usa otro puerto: `npm run dev -- --port 5174`

### El servidor inicia pero la página sigue sin cargar
**Solución:**
1. Verifica que el servidor esté corriendo (deberías ver "Local: http://localhost:5173/")
2. Recarga la página con `Ctrl + F5` (limpiar caché)
3. Verifica la consola del navegador (F12) para errores

## 📝 Checklist

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Dependencias instaladas (`npm install` ejecutado)
- [ ] Servidor corriendo (`npm run dev` ejecutado)
- [ ] Terminal muestra "Local: http://localhost:5173/"
- [ ] Navegador abierto en `http://localhost:5173/`

---

**Una vez que el servidor esté corriendo, deberías ver la página de login en lugar del error.**

