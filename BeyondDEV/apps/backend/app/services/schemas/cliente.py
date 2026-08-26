from pydantic import BaseModel
from datetime import date
from typing import Optional

class ClienteSchema(BaseModel):
    nombre: Optional[str] = None
    documento: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    fecha_creacion: Optional[date] = None
