# 🧹 Resumen: Limpiar y Reiniciar Servidor

## 🎯 Problema

Múltiples servidores pueden estar ejecutándose, causando conflictos en los puertos.

## ✅ Solución Rápida

### Método Todo en Uno (Recomendado)

**Doble click en:**
```
INICIAR_LIMPIO.bat
```

Este script hace **TODO automáticamente**:
1. ✅ Detiene todos los procesos de Python (http.server)
2. ✅ Detiene todos los procesos de Node.js (Vite/npm)
3. ✅ Libera los puertos 5174, 8080, 8002
4. ✅ Espera 2 segundos para que los puertos se liberen
5. ✅ Inicia el servidor HTTP en puerto 5174
6. ✅ Sirve los archivos HTML vanilla desde `frontend/`
7. ✅ Abre el navegador automáticamente

## 📋 Scripts Disponibles

| Script | Qué Hace |
|--------|----------|
| `INICIAR_LIMPIO.bat` | **TODO EN UNO** - Detiene todo y inicia servidor limpio |
| `DETENER_TODOS.bat` | Solo detiene todos los servidores |
| `SERVIDOR_5174_VANILLA.bat` | Solo inicia servidor (sin detener) |

## 🚀 Pasos

1. **Doble click en:** `INICIAR_LIMPIO.bat`
2. Espera a que termine la limpieza
3. El navegador se abrirá automáticamente
4. Deberías ver la página de login

## ✅ Verificación

Después de ejecutar, deberías ver:

```
[OK] Procesos de Python detenidos (o no encontrados)
[OK] Procesos de Node.js detenidos (o no encontrados)
[OK] Servidores detenidos
[OK] Python encontrado
[INFO] Iniciando servidor HTTP en puerto 5174...
[INFO] Sirviendo archivos desde: C:\...\frontend
```

**IMPORTANTE:** Debe decir `frontend` (NO `frontend\app`)

## 🐛 Si Aún Hay Problemas

1. Ejecuta `DETENER_TODOS.bat` manualmente
2. Espera 5 segundos
3. Abre el **Administrador de Tareas** (`Ctrl + Shift + Esc`)
4. Verifica que no haya procesos de `python.exe` o `node.exe`
5. Si los hay, termínalos manualmente
6. Ejecuta `INICIAR_LIMPIO.bat` de nuevo

---

**¡Usa `INICIAR_LIMPIO.bat` para empezar limpio!** 🚀

