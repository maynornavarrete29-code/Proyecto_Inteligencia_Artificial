from app.services.schemas.factura import FacturaSchema
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_db
from app.services.facturas import FacturaRepository

def get_factura_repository(db=Depends(get_db)):
    return FacturaRepository(db)

router = APIRouter(
)

@router.post("")
async def create_factura(factura: FacturaSchema, repo: FacturaRepository = Depends(get_factura_repository)):
    return repo.create_factura(factura)

@router.get("")
async def get_facturas(repo: FacturaRepository = Depends(get_factura_repository)):
    return repo.get_facturas()