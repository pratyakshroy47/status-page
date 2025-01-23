from sqlalchemy import Column, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base, TimestampMixin, UUIDMixin
from enum import Enum as PyEnum

class IncidentStatus(str, PyEnum):
    INVESTIGATING = "INVESTIGATING"
    IDENTIFIED = "IDENTIFIED"
    MONITORING = "MONITORING"
    RESOLVED = "RESOLVED"

class IncidentImpact(str, PyEnum):
    NONE = "NONE"
    MINOR = "MINOR"
    MAJOR = "MAJOR"
    CRITICAL = "CRITICAL"

class Incident(Base, TimestampMixin, UUIDMixin):
    __tablename__ = "incidents"

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.INVESTIGATING)
    impact = Column(Enum(IncidentImpact), default=IncidentImpact.MINOR)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Foreign Keys
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Relationships
    service = relationship("Service", back_populates="incidents")
    organization = relationship("Organization", back_populates="incidents")
    created_by = relationship("User", back_populates="incidents")
    updates = relationship("IncidentUpdate", back_populates="incident", cascade="all, delete-orphan") 