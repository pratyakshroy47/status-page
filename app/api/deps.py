from typing import Generator
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.errors import APIError
from fastapi import status, Depends
from uuid import UUID
from app.models.organization import Organization

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def verify_organization_exists(db: Session, organization_id: UUID) -> Organization:
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if not organization:
        raise APIError(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization with id {organization_id} not found"
        )
    return organization 