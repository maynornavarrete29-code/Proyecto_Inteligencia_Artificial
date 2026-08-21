from pydantic import BaseModel
from datetime import datetime

class FacturaSchema(BaseModel):
    pago_id: int
    numero_factura: str
    fecha_creacion: datetime
