import sys
import os
from pathlib import Path
import uuid
from enum import Enum

# Setup Python path BEFORE any app imports
BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

# Now we can import from app
from app.db.session import SessionLocal
from app.models.organization import Organization
from app.models.service import Service, ServiceStatus
import requests
import json

# Define ServiceStatus enum here
class ServiceStatus(str, Enum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    PARTIAL_OUTAGE = "partial_outage"
    MAJOR_OUTAGE = "major_outage"

def get_organizations():
    """Get all organizations from the API"""
    try:
        response = requests.get("http://localhost:8000/api/v1/organizations")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching organizations: {str(e)}")
        return []

def get_services_for_org(org_name):
    if org_name == "Google Cloud Platform":
        return [
            {
                "name": "Compute Engine",
                "description": "Virtual Machines",
                "status": ServiceStatus.OPERATIONAL
            },
            {
                "name": "Cloud Storage",
                "description": "Object Storage",
                "status": ServiceStatus.DEGRADED
            },
            {
                "name": "Cloud SQL",
                "description": "Managed Databases",
                "status": ServiceStatus.OPERATIONAL
            },
            {
                "name": "Kubernetes Engine",
                "description": "Container Orchestration",
                "status": ServiceStatus.OPERATIONAL
            }
        ]
    elif org_name == "Microsoft Azure":
        return [
            {
                "name": "Virtual Machines",
                "description": "Azure VMs",
                "status": ServiceStatus.OPERATIONAL
            },
            {
                "name": "Blob Storage",
                "description": "Object Storage",
                "status": ServiceStatus.OPERATIONAL
            },
            {
                "name": "Azure SQL",
                "description": "Managed SQL Databases",
                "status": ServiceStatus.DEGRADED
            },
            {
                "name": "AKS",
                "description": "Azure Kubernetes Service",
                "status": ServiceStatus.PARTIAL_OUTAGE
            }
        ]
    elif org_name == "Amazon Web Services":
        return [
            {
                "name": "EC2",
                "description": "Elastic Compute Cloud",
                "status": ServiceStatus.OPERATIONAL
            },
            {
                "name": "S3",
                "description": "Simple Storage Service",
                "status": ServiceStatus.OPERATIONAL
            },
            {
                "name": "RDS",
                "description": "Relational Database Service",
                "status": ServiceStatus.DEGRADED
            },
            {
                "name": "EKS",
                "description": "Elastic Kubernetes Service",
                "status": ServiceStatus.PARTIAL_OUTAGE
            }
        ]
    return []

def create_services():
    print("Starting service creation...")
    db = SessionLocal()
    
    try:
        organizations = db.query(Organization).all()
        
        for org in organizations:
            print(f"\nCreating services for organization: {org.name}")
            
            if "Azure" in org.name:
                services = [
                    {
                        "name": "Virtual Machines",
                        "description": "Azure VMs",
                        "status": ServiceStatus.OPERATIONAL,
                    },
                    {
                        "name": "Blob Storage",
                        "description": "Object Storage",
                        "status": ServiceStatus.OPERATIONAL,
                    },
                    {
                        "name": "Azure SQL",
                        "description": "Managed SQL Databases",
                        "status": ServiceStatus.DEGRADED,
                    }
                ]
            elif "Google" in org.name:
                services = [
                    {
                        "name": "Compute Engine",
                        "description": "Virtual Machines",
                        "status": ServiceStatus.OPERATIONAL,
                    },
                    {
                        "name": "Cloud Storage",
                        "description": "Object Storage",
                        "status": ServiceStatus.DEGRADED,
                    },
                    {
                        "name": "Cloud SQL",
                        "description": "Managed Databases",
                        "status": ServiceStatus.OPERATIONAL,
                    }
                ]
            else:
                services = []
            
            for service_data in services:
                existing_service = db.query(Service).filter(
                    Service.name == service_data["name"],
                    Service.organization_id == org.id
                ).first()
                
                if existing_service:
                    print(f"Service {service_data['name']} already exists, skipping...")
                    continue
                
                service = Service(
                    id=uuid.uuid4(),
                    organization_id=org.id,
                    **service_data
                )
                db.add(service)
                print(f"Creating service: {service.name}")
        
        db.commit()
        print("\nServices created successfully!")
        
    except Exception as e:
        print(f"Error creating services: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Make sure the API is running first
    try:
        requests.get("http://localhost:8000/api/v1/")
        create_services()
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to the API. Make sure it's running on http://localhost:8000") 