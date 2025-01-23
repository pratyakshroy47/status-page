import logging
from sqlalchemy.exc import ProgrammingError
from app.db.session import engine
from app.db.base import Base  # This now includes all models

logger = logging.getLogger(__name__)

def init_db():
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

if __name__ == "__main__":
    init_db() 