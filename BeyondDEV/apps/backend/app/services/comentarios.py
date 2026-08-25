from .base import BaseRepository
from .schemas.comentario import ComentarioSchema

class ComentariosRepository(BaseRepository):
    def create_comentario(self, data: ComentarioSchema):
        query = "EXEC sp_crear_comentario %s, %s"
        params = (
            data.descripcion,
            data.usuario_id,
        )
        return self._execute_query(query, params, is_write=True)

    def get_comentarios(self):
        query = "EXEC sp_listar_comentarios"
        return self._execute_query(query)
