import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException

from app.config import get_settings

settings = get_settings()

async def save_upload_file(file: UploadFile, project_id: int) -> dict:
    """Guardar archivo en filesystem"""
    # Validar extensión
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Tipo de archivo no permitido: {file_ext}")
    
    # Validar tamaño
    file.file.seek(0, 2)  # Mover cursor al final
    file_size = file.file.tell()
    file.file.seek(0)  # Volver al inicio
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Archivo muy grande (máx 10MB)")
    
    # Crear directorio si no existe
    upload_dir = Path(settings.UPLOAD_DIR) / str(project_id)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generar nombre único
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename
    
    # Guardar archivo
    with file_path.open("wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": str(file_path),
        "file_size": file_size,
        "mime_type": file.content_type
    }

async def delete_file(file_path: str):
    """Eliminar archivo del filesystem"""
    try:
        os.remove(file_path)
    except FileNotFoundError:
        pass

