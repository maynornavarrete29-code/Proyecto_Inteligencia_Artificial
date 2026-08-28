"""FastAPI application entrypoint for BeyondDev backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core import database
from app.api.v1.routes import api_router  # <-- Importamos desde routes.py
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.auth import AuthMiddleware

app = FastAPI(
    title="BeyondDev Backend",
    version="1.0.0"
)

app.add_middleware(AuthMiddleware)

# Configuración de CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos todas las rutas de v1 bajo el prefijo /api/v1
app.include_router(api_router, prefix="/api/v1")