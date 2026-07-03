"""Model loading and prediction service."""
import json

import joblib
import pandas as pd

from app.config import FEATURE_NAMES, METRICS_PATH, MODEL_PATH
from app.schemas import HousingFeatures


class ModelService:
    """Loads model and metrics at startup for serving predictions."""

    def __init__(self) -> None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model artifact not found at {MODEL_PATH}. "
                "Run `python train.py` first to train and save the model."
            )

        self.model = joblib.load(MODEL_PATH)

        with open(METRICS_PATH, encoding="utf-8") as f:
            self._metrics_payload = json.load(f)

    def predict(self, items: list[HousingFeatures]) -> list[float]:
        """Predict prices for a batch (single = batch of one)."""
        rows = [[getattr(item, name) for name in FEATURE_NAMES] for item in items]
        frame = pd.DataFrame(rows, columns=FEATURE_NAMES)
        preds = self.model.predict(frame)
        return [round(float(p), 2) for p in preds]

    def info(self) -> dict:
        """Coefficients, intercept and performance metrics for `/model-info`."""
        coefficients = {
            name: round(float(coef), 4)
            for name, coef in zip(FEATURE_NAMES, self.model.coef_)
        }
        return {
            "model_type": type(self.model).__name__,
            "intercept": round(float(self.model.intercept_), 4),
            "coefficients": coefficients,
            "metrics": self._metrics_payload["metrics"],
            "feature_names": FEATURE_NAMES,
        }
