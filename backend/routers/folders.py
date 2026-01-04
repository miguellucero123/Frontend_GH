from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Folder, Project, User, UserRole
from schemas import FolderCreate, Folder as FolderSchema, FolderWithSubfolders
from auth import (
    get_current_active_user, require_jefe, 
    check_project_access
)

router = APIRouter(prefix="/api/folders", tags=["Carpetas"])

# ============= CREAR CARPETA (Solo JEFE) =============
@router.post("/", response_model=FolderSchema, status_code=status.HTTP_201_CREATED)
def create_folder(
    folder_data: FolderCreate,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Crea una nueva carpeta en un proyecto o subcarpeta
    Solo accesible para usuarios con rol JEFE
    """
    # Verificar que el proyecto existe
    project = db.query(Project).filter(Project.id == folder_data.proyecto_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Si es una subcarpeta, verificar que la carpeta padre existe y pertenece al mismo proyecto
    if folder_data.carpeta_padre_id:
        parent_folder = db.query(Folder).filter(Folder.id == folder_data.carpeta_padre_id).first()
        if not parent_folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carpeta padre no encontrada"
            )
        
        if parent_folder.proyecto_id != folder_data.proyecto_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La carpeta padre no pertenece al proyecto indicado"
            )
    
    new_folder = Folder(
        nombre=folder_data.nombre,
        proyecto_id=folder_data.proyecto_id,
        carpeta_padre_id=folder_data.carpeta_padre_id,
        creado_por_id=current_user.id
    )
    
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    
    return new_folder

# ============= LISTAR CARPETAS DE UN PROYECTO =============
@router.get("/project/{project_id}", response_model=List[FolderSchema])
def list_project_folders(
    project_id: int,
    parent_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Lista las carpetas de un proyecto
    Opcional: Filtrar por carpeta padre (para navegación por niveles)
    """
    # Verificar acceso al proyecto
    if not check_project_access(current_user, project_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este proyecto"
        )
    
    query = db.query(Folder).filter(Folder.proyecto_id == project_id)
    
    if parent_id:
        query = query.filter(Folder.carpeta_padre_id == parent_id)
    else:
        # Si no se especifica padre, mostrar solo las raíces? 
        # O todas si queremos construir el árbol en el frontend?
        # Por defecto, devolvamos todas para que el frontend maneje la estructura
        pass
        
    folders = query.all()
    return folders

# ============= OBTENER ÁRBOL DE CARPETAS =============
@router.get("/project/{project_id}/tree", response_model=List[FolderWithSubfolders])
def get_folder_tree(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene la estructura completa de carpetas (árbol jerárquico)
    Solo devuelve las carpetas raíz, las hijas vienen anidadas
    """
    if not check_project_access(current_user, project_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este proyecto"
        )
    
    # Obtener carpetas raíz (sin padre)
    root_folders = db.query(Folder).filter(
        Folder.proyecto_id == project_id,
        Folder.carpeta_padre_id == None
    ).all()
    
    return root_folders

# ============= ELIMINAR CARPETA (Solo JEFE) =============
@router.delete("/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_folder(
    folder_id: int,
    current_user: User = Depends(require_jefe),
    db: Session = Depends(get_db)
):
    """
    Elimina una carpeta y todo su contenido (en cascada)
    Solo JEFE
    """
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada"
        )
    
    db.delete(folder)
    db.commit()
    
    return None
