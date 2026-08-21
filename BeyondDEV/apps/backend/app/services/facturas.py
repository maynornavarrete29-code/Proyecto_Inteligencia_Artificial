from .base import BaseRepository
from .schemas.factura import FacturaSchema

class FacturaRepository(BaseRepository):
    def crear_factura(self, data: FacturaSchema):
        query = "EXEC sp_crear_factura %s, %s, %s"

        params =(
            data.pago_id,
            data.numero_factura
        )

        return self._execute_query(query, params, is_write=True)
