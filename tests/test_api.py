"""API endpoint tests."""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    # Use as a context manager so FastAPI's lifespan loads the model.
    with TestClient(app) as c:
        yield c


SAMPLE = {
    "square_footage": 1800,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 2000,
    "lot_size": 7300,
    "distance_to_city_center": 4.5,
    "school_rating": 8.0,
}


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_model_info(client):
    resp = client.get("/model-info")
    assert resp.status_code == 200
    body = resp.json()
    assert "coefficients" in body
    assert "metrics" in body
    assert set(body["coefficients"]) == set(body["feature_names"])


def test_predict_single(client):
    resp = client.post("/predict", json={"items": [SAMPLE]})
    assert resp.status_code == 200
    preds = resp.json()["predictions"]
    assert len(preds) == 1
    assert isinstance(preds[0], float)


def test_predict_batch(client):
    resp = client.post("/predict", json={"items": [SAMPLE, SAMPLE, SAMPLE]})
    assert resp.status_code == 200
    assert len(resp.json()["predictions"]) == 3


def test_predict_validation_error(client):
    bad = {**SAMPLE, "square_footage": -100}
    resp = client.post("/predict", json={"items": [bad]})
    assert resp.status_code == 422
