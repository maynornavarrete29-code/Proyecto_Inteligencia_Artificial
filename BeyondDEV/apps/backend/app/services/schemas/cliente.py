from pydantic import BaseModel
from datetime import date

class ClienteSchema(BaseModel):
    nombre: str
    telefono: str
    email: str
    fecha_creacion: date
