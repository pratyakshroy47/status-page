from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.api import deps
from app.schemas import incident as schemas
from app.models.incident import Incident, IncidentStatus
from app.models.service import Service
from app.models.organization import Organization
from app.models.user import User
from app.core.errors import NotFoundError, ValidationError, APIError
from uuid import UUID
from datetime import datetime
import uuid
from .websocket import manager  # Import the connection manager

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=schemas.Incident)
async def create_incident(
    *,
    db: Session = Depends(deps.get_db),
    incident_in: schemas.IncidentCreate
):
    """
    Create new incident.
    """
    try:
        # First verify if the user exists if provided
        created_by_id = incident_in.created_by_id
        if created_by_id:
            user = db.query(User).get(created_by_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
        else:
            # Fallback to first active user in the system
            created_by = db.query(User).filter(
                User.is_active == True
            ).first()
            if not created_by:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No active user found"
                )
            created_by_id = created_by.id

        # Verify service exists
        service = db.query(Service).get(incident_in.service_id)
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Service with id {incident_in.service_id} not found"
            )

        # Create the incident
        incident = Incident(
            title=incident_in.title,
            description=incident_in.description,
            status=incident_in.status,
            impact=incident_in.impact,
            service_id=incident_in.service_id,
            organization_id=incident_in.organization_id,
            created_by_id=created_by_id
        )
        
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
        logger.info(f"Created incident: {incident.id}")

        # Broadcast the new incident to connected clients
        await manager.broadcast_to_organization(
            str(incident.organization_id),
            {
                "type": "INCIDENT_CREATED",
                "data": {
                    "id": str(incident.id),
                    "title": incident.title,
                    "description": incident.description,
                    "status": incident.status,
                    "impact": incident.impact,
                    "service_id": str(incident.service_id),
                    "created_at": incident.created_at.isoformat(),
                }
            }
        )

        return incident
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating incident: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[schemas.Incident])
def read_incidents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve incidents.
    """
    incidents = db.query(Incident).offset(skip).limit(limit).all()
    return incidents

@router.get("/{incident_id}", response_model=schemas.Incident)
def read_incident(
    *,
    db: Session = Depends(deps.get_db),
    incident_id: str,
):
    """
    Get incident by ID.
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )
    return incident

@router.put("/{incident_id}", response_model=schemas.Incident)
def update_incident(
    *,
    db: Session = Depends(deps.get_db),
    incident_id: str,
    incident_in: schemas.IncidentUpdate,
):
    """
    Update incident.
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )
    
    for field, value in incident_in.dict(exclude_unset=True).items():
        setattr(incident, field, value)
    
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.get("/service/{service_id}", response_model=List[schemas.Incident])
def read_service_incidents(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
    skip: int = 0,
    limit: int = 100,
):
    """
    Get incidents for a specific service.
    """
    incidents = (
        db.query(Incident)
        .filter(Incident.service_id == service_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return incidents

@router.get("/organization/{organization_id}", response_model=List[schemas.Incident])
def get_organization_incidents(
    organization_id: UUID,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get all incidents for an organization"""
    try:
        incidents = (
            db.query(Incident)
            .filter(Incident.organization_id == organization_id)
            .order_by(Incident.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        # Convert any non-UUID4 to valid UUID4 for response
        for incident in incidents:
            if not is_valid_uuid4(str(incident.created_by_id)):
                incident.created_by_id = uuid.uuid4()
        
        return incidents
    except Exception as e:
        logger.error(f"Error fetching incidents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch incidents"
        )

def is_valid_uuid4(uuid_string):
    try:
        uuid_obj = uuid.UUID(uuid_string)
        return uuid_obj.version == 4
    except ValueError:
        return False

@router.get("/active", response_model=List[schemas.Incident])
def get_active_incidents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Get all active (unresolved) incidents.
    """
    incidents = (
        db.query(Incident)
        .filter(Incident.resolved_at.is_(None))
        .order_by(Incident.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return incidents 