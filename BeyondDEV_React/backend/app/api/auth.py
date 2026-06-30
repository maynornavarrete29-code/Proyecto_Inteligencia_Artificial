"""Authentication API Endpoints"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import (
    UserRegister, UserLogin, UserResponse, TokenResponse,
    MessageResponse, CheckFaceEmailRequest
)
from app.services import AuthService, EmailService
from app.models import db
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(user_data: UserRegister):
    """Register new user"""
    
    # Check if user exists
    existing = db.find_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El correo electrónico ya está registrado."
        )
    
    # Create user
    new_user = AuthService.create_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password
    )
    
    # Save to database
    db.save_user(new_user)
    
    # Send verification email
    email_record = EmailService.send_verification_email(
        to=new_user["email"],
        name=new_user["name"],
        token=new_user["verificationToken"],
        base_url="http://localhost:3000"
    )
    db.save_email(email_record)
    
    # Generate token
    token = AuthService.generate_token(new_user["id"], new_user["name"], new_user["email"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "verified": new_user["verified"],
            "createdAt": new_user["createdAt"]
        }
    }


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login user"""
    
    # Find user
    user = db.find_user_by_email(credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña inválidos."
        )
    
    # Verify password
    if not AuthService.verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña inválidos."
        )
    
    # Generate token
    token = AuthService.generate_token(user["id"], user["name"], user["email"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "verified": user["verified"],
            "createdAt": user["createdAt"]
        }
    }


@router.get("/verify", response_model=TokenResponse)
async def verify_email(email: str, token: str):
    """Verify user email"""
    
    user = db.find_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    if user.get("verificationToken") != token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de verificación inválido."
        )
    
    # Mark as verified
    user["verified"] = True
    user["verificationToken"] = None
    db.save_user(user)
    
    # Generate token
    new_token = AuthService.generate_token(user["id"], user["name"], user["email"])
    
    return {
        "access_token": new_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "verified": user["verified"],
            "createdAt": user["createdAt"]
        }
    }


@router.post("/check-face-email", response_model=MessageResponse)
async def check_face_email(data: CheckFaceEmailRequest):
    """Check if email has Face ID registered"""
    
    user = db.find_user_by_email(data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    has_face = bool(user.get("faceProfile") and user["faceProfile"].get("descriptors"))
    
    if not has_face:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este correo no tiene Face ID registrado."
        )
    
    return {"success": True, "message": "Este usuario tiene Face ID registrado."}


@router.get("/me", response_model=UserResponse, dependencies=[Depends(get_current_user)])
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    user = db.find_user_by_id(current_user["id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "verified": user["verified"],
        "createdAt": user["createdAt"]
    }
