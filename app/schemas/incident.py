from pydantic import BaseModel, UUID4, validator
from typing import Optional
from datetime import datetime
from app.models.incident import IncidentStatus, IncidentImpact
import uuid
from enum import Enum

class IncidentStatus(str, Enum):
    INVESTIGATING = "INVESTIGATING"
    IDENTIFIED = "IDENTIFIED"
    MONITORING = "MONITORING"
    RESOLVED = "RESOLVED"

class IncidentImpact(str, Enum):
    MINOR = "MINOR"
    MAJOR = "MAJOR"
    CRITICAL = "CRITICAL"

class IncidentBase(BaseModel):
    title: str
    description: str
    status: IncidentStatus = IncidentStatus.INVESTIGATING
    impact: IncidentImpact = IncidentImpact.MINOR

    @validator('impact')
    def validate_impact(cls, v):
        if v not in [e.value for e in IncidentImpact]:
            raise ValueError(f'Invalid impact value. Must be one of: {[e.value for e in IncidentImpact]}')
        return v

    @validator('status')
    def validate_status(cls, v):
        if v not in [e.value for e in IncidentStatus]:
            raise ValueError(f'Invalid status value. Must be one of: {[e.value for e in IncidentStatus]}')
        return v

class IncidentCreate(BaseModel):
    title: str
    description: str
    service_id: UUID4
    organization_id: UUID4
    status: IncidentStatus
    impact: IncidentImpact
    created_by_id: Optional[UUID4] = None

class IncidentUpdate(IncidentBase):
    resolved_at: Optional[datetime] = None

class Incident(IncidentBase):
    id: UUID4
    service_id: UUID4
    organization_id: UUID4
    created_by_id: UUID4
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    @validator('created_by_id')
    def validate_created_by_id(cls, v):
        # If it's not a valid UUID4, generate a new one
        if not is_valid_uuid4(str(v)):
            return uuid.uuid4()
        return v

    class Config:
        from_attributes = True

def is_valid_uuid4(uuid_string):
    try:
        uuid_obj = uuid.UUID(uuid_string)
        return uuid_obj.version == 4
    except ValueError:
        return False 