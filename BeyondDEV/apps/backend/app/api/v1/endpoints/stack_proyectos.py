from fastapi import APIRouter, Depends, HTTPException, status
from app.services.stack_proyectos import StackProyectosRepository
from app.services.schemas.stack_proyecto import StackProyectoSchema
from app.core.database import get_db

def get_stack_proyecto_repository(db = Depends(get_db)):
    return StackProyectosRepository(db)

router = APIRouter()

@router.post("")
async def create_stack_proyecto(StackProyecto: StackProyectoSchema, repo: StackProyectosRepository = Depends(get_stack_proyecto_repository)):
    return repo.create_stack_proyecto(StackProyecto)

@router.get("")
async def get_stack_proyectos(repo: StackProyectosRepository = Depends(get_stack_proyecto_repository)):
    return repo.get_stack_proyectos()