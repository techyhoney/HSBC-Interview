"""Pydantic schemas for request/response validation and Swagger examples."""
from pydantic import BaseModel, Field


class HousingFeatures(BaseModel):
    """Features describing a single house."""

    square_footage: float = Field(..., gt=0, description="Interior area in square feet")
    bedrooms: int = Field(..., ge=0, description="Number of bedrooms")
    bathrooms: float = Field(..., ge=0, description="Number of bathrooms (half-baths allowed)")
    year_built: int = Field(..., ge=1800, le=2100, description="Year the house was built")
    lot_size: float = Field(..., gt=0, description="Lot size in square feet")
    distance_to_city_center: float = Field(..., ge=0, description="Distance to city center in km/miles")
    school_rating: float = Field(..., ge=0, le=10, description="Local school rating (0-10)")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "square_footage": 1800,
                    "bedrooms": 3,
                    "bathrooms": 2,
                    "year_built": 2000,
                    "lot_size": 7300,
                    "distance_to_city_center": 4.5,
                    "school_rating": 8.0,
                }
            ]
        }
    }


class PredictRequest(BaseModel):
    """Wraps one or more houses. A single prediction is just a list of one."""

    items: list[HousingFeatures] = Field(..., min_length=1, description="Houses to predict")


class PredictResponse(BaseModel):
    predictions: list[float] = Field(..., description="Predicted price for each input item")


class ModelInfoResponse(BaseModel):
    model_type: str
    intercept: float
    coefficients: dict[str, float]
    metrics: dict[str, float]
    feature_names: list[str]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
