#!/usr/bin/env python
"""FastAPI Server Entry Point"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    
    print(f"\n🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"📍 Running on http://0.0.0.0:8000")
    print(f"📚 API Docs: http://localhost:8000/docs\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
