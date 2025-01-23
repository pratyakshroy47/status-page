import sys
import os
from pathlib import Path
import uuid

# Add the parent directory to Python path
BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

from app.db.session import SessionLocal
from app.models.incident import Incident, IncidentStatus, IncidentImpact
from app.models.service import Service
from app.models.user import User

def create_test_incident():
    db = SessionLocal()
    try:
        print("Fetching services...")
        service = db.query(Service).first()
        if not service:
            print("No services found in database")
            return
        
        print("Fetching test user...")
        user = db.query(User).filter(User.email == "test@example.com").first()
        if not user:
            print("Test user not found. Please run create_test_user.py first")
            return
        
        print(f"\nFound service:")
        print(f"ID: {service.id}")
        print(f"Name: {service.name}")
        print(f"Organization: {service.organization_id}")

        print("\nCreating test incident...")
        incident_data = {
            "title": "Test Incident",
            "description": "This is a test incident",
            "status": IncidentStatus.INVESTIGATING,
            "impact": IncidentImpact.MINOR,
            "service_id": service.id,
            "organization_id": service.organization_id,
            "created_by_id": user.id
        }
        
        print("\nIncident data:")
        for key, value in incident_data.items():
            print(f"{key}: {value}")

        incident = Incident(**incident_data)
        
        print("\nAdding to database...")
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
        print("\nIncident created successfully:")
        print(f"ID: {incident.id}")
        print(f"Title: {incident.title}")
        print(f"Status: {incident.status}")
        print(f"Impact: {incident.impact}")

    except Exception as e:
        print(f"\nError creating test incident: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_test_incident() 