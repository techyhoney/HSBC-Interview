"""Housing price prediction API endpoints."""
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from app.model import ModelService
from app.schemas import (
    HealthResponse,
    ModelInfoResponse,
    PredictRequest,
    PredictResponse,
)

# Holds the loaded model service for the lifetime of the app.
state: dict[str, ModelService] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once at startup; clean up on shutdown."""
    try:
        state["model"] = ModelService()
    except FileNotFoundError:
        # Allow the app to boot (so /health works) even without an artifact.
        state["model"] = None
    yield
    state.clear()


app = FastAPI(
    title="Housing Price Prediction API",
    description="Predicts housing prices using a scikit-learn Linear Regression model.",
    version="1.0.0",
    lifespan=lifespan,
)


def get_model() -> ModelService:
    model = state.get("model")
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run `python train.py` to create model.pkl.",
        )
    return model


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    """Simple health check."""
    return HealthResponse(status="ok", model_loaded=state.get("model") is not None)


@app.get("/model-info", response_model=ModelInfoResponse, tags=["model"])
def model_info() -> ModelInfoResponse:
    """Return model coefficients, intercept and performance metrics."""
    return ModelInfoResponse(**get_model().info())


@app.post("/predict", response_model=PredictResponse, tags=["model"])
def predict(request: PredictRequest) -> PredictResponse:
    """Predict price(s) for one or many houses (single = list of one)."""
    predictions = get_model().predict(request.items)
    return PredictResponse(predictions=predictions)
