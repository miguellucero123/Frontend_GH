from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

# ============= ENUMS =============
class UserRole(str, Enum):
    JEFE = "jefe"
    TRABAJADOR = "trabajador"
    CLIENTE = "cliente"

class UserStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    INACTIVE = "inactive"

# ============= USUARIOS =============
class UserBase(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = None
    rol: UserRole

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    password: Optional[str] = None

class UserApproval(BaseModel):
    user_id: int
    approved: bool  # True = aprobar, False = rechazar

class User(UserBase):
    id: int
    estado: UserStatus
    fecha_registro: datetime
    ultimo_acceso: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============= PROYECTOS =============
class ProjectBase(BaseModel):
    # Información básica (a-d)
    nombre_mandante: str
    direccion: str
    ciudad: str
    descripcion: Optional[str] = None
    
    # Fechas (e-f)
    fecha_inicio: date
    fecha_termino_estimado: date
    
    # Costos (h-j)
    costo_inicial: float
    costos_adicionales: float = 0
    costos_extras: float = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    nombre_mandante: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_termino_estimado: Optional[date] = None
    fecha_termino_real: Optional[date] = None
    costos_adicionales: Optional[float] = None
    costos_extras: Optional[float] = None
    costo_final: Optional[float] = None

class ProjectSimple(BaseModel):
    id: int
    nombre_mandante: str
    ciudad: str
    fecha_inicio: date
    
    class Config:
        from_attributes = True

# Ahora podemos definir UserWithProjects
class UserWithProjects(User):
    proyectos: List[ProjectSimple] = []

class Project(ProjectBase):
    id: int
    fecha_termino_real: Optional[date] = None
    costo_final: Optional[float] = None
    creado_por_id: int
    fecha_creacion: datetime
    activo: bool
    
    class Config:
        from_attributes = True

class ProjectWithUsers(Project):
    usuarios_asignados: List[User] = []

class ProjectForClient(BaseModel):
    """Vista limitada para clientes - sin costos"""
    id: int
    nombre_mandante: str
    direccion: str
    ciudad: str
    descripcion: Optional[str] = None
    fecha_inicio: date
    fecha_termino_estimado: date
    fecha_termino_real: Optional[date] = None
    
    class Config:
        from_attributes = True

# ============= ASIGNACIÓN DE USUARIOS A PROYECTOS =============
class ProjectUserAssignment(BaseModel):
    proyecto_id: int
    usuario_id: int
    can_upload_files: bool = False
    can_edit_project: bool = False

# ============= CARPETAS =============
class FolderBase(BaseModel):
    nombre: str
    carpeta_padre_id: Optional[int] = None

class FolderCreate(FolderBase):
    proyecto_id: int

class Folder(FolderBase):
    id: int
    proyecto_id: int
    creado_por_id: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

class FolderWithSubfolders(Folder):
    subcarpetas: List['FolderWithSubfolders'] = []

# ============= ARCHIVOS =============
class FileBase(BaseModel):
    nombre: str

class FileUpload(BaseModel):
    proyecto_id: int
    carpeta_id: Optional[int] = None

class File(FileBase):
    id: int
    nombre_original: str
    tipo_archivo: str
    tamanio: int
    proyecto_id: int
    carpeta_id: Optional[int] = None
    subido_por_id: int
    fecha_subida: datetime
    
    class Config:
        from_attributes = True

class FileWithPermissions(File):
    puede_ver: bool = True
    puede_descargar: bool = True

# ============= PERMISOS DE ARCHIVOS =============
class FilePermissionBase(BaseModel):
    archivo_id: int
    usuario_id: int
    puede_ver: bool = True
    puede_descargar: bool = True

class FilePermissionCreate(FilePermissionBase):
    pass

class FilePermission(FilePermissionBase):
    id: int
    
    class Config:
        from_attributes = True

# ============= MENSAJES =============
class MessageBase(BaseModel):
    contenido: str
    archivo_adjunto: Optional[str] = None

class MessageCreate(MessageBase):
    proyecto_id: int
    destinatario_id: int

class Message(MessageBase):
    id: int
    proyecto_id: int
    remitente_id: int
    destinatario_id: int
    leido: bool
    fecha_envio: datetime
    fecha_lectura: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class MessageWithUsers(Message):
    remitente: User
    destinatario: User

class ChatChannel(BaseModel):
    """Canal de chat entre dos usuarios en un proyecto"""
    proyecto_id: int
    proyecto_nombre: str
    otro_usuario: User
    ultimo_mensaje: Optional[Message] = None
    mensajes_no_leidos: int = 0

# ============= SCHEMAS LEGACY (CPM) =============
class TaskBase(BaseModel):
    wbs_code: Optional[str] = None
    name: str
    duration: int = Field(default=1, gt=0)

class TaskCreate(TaskBase):
    project_id: int

class Task(TaskBase):
    id: int
    project_id: int
    early_start: Optional[int] = None
    early_finish: Optional[int] = None
    late_start: Optional[int] = None
    late_finish: Optional[int] = None
    total_float: Optional[int] = None
    is_critical: bool = False
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    class Config:
        from_attributes = True

class DependencyBase(BaseModel):
    predecessor_id: int
    successor_id: int
    type: str = "FS"
    lag: int = 0

class DependencyCreate(DependencyBase):
    pass

class Dependency(DependencyBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase_Legacy(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date

class ProjectCreate_Legacy(ProjectBase_Legacy):
    pass

class Project_Legacy(ProjectBase_Legacy):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CalculationResult(BaseModel):
    project_id: int
    critical_path_length: int
    critical_tasks: List[int]
    message: str

# ============= RESPUESTAS DE AUTENTICACIÓN =============
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
    rol: Optional[UserRole] = None

# Update forward references
FolderWithSubfolders.model_rebuild()
