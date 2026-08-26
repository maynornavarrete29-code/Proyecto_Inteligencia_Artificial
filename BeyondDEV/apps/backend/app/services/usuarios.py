from .base import BaseRepository
from .schemas.usuario import UsuarioSchema

class UsuariosRepository(BaseRepository):
    def create_usuario(self, data: UsuarioSchema):
        query = "EXEC sp_crear_usuario %s, %s, %s, %s, %s"
        params = (
            data.rol_id,
            data.nombre,
            data.telefono,
            data.email,
            '$2b$10$d0.NeMqKOMJhsAH2VfcDk.Y.PTWz2JEfG0W0imwmgL37cXTZModnW'
        )

        return self._execute_query(query, params, is_write=True)

    def get_usuarios(self):
        query = "EXEC sp_listar_usuarios"
        return self._execute_query(query)