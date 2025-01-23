from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin, UUIDMixin

class Organization(Base, TimestampMixin, UUIDMixin):
    __tablename__ = "organizations"

    name = Column(String, nullable=False)
    subdomain = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    services = relationship("Service", back_populates="organization", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="organization", cascade="all, delete-orphan") 