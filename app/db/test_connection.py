import logging
from sqlalchemy import text
from app.db.session import engine

logger = logging.getLogger(__name__)

def test_connection():
    try:
        # Try to connect and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            logger.info("Successfully connected to the database!")
            return True
    except Exception as e:
        logger.error(f"Error connecting to the database: {e}")
        return False

if __name__ == "__main__":
    test_connection() 