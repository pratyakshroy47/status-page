from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base, TimestampMixin, UUIDMixin

class User(Base, TimestampMixin, UUIDMixin):
    __tablename__ = "users"

    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    incidents = relationship("Incident", back_populates="created_by")
    incident_updates = relationship("IncidentUpdate", back_populates="created_by") 