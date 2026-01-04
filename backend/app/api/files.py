from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.file import File as FileModel
from app.models.project import Project
from app.utils.file_handler import save_upload_file, delete_file

router = APIRouter(prefix="/files", tags=["archivos"])

@router.get("/project/{project_id}")
async def get_project_files(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar archivos de un proyecto"""
    # Verificar acceso al proyecto
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    if current_user.role.value == "cliente" and project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a este proyecto")
    
    files = db.query(FileModel).filter(FileModel.project_id == project_id).all()
    return files

@router.post("/upload/{project_id}")
async def upload_file(
    project_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Subir archivo a un proyecto"""
    # Verificar acceso al proyecto
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    if current_user.role.value == "cliente" and project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a este proyecto")
    
    # Guardar archivo
    file_data = await save_upload_file(file, project_id)
    
    # Crear registro en DB
    new_file = FileModel(
        **file_data,
        uploaded_by=current_user.id,
        project_id=project_id
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    
    return {
        "id": new_file.id,
        "filename": new_file.filename,
        "original_filename": new_file.original_filename,
        "file_size": new_file.file_size,
        "uploaded_at": new_file.uploaded_at
    }

@router.get("/download/{file_id}")
async def download_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Descargar archivo"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    # Verificar acceso
    project = db.query(Project).filter(Project.id == file_record.project_id).first()
    if current_user.role.value == "cliente" and project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso")
    
    return FileResponse(
        file_record.file_path,
        filename=file_record.original_filename,
        media_type=file_record.mime_type
    )

@router.delete("/{file_id}")
async def delete_file_endpoint(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar archivo"""
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    # Solo jefes o uploader pueden eliminar
    if current_user.role.value != "jefe" and file_record.uploaded_by != current_user.id:
        raise HTTPException(status_code=403, detail="Sin permiso")
    
    await delete_file(file_record.file_path)
    db.delete(file_record)
    db.commit()
    
    return {"message": "Archivo eliminado"}

