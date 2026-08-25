from .base import BaseRepository
from .schemas.tarea import TareaSchema

class TareasRepository(BaseRepository):
    def create_tarea(self, data: TareaSchema):
        query = "EXEC sp_crear_tarea %s, %s, %s, %s, %s, %s"

        params = (
            data.proyecto_id,
            data.usuario_id,
            data.descripcion,
            data.prioridad,
            data.estado,
            data.fecha_asignacion
        )

        return self._execute_query(query, params, is_write=True)

    def get_tareas(self):
        query = "EXEC sp_listar_tareas"
        return self._execute_query(query)