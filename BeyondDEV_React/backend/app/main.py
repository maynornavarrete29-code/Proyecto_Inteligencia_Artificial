"""Main FastAPI Application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.api import api_router
from app.models import db

# Initialize database
db.read()  # Ensure DB is initialized

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "message": f"{settings.APP_NAME} v{settings.APP_VERSION} funcionando correctamente.",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    }


@app.get("/api/emails")
async def get_emails():
    """Get all email records"""
    emails = db.get_emails()
    return {"success": True, "emails": emails}


@app.delete("/api/emails")
async def clear_emails():
    """Clear all email records"""
    db.clear_emails()
    return {"success": True, "message": "Emails cleared."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
