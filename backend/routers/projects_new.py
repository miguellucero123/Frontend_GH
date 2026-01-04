from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import get_db
from models import Project, User, UserRole, project_users
from schemas import (
    ProjectCreate, ProjectUpdate, Project as ProjectSchema,
    ProjectWithUsers, ProjectForClient, ProjectUserAssignment,
    ProjectSimple
)
from auth import (
    get_current_active_user, require_jefe, 
    check_project_access
)

router = APIRouter(prefix="/api/projects", tags=["Proyectos"])

# ============= CREAR PROYECTO (Solo JEFE) =============
@router.post("/", response_model=ProjectSchema, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo proyecto
    Solo accesible para usuarios con rol JEFE
    """
    # Calcular costo final inicial
    costo_final = (
        project_data.costo_inicial + 
        project_data.costos_adicionales + 
        project_data.costos_extras
    )
    
    new_project = Project(
        nombre_mandante=project_data.nombre_mandante,
        direccion=project_data.direccion,
        ciudad=project_data.ciudad,
        descripcion=project_data.descripcion,
        fecha_inicio=project_data.fecha_inicio,
        fecha_termino_estimado=project_data.fecha_termino_estimado,
        costo_inicial=project_data.costo_inicial,
        costos_adicionales=project_data.costos_adicionales,
        costos_extras=project_data.costos_extras,
        costo_final=costo_final,
        creado_por_id=current_user.id
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return new_project

# ============= LISTAR PROYECTOS =============
@router.get("/stats/global")
def get_global_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    from sqlalchemy import func
    
    # Si es cliente o trabajador, solo contar sus proyectos asignados
    if current_user.rol != UserRole.JEFE:
        # Obtener IDs de proyectos asignados al usuario
        assigned_projects = db.query(project_users.c.project_id).filter(
            project_users.c.user_id == current_user.id
        ).all()
        project_ids = [p[0] for p in assigned_projects]
        
        if not project_ids:
            # Si no tiene proyectos asignados, retornar estadísticas vacías
            return {
                "total_projects": 0,
                "active_projects": 0,
                "completed_projects": 0,
                "total_budget": 0.0
            }
        
        # Proyectos totales del usuario
        total_projects = db.query(Project).filter(Project.id.in_(project_ids)).count()
        
        # Proyectos activos del usuario
        active_projects = db.query(Project).filter(
            Project.id.in_(project_ids),
            Project.activo == True
        ).count()
        
        # Proyectos completados del usuario
        completed_projects = db.query(Project).filter(
            Project.id.in_(project_ids),
            Project.fecha_termino_real != None
        ).count()
        
        # Presupuesto total (solo para jefe, clientes no deberían ver costos)
        if current_user.rol == UserRole.CLIENTE:
            total_budget = 0.0  # Clientes no ven costos
        else:
            total_budget = db.query(
                func.sum(Project.costo_inicial + Project.costos_adicionales + Project.costos_extras)
            ).filter(Project.id.in_(project_ids)).scalar() or 0
    else:
        # JEFE ve todas las estadísticas globales
        total_projects = db.query(Project).count()
        active_projects = db.query(Project).filter(Project.activo == True).count()
        completed_projects = db.query(Project).filter(Project.fecha_termino_real != None).count()
        total_budget = db.query(
            func.sum(Project.costo_inicial + Project.costos_adicionales + Project.costos_extras)
        ).scalar() or 0

    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "completed_projects": completed_projects,
        "total_budget": float(total_budget)
    }

@router.get("/", response_model=List[ProjectSchema])
def list_projects(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    activo: Optional[bool] = None,
    ciudad: Optional[str] = None
):
    """
    Lista proyectos según el rol del usuario:
    - JEFE: Ve todos los proyectos
    - TRABAJADOR/CLIENTE: Solo ve proyectos asignados
    """
    query = db.query(Project)
    
    # Filtrar por usuario si no es JEFE
    if current_user.rol != UserRole.JEFE:
        # Obtener IDs de proyectos asignados al usuario
        assigned_projects = db.query(project_users.c.project_id).filter(
            project_users.c.user_id == current_user.id
        ).all()
        project_ids = [p[0] for p in assigned_projects]
        query = query.filter(Project.id.in_(project_ids))
    
    # Aplicar filtros opcionales
    if activo is not None:
        query = query.filter(Project.activo == activo)
    
    if ciudad:
        query = query.filter(Project.ciudad.ilike(f"%{ciudad}%"))
    
    projects = query.all()
    
    # Si es CLIENTE, retornar sin información de costos
    if current_user.rol == UserRole.CLIENTE:
        return [ProjectForClient.from_orm(p) for p in projects]
    
    return projects

# ============= OBTENER PROYECTO POR ID =============
@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene un proyecto específico
    Verifica permisos de acceso
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Verificar acceso
    if not check_project_access(current_user, project_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este proyecto"
        )
    
    # Si es CLIENTE, retornar sin costos
    if current_user.rol == UserRole.CLIENTE:
        return ProjectForClient.from_orm(project)
    
    return project

# ============= ACTUALIZAR PROYECTO (Solo JEFE) =============
@router.patch("/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Actualiza un proyecto existente
    Solo accesible para usuarios con rol JEFE
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Actualizar campos
    update_data = project_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    # Recalcular costo final si se actualizaron costos
    if any(k in update_data for k in ['costo_inicial', 'costos_adicionales', 'costos_extras']):
        project.costo_final = (
            project.costo_inicial + 
            project.costos_adicionales + 
            project.costos_extras
        )
    
    db.commit()
    db.refresh(project)
    
    return project

# ============= ELIMINAR PROYECTO (Solo JEFE) =============
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Elimina un proyecto (soft delete)
    Solo accesible para usuarios con rol JEFE
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Soft delete
    project.activo = False
    db.commit()
    
    return None

# ============= ASIGNAR USUARIO A PROYECTO (Solo JEFE) =============
@router.post("/{project_id}/users", response_model=dict)
def assign_user_to_project(
    project_id: int,
    assignment: ProjectUserAssignment,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Asigna un usuario a un proyecto con permisos específicos
    Solo accesible para usuarios con rol JEFE
    """
    # Verificar que el proyecto existe
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Verificar que el usuario existe
    user = db.query(User).filter(User.id == assignment.usuario_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Verificar si ya está asignado
    existing = db.query(project_users).filter(
        project_users.c.project_id == project_id,
        project_users.c.user_id == assignment.usuario_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya está asignado a este proyecto"
        )
    
    # Crear asignación
    from datetime import datetime
    stmt = project_users.insert().values(
        project_id=project_id,
        user_id=assignment.usuario_id,
        can_upload_files=assignment.can_upload_files,
        can_edit_project=assignment.can_edit_project,
        assigned_at=datetime.utcnow()
    )
    db.execute(stmt)
    db.commit()
    
    return {
        "message": "Usuario asignado exitosamente",
        "project_id": project_id,
        "user_id": assignment.usuario_id
    }

# ============= LISTAR USUARIOS DE UN PROYECTO (Solo JEFE) =============
@router.get("/{project_id}/users", response_model=ProjectWithUsers)
def get_project_users(
    project_id: int,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Lista todos los usuarios asignados a un proyecto
    Solo accesible para usuarios con rol JEFE
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    return project

# ============= REMOVER USUARIO DE PROYECTO (Solo JEFE) =============
@router.delete("/{project_id}/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_from_project(
    project_id: int,
    user_id: int,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Remueve un usuario de un proyecto
    Solo accesible para usuarios con rol JEFE
    """
    # Verificar que existe la asignación
    assignment = db.query(project_users).filter(
        project_users.c.project_id == project_id,
        project_users.c.user_id == user_id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asignación no encontrada"
        )
    
    # Eliminar asignación
    stmt = project_users.delete().where(
        project_users.c.project_id == project_id,
        project_users.c.user_id == user_id
    )
    db.execute(stmt)
    db.commit()
    
    return None

# ============= ESTADÍSTICAS DE PROYECTO (Solo JEFE) =============
@router.get("/{project_id}/stats", response_model=dict)
def get_project_stats(
    project_id: int,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Obtiene estadísticas de un proyecto
    Solo accesible para usuarios con rol JEFE
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Contar usuarios asignados
    users_count = db.query(project_users).filter(
        project_users.c.project_id == project_id
    ).count()
    
    # Calcular días transcurridos y restantes
    from datetime import datetime
    today = datetime.now().date()
    dias_transcurridos = (today - project.fecha_inicio).days if today > project.fecha_inicio else 0
    dias_restantes = (project.fecha_termino_estimado - today).days if project.fecha_termino_estimado > today else 0
    
    # Calcular porcentaje de presupuesto ejecutado
    porcentaje_presupuesto = (
        (project.costo_final / project.costo_inicial * 100) 
        if project.costo_inicial > 0 else 0
    )
    
    return {
        "project_id": project_id,
        "nombre_mandante": project.nombre_mandante,
        "usuarios_asignados": users_count,
        "dias_transcurridos": dias_transcurridos,
        "dias_restantes": dias_restantes,
        "porcentaje_presupuesto": round(porcentaje_presupuesto, 2),
        "costo_total": float(project.costo_final),
        "estado": "activo" if project.activo else "inactivo",
        "finalizado": project.fecha_termino_real is not None
    }
