"""
Script para crear un usuario trabajador de ejemplo
Ejecutar: python create_worker_user.py
"""
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole, UserStatus
from auth import get_password_hash

def create_worker_user():
    db = SessionLocal()
    try:
        worker_email = "trabajador@constructora.com"
        worker = db.query(User).filter(User.email == worker_email).first()
        
        if not worker:
            print("Creando usuario trabajador...")
            new_worker = User(
                nombre="Juan Pérez",
                email=worker_email,
                password_hash=get_password_hash("trabajador123"),
                rol=UserRole.TRABAJADOR,
                estado=UserStatus.APPROVED
            )
            db.add(new_worker)
            db.commit()
            print("[OK] Usuario trabajador creado exitosamente:")
            print(f"   Email: {worker_email}")
            print(f"   Contraseña: trabajador123")
            print(f"   Nombre: Juan Perez")
            print(f"   Rol: Trabajador")
        else:
            print("[INFO] El usuario trabajador ya existe.")
            print(f"   Email: {worker.email}")
            print(f"   Nombre: {worker.nombre}")
            print(f"   Rol: {worker.rol.value}")
            
            # Opción para resetear la contraseña
            reset = input("\n¿Deseas resetear la contraseña a 'trabajador123'? (s/n): ")
            if reset.lower() == 's':
                worker.password_hash = get_password_hash("trabajador123")
                db.commit()
                print("[OK] Contraseña reseteada a: trabajador123")
    except Exception as e:
        print(f"[ERROR] Error al crear usuario trabajador: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_worker_user()

