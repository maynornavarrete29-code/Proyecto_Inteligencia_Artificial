from fastapi import APIRouter, Depends, HTTPException, status
from app.services.comentarios import ComentariosRepository
from app.services.schemas.comentario import ComentarioSchema
from app.core.database import get_db

def get_comentario_repository(db = Depends(get_db)):
    return ComentariosRepository(db)

router = APIRouter()

@router.post("")
async def create_comentario(comentario: ComentarioSchema, repo: ComentariosRepository = Depends(get_comentario_repository)):
    return repo.create_comentario(comentario)

@router.get("")
async def get_comentarios(repo: ComentariosRepository = Depends(get_comentario_repository)):
    return repo.get_comentarios()