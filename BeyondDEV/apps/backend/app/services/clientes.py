from .base import BaseRepository
from .schemas.cliente import ClienteSchema

class ClienteRepository(BaseRepository):
    def crear_cliente(self, data: ClienteSchema):
        query = "EXEC sp_crear_cliente %s, %s, %s, %s"
        params = (
            data.nombre,
            data.telefono,
            data.email,
            data.fecha_creacion
        )

        return self._execute_query(query, params, is_write=True);
