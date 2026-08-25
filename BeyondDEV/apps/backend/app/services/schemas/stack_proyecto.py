from pydantic import BaseModel
from typing import Optional

class StackProyectoSchema(BaseModel):
    proyecto_id: Optional[int] = None
    tecnologia_id: Optional[int] = None
