from .base import BaseRepository
from .schemas.pago_cascada import PagoCascadaSchema

class PagosCascadaRepository(BaseRepository):
    def create_pagos_cascada(self, pagos_cascada: PagoCascadaSchema):
        query = "EXEC sp_crear_pago_cascada %s, %s, %s"
        params = (
            pagos_cascada.proyecto_id,
            pagos_cascada.monto,
        )

        return self._execute_query(query, params, is_write=True)
