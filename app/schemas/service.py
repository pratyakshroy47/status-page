from pydantic import BaseModel, constr, validator
from typing import Optional, List
from datetime import datetime
from app.models.service import ServiceStatus
from uuid import UUID

class ServiceBase(BaseModel):
    name: constr(min_length=1, max_length=100, strip_whitespace=True)
    description: Optional[str] = None
    status: ServiceStatus = ServiceStatus.OPERATIONAL

    @validator('name')
    def name_must_be_valid(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()

    @validator('status')
    def status_must_be_valid(cls, v):
        if isinstance(v, ServiceStatus):
            return v.value
        if v not in ServiceStatus.__members__.values():
            raise ValueError('Invalid status value')
        return v

class ServiceCreate(ServiceBase):
    organization_id: UUID

class ServiceUpdate(BaseModel):
    name: Optional[constr(min_length=1, max_length=100, strip_whitespace=True)] = None
    description: Optional[str] = None
    status: Optional[ServiceStatus] = None

class ServiceStatusUpdate(BaseModel):
    status: ServiceStatus
    notes: Optional[str] = None

class ServiceStatusHistoryRead(BaseModel):
    id: UUID
    old_status: ServiceStatus
    new_status: ServiceStatus
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class Service(ServiceBase):
    id: UUID
    organization_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ServiceWithHistory(Service):
    status_history: List[ServiceStatusHistoryRead]

    class Config:
        from_attributes = True

class ServiceStatusResponse(BaseModel):
    id: UUID
    name: str
    status: ServiceStatus
    updated_at: datetime

    class Config:
        from_attributes = True

class ServiceStatusSummary(BaseModel):
    total_services: int
    operational_count: int
    degraded_count: int
    partial_outage_count: int
    major_outage_count: int
    services: List[ServiceStatusResponse]

    class Config:
        from_attributes = True 