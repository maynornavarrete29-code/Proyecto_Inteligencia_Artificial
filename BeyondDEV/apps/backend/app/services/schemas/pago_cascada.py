from pydantic import BaseModel
from datetime import datetime

class PagoCascadaSchema(BaseModel):
    proyecto_id: int
    monto: float
    fecha_pago: datetime
