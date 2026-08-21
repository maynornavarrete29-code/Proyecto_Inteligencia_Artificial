from fastapi import APIRouter, Depends, HTTPException, status
from services.comentarios import ComentarioRepository
from services.schemas.comentario import ComentarioSchema
from app.core.database import get_db

def get_comentario_repository(db = Depends(get_db)):
    return ComentarioRepository(db)

router = APIRouter(
    prefix = "/comentarios",
    tags = ["comentarios"]
)

@router.post("")
async def create_comentario(comentarios: ComentarioSchema, repo: ComentarioRepository = Depends(get_comentario_repository)):
    return repo.crear_comentario(comentarios)
