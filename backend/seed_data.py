from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from passlib.context import CryptContext

# Configuración de hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_initial_data():
    db = SessionLocal()
    
    try:
        # Verificar si ya existe el usuario admin
        existing_user = db.query(models.User).filter(models.User.email == "admin@constructora.com").first()
        
        if not existing_user:
            print("Creando usuario administrador...")
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
            print("✅ Usuario creado exitosamente:")
            print("Email: admin@constructora.com")
            print("Password: admin123")
        else:
            print("ℹ️ El usuario admin ya existe.")
            
    except Exception as e:
        print(f"❌ Error al crear datos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Asegurar que las tablas existan
    models.Base.metadata.create_all(bind=engine)
    create_initial_data()
