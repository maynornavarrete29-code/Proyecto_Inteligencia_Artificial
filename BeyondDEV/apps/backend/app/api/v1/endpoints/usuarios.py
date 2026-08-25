from fastapi import APIRouter, Depends, HTTPException, status
from app.services.schemas.usuario import UsuarioSchema
from app.services.usuarios import UsuariosRepository
from app.core.database import get_db

def get_usuario_repository(db = Depends(get_db)):
    return UsuariosRepository(db)

router = APIRouter()

@router.post("")
async def create_usuario(usuario: UsuarioSchema, repo: UsuariosRepository = Depends(get_usuario_repository)):
    return repo.create_usuario(usuario)

@router.get("")
async def get_usuarios(repo: UsuariosRepository = Depends(get_usuario_repository)):
    return repo.get_usuarios()