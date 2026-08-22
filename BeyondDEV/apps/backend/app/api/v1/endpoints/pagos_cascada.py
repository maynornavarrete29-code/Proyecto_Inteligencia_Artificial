from fastapi import APIRouter, Depends, HTTPException, status
from app.services.schemas.pago_cascada import PagoCascadaSchema
from app.services.pagos_cascada import PagosCascadaRepository
from app.core.database import get_db

def get_pagos_cascada_repository(db=Depends(get_db)):
    return PagosCascadaRepository(db)

router = APIRouter(
    prefix="/pagos-cascada",
    tags=["pagos-cascada"],
)

@router.post("")
async def create_pago_cascada(pago_cascada: PagoCascadaSchema, repo: PagosCascadaRepository = Depends(get_pagos_cascada_repository)):
    return repo.create_pagos_cascada(pago_cascada)
