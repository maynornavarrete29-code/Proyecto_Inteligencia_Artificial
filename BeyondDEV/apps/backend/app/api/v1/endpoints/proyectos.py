from app.services.schemas.proyecto import ProyectoSchema
from fastapi  import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.database import get_db
from app.services.proyectos import ProyectosRepository

def get_proyecto_repository(db = Depends(get_db)):
    return ProyectosRepository(db)

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED)
async def createProject(proyecto: ProyectoSchema, repo: ProyectosRepository = Depends(get_proyecto_repository)):
    print("Proyecto a crear desde el backend: ", proyecto)
    return repo.create_proyecto(proyecto)

@router.get("")
async def getProjects(repo: ProyectosRepository = Depends(get_proyecto_repository)):
    proyectos = repo.listar_proyectos()

    if not proyectos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Proyectos no encontrados"
        )

    return proyectos

@router.put("/{proyecto_id}", status_code=status.HTTP_200_OK)
async def updateProject(proyecto_id: int, proyecto: ProyectoSchema, repo: ProyectosRepository = Depends(get_proyecto_repository)):
    print("Proyecto a actualizar desde el backend: ", proyecto)
    updated_proyecto = repo.update_proyecto(proyecto)

    if not updated_proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Proyecto no encontrado"
        )

    return updated_proyecto