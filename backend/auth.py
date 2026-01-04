from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserStatus
from schemas import TokenData, UserRole

# Configuración de seguridad
SECRET_KEY = "tu_clave_secreta_super_segura_cambiar_en_produccion_123456789"  # CAMBIAR EN PRODUCCIÓN
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ============= FUNCIONES DE HASH =============
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica que la contraseña coincida con el hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera el hash de una contraseña"""
    return pwd_context.hash(password)

# ============= FUNCIONES DE TOKEN JWT =============
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crea un token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> TokenData:
    """Decodifica y valida un token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        rol: str = payload.get("rol")
        
        if email is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return TokenData(email=email, user_id=user_id, rol=UserRole(rol) if rol else None)
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ============= AUTENTICACIÓN DE USUARIO =============
def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Autentica un usuario con email y contraseña"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    # Verificar que el usuario esté aprobado
    if user.estado != UserStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Usuario no aprobado. Estado actual: {user.estado}"
        )
    
    return user

# ============= DEPENDENCIAS DE AUTENTICACIÓN =============
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Obtiene el usuario actual desde el token JWT"""
    token_data = decode_access_token(token)
    
    user = db.query(User).filter(User.id == token_data.user_id).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.estado != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario no activo"
        )
    
    # Actualizar último acceso
    user.ultimo_acceso = datetime.utcnow()
    db.commit()
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verifica que el usuario esté activo"""
    if current_user.estado == "inactive":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    return current_user

# ============= VERIFICACIÓN DE ROLES =============
class RoleChecker:
    """Clase para verificar roles de usuario"""
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.rol not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere rol: {', '.join([r.value for r in self.allowed_roles])}"
            )
        return current_user

# Dependencias de rol predefinidas
require_jefe = RoleChecker([UserRole.JEFE])
require_trabajador_or_jefe = RoleChecker([UserRole.JEFE, UserRole.TRABAJADOR])
require_any_role = RoleChecker([UserRole.JEFE, UserRole.TRABAJADOR, UserRole.CLIENTE])

# ============= VERIFICACIÓN DE PERMISOS DE PROYECTO =============
def check_project_access(user: User, project_id: int, db: Session) -> bool:
    """Verifica si un usuario tiene acceso a un proyecto"""
    # El jefe tiene acceso a todos los proyectos
    if user.rol == UserRole.JEFE:
        return True
    
    # Verificar si el usuario está asignado al proyecto
    from models import project_users
    assignment = db.query(project_users).filter(
        project_users.c.user_id == user.id,
        project_users.c.project_id == project_id
    ).first()
    
    return assignment is not None

def require_project_access(project_id: int):
    """Dependencia para verificar acceso a un proyecto específico"""
    def _check_access(
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db)
    ) -> User:
        if not check_project_access(current_user, project_id, db):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes acceso a este proyecto"
            )
        return current_user
    
    return _check_access

# ============= VERIFICACIÓN DE PERMISOS DE ARCHIVOS =============
def check_file_permission(user: User, file_id: int, db: Session, permission_type: str = "ver") -> bool:
    """Verifica si un usuario tiene permiso para un archivo"""
    from models import File, FilePermission
    
    # El jefe tiene acceso a todos los archivos
    if user.rol == UserRole.JEFE:
        return True
    
    # Obtener el archivo
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        return False
    
    # Verificar acceso al proyecto
    if not check_project_access(user, file.proyecto_id, db):
        return False
    
    # Verificar permisos específicos del archivo
    permission = db.query(FilePermission).filter(
        FilePermission.archivo_id == file_id,
        FilePermission.usuario_id == user.id
    ).first()
    
    if not permission:
        # Si no hay permisos específicos, denegar acceso por defecto
        return False
    
    if permission_type == "ver":
        return permission.puede_ver
    elif permission_type == "descargar":
        return permission.puede_descargar
    
    return False

# ============= HELPER PARA WEBSOCKETS =============
def get_user_from_token(token: str, db: Session) -> Optional[User]:
    """Helper para obtener usuario desde token (sin depender de request context de FastAPI)"""
    try:
        # Reutilizamos decode_access_token que ya valida firma y expiración
        token_data = decode_access_token(token)
        user = db.query(User).filter(User.id == token_data.user_id).first()
        # Verificar UserStatus (enum)
        if user and user.estado == UserStatus.APPROVED:
            return user
    except Exception:
        pass
    return None

