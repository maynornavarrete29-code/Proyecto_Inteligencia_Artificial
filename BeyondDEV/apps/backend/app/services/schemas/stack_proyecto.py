from pydantic import BaseModel

class StackProyectoSchema(BaseModel):
    proyecto_id: int
    tecnologia_id: int
