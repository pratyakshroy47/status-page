from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas import service as schemas
from app.models.service import Service, ServiceStatusHistory, ServiceStatus
from app.models.organization import Organization
from app.core.errors import NotFoundError, ValidationError, APIError
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=schemas.Service)
def create_service(
    *,
    db: Session = Depends(deps.get_db),
    service_in: schemas.ServiceCreate,
):
    """Create new service with validation."""
    try:
        # Check if service name exists in organization
        existing_service = db.query(Service).filter(
            Service.name == service_in.name,
            Service.organization_id == service_in.organization_id
        ).first()
        if existing_service:
            raise ValidationError(
                "Service with this name already exists in the organization"
            )

        # Verify organization exists
        organization = deps.verify_organization_exists(db, service_in.organization_id)

        service = Service(
            name=service_in.name,
            description=service_in.description,
            status=service_in.status,
            organization_id=service_in.organization_id
        )
        
        # Create initial status history
        status_history = ServiceStatusHistory(
            service=service,
            old_status=service.status,
            new_status=service.status,
            notes="Initial service creation"
        )

        db.add(service)
        db.add(status_history)
        db.commit()
        db.refresh(service)
        return service

    except ValidationError as e:
        raise
    except Exception as e:
        db.rollback()
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[schemas.Service])
def read_services(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Retrieve services."""
    services = db.query(Service).offset(skip).limit(limit).all()
    return services

@router.get("/{service_id}", response_model=schemas.Service)
def read_service(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
):
    """Get service by ID."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )
    return service

@router.put("/{service_id}", response_model=schemas.Service)
def update_service(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
    service_in: schemas.ServiceUpdate,
):
    """Update service."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )
    
    for field, value in service_in.dict(exclude_unset=True).items():
        setattr(service, field, value)
    
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}")
def delete_service(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
):
    """
    Delete service.
    """
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )
    
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}

@router.get("/organization/{organization_id}", response_model=List[schemas.Service])
def read_organization_services(
    *,
    db: Session = Depends(deps.get_db),
    organization_id: str,
    skip: int = 0,
    limit: int = 100,
):
    """
    Get services for a specific organization.
    """
    services = (
        db.query(Service)
        .filter(Service.organization_id == organization_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return services

@router.get("/{service_id}/history", response_model=schemas.ServiceWithHistory)
def read_service_with_history(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
):
    """Get service with its status history."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise NotFoundError("Service", service_id)
    return service

@router.put("/{service_id}/status", response_model=schemas.Service)
def update_service_status(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
    status_update: schemas.ServiceStatusUpdate,
):
    """Update service status with history."""
    try:
        service = db.query(Service).filter(Service.id == service_id).first()
        if not service:
            raise NotFoundError("Service", service_id)

        if service.status == status_update.status:
            raise ValidationError("Service is already in this status")

        # Record status change
        status_change = ServiceStatusHistory(
            service_id=service.id,
            old_status=service.status,
            new_status=status_update.status,
            notes=status_update.notes
        )

        service.status = status_update.status
        db.add(service)
        db.add(status_change)
        db.commit()
        db.refresh(service)

        return service

    except (NotFoundError, ValidationError) as e:
        raise
    except Exception as e:
        db.rollback()
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/organization/{organization_id}/status", response_model=List[schemas.ServiceStatus])
def get_organization_service_statuses(
    *,
    db: Session = Depends(deps.get_db),
    organization_id: str,
):
    """Get current status of all services in an organization."""
    services = (
        db.query(Service)
        .filter(Service.organization_id == organization_id)
        .all()
    )
    return [
        {
            "id": str(service.id),
            "name": service.name,
            "status": service.status,
            "updated_at": service.updated_at
        }
        for service in services
    ]

@router.get("/{service_id}/status/history", response_model=List[schemas.ServiceStatusHistoryRead])
def get_service_status_history(
    *,
    db: Session = Depends(deps.get_db),
    service_id: str,
    limit: int = 10
):
    """Get status change history for a service."""
    history = (
        db.query(ServiceStatusHistory)
        .filter(ServiceStatusHistory.service_id == service_id)
        .order_by(ServiceStatusHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    return history 

@router.get("/organization/{organization_id}/status/summary", response_model=schemas.ServiceStatusSummary)
def get_organization_status_summary(
    *,
    db: Session = Depends(deps.get_db),
    organization_id: str,
):
    """Get a summary of service statuses in an organization."""
    services = (
        db.query(Service)
        .filter(Service.organization_id == organization_id)
        .all()
    )
    
    status_counts = {
        ServiceStatus.OPERATIONAL: 0,
        ServiceStatus.DEGRADED: 0,
        ServiceStatus.PARTIAL_OUTAGE: 0,
        ServiceStatus.MAJOR_OUTAGE: 0
    }
    
    for service in services:
        status_counts[service.status] += 1
    
    return {
        "total_services": len(services),
        "operational_count": status_counts[ServiceStatus.OPERATIONAL],
        "degraded_count": status_counts[ServiceStatus.DEGRADED],
        "partial_outage_count": status_counts[ServiceStatus.PARTIAL_OUTAGE],
        "major_outage_count": status_counts[ServiceStatus.MAJOR_OUTAGE],
        "services": services
    } 

@router.get("/organization/{organization_id}/services", response_model=List[schemas.Service])
def get_organization_services(
    organization_id: UUID,
    db: Session = Depends(deps.get_db)
):
    """Get all services for an organization"""
    services = (
        db.query(Service)
        .filter(Service.organization_id == organization_id)
        .all()
    )
    return services

@router.get("/organization/{organization_id}/status", response_model=schemas.ServiceStatusSummary)
def get_organization_service_status(
    organization_id: UUID,
    db: Session = Depends(deps.get_db)
):
    """Get service status summary for an organization"""
    services = (
        db.query(Service)
        .filter(Service.organization_id == organization_id)
        .all()
    )
    
    summary = {
        "total_services": len(services),
        "operational_count": sum(1 for s in services if s.status == ServiceStatus.OPERATIONAL),
        "degraded_count": sum(1 for s in services if s.status == ServiceStatus.DEGRADED),
        "partial_outage_count": sum(1 for s in services if s.status == ServiceStatus.PARTIAL_OUTAGE),
        "major_outage_count": sum(1 for s in services if s.status == ServiceStatus.MAJOR_OUTAGE),
        "services": services
    }
    
    return summary 