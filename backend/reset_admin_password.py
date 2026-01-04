from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, UserRole, UserStatus
from passlib.context import CryptContext

DB_URL = "sqlite:///./erp.db"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def reset_password():
    try:
        engine = create_engine(DB_URL)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        user = db.query(User).filter(User.email == "admin@constructora.com").first()
        
        if not user:
            print("Usuario admin no encontrado. Creando uno nuevo...")
            user = User(
                email="admin@constructora.com",
                nombre="Administrador",
                rol=UserRole.JEFE,
                estado=UserStatus.APPROVED
            )
            db.add(user)
        
        # Reset password
        hashed_password = pwd_context.hash("admin123")
        user.password_hash = hashed_password
        user.estado = UserStatus.APPROVED # Asegurar que esté aprobado
        
        db.commit()
        print("Password de admin reseteado a 'admin123' y estado APPROVED.")
        print(f"Hash guardado: {hashed_password[:10]}...")
        
    except Exception as e:
        print(f"Error reset password: {e}")

if __name__ == "__main__":
    reset_password()
