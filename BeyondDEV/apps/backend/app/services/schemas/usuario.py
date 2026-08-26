from datetime import date
from typing import Optional
from pydantic import BaseModel

class UsuarioSchema(BaseModel):
    rol_id: Optional[int] = None
    documento: Optional[str] = None
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    hashed_password: Optional[str] = None
    fecha_creacion: Optional[date] = None
    
