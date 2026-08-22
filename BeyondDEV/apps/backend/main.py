"""FastAPI application entrypoint for BeyondDev backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core import database
from app.api.v1.routes import api_router  # <-- Importamos desde routes.py

app = FastAPI(
    title="BeyondDev Backend",
    version="1.0.0"
)

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

'''
@app.get("/")
async def root() -> dict:
    """comprobación del estado de la Base de Datos."""
    db_ok = False
    db_error = None
    try:
        with database.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception as exc:
        db_error = str(exc)

    return {
        "message": "¡Hola Mundo! La API de BeyondDev está funcionando 🚀",
        "database_status": "Conectada correctamente" if db_ok else "Sin conexión",
        "database_error": db_error
    }
'''