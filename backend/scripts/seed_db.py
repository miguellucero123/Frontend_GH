"""
Script para poblar la base de datos con datos de prueba
Ejecutar: python -m scripts.seed_db
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.core.security import get_password_hash
from app.database import Base

def seed_database():
    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar si ya hay datos
        if db.query(User).first():
            print("⚠️  La base de datos ya tiene datos. Abortando...")
            return
        
        print("🌱 Sembrando base de datos...")
        
        # Crear usuarios
        jefe = User(
            email="jefe@construccion.cl",
            hashed_password=get_password_hash("Jefe123456"),
            full_name="Carlos Jefe",
            phone="+56912345678",
            role=UserRole.JEFE,
            is_active=True
        )
        
        cliente1 = User(
            email="cliente1@gmail.com",
            hashed_password=get_password_hash("Cliente123456"),
            full_name="María González",
            phone="+56987654321",
            role=UserRole.CLIENTE,
            is_active=True
        )
        
        cliente2 = User(
            email="cliente2@gmail.com",
            hashed_password=get_password_hash("Cliente123456"),
            full_name="Pedro Martínez",
            phone="+56911111111",
            role=UserRole.CLIENTE,
            is_active=True
        )
        
        db.add_all([jefe, cliente1, cliente2])
        db.commit()
        
        # Crear proyectos
        proyecto1 = Project(
            name="Remodelación Casa Viña del Mar",
            description="Remodelación completa de cocina y baños",
            location="Viña del Mar, Valparaíso",
            budget=15000000.0,
            actual_cost=8500000.0,
            status=ProjectStatus.EN_CURSO,
            client_id=cliente1.id
        )
        
        proyecto2 = Project(
            name="Construcción Terraza",
            description="Construcción de terraza con quincho",
            location="Quilpué, Valparaíso",
            budget=8000000.0,
            actual_cost=0.0,
            status=ProjectStatus.COTIZACION,
            client_id=cliente2.id
        )
        
        proyecto3 = Project(
            name="Ampliación Segundo Piso",
            description="Construcción de segundo piso",
            location="Valparaíso Centro",
            budget=25000000.0,
            actual_cost=25000000.0,
            status=ProjectStatus.COMPLETADO,
            client_id=cliente1.id
        )
        
        db.add_all([proyecto1, proyecto2, proyecto3])
        db.commit()
        
        print("✅ Base de datos sembrada exitosamente!")
        print("\n📝 Credenciales de prueba:")
        print("   Jefe: jefe@construccion.cl / Jefe123456")
        print("   Cliente 1: cliente1@gmail.com / Cliente123456")
        print("   Cliente 2: cliente2@gmail.com / Cliente123456")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

