"""Property Value Estimator backend service."""
import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    BatchEstimateRequest,
    BatchEstimateResponse,
    EstimateResponse,
    HealthResponse,
    HousingFeatures,
)

MODEL_API_URL = os.getenv("MODEL_API_URL", "http://localhost:8000").rstrip("/")
REQUEST_TIMEOUT = float(os.getenv("MODEL_API_TIMEOUT", "10"))

app = FastAPI(
    title="Property Value Estimator BFF",
    description="Backend-for-frontend that validates inputs and calls the Task 1 model API.",
    version="1.0.0",
)

# CORS: the Next.js portal calls this service directly from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


async def _call_model(items: list[HousingFeatures]) -> list[float]:
    """Call model API for predictions."""
    payload = {"items": [item.model_dump() for item in items]}
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            resp = await client.post(f"{MODEL_API_URL}/predict", json=payload)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Model API is unreachable at {MODEL_API_URL}: {exc}",
        ) from exc

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Model API returned {resp.status_code}: {resp.text}",
        )

    predictions = resp.json().get("predictions")
    if not isinstance(predictions, list) or len(predictions) != len(items):
        raise HTTPException(status_code=502, detail="Malformed response from model API.")
    return predictions


@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health() -> HealthResponse:
    return HealthResponse(status="ok", model_api_url=MODEL_API_URL)


@app.post("/estimate", response_model=EstimateResponse, tags=["estimate"])
async def estimate(features: HousingFeatures) -> EstimateResponse:
    """Single property estimate."""
    predictions = await _call_model([features])
    return EstimateResponse(predicted_price=predictions[0], features=features)


@app.post("/estimate/batch", response_model=BatchEstimateResponse, tags=["estimate"])
async def estimate_batch(request: BatchEstimateRequest) -> BatchEstimateResponse:
    """Batch property estimates."""
    predictions = await _call_model(request.items)
    estimates = [
        EstimateResponse(predicted_price=price, features=feature)
        for price, feature in zip(predictions, request.items)
    ]
    return BatchEstimateResponse(estimates=estimates)
