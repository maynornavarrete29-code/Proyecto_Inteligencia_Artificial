from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ia_engine import get_ia_engine

router = APIRouter()


class PredictRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    input: dict
    prediction: dict


@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """Receive a simple JSON payload, pass it to the IA engine and return result."""
    engine = get_ia_engine()
    result = engine.predict(request.dict())
    return {"input": request.dict(), "prediction": result}
