from .base import BaseRepository
from .schemas.tecnologia import TecnologiaSchema

class TecnologiasRepository(BaseRepository):

    def crear_tecnologia(self, data: TecnologiaSchema):
        query = "EXEC sp_crear_tecnologia %s, %s,%s"
        params = (
            data.nombre,
            data.tipo,
            data.descripcion,
        )

        return self._execute_query(
            query,
            params,
            is_write=True,
        )
