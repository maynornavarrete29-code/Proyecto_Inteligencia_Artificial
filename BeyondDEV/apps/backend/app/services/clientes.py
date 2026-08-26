from .base import BaseRepository
from .schemas.cliente import ClienteSchema

class ClientesRepository(BaseRepository):
    def create_cliente(self, data: ClienteSchema):
        query = "EXEC sp_crear_cliente %s, %s, %s, %s"
        params = (
            data.nombre,
            data.documento,
            data.telefono,
            data.email
        )

        return self._execute_query(query, params, is_write=True)

    def get_clientes(self):
        query = "EXEC sp_listar_clientes"
        return self._execute_query(query)
