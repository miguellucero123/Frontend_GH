# 🧹 Instrucciones: Limpiar y Reiniciar Servidor

## 🎯 Problema

Puede haber múltiples servidores ejecutándose que causan conflictos. Es necesario detenerlos todos antes de iniciar uno nuevo.

## ✅ Solución: Script de Limpieza

### Paso 1: Detener Todos los Servidores

**Doble click en:**
```
DETENER_TODOS.bat
```

Este script:
- ✅ Detiene todos los procesos de Python (http.server)
- ✅ Detiene todos los procesos de Node.js (Vite/npm)
- ✅ Libera los puertos 5174, 8080, 8002
- ✅ Espera 2 segundos para que los puertos se liberen

### Paso 2: Iniciar Servidor Limpio

**Doble click en:**
```
INICIAR_LIMPIO.bat
```

Este script:
- ✅ Primero detiene todos los servidores (llama a DETENER_TODOS.bat)
- ✅ Luego inicia el servidor HTTP en puerto 5174
- ✅ Sirve los archivos HTML vanilla desde `frontend/`
- ✅ Abre el navegador automáticamente

## 🚀 Método Rápido (Todo en Uno)

**Doble click en:**
```
INICIAR_LIMPIO.bat
```

Este script hace todo automáticamente:
1. Detiene todos los servidores
2. Espera 2 segundos
3. Inicia el servidor limpio

## 📋 Pasos Manuales (Si Prefieres)

### Opción 1: Usar los Scripts

1. **Doble click en:** `DETENER_TODOS.bat`
2. Espera a que termine
3. **Doble click en:** `SERVIDOR_5174_VANILLA.bat`

### Opción 2: Detener Manualmente

1. Abre el **Administrador de Tareas** (`Ctrl + Shift + Esc`)
2. Busca procesos:
   - `python.exe`
   - `node.exe`
3. **Termina** todos esos procesos
4. Espera 5 segundos
5. Ejecuta `SERVIDOR_5174_VANILLA.bat`

## 🐛 Si Aún Hay Problemas

### Problema: "Puerto 5174 aún está en uso"

**Solución:**
1. Ejecuta `DETENER_TODOS.bat` de nuevo
2. Espera 5 segundos
3. Verifica en el Administrador de Tareas que no haya procesos de Python o Node
4. Ejecuta `INICIAR_LIMPIO.bat`

### Problema: "No se pueden detener los procesos"

**Solución:**
1. Abre el **Administrador de Tareas** (`Ctrl + Shift + Esc`)
2. Ve a la pestaña "Detalles"
3. Busca `python.exe` y `node.exe`
4. Click derecho → "Finalizar tarea"
5. Repite para todos los procesos
6. Ejecuta `INICIAR_LIMPIO.bat`

## 📝 Verificación

Después de ejecutar `INICIAR_LIMPIO.bat`, deberías ver:

```
[OK] Python encontrado
[INFO] Iniciando servidor HTTP en puerto 5174...
[INFO] Sirviendo archivos desde: C:\...\frontend
```

**IMPORTANTE:** Debe decir `frontend` (NO `frontend\app`)

## ✅ Resumen

1. **Detener todo:** `DETENER_TODOS.bat`
2. **Iniciar limpio:** `INICIAR_LIMPIO.bat` (hace ambos pasos)

---

**¡Usa `INICIAR_LIMPIO.bat` para detener todo y empezar limpio!** 🚀

