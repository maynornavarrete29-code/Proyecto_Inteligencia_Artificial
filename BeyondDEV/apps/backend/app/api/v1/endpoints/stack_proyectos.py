from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.services.stack_proyectos import StackProyectosRepository
from backend.app.services.schemas.stack_proyecto import StackProyectoSchema
from backend.app.core.database import get_db

def get_stack_proyectos_repo(db = Depends(get_db)):
    return StackProyectosRepository(db)

router = APIRouter(
    prefix="/stack-proyectos",
    tags=["stack-proyectos"]
)

@router.post("")
async def create_stack_proyecto(data: StackProyectoSchema, repo: StackProyectosRepository = Depends(get_stack_proyectos_repo)):
    return repo.crear_stack_proyecto(data)
