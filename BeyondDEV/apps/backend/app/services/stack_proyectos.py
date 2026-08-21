from .base import BaseRepository
from .schemas.stack_proyecto import StackProyectoSchema

class StackProyectosRepository(BaseRepository):
    def crear_stack_proyecto(self, data: StackProyectoSchema):
        query = "EXEC sp_crear_stack_proyecto %s, %s"
        params = (
            data.proyecto_id,
            data.tecnologia_id,
        )

        return self._execute_query(
            query,
            params,
            is_write=True,
        )
