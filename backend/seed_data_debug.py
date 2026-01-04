from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from passlib.context import CryptContext
import traceback

# Configuración de hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def log(msg):
    print(msg)
    with open("seed_log.txt", "a", encoding="utf-8") as f:
        f.write(str(msg) + "\n")

def create_initial_data():
    db = SessionLocal()
    
    try:
        log("Conectando a DB...")
        # Verificar si ya existe el usuario admin
        existing_user = db.query(models.User).filter(models.User.email == "admin@constructora.com").first()
        
        if not existing_user:
            log("Creando usuario administrador...")
            hashed_password = pwd_context.hash("admin123")
            
            admin_user = models.User(
                email="admin@constructora.com",
                hashed_password=hashed_password,
                full_name="Administrador General",
                role=models.UserRole.JEFE,
                status=models.UserStatus.APPROVED,
                is_active=True
            )
            
            db.add(admin_user)
            db.commit()
            log("✅ Usuario creado exitosamente:")
            log("Email: admin@constructora.com")
            log("Password: admin123")
        else:
            log("ℹ️ El usuario admin ya existe.")
            
    except Exception as e:
        log(f"❌ Error al crear datos: {e}")
        log(traceback.format_exc())
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Limpiar log anterior
    with open("seed_log.txt", "w", encoding="utf-8") as f:
        f.write("Iniciando Seed...\n")

    try:
        # Asegurar que las tablas existan
        models.Base.metadata.create_all(bind=engine)
        create_initial_data()
    except Exception as e:
        log(f"Error fatal: {e}")
