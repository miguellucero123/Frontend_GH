from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Importar Base y modelos
from app.database import Base
from app.models import user, project, file, message

# this is the Alembic Config object
config = context.config

# Interpretar el archivo de configuración para logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Obtener URL de la base de datos desde variables de entorno
database_url = os.getenv("DATABASE_URL", "postgresql://erp_user:erp_password_2024@localhost:5432/erp_construccion")
config.set_main_option("sqlalchemy.url", database_url)

# Metadatos para autogenerate
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

