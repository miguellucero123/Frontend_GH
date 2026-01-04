# 🗄️ Plan de Migración de Base de Datos: SQLite a PostgreSQL
## ERP Constructora G&H - Enterprise Edition

Este documento define la estrategia técnica para migrar la capa de persistencia desde SQLite (prototipo) a PostgreSQL (producción/enterprise), garantizando integridad de datos y cero tiempo de inactividad percibido.

---

## 1. Contexto y Justificación
Actualmente el sistema opera con `sqlite.db` local. Esto presenta limitaciones:
- **Concurrencia**: Bloqueos de escritura en operaciones simultáneas.
- **Escalabilidad**: Rendimiento degradado con >100MB de datos.
- **Tipos de Datos**: Falta de soporte nativo para arrays y JSONB avanzado que requiere la Fase 3.

**Objetivo**: Implementar PostgreSQL 16+ para soportar alta transaccionalidad, gestión de usuarios concurrentes y tipos de datos complejos.

---

## 2. Arquitectura Destino

### Infraestructura
- **Motor**: PostgreSQL 16.2
- **Hosting**: AWS RDS / Azure Database for PostgreSQL / Docker Container (On-premise)
- **Driver**: `asyncpg` (Python) para soporte asíncrono nativo con FastAPI.

### Configuración del Pool
- Implementación de `PgBouncer` para gestión eficiente de conexiones.
- Configuración de `max_connections` ajustada a la carga esperada (ej: 200).

---

## 3. Estrategia de Migración

### Fase A: Preparación (Dev)
1.  **Docker Local**: Levantar contenedor PostgreSQL.
    ```bash
    docker run --name erp-db -e POSTGRES_PASSWORD=secret -d -p 5432:5432 postgres
    ```
2.  **Adaptación de Modelos (SQLAlchemy)**:
    - Reemplazar `Integer` PK por `BigInteger` (o `UUID`).
    - Migrar campos `JSON` de SQLite a `JSONB` de Postgres.
    - Asegurar que `DateTime` sea `timezone=True`.

### Fase B: Exportación y Transformación (ETL)
1.  **Dump de SQLite**:
    ```bash
    sqlite3 constructora.db .dump > dump.sql
    ```
2.  **Limpieza de SQL**:
    - Remover `PRAGMA` statements.
    - Convertir sintaxis de fechas si es necesario.
    - Ajustar comillas y escapes propietarios.
3.  **Herramienta Recomendada**: Usar `pgloader` para automigración.
    ```bash
    pgloader sqlite:///path/to/constructora.db postgresql:///erp_db
    ```

### Fase C: Ejecución y Switch
1.  Detener servicios de escritura (Modo Mantenimiento).
2.  Ejecutar migración de datos (`pgloader`).
3.  Validar integridad (Counts, Checksums).
4.  Cambiar `DATABASE_URL` en `config.env` (o `.env`).
5.  Reiniciar Backend.

---

## 4. Cambios en Backend (Python)

### Dependencias (`requirements.txt`)
- Remover: `sqlite` (buit-in)
- Agregar: `psycopg2-binary`, `asyncpg`

### Configuración (`database.py`)
```python
# ANTES
DATABASE_URL = "sqlite:///./constructora.db"

# AHORA
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:pass@host:5432/erp_db")
```

---

## 5. Plan de Rollback
En caso de fallo crítico en Producción:
1.  Revertir `DATABASE_URL` para apuntar a `sqlite.db` (solo lectura temporal).
2.  Analizar logs de `pgloader` o errores de conexión.
3.  Restaurar backup de SQLite si hubo corrupción.

---

## Estado Actual
- [x] Diseño del Plan
- [ ] Configuración Docker (Pendiente)
- [ ] Ejecución de Migración (Pendiente)
