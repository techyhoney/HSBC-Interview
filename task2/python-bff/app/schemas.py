"""Pydantic schemas for the App 1 BFF.

These mirror the Task 1 model contract but add BFF-friendly response shapes
(echoing inputs alongside the predicted price) so the frontend has everything
it needs from a single call.
"""
from pydantic import BaseModel, Field


class HousingFeatures(BaseModel):
    """Features describing a single property (validated before forwarding)."""

    square_footage: float = Field(..., gt=0, description="Interior area in square feet")
    bedrooms: int = Field(..., ge=0, le=20, description="Number of bedrooms")
    bathrooms: float = Field(..., ge=0, le=20, description="Number of bathrooms")
    year_built: int = Field(..., ge=1800, le=2100, description="Year the house was built")
    lot_size: float = Field(..., gt=0, description="Lot size in square feet")
    distance_to_city_center: float = Field(..., ge=0, description="Distance to city center")
    school_rating: float = Field(..., ge=0, le=10, description="Local school rating (0-10)")


class EstimateResponse(BaseModel):
    """A single estimate: predicted price plus the echoed inputs."""

    predicted_price: float
    features: HousingFeatures


class BatchEstimateRequest(BaseModel):
    """Multiple properties for the comparison view."""

    items: list[HousingFeatures] = Field(..., min_length=1, max_length=25)


class BatchEstimateResponse(BaseModel):
    estimates: list[EstimateResponse]


class HealthResponse(BaseModel):
    status: str
    model_api_url: str
