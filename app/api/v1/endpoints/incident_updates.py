from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.api import deps
from app.schemas import incident_update as schemas
from app.models.incident_update import IncidentUpdate
from app.models.incident import Incident
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=schemas.IncidentUpdate)
def create_incident_update(
    *,
    db: Session = Depends(deps.get_db),
    update_in: schemas.IncidentUpdateCreate
):
    """Create new incident update"""
    try:
        # Verify incident exists
        incident = db.query(Incident).get(update_in.incident_id)
        if not incident:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Incident with id {update_in.incident_id} not found"
            )

        # Create update
        update = IncidentUpdate(**update_in.dict())
        
        # Update incident status
        incident.status = update_in.status
        if update_in.status == "resolved":
            incident.resolved_at = datetime.utcnow()

        db.add(update)
        db.add(incident)
        db.commit()
        db.refresh(update)
        
        return update

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/incident/{incident_id}", response_model=List[schemas.IncidentUpdate])
def get_incident_updates(
    incident_id: UUID,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get all updates for an incident"""
    updates = (
        db.query(IncidentUpdate)
        .filter(IncidentUpdate.incident_id == incident_id)
        .order_by(IncidentUpdate.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return updates 