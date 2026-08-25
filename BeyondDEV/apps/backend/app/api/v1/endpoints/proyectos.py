from app.services.schemas.proyecto import ProyectoSchema
from fastapi  import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.database import get_db
from app.services.proyectos import ProyectoRepository

def get_proyecto_repository(db = Depends(get_db)):
    return ProyectoRepository(db)

router = APIRouter(
)

@router.post("", status_code=status.HTTP_201_CREATED)
async def createProject(proyecto: ProyectoSchema, repo: ProyectoRepository = Depends(get_proyecto_repository)):
    print("Proyecto a crear desde el backend: ", proyecto)
    return repo.create_proyecto(proyecto)

@router.get("")
async def getProjects(repo: ProyectoRepository = Depends(get_proyecto_repository)):
    proyectos = repo.listar_proyectos()

    if not proyectos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Proyectos no encontrados"
        )

    return proyectos

