from .base import BaseRepository
from .schemas.usuario import UsuarioSchema

class UsuarioRepository(BaseRepository):
    def create_usuario(self, data: UsuarioSchema):
        query = "EXEC sp_crear_usuario %s, %s, %s, %s"
        params = (
            data.nombre,
            data.telefono,
            data.email,
            data.hashed_password
        )

        return self._execute_query(query, params, is_write=True)

    def get_usuarios(self):
        query = "EXEC sp_listar_usuarios"
        return self._execute_query(query)