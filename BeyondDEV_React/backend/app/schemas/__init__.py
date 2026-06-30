"""Pydantic Schemas for Request/Response Validation"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    """Base user data"""
    name: str
    email: EmailStr


class UserRegister(UserBase):
    """User registration request"""
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class FaceProfile(BaseModel):
    """Face ID profile data"""
    descriptors: List[List[float]]
    quality: float
    registeredAt: datetime
    lastVerifiedAt: Optional[datetime] = None
    verificationCount: int = 0


class UserResponse(UserBase):
    """User response (no password)"""
    id: str
    verified: bool
    faceProfile: Optional[FaceProfile] = None
    createdAt: datetime


class UserDetail(UserResponse):
    """Detailed user info (for authenticated requests)"""
    pass


class TokenResponse(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic message response"""
    success: bool
    message: str


class ErrorResponse(BaseModel):
    """Error response"""
    success: bool
    message: str
    detail: Optional[str] = None


# Face ID Schemas
class FaceDescriptorData(BaseModel):
    """Single face descriptor with metadata"""
    descriptor: List[float]
    quality: float


class RegisterFaceRequest(BaseModel):
    """Register Face ID request"""
    email: EmailStr
    descriptors: List[FaceDescriptorData]


class VerifyFaceRequest(BaseModel):
    """Verify face for login"""
    email: EmailStr
    descriptor: List[float]


class CheckFaceEmailRequest(BaseModel):
    """Check if email has Face ID registered"""
    email: EmailStr


# Email Schemas
class EmailRecord(BaseModel):
    """Email record in system"""
    id: str
    type: str
    to: str
    name: str
    subject: str
    message: str
    timestamp: str
    previewUrl: Optional[str] = None
