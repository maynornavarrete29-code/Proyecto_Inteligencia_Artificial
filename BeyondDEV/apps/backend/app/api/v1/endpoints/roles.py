from fastapi import APIRouter, Depends, HTTPException, status
from app.services.roles import RolesRepository
from app.services.schemas.rol import RolSchema
from app.core.database import get_db

def get_rol_repository(db=Depends(get_db)):
    return RolesRepository(db)


router = APIRouter()

@router.post("")
async def create_rol(rol: RolSchema, repo: RolesRepository = Depends(get_rol_repository)):
    return repo.create_rol(rol)

@router.get("")
async def get_roles(repo: RolesRepository = Depends(get_rol_repository)):
    return repo.get_roles()