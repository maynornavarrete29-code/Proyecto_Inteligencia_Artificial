from fastapi import APIRouter, Depends, HTTPException, status
from apps.backend.app.services.roles import RolesRepository
from apps.backend.app.services.schemas.rol import RolSchema
from apps.backend.app.core.database import get_db

def get_roles_repository(db=Depends(get_db)):
    return RolesRepository(db)


router = APIRouter(
    prefix = "/roles",
    tags = ["roles"]
)

@router.post("")
async def create_rol(rol: RolSchema, repo: RolesRepository = Depends(get_roles_repository)):
    return repo.create_rol(rol)
