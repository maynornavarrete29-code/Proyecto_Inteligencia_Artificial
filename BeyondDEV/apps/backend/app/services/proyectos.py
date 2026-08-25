from .base import BaseRepository
from .schemas.proyecto import ProyectoSchema

class ProyectosRepository(BaseRepository):
    def create_proyecto(self, data: ProyectoSchema):
        print("Proyecto a crear desde el backend: ", data)
        try:
            query = "EXEC sp_crear_proyecto %s, %s, %s, %s, %s, %s, %s, %s"
            params = (
                data.nombre,
                data.tipo,
                data.descripcion,
                data.prioridad,
                data.estado,
                data.fecha_inicio,
                data.entrega_propuesta,
                data.presupuesto
            )

            return self._execute_query(
                query,
                params,
                is_write=True,
            )
        except Exception as e:
            print(f"Error al crear el proyecto: {e}")
            return None

    def listar_proyectos(self):
        query = "EXEC sp_listar_proyectos"
        '''params = (
            data.proyecto_id
        )'''
        return self._execute_query(query)