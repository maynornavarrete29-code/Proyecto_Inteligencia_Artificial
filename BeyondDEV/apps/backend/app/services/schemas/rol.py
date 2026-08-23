from pydantic import BaseModel
from typing import Optional

class RolSchema(BaseModel):
    rol_id: Optional[int] = None
    tipo: str
    descripcion: Optional[str] = None
