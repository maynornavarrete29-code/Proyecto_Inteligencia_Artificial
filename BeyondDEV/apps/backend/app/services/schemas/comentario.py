from pydantic import BaseModel
from datetime import datetime

class ComentarioSchema(BaseModel):
    descripcion: str
    usuario_id: int
    fecha_creacion: datetime
