from .base import BaseRepository
from .schemas.proyecto import ProyectoSchema

class ProyectoRepository(BaseRepository):
    def crear_proyecto(self, data: ProyectoSchema):
        query = "EXEC sp_crear_proyecto %s, %s, %s, %s, %s, %s, %s, %s"
        params = (
            data.nombre,
            data.tipo,
            data.descripcion,
            data.prioridad,
            data.estado,
            data.fecha_inicio,
            data.entrega_propuesta,
            data.presupuesto
        )

        return self._execute_query(
            query,
            params,
            is_write=True,
        );
