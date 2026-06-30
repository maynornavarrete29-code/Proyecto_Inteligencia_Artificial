"""API Router"""
from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.faceid import router as faceid_router

# Main API router
api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(faceid_router)

__all__ = ["api_router"]
