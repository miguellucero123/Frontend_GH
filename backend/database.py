from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Determinar si estamos en Docker o local
# Si existe la variable DATABASE_URL, úsala (para producción/docker)
# Si no, usa SQLite local por defecto
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Configuración para PostgreSQL (Docker/Prod)
    engine = create_engine(DATABASE_URL)
else:
    # Configuración para SQLite (Local)
    SQLALCHEMY_DATABASE_URL = "sqlite:///./erp_construction.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}  # Necesario para SQLite
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
