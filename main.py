import os
import sys
# Add the parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import logging
from app.db.test_connection import test_connection
from app.core.logging import setup_logging
from app.core.config import settings
import logging.config

# Setup logging
logging.config.dictConfig(setup_logging())
logger = logging.getLogger(__name__)

def main():
    print(f"Using DATABASE_URL: {settings.DATABASE_URL}")
    
    logger.info("Testing database connection...")
    if test_connection():
        logger.info("Database connection test passed!")
    else:
        logger.error("Database connection test failed!")

if __name__ == "__main__":
    main()