from app.services.schemas.cliente import ClienteSchema
from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db
from app.services.clientes import ClienteRepository

def get_cliente_repository(db=Depends(get_db)):
    return ClienteRepository(db)

router = APIRouter(
    prefix = "/clientes",
    tags = ["clientes"]
)

@router.post("")
async def create_cliente(cliente: ClienteSchema, repo: ClienteRepository = Depends(get_cliente_repository)):
    return repo.create_cliente(cliente)
