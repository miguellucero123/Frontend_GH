from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
from routers import auth, folders, chat
from routers import projects_new as projects
from routers import automation
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole, UserStatus
from auth import get_password_hash

# Tablas
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="ERP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "online"}

@app.get("/api/health")
def api_health():
    return {"status": "online"}

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Crear usuario admin si no existe
        admin_email = "admin@constructora.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            new_admin = User(
                nombre="Administrador",
                email=admin_email,
                password_hash=get_password_hash("admin123"),
                rol=UserRole.JEFE,
                estado=UserStatus.APPROVED
            )
            db.add(new_admin)
            db.commit()
            print("[OK] Usuario admin creado: admin@constructora.com / admin123")
        
        # Crear usuario trabajador si no existe
        worker_email = "trabajador@constructora.com"
        worker = db.query(User).filter(User.email == worker_email).first()
        if not worker:
            new_worker = User(
                nombre="Juan Pérez",
                email=worker_email,
                password_hash=get_password_hash("trabajador123"),
                rol=UserRole.TRABAJADOR,
                estado=UserStatus.APPROVED
            )
            db.add(new_worker)
            db.commit()
            print("[OK] Usuario trabajador creado: trabajador@constructora.com / trabajador123")
        else:
            print("[INFO] Usuario trabajador ya existe: trabajador@constructora.com")
        
        # Crear usuario cliente si no existe
        client_email = "cliente@constructora.com"
        client = db.query(User).filter(User.email == client_email).first()
        if not client:
            new_client = User(
                nombre="María González",
                email=client_email,
                password_hash=get_password_hash("cliente123"),
                rol=UserRole.CLIENTE,
                estado=UserStatus.APPROVED
            )
            db.add(new_client)
            db.commit()
            print("[OK] Usuario cliente creado: cliente@constructora.com / cliente123")
        else:
            print("[INFO] Usuario cliente ya existe: cliente@constructora.com")
    except Exception as e:
        print(f"Startup error: {e}")
    finally:
        db.close()

# Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(folders.router)
app.include_router(chat.router)
app.include_router(automation.router)  # Automatización con n8n

@app.get("/")
def root():
    return {"message": "API Running"}
