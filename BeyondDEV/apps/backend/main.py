"""FastAPI application entrypoint for BeyondDev backend.

Includes CORS configuration for the Next.js frontend and a simple health endpoint.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.services.ia_engine import get_ia_engine
from app.core import database

app = FastAPI(title="BeyondDev Backend")

# Allow the local frontend during development
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
async def health() -> dict:
    """Health endpoint that verifies the AI engine and DB connectivity."""
    engine = get_ia_engine()

    # Check DB connectivity (non-fatal)
    db_ok = False
    db_error = None
    try:
        with database.engine.connect() as conn:
            # lightweight check
            conn.execute("SELECT 1")
        db_ok = True
    except Exception as exc:
        db_error = str(exc)

    return {
        "status": "ok",
        "model_loaded": bool(engine.model),
        "db_ok": db_ok,
        "db_error": db_error,
        "db_host": settings.DB_HOST,
    }
