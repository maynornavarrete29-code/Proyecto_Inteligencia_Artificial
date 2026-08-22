from .base import BaseRepository
from .schemas.factura import FacturaSchema

class FacturaRepository(BaseRepository):
    def create_factura(self, data: FacturaSchema):
        query = "EXEC sp_crear_factura %s, %s, %s"

        params =(
            data.pago_id,
            data.numero_factura
        )

        return self._execute_query(query, params, is_write=True)

    def get_facturas(self):
        query = "EXEC sp_listar_facturas"
        return self._execute_query(query)
