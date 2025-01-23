from typing import List
from pydantic_settings import BaseSettings
import os
import json

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Status Page"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-for-development")
    
    # Database Settings
    DATABASE_URL: str
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = json.loads(
        os.getenv("BACKEND_CORS_ORIGINS", '["http://localhost:3000"]')
    )
    
    VITE_API_URL: str
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()