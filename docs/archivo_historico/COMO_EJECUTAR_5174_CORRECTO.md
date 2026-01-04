# 🚀 Cómo Ejecutar en Puerto 5174 (HTML Vanilla)

## 🎯 Problema Identificado

El puerto **5174** está configurado para servir la **aplicación React** (`frontend/app/`), pero necesitas los **archivos HTML vanilla** (`frontend/`).

## ✅ Solución: Script Específico

### Usar Este Script (Recomendado)

**Doble click en:**
```
SERVIDOR_5174_VANILLA.bat
```

Este script:
- ✅ Sirve **SOLO** los archivos HTML vanilla
- ✅ Desde la carpeta `frontend/` (NO `frontend/app/`)
- ✅ En el puerto 5174
- ✅ Abre `index.html` directamente

## 📋 Qué Hace el Script

1. **Verifica Python** (necesario para el servidor HTTP)
2. **Se posiciona en `frontend/`** (carpeta correcta)
3. **Inicia servidor HTTP** en puerto 5174
4. **Abre el navegador** en `http://localhost:5174/index.html`

## 🚀 Pasos para Ejecutar

### Paso 1: Cerrar Todo

1. Cierra todas las ventanas del servidor
2. Cierra el navegador

### Paso 2: Ejecutar Script

**Doble click en:**
```
SERVIDOR_5174_VANILLA.bat
```

### Paso 3: Verificar

Deberías ver en la ventana del servidor:
```
[OK] Python encontrado
[INFO] Iniciando servidor HTTP en puerto 5174...
[INFO] Sirviendo archivos desde: C:\...\frontend
```

**IMPORTANTE:** Debe decir `frontend` (NO `frontend\app`)

### Paso 4: Verificar en el Navegador

1. Debería abrirse automáticamente en `http://localhost:5174/index.html`
2. Deberías ver la página de login (formato innovador)
3. NO deberías ver la aplicación React

## 🐛 Si Aún No Funciona

### Problema: "Sigue mostrando React"

**Causa:** El servidor está sirviendo desde `frontend/app/` en lugar de `frontend/`

**Solución:**
1. Verifica que el script `SERVIDOR_5174_VANILLA.bat` esté en la carpeta `frontend/`
2. Verifica que el servidor diga: `Sirviendo archivos desde: C:\...\frontend`
3. Si dice `frontend\app`, está mal - cierra y vuelve a ejecutar

### Problema: "No encuentra index.html"

**Solución:**
1. Verifica que `index.html` exista en `frontend/`
2. Abre manualmente: `http://localhost:5174/index.html`
3. Verifica que el servidor esté en la carpeta correcta

### Problema: "Python no encontrado"

**Solución:**
1. Instala Python desde: https://www.python.org/
2. O usa `INICIAR_5174.bat` (también usa Python)

## 📝 Diferencia Entre Scripts

| Script | Qué Sirve | Desde Dónde | Puerto |
|--------|-----------|-------------|--------|
| `EJECUTAR.bat` | React App | `frontend/app/` | 5174 |
| `SERVIDOR_5174_VANILLA.bat` | HTML Vanilla | `frontend/` | 5174 |
| `EJECUTAR_SIMPLE.bat` | HTML Vanilla | `frontend/` | 5174 |
| `INICIAR_SERVIDOR.bat` | HTML Vanilla | `frontend/` | 8080 |

## ✅ Resumen

**Para servir HTML vanilla en puerto 5174:**
- Usa: `SERVIDOR_5174_VANILLA.bat`

**Para servir HTML vanilla en puerto 8080:**
- Usa: `INICIAR_SERVIDOR.bat`

---

**¡Usa `SERVIDOR_5174_VANILLA.bat` y debería funcionar correctamente!** 🚀

