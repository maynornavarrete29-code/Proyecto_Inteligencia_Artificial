from .base import BaseRepository
from .schemas.rol import RolSchema

class RolesRepository(BaseRepository):
    def create_rol(self, data: RolSchema):
        query = "EXEC sp_crear_rol %s, %s"
        params = (
            data.nombre,
            data.descripcion,
        )

        return self._execute_query(query, params, is_write=True)
