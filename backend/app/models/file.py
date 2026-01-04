from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class File(Base):
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500))  # Ruta local o S3 key
    file_size = Column(BigInteger)  # Bytes
    mime_type = Column(String(100))
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    project = relationship("Project", back_populates="files")
    uploader = relationship("User", back_populates="uploaded_files", foreign_keys=[uploaded_by])

