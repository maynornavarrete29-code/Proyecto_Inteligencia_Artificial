from ....services.tecnologias import TecnologiaRepository
from ....services.schemas.tecnologia import TecnologiaSchema
from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db

def get_tecnologia_repository(db = Depends(get_db)):
    return TecnologiaRepository(db)

router = APIRouter(
    prefix = "/tecnologias",
    tags = ["tecnologias"]
)

@router.post("")
async def create_tecnologias(tecnologia: TecnologiaSchema, repo: TecnologiaRepository = Depends(get_tecnologia_repository)):
    return repo.create_tecnologia(tecnologia)
