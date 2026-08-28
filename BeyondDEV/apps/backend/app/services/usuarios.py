from .base import BaseRepository
from .schemas.usuario import UsuarioSchema
from typing import Optional

class UsuariosRepository(BaseRepository):
    def create_usuario(self, data: UsuarioSchema, hashed_password: str) -> int:
        query = "EXEC sp_crear_usuario %s, %s, %s, %s, %s"
        params = (
            data.rol_id,
            data.nombre,
            data.telefono,
            data.email,
            hashed_password
        )

        result = self._execute_query(query, params, is_write=True)

        if result:
            if isinstance(result, dict):
                return int(result.get("usuario_id", 0))
            elif isinstance(result, (list, tuple)):
                return int(result[0])
        return 0

    def get_usuarios(self):
        query = "EXEC sp_listar_usuarios"
        return self._execute_query(query)

    def get_usuario_by_email(self, email: str) -> Optional[dict]:
        query = "EXEC sp_obtener_usuario_por_email %s"
        params = (email,)
        return self._execute_query(query, params, fetch_one=True)