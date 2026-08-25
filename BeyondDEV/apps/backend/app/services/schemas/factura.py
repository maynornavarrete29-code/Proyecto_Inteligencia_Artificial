from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FacturaSchema(BaseModel):
    pago_id: Optional[int] = None
    numero_factura: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
