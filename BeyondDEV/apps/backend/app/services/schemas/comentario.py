from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ComentarioSchema(BaseModel):
    descripcion: Optional[str] = None
    usuario_id: Optional[int] = None
    fecha_creacion: Optional[datetime] = None
