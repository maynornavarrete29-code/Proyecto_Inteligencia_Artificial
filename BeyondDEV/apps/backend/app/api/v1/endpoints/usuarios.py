from fastapi import APIRouter, Depends, HTTPException, status
from app.services.schemas.usuario import UsuarioSchema, UsuarioLoginSchema
from app.services.usuarios import UsuariosRepository
from app.core.database import get_db
from app.utils.security import get_password_hash, create_access_token, verify_password
from datetime import timedelta
from pydantic import BaseModel, EmailStr

def get_usuario_repository(db = Depends(get_db)):
    return UsuariosRepository(db)

router = APIRouter()

class AuthResponseSchema(BaseModel):
    access_token: str
    token_type: str
    usuario_id: int
    nombre: str
    rol_id: int
    email: EmailStr

@router.post("")
async def create_usuario(usuario: UsuarioSchema, repo: UsuariosRepository = Depends(get_usuario_repository)):
    return repo.create_usuario(usuario)

@router.get("")
async def get_usuarios(repo: UsuariosRepository = Depends(get_usuario_repository)):
    return repo.get_usuarios()

@router.post("/signup", response_model=UsuarioSchema)
async def signup(usuario: UsuarioSchema, repo: UsuariosRepository = Depends(get_usuario_repository)):
    existing_user = repo.get_usuario_by_email(usuario.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario ya existe"
        )
    
    hashed_password = get_password_hash(usuario.hashed_password)
    usuario_id = repo.create_usuario(usuario, hashed_password)

    access_token = create_access_token(
        data={"sub": usuario.email, "usuario_id": usuario_id},
        expires_delta=timedelta(hours=8)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario_id": usuario_id,
        "nombre": usuario.nombre,
        "rol_id": usuario.rol_id,
        "email": usuario.email
    }

@router.post("/login", response_model = AuthResponseSchema)
async def login(credentials: UsuarioLoginSchema, repo: UsuariosRepository = Depends(get_usuario_repository)):
    user = repo.get_usuario_by_email(credentials.email)

    if not user or not verify_password(credentials.hashed_password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales de acceso invalidas",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "usuario_id": user["usuario_id"]},
        expires_delta=timedelta(hours=8)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario_id": user["usuario_id"],
        "nombre": user["nombre"],
        "rol_id": user["rol_id"],
        "email": user["email"]
    }