from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ProyectoSchema(BaseModel):
    nombre: str
    tipo: str
    descripcion: str
    prioridad: str
    estado: str
    fecha_inicio: date
    entrega_propuesta: date
    presupuesto: float
