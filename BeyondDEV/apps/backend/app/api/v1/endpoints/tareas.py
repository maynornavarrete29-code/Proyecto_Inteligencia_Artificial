from fastapi import APIRouter, Depends, HTTPException, status
from app.services.tareas import TareasRepository
from app.services.schemas.tarea import TareaSchema
from app.core.database import get_db

def get_tarea_repository(db = Depends(get_db)):
    return TareasRepository(db)

router = APIRouter()

@router.post("")
async def create_tarea(tarea: TareaSchema, repo: TareasRepository = Depends(get_tarea_repository)):
    return repo.create_tarea(tarea) 

@router.get("")
async def get_tareas(repo: TareasRepository = Depends(get_tarea_repository)):
    return repo.get_tareas()
