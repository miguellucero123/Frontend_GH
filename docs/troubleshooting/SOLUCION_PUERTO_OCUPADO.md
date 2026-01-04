# 🔧 Solución: Puerto 5173 Ocupado

## ❌ Problema
El puerto 5173 está siendo usado por otro proceso y Vite no puede iniciar.

## ✅ Soluciones

### Opción 1: Usar Puerto Alternativo (Recomendado)

He cambiado la configuración para usar el puerto **5174**:

**Archivo actualizado:** `frontend/app/vite.config.ts`
```typescript
port: 5174, // Puerto alternativo
strictPort: false, // Usar siguiente puerto disponible si está ocupado
```

**Ahora inicia con:**
```bash
cd frontend/app
npm run dev
```

**Abre:** `http://localhost:5174/`

### Opción 2: Liberar el Puerto 5173

Si prefieres usar el puerto 5173 original:

#### Windows:
```powershell
# Encontrar proceso usando el puerto
netstat -ano | findstr :5173

# Matar el proceso (reemplaza PID con el número que aparezca)
taskkill /PID <PID> /F
```

#### Linux/Mac:
```bash
# Encontrar proceso
lsof -i :5173

# Matar el proceso
kill -9 <PID>
```

### Opción 3: Usar Puerto Personalizado

Puedes especificar cualquier puerto al iniciar:

```bash
cd frontend/app
npm run dev -- --port 3000
# O
npm run dev -- --port 8080
```

Luego actualiza CORS en el backend si es necesario.

---

## 🔄 Actualización de CORS

He actualizado el backend para aceptar múltiples puertos:
- `5173` (original)
- `5174` (alternativo - ahora configurado)
- `5175` (alternativo adicional)
- `3000` (otro común)
- `8080` (vanilla JS)

**No necesitas cambiar nada más**, el backend ya acepta estos puertos.

---

## ✅ Verificación

1. **Inicia el servidor:**
   ```bash
   cd frontend/app
   npm run dev
   ```

2. **Deberías ver:**
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5174/
   ```

3. **Abre en navegador:**
   `http://localhost:5174/`

---

## 📝 Nota

Si Vite encuentra que 5174 también está ocupado, automáticamente usará el siguiente puerto disponible (5175, 5176, etc.) gracias a `strictPort: false`.

---

**Solución aplicada:** Puerto cambiado a 5174 ✅

