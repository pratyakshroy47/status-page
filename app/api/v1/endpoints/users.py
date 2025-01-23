from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas import user as schemas
from app.models.user import User
from app.core.security import get_password_hash
import uuid
from uuid import UUID
from pydantic import BaseModel

router = APIRouter()

@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
):
    """Create new user."""
    # Check if user with this email exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        organization_id=user_in.organization_id,
        is_active=user_in.is_active,
        is_superuser=user_in.is_superuser
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve users.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.User)
def read_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: str,
):
    """
    Get user by ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: str,
    user_in: schemas.UserUpdate,
):
    """
    Update user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    update_data = user_in.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/organization/{organization_id}", response_model=List[schemas.User])
def read_organization_users(
    organization_id: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve users for a specific organization.
    """
    users = db.query(User)\
        .filter(User.organization_id == organization_id)\
        .offset(skip)\
        .limit(limit)\
        .all()
    return users

@router.delete("/{user_id}")
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: str,
):
    """
    Delete user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Add this class for the request body
class TestUserCreate(BaseModel):
    organization_id: UUID

@router.post("/test-user", response_model=schemas.User)
def create_test_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: TestUserCreate  # Changed to use request body
):
    """Create a test user for development"""
    try:
        # Check if test user exists
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if test_user:
            return test_user

        # Create test user with a valid UUID4
        user = User(
            id=uuid.uuid4(),
            email="test@example.com",
            full_name="Test User",
            hashed_password=get_password_hash("testpassword"),
            organization_id=user_in.organization_id,
            is_active=True,
            is_superuser=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    except Exception as e:
        db.rollback()
        logger.error(f"Error creating test user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/email/{email}", response_model=schemas.User)
def get_user_by_email(
    email: str,
    db: Session = Depends(deps.get_db),
):
    """Get user by email"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user 