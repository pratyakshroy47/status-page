from fastapi import APIRouter
from app.api.v1.endpoints import organizations, services, incidents, incident_updates, users, auth

api_router = APIRouter()
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(incident_updates.router, prefix="/incident-updates", tags=["incident-updates"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"]) 