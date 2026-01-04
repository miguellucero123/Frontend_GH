from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user, get_current_jefe
from app.models.user import User
from app.models.project import Project, ProjectStatus
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["proyectos"])

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar proyectos según rol"""
    if current_user.role.value == "jefe":
        projects = db.query(Project).all()
    else:
        projects = db.query(Project).filter(Project.client_id == current_user.id).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener un proyecto específico"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Verificar acceso
    if current_user.role.value == "cliente" and project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a este proyecto")
    
    return project

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_jefe),
    db: Session = Depends(get_db)
):
    """Solo jefes pueden crear proyectos"""
    # Verificar que el cliente existe
    client = db.query(User).filter(User.id == project_data.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Validar status
    try:
        status_enum = ProjectStatus(project_data.status)
    except ValueError:
        status_enum = ProjectStatus.COTIZACION
    
    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        location=project_data.location,
        budget=project_data.budget,
        status=status_enum,
        client_id=project_data.client_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    update_data: ProjectUpdate,
    current_user: User = Depends(get_current_jefe),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    for field, value in update_data.dict(exclude_unset=True).items():
        if field == "status" and value:
            try:
                value = ProjectStatus(value)
            except ValueError:
                pass
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_jefe),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    db.delete(project)
    db.commit()
    return None

