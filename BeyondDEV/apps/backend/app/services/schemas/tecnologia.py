from pydantic import BaseModel
from typing import Optional

class TecnologiaSchema(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
