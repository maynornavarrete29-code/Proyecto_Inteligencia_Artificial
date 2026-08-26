from fastapi import APIRouter

from app.api.v1.endpoints import (
    clientes,
    comentarios,
    facturas,
    pagos_cascada,
    proyectos,
    roles,
    stack_proyectos,
    tecnologias,
    usuarios,
    tareas
)

#creamos un router central para la version 1 de la api
api_router = APIRouter()

#registrsamos los routers de cada endpoint en el router central
api_router.include_router(clientes.router, prefix="/clientes", tags=["clientes"])
api_router.include_router(comentarios.router, prefix="/comentarios", tags=["comentarios"])
api_router.include_router(facturas.router, prefix="/facturas", tags=["facturas"])
api_router.include_router(pagos_cascada.router, prefix="/pagos_cascada", tags=["pagos_cascada"])
api_router.include_router(proyectos.router, prefix="/proyectos", tags=["proyectos"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(stack_proyectos.router, prefix="/stack_proyectos", tags=["stack_proyectos"])
api_router.include_router(tecnologias.router, prefix="/tecnologias", tags=["tecnologias"])
api_router.include_router(usuarios.router, prefix="/usuarios", tags=["usuarios"])
api_router.include_router(tareas.router, prefix="/tareas", tags=["tareas"])