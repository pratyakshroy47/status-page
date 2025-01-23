import sys
import os
from pathlib import Path

# Add the parent directory to Python path
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
sys.path.append(str(parent_dir))

from app.db.session import SessionLocal
from app.models.organization import Organization
import uuid

def create_organizations():
    print("Starting organization creation...")
    db = SessionLocal()
    
    try:
        # Sample organizations
        organizations = [
            # {
            #     "name": "Google Cloud Platform",
            #     "subdomain": "gcp",
            #     "description": "Google Cloud Platform Services Status"
            # },
            {
                "name": "Microsoft Azure",
                "subdomain": "azure",
                "description": "Microsoft Azure Services Status"
            }
            # {
            #     "name": "Amazon Web Services",
            #     "subdomain": "aws",
            #     "description": "AWS Services Status"
            # }
        ]
        
        # Check if organizations already exist
        for org_data in organizations:
            existing_org = db.query(Organization).filter(
                Organization.subdomain == org_data["subdomain"]
            ).first()
            
            if existing_org:
                print(f"Organization {org_data['name']} already exists, skipping...")
                continue
                
            org = Organization(
                id=uuid.uuid4(),
                **org_data
            )
            db.add(org)
            print(f"Creating organization: {org.name}")
        
        db.commit()
        print("Organizations created successfully!")
        
    except Exception as e:
        print(f"Error creating organizations: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_organizations()