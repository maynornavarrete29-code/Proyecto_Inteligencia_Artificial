"""Application Configuration"""
from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings"""
    
    # FastAPI
    APP_NAME: str = "BeyondDev API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",  # React dev
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    # Security
    JWT_SECRET: str = "beyonddev_jwt_secret_2026_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 8
    
    # Database
    DB_PATH: Path = Path("./data/db.json")
    DATA_DIR: Path = Path("./data")
    
    # Face ID
    FACE_QUALITY_THRESHOLD: float = 0.75
    FACE_DISTANCE_THRESHOLD: float = 0.6
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
