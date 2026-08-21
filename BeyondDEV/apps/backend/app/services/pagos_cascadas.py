from .base import BaseRepository
from .schemas.pagos_cascada import PagosCascadaSchema

class PagosCascadaRepository(BaseRepository):
    def crear_pagos_cascada(self, pagos_cascada: PagosCascadaSchema):
        query = "EXEC sp_crear_pagos_cascada @proyecto_id = ?, @monto = ?, @fecha_pago = ?"
        params = (
            pagos_cascada.proyecto_id,
            pagos_cascada.monto,
            pagos_cascada.fecha_pago,
        )

        return self._execute_query(query, params, is_write=True)
