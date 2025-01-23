import sys
import os
from pathlib import Path
import uuid

BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    try:
        # Get first organization
        from app.models.organization import Organization
        organization = db.query(Organization).first()
        if not organization:
            print("No organizations found in database")
            return

        print("\nCreating test user...")
        user = User(
            id=uuid.UUID("00000000-0000-0000-0000-000000000000"),  # Fixed UUID for testing
            email="test@example.com",
            full_name="Test User",
            hashed_password=get_password_hash("testpassword"),
            organization_id=organization.id,
            is_active=True,
            is_superuser=True
        )

        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            print(f"User already exists with ID: {existing_user.id}")
            return existing_user.id

        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"Created test user with ID: {user.id}")
        return user.id

    except Exception as e:
        print(f"Error creating test user: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user() 