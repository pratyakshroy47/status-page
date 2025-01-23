import sys
import os
from pathlib import Path

BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

from app.db.session import SessionLocal
from app.models.organization import Organization
from app.models.user import User
from app.models.service import Service
from app.models.incident import Incident

def verify_all():
    db = SessionLocal()
    try:
        # Check organizations
        print("\n=== Organizations ===")
        orgs = db.query(Organization).all()
        for org in orgs:
            print(f"Name: {org.name}")
            print(f"ID: {org.id}")
            print("---")

        # Check users
        print("\n=== Users ===")
        users = db.query(User).all()
        for user in users:
            print(f"Email: {user.email}")
            print(f"ID: {user.id}")
            print(f"Organization: {user.organization_id}")
            print("---")

        # Check services
        print("\n=== Services ===")
        services = db.query(Service).all()
        for service in services:
            print(f"Name: {service.name}")
            print(f"ID: {service.id}")
            print(f"Organization: {service.organization_id}")
            print(f"Status: {service.status}")
            print("---")

        # Check incidents
        print("\n=== Incidents ===")
        incidents = db.query(Incident).all()
        for incident in incidents:
            print(f"Title: {incident.title}")
            print(f"ID: {incident.id}")
            print(f"Service: {incident.service_id}")
            print(f"Created by: {incident.created_by_id}")
            print(f"Status: {incident.status}")
            print(f"Impact: {incident.impact}")
            print("---")

    except Exception as e:
        print(f"Error verifying data: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_all() 