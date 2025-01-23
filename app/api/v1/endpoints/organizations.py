from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas import organization as schemas
from app.models.organization import Organization

router = APIRouter()

@router.get("/", response_model=List[schemas.Organization])
def get_organizations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get all organizations"""
    organizations = (
        db.query(Organization)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return organizations

@router.get("/{subdomain}", response_model=schemas.Organization)
def get_organization(
    subdomain: str,
    db: Session = Depends(deps.get_db)
):
    """Get organization by subdomain"""
    organization = (
        db.query(Organization)
        .filter(Organization.subdomain == subdomain)
        .first()
    )
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return organization 