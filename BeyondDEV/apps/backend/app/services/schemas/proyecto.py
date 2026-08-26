from datetime import date
from typing import Optional
from pydantic import BaseModel

class ProyectoSchema(BaseModel):
    proyecto_id: Optional[int] = None
    cliente_id: Optional[int] = None
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
    prioridad: Optional[str] = None
    estado: Optional[str] = None
    fecha_inicio: Optional[date] = None
    entrega_propuesta: Optional[date] = None
    presupuesto: Optional[float] = None
