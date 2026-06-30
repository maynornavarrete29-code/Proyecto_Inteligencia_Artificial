"""Email Service (Mock)"""
from datetime import datetime
from typing import Dict, Any
import uuid


class EmailService:
    """Email sending service (mock for development)"""
    
    @staticmethod
    def send_verification_email(to: str, name: str, token: str, base_url: str) -> Dict[str, Any]:
        """Send verification email"""
        email_id = f"email-{str(uuid.uuid4())}"
        
        verification_link = f"{base_url}/verify?email={to}&token={token}"
        
        email_record = {
            "id": email_id,
            "type": "verification",
            "to": to,
            "name": name,
            "subject": f"Verifica tu cuenta en {base_url.split('//')[1].split(':')[0]}",
            "message": f"Hola {name}, haz clic aquí para verificar tu cuenta: {verification_link}",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "previewUrl": f"http://localhost:3000/mail/{email_id}"
        }
        
        return email_record
    
    @staticmethod
    def send_faceid_registered_email(to: str, name: str, quality: float) -> Dict[str, Any]:
        """Send Face ID registration confirmation"""
        email_id = f"email-{str(uuid.uuid4())}"
        
        email_record = {
            "id": email_id,
            "type": "faceid",
            "to": to,
            "name": name,
            "subject": "✓ Face ID Registrado en BeyondDev",
            "message": f"Hola {name}, tu perfil facial ha sido registrado exitosamente (Calidad: {quality}%). Ya puedes usar Face ID para acceder.",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "previewUrl": f"http://localhost:3000/mail/{email_id}"
        }
        
        return email_record
    
    @staticmethod
    def send_password_reset_email(to: str, name: str, token: str, base_url: str) -> Dict[str, Any]:
        """Send password reset email"""
        email_id = f"email-{str(uuid.uuid4())}"
        
        reset_link = f"{base_url}/reset-password?email={to}&token={token}"
        
        email_record = {
            "id": email_id,
            "type": "reset",
            "to": to,
            "name": name,
            "subject": "Restablecer contraseña",
            "message": f"Hola {name}, haz clic aquí para restablecer tu contraseña: {reset_link}",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "previewUrl": f"http://localhost:3000/mail/{email_id}"
        }
        
        return email_record
