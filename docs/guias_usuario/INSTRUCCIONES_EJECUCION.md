# 📖 Instrucciones de Ejecución - Paso a Paso

## 🎯 Método Más Simple

### Paso 1: Abrir Terminal
- Presiona `Win + R`
- Escribe `cmd` y presiona Enter
- O busca "Símbolo del sistema" en el menú de inicio

### Paso 2: Navegar a la Carpeta
```bash
cd C:\Users\Alicia_Piero\Documents\Repo_AIEP\ERP_Costructora\frontend
```

### Paso 3: Ejecutar
```bash
npm start
```

### Paso 4: Esperar
- El servidor iniciará
- Se abrirá automáticamente el navegador
- Verás el login con formato innovador

## 🖱️ Método con Doble Click (Más Fácil)

### Opción A: Script .bat
1. Navega a la carpeta `frontend`
2. Doble click en `EJECUTAR.bat`
3. Espera a que se abra el navegador

### Opción B: Desde la Raíz
1. Navega a la carpeta raíz del proyecto
2. Doble click en `INICIAR_SERVIDOR.bat`
3. Espera a que se abra el navegador

## 🔍 Verificación Rápida

### ¿Funcionó?
- ✅ Se abrió el navegador
- ✅ Ves el login con fondo oscuro
- ✅ Hay efectos animados en el fondo
- ✅ El card tiene efecto glassmorphism
- ✅ Hay un badge que dice "API: CHECKING" o "API: ONLINE/OFFLINE"

### Si NO funcionó:
1. Verifica que Node.js esté instalado:
   ```bash
   node --version
   ```
2. Si no está instalado, descarga desde: https://nodejs.org/
3. Reinstala las dependencias:
   ```bash
   cd frontend
   npm install
   ```

## 🎨 Qué Deberías Ver

### En el Login:
- **Fondo:** Oscuro (negro/gris muy oscuro)
- **Efectos:** Círculos grandes con blur que pulsan suavemente
- **Card:** Fondo semitransparente blanco con blur (glassmorphism)
- **Badge:** Pequeño badge arriba del logo con estado del backend
- **Logo:** Logo de la empresa centrado
- **Inputs:** Campos oscuros con iconos a la izquierda
- **Botón:** Botón azul/indigo con gradiente

### Después del Login:
- **Sidebar:** Barra lateral oscura a la izquierda
- **Header:** Barra superior con efecto glassmorphism
- **Contenido:** Área principal con el dashboard

## 📱 Acceso Rápido

Una vez que el servidor esté corriendo, puedes acceder desde:
- **URL Principal:** `http://localhost:8080`
- **Desde otro dispositivo en la red:** `http://[TU-IP]:8080`

## ⚠️ Notas Importantes

1. **No cierres la terminal** mientras uses el sistema
2. **Para detener:** Presiona `Ctrl+C` en la terminal
3. **Si cambias archivos:** Recarga la página (F5) para ver cambios
4. **Modo DEMO:** Funciona sin backend, muestra credenciales automáticamente

---

**¡Ejecuta y disfruta del formato innovador!** 🚀

