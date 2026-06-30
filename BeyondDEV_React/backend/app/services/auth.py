"""Authentication Service"""
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from uuid import uuid4
from app.config import settings


class AuthService:
    """Authentication business logic"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password with bcrypt"""
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(password.encode(), salt).decode()
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode(), hashed.encode())
    
    @staticmethod
    def generate_token(user_id: str, name: str, email: str) -> str:
        """Generate JWT token"""
        payload = {
            "id": user_id,
            "name": name,
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    
    @staticmethod
    def decode_token(token: str) -> Optional[Dict[str, Any]]:
        """Decode and verify JWT token"""
        try:
            return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def generate_verification_token() -> str:
        """Generate email verification token"""
        return str(uuid4()).replace('-', '')
    
    @staticmethod
    def create_user(name: str, email: str, password: str) -> Dict[str, Any]:
        """Create user object"""
        return {
            "id": f"user-{str(uuid4())}",
            "name": name,
            "email": email,
            "password": AuthService.hash_password(password),
            "verified": False,
            "verificationToken": AuthService.generate_verification_token(),
            "createdAt": datetime.utcnow().isoformat(),
            "faceProfile": None
        }
