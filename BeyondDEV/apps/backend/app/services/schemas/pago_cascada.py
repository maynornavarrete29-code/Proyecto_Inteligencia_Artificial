from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PagoCascadaSchema(BaseModel):
    proyecto_id: Optional[int] = None
    monto: Optional[float] = None
    fecha_pago: Optional[datetime] = None
