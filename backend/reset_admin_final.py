from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, UserRole, UserStatus
from auth import get_password_hash

# USAR EL NOMBRE CORRECTO DE LA DB
DB_URL = "sqlite:///./erp_construction.db"

def reset_admin():
    engine = create_engine(DB_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    admin_email = "admin@constructora.com"
    user = db.query(User).filter(User.email == admin_email).first()
    
    if not user:
        print(f"Creating new admin user: {admin_email}")
        user = User(
            email=admin_email,
            nombre="Administrador",
            rol=UserRole.JEFE,
            estado=UserStatus.APPROVED,
            password_hash=get_password_hash("admin123")
        )
        db.add(user)
    else:
        print(f"Updating existing admin user: {admin_email}")
        user.password_hash = get_password_hash("admin123")
        user.estado = UserStatus.APPROVED
        user.rol = UserRole.JEFE
    
    db.commit()
    print("Admin user is now ready with password 'admin123'")
    db.close()

if __name__ == "__main__":
    reset_admin()
