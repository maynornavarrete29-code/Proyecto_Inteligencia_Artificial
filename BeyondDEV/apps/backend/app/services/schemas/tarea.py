from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TareaSchema(BaseModel):
    tarea_id: Optional[int] = None
    proyecto_id: Optional[int] = None
    usuario_id: Optional[int] = None
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    prioridad: Optional[str] = None
    estado: Optional[str] = None
    fecha_asignacion: Optional[datetime] = None
