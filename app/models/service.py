from sqlalchemy import Column, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base, TimestampMixin, UUIDMixin
from enum import Enum as PyEnum

class ServiceStatus(str, PyEnum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    PARTIAL_OUTAGE = "partial_outage"
    MAJOR_OUTAGE = "major_outage"

    @classmethod
    def values(cls):
        return [e.value for e in cls]

class Service(Base, TimestampMixin, UUIDMixin):
    __tablename__ = "services"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(
        String, 
        nullable=False,
        default=ServiceStatus.OPERATIONAL
    )
    
    # Add check constraint for valid status values
    __table_args__ = (
        CheckConstraint(
            status.in_(ServiceStatus.values()),
            name='valid_service_status'
        ),
    )

    # Foreign Keys
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="services")
    incidents = relationship("Incident", back_populates="service", cascade="all, delete-orphan")
    status_history = relationship("ServiceStatusHistory", back_populates="service", cascade="all, delete-orphan")

class ServiceStatusHistory(Base, TimestampMixin, UUIDMixin):
    __tablename__ = "service_status_history"

    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    old_status = Column(String, nullable=False)
    new_status = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    
    # Add check constraints for valid status values
    __table_args__ = (
        CheckConstraint(
            old_status.in_(ServiceStatus.values()),
            name='valid_old_status'
        ),
        CheckConstraint(
            new_status.in_(ServiceStatus.values()),
            name='valid_new_status'
        ),
    )

    # Relationships
    service = relationship("Service", back_populates="status_history")

    def __init__(self, **kwargs):
        # Validate status values before saving
        if 'old_status' in kwargs:
            kwargs['old_status'] = str(kwargs['old_status'])
        if 'new_status' in kwargs:
            kwargs['new_status'] = str(kwargs['new_status'])
        super().__init__(**kwargs) 