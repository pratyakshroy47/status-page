import sys
import os
from pathlib import Path

# Add the parent directory to Python path
BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

from app.db.session import engine
from app.db.base_class import Base  # Import from base_class instead
import app.models  # This ensures all models are loaded

def create_tables():
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {str(e)}")
        raise e

if __name__ == "__main__":
    create_tables() 