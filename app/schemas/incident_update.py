from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime
from app.models.incident import IncidentStatus

class IncidentUpdateBase(BaseModel):
    message: str
    status: IncidentStatus
    incident_id: UUID4
    created_by_id: UUID4

class IncidentUpdateCreate(IncidentUpdateBase):
    pass

class IncidentUpdate(IncidentUpdateBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 