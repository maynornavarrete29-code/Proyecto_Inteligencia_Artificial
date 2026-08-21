from pydantic import BaseModel

class TecnologiaSchema(BaseModel):
    nombre: str
    tipo: str
    descripcion: str
