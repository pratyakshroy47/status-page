from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    organization_id: UUID4

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class Team(TeamBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TeamWithMembers(Team):
    members: List["UserBase"]  # Import UserBase from user schemas 