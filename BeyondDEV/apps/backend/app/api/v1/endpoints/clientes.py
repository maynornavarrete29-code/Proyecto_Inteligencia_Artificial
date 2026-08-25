from app.services.schemas.cliente import ClienteSchema
from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db
from app.services.clientes import ClientesRepository

def get_cliente_repository(db=Depends(get_db)):
    return ClientesRepository(db)

router = APIRouter()

@router.post("")
async def create_cliente(cliente: ClienteSchema, repo: ClientesRepository = Depends(get_cliente_repository)):
    return repo.create_cliente(cliente)

@router.get("")
async def get_clientes(repo: ClientesRepository = Depends(get_cliente_repository)):
    return repo.get_clientes()