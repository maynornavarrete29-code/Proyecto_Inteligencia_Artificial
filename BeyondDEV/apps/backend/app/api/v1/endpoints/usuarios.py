from fastapi import APIRouter, Depends, HTTPException, status
from app.services.schemas.usuario import UsuarioSchema
from app.services.usuarios import UsuarioRepository
from app.core.database import get_db

def get_usuarios_repository(db = Depends(get_db)):
    return UsuarioRepository(db)

router = APIRouter(
)

@router.post("")
async def create_usuario(usuario: UsuarioSchema, repo: UsuarioRepository = Depends(get_usuarios_repository)):
    return repo.create_usuario(usuario)

@router.get("")
async def get_usuarios(repo: UsuarioRepository = Depends(get_usuarios_repository)):
    return repo.get_usuarios()