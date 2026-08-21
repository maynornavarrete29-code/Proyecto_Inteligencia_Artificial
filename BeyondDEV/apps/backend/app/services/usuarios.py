from .base import BaseRepository
from .schemas.usuario import UsuarioSchema

class UsuarioRepository(BaseRepository):
    def crear_usuario(self, data: UsuarioSchema):
        query = "EXEC sp_crear_usuario %s, %s, %s, %s"
        params = (
            data.nombre,
            data.telefono,
            data.email,
            data.hashed_password,
        )

        return self._execute_query(query, params, is_write=True)
