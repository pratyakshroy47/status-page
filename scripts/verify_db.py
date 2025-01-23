import sys
import os
from pathlib import Path

BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

from app.db.session import SessionLocal
from app.models.service import Service
from app.models.incident import Incident

def verify_db():
    db = SessionLocal()
    try:
        # Check services
        services = db.query(Service).all()
        print("\nServices in database:")
        for service in services:
            print(f"ID: {service.id}")
            print(f"Name: {service.name}")
            print(f"Organization ID: {service.organization_id}")
            print("---")

        # Check incidents
        incidents = db.query(Incident).all()
        print("\nIncidents in database:")
        for incident in incidents:
            print(f"ID: {incident.id}")
            print(f"Title: {incident.title}")
            print(f"Status: {incident.status}")
            print(f"Service ID: {incident.service_id}")
            print("---")

    except Exception as e:
        print(f"Error verifying database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_db() 