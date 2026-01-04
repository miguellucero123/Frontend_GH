from sqlalchemy import create_engine, Column, Integer, String, Date, Float, ForeignKey, Boolean, DateTime, Text, Enum, Numeric, Table
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import enum

Base = declarative_base()

# Enums
class UserRole(str, enum.Enum):
    JEFE = "jefe"
    TRABAJADOR = "trabajador"
    CLIENTE = "cliente"

class UserStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    INACTIVE = "inactive"

# Tabla de asociación para usuarios y proyectos
project_users = Table(
    'project_users',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('project_id', Integer, ForeignKey('projects.id', ondelete='CASCADE')),
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE')),
    Column('can_upload_files', Boolean, default=False),
    Column('can_edit_project', Boolean, default=False),
    Column('assigned_at', DateTime, default=datetime.utcnow)
)

# ============= USUARIOS =============
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    telefono = Column(String(20))
    
    # Rol y estado
    rol = Column(Enum(UserRole), nullable=False)
    estado = Column(Enum(UserStatus), default=UserStatus.PENDING)
    
    # Timestamps
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    ultimo_acceso = Column(DateTime, nullable=True)
    aprobado_por_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    fecha_aprobacion = Column(DateTime, nullable=True)
    
    # Relationships
    aprobado_por = relationship("User", remote_side=[id], backref="usuarios_aprobados")
    proyectos = relationship("Project", secondary=project_users, back_populates="usuarios_asignados")
    mensajes_enviados = relationship("Message", foreign_keys="[Message.remitente_id]", back_populates="remitente")
    mensajes_recibidos = relationship("Message", foreign_keys="[Message.destinatario_id]", back_populates="destinatario")
    archivos_subidos = relationship("File", back_populates="subido_por")

# ============= PROYECTOS =============
class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    
    # Información básica (a-d) - Visible para todos
    nombre_mandante = Column(String(255), nullable=False)  # a
    direccion = Column(Text, nullable=False)  # b
    ciudad = Column(String(100), nullable=False)  # c
    descripcion = Column(Text)  # d
    
    # Fechas (e-g)
    fecha_inicio = Column(Date, nullable=False)  # e
    fecha_termino_estimado = Column(Date, nullable=False)  # f
    fecha_termino_real = Column(Date, nullable=True)  # g
    
    # Costos (h-k) - Solo visible para JEFE
    costo_inicial = Column(Numeric(15, 2), nullable=False)  # h
    costos_adicionales = Column(Numeric(15, 2), default=0)  # i
    costos_extras = Column(Numeric(15, 2), default=0)  # j
    costo_final = Column(Numeric(15, 2), nullable=True)  # k
    
    # Gestión
    creado_por_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    activo = Column(Boolean, default=True)
    
    # Relationships
    creado_por = relationship("User", foreign_keys=[creado_por_id])
    usuarios_asignados = relationship("User", secondary=project_users, back_populates="proyectos")
    carpetas = relationship("Folder", back_populates="proyecto", cascade="all, delete-orphan")
    archivos = relationship("File", back_populates="proyecto", cascade="all, delete-orphan")
    mensajes = relationship("Message", back_populates="proyecto", cascade="all, delete-orphan")
    
    # Legacy relationships (mantener compatibilidad)
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    risks = relationship("RiskMatrix", back_populates="project")
    change_logs = relationship("ChangeLog", back_populates="project")

# ============= CARPETAS =============
class Folder(Base):
    __tablename__ = 'folders'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    proyecto_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    carpeta_padre_id = Column(Integer, ForeignKey('folders.id', ondelete='CASCADE'), nullable=True)
    
    creado_por_id = Column(Integer, ForeignKey('users.id'))
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    proyecto = relationship("Project", back_populates="carpetas")
    creado_por = relationship("User")
    carpeta_padre = relationship("Folder", remote_side=[id], backref="subcarpetas")
    archivos = relationship("File", back_populates="carpeta")

