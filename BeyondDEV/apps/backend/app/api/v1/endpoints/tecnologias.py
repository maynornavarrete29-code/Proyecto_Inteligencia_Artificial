from app.services.tecnologias import TecnologiasRepository
from app.services.schemas.tecnologia import TecnologiaSchema
from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db

def get_tecnologia_repository(db = Depends(get_db)):
    return TecnologiasRepository(db)

router = APIRouter(
)

@router.post("")
async def create_tecnologias(tecnologia: TecnologiaSchema, repo: TecnologiasRepository = Depends(get_tecnologia_repository)):
    return repo.create_tecnologia(tecnologia)

@router.get("")
async def get_tecnologias(repo: TecnologiasRepository = Depends(get_tecnologia_repository)):
    return repo.get_tecnologias()
