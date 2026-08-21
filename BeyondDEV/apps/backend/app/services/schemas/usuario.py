from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UsuarioSchema(BaseModel):
    rol_id: int
    nombre: str
    telefono: str
    email: str
    hashed_password: str
    fecha_creacion: datetime
