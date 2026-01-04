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
            pass_hash = pwd_context.hash("admin123")
            
            admin_user = models.User(
                email="admin@constructora.com",
                password_hash=pass_hash,  # Corregido: antes era hashed_password
                nombre="Administrador General", # Corregido: antes era full_name
                rol=models.UserRole.JEFE,
                estado=models.UserStatus.APPROVED, # Corregido: antes era status
                # is_active no existe en el modelo nuevo, se asume por estado APPROVED? 
                # Reviso modelo: Line 44: estado = Column(Enum(UserStatus)...
                # No hay campo is_active en User model! Hay estado.
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
    with open("seed_log.txt", "w", encoding="utf-8") as f:
        f.write("Iniciando Seed Final...\n")

    try:
        models.Base.metadata.create_all(bind=engine)
        create_initial_data()
    except Exception as e:
        log(f"Error fatal: {e}")
