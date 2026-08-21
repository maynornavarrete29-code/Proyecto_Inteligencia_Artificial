from fastapi import APIRouter, Depends, HTTPException, status
from ....services.schemas.pago_cascada import PagoCascadaSchema
from ....services.pagos_cascada import PagosCascadaRepository
from ....core.database import get_db

def get_pagos_cascada_repo(db=Depends(get_db)):
    return PagosCascadaRepository(db)


router = APIRouter(
    prefix="/pagos-cascada",
    tags=["pagos-cascada"],
)

@router.post("/")
async def create_pago_cascada(pago_cascada: PagoCascadaSchema, repo: PagosCascadaRepository = Depends(get_pagos_cascada_repo)):
    return repo.create(pago_cascada)
