from pydantic import BaseModel

class RolSchema(BaseModel):
    tipo: str
    descripcion: str
