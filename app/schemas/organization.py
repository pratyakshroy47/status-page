from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime
from uuid import UUID

class OrganizationBase(BaseModel):
    name: str
    subdomain: constr(pattern=r'^[a-zA-Z0-9-]+$')  # Only allow alphanumeric and hyphens
    description: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    admin_email: EmailStr
    admin_password: str
    admin_full_name: str

class OrganizationUpdate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 