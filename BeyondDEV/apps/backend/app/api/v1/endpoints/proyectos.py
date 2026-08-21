from app.services.schemas.proyecto import ProyectoSchema
from fastapi  import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.database import get_db
from app.services.proyectos import ProyectoRepository

def get_proyecto_repository(db = Depends(get_db)):
    return ProyectoRepository(db)

router = APIRouter(
    prefix="/proyectos",
)

@router.post("")
async def createProject(proyecto: ProyectoSchema, repo: ProyectoRepository = Depends(get_proyecto_repository)):
    return repo.create_proyecto(proyecto)
