from pydantic import BaseModel, Field
from datetime import datetime

class ProjectBase(BaseModel):
    name: str = Field(min_length=3, max_length=200)
    description: str | None = None
    location: str | None = None
    budget: float = Field(ge=0)
    status: str = "cotizacion"

class ProjectCreate(ProjectBase):
    client_id: int

class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    budget: float | None = Field(None, ge=0)
    actual_cost: float | None = Field(None, ge=0)
    status: str | None = None

class ProjectResponse(ProjectBase):
    id: int
    client_id: int
    actual_cost: float
    created_at: datetime
    
    class Config:
        from_attributes = True

