from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional

from database import get_db
from models import User, UserStatus
from schemas import (
    UserCreate, User as UserSchema, UserLogin, Token,
    UserApproval, UserWithProjects, UserRole
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_active_user, require_jefe, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

# ============= REGISTRO DE USUARIO =============
@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario (estado: PENDING)
    Requiere aprobación del JEFE para activarse
    """
    # Verificar si el email ya existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario
    new_user = User(
        nombre=user_data.nombre,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        telefono=user_data.telefono,
        rol=user_data.rol,
        estado=UserStatus.PENDING  # Requiere aprobación
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# ============= LOGIN =============
@router.post("/login", response_model=Token)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Inicia sesión con email y contraseña
    Retorna un token JWT
    """
    user = authenticate_user(db, login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "rol": user.rol.value
        },
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# ============= OBTENER USUARIO ACTUAL =============
@router.get("/me", response_model=UserWithProjects)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Obtiene la información del usuario actual"""
    return current_user

# ============= APROBAR/RECHAZAR USUARIOS (Solo JEFE) =============
@router.post("/approve", response_model=UserSchema)
def approve_user(
    approval: UserApproval,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Aprueba o rechaza un usuario pendiente
    Solo accesible para usuarios con rol JEFE
    """
    user = db.query(User).filter(User.id == approval.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    if user.estado != UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El usuario ya fue procesado. Estado actual: {user.estado}"
        )
    
    # Actualizar estado
    if approval.approved:
        user.estado = UserStatus.APPROVED
        from datetime import datetime
        user.fecha_aprobacion = datetime.utcnow()
        user.aprobado_por_id = current_user.id
    else:
        user.estado = UserStatus.REJECTED
    
    db.commit()
    db.refresh(user)
    
    return user

# ============= LISTAR USUARIOS PENDIENTES (Solo JEFE) =============
@router.get("/pending", response_model=List[UserSchema])
def get_pending_users(
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Lista todos los usuarios pendientes de aprobación
    Solo accesible para usuarios con rol JEFE
    """
    pending_users = db.query(User).filter(User.estado == UserStatus.PENDING).all()
    return pending_users

# ============= LISTAR TODOS LOS USUARIOS (Solo JEFE) =============
@router.get("/users", response_model=List[UserSchema])
def get_all_users(
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db),
    rol: Optional[UserRole] = None,
    estado: Optional[UserStatus] = None
):
    """
    Lista todos los usuarios con filtros opcionales
    Solo accesible para usuarios con rol JEFE
    """
    query = db.query(User)
    
    if rol:
        query = query.filter(User.rol == rol)
    
    if estado:
        query = query.filter(User.estado == estado)
    
    users = query.all()
    return users

# ============= CAMBIAR ESTADO DE USUARIO (Solo JEFE) =============
@router.patch("/users/{user_id}/status", response_model=UserSchema)
def change_user_status(
    user_id: int,
    new_status: UserStatus,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Cambia el estado de un usuario
    Solo accesible para usuarios con rol JEFE
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # No permitir cambiar el estado del propio jefe
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes cambiar tu propio estado"
        )
    
    user.estado = new_status
    db.commit()
    db.refresh(user)
    
    return user
