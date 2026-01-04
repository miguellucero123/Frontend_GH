# 🔑 Instrucciones para Resetear Contraseña de Admin

## Problema
El usuario `admin@constructora.com` necesita tener la contraseña `admin123` para poder iniciar sesión.

## Solución

### 1. Ejecutar el Script de Reset

Desde la carpeta `backend`, ejecuta:

```bash
cd frontend/backend
python reset_admin_password.py
```

### 2. Verificar Resultado

Deberías ver:
```
Password de admin reseteado a 'admin123' y estado APPROVED.
Hash guardado: $2b$12$...
```

### 3. Probar Login

Ahora puedes iniciar sesión con:
- **Email:** `admin@constructora.com`
- **Contraseña:** `admin123`

## ⚠️ Nota Importante

El script:
- Busca el usuario `admin@constructora.com`
- Si no existe, lo crea
- Resetea la contraseña a `admin123`
- Asegura que el estado sea `APPROVED`

## 🔧 Si el Script Falla

### Error: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Error: "No such table: users"
```bash
# Asegúrate de que la base de datos esté inicializada
python -c "from database import init_db; init_db()"
```

### Error: "Database is locked"
- Cierra todas las conexiones a la base de datos
- Si usas SQLite, verifica que no haya otro proceso accediendo a `erp.db`

---

**Última actualización:** Script verificado y funcionando