# ============= ARCHIVOS =============
class File(Base):
    __tablename__ = 'files'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    nombre_original = Column(String(255), nullable=False)
    ruta_archivo = Column(Text, nullable=False)
    tipo_archivo = Column(String(50))  # extension
    tamanio = Column(Integer)  # bytes
    
    proyecto_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    carpeta_id = Column(Integer, ForeignKey('folders.id', ondelete='SET NULL'), nullable=True)
    subido_por_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    fecha_subida = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    proyecto = relationship("Project", back_populates="archivos")
    carpeta = relationship("Folder", back_populates="archivos")
    subido_por = relationship("User", back_populates="archivos_subidos")
    permisos = relationship("FilePermission", back_populates="archivo", cascade="all, delete-orphan")

# ============= PERMISOS DE ARCHIVOS =============
class FilePermission(Base):
    __tablename__ = 'file_permissions'

    id = Column(Integer, primary_key=True, index=True)
    archivo_id = Column(Integer, ForeignKey('files.id', ondelete='CASCADE'), nullable=False)
    usuario_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    puede_ver = Column(Boolean, default=True)
    puede_descargar = Column(Boolean, default=True)
    
    # Relationships
    archivo = relationship("File", back_populates="permisos")
    usuario = relationship("User")

# ============= MENSAJES =============
class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    remitente_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    destinatario_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    contenido = Column(Text, nullable=False)
    archivo_adjunto = Column(String(255), nullable=True)
    
    leido = Column(Boolean, default=False)
    fecha_envio = Column(DateTime, default=datetime.utcnow)
    fecha_lectura = Column(DateTime, nullable=True)
    
    # Relationships
    proyecto = relationship("Project", back_populates="mensajes")
    remitente = relationship("User", foreign_keys=[remitente_id], back_populates="mensajes_enviados")
    destinatario = relationship("User", foreign_keys=[destinatario_id], back_populates="mensajes_recibidos")

# ============= MODELOS LEGACY (CPM) =============
class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    wbs_code = Column(String, index=True)
    name = Column(String, nullable=False)
    duration = Column(Integer, default=1)
    
    # CPM Calculated Fields
    early_start = Column(Integer, nullable=True)
    early_finish = Column(Integer, nullable=True)
    late_start = Column(Integer, nullable=True)
    late_finish = Column(Integer, nullable=True)
    total_float = Column(Integer, nullable=True)
    is_critical = Column(Boolean, default=False)
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    project = relationship("Project", back_populates="tasks")
    dependencies_outgoing = relationship("Dependency", foreign_keys="[Dependency.predecessor_id]", back_populates="predecessor")
    dependencies_incoming = relationship("Dependency", foreign_keys="[Dependency.successor_id]", back_populates="successor")
    resources = relationship("ResourceAllocation", back_populates="task")

class Dependency(Base):
    __tablename__ = 'dependencies'

    id = Column(Integer, primary_key=True, index=True)
    predecessor_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    successor_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    type = Column(String, default="FS")
    lag = Column(Integer, default=0)

    predecessor = relationship("Task", foreign_keys=[predecessor_id], back_populates="dependencies_outgoing")
    successor = relationship("Task", foreign_keys=[successor_id], back_populates="dependencies_incoming")

class Resource(Base):
    __tablename__ = 'resources'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    cost_per_unit = Column(Float, default=0.0)
    unit = Column(String)

class ResourceAllocation(Base):
    __tablename__ = 'resource_allocations'

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    resource_id = Column(Integer, ForeignKey('resources.id'))
    quantity = Column(Float, default=1.0)

    task = relationship("Task", back_populates="resources")
    resource = relationship("Resource")

class RiskMatrix(Base):
    __tablename__ = 'risk_matrix'

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    description = Column(String, nullable=False)
    probability = Column(Float)
    impact = Column(Integer)
    mitigation_plan = Column(Text)

    project = relationship("Project", back_populates="risks")

class ChangeLog(Base):
    __tablename__ = 'change_logs'

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    change_description = Column(String)
    reason = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="change_logs")
