from pydantic import BaseModel, Field
from datetime import datetime

class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)
    project_id: int

class MessageResponse(BaseModel):
    id: int
    content: str
    user_id: int
    user_name: str | None = None
    project_id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    """Formato de mensaje WebSocket"""
    type: str = "message"  # message, typing, system, error
    content: str
    user_id: int
    user_name: str
    timestamp: str
    message_id: int | None = None

