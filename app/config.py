"""Configuration for paths and feature definitions."""
from pathlib import Path

# Project root = parent of the `app` package directory.
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "data" / "housing-price-dataset.csv"
MODEL_PATH = BASE_DIR / "model.pkl"
METRICS_PATH = BASE_DIR / "metrics.json"

# Order matters: this is the exact column order fed to the model.
FEATURE_NAMES = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]

TARGET_NAME = "price"

# Reproducibility for the train/test split.
RANDOM_STATE = 42
TEST_SIZE = 0.2
