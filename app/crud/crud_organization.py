from sqlalchemy.orm import Session
from app import models

def get_organizations(db: Session):
    """
    Retrieve all organizations.
    """
    return db.query(models.Organization).all() 