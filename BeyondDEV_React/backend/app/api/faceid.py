"""Face ID API Endpoints"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from app.schemas import (
    RegisterFaceRequest, VerifyFaceRequest, FaceDescriptorData,
    MessageResponse, CheckFaceEmailRequest
)
from app.services import FaceIDService, EmailService
from app.models import db
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/faceid", tags=["face-id"])


@router.post("/register", response_model=MessageResponse)
async def register_face(data: RegisterFaceRequest):
    """Register Face ID for user"""
    
    # Find user
    user = db.find_user_by_email(data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    # Validate descriptors
    valid, message = FaceIDService.validate_descriptors([d.dict() for d in data.descriptors])
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Extract pure descriptors
    pure_descriptors = FaceIDService.extract_pure_descriptors([d.dict() for d in data.descriptors])
    quality = FaceIDService.calculate_average_quality([d.dict() for d in data.descriptors])
    
    # Store face profile
    user["faceProfile"] = {
        "descriptors": pure_descriptors,
        "quality": quality,
        "registeredAt": datetime.utcnow().isoformat(),
        "lastVerifiedAt": None,
        "verificationCount": 0
    }
    
    db.save_user(user)
    
    # Send confirmation email
    email_record = EmailService.send_faceid_registered_email(
        to=user["email"],
        name=user["name"],
        quality=quality
    )
    db.save_email(email_record)
    
    return {
        "success": True,
        "message": f"Face ID registrado exitosamente. Calidad: {quality}%"
    }


@router.post("/verify", response_model=MessageResponse)
async def verify_face_login(data: VerifyFaceRequest):
    """Verify Face ID for login"""
    
    # Find user
    user = db.find_user_by_email(data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    # Check if user has Face ID
    if not user.get("faceProfile") or not user["faceProfile"].get("descriptors"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este usuario no tiene Face ID registrado."
        )
    
    # Verify face
    result = FaceIDService.compare_descriptors(
        data.descriptor,
        user["faceProfile"]["descriptors"]
    )
    
    if not result["isMatch"] or result["confidence"] < 60:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Rostro no coincide. Confianza: {result['confidence']}%"
        )
    
    # Update verification info
    user["faceProfile"]["lastVerifiedAt"] = datetime.utcnow().isoformat()
    user["faceProfile"]["verificationCount"] = user["faceProfile"].get("verificationCount", 0) + 1
    db.save_user(user)
    
    return {
        "success": True,
        "message": f"Rostro verificado exitosamente. Confianza: {result['confidence']}%"
    }


@router.get("/profile", response_model=MessageResponse, dependencies=[Depends(get_current_user)])
async def get_face_profile(current_user: dict = Depends(get_current_user)):
    """Get user's face profile"""
    
    user = db.find_user_by_id(current_user["id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    has_profile = bool(user.get("faceProfile") and user["faceProfile"].get("descriptors"))
    
    if has_profile:
        return {
            "success": True,
            "message": "Perfil facial encontrado",
            "profile": {
                "quality": user["faceProfile"].get("quality"),
                "registeredAt": user["faceProfile"].get("registeredAt"),
                "lastVerifiedAt": user["faceProfile"].get("lastVerifiedAt"),
                "verificationCount": user["faceProfile"].get("verificationCount", 0)
            }
        }
    else:
        return {
            "success": False,
            "message": "Este usuario no tiene Face ID registrado."
        }


@router.delete("/profile", response_model=MessageResponse, dependencies=[Depends(get_current_user)])
async def delete_face_profile(current_user: dict = Depends(get_current_user)):
    """Delete user's face profile"""
    
    user = db.find_user_by_id(current_user["id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    user["faceProfile"] = None
    db.save_user(user)
    
    return {
        "success": True,
        "message": "Perfil facial eliminado exitosamente."
    }
