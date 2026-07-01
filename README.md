# Housing Price Prediction API

A simple, production-style REST API that predicts housing prices using a
scikit-learn **Linear Regression** model, served with **FastAPI** and
containerised with **Docker**.

## Features

- `GET /health` — health check.
- `GET /model-info` — model coefficients, intercept and performance metrics (R², MAE, RMSE).
- `POST /predict` — predict price for a single house or a batch.
- Interactive Swagger UI at `/docs` (OpenAPI spec at `/openapi.json`).

## Project structure

```
app/
  config.py     # paths + feature list (single source of truth)
  schemas.py    # Pydantic request/response models
  model.py      # loads model.pkl, serves predictions
  main.py       # FastAPI app + endpoints
data/housing-price-dataset.csv  # training dataset
train.py          # trains + saves model.pkl and metrics.json
tests/test_api.py # endpoint tests
Dockerfile
```

## Setup (local)

Requires **Python 3.12+**.

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Train the model

```bash
python train.py
```

This reads `data/housing-price-dataset.csv`, fits the model, prints metrics/coefficients,
and writes `model.pkl` + `metrics.json`.

## Run the API

```bash
uvicorn app.main:app --reload
```

Open Swagger UI: http://127.0.0.1:8000/docs

### Example requests

Single prediction:

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"items":[{"square_footage":1800,"bedrooms":3,"bathrooms":2,"year_built":2000,"lot_size":7300,"distance_to_city_center":4.5,"school_rating":8.0}]}'
```

Batch prediction: add more objects to the `items` array.

## Tests

```bash
python train.py   # ensure model.pkl exists
pytest -q
```

## Docker

The image trains the model at build time, so the container is self-contained
(requires `data/housing-price-dataset.csv` to be present at build).

```bash
docker build -t housing-api .
docker run -p 8000:8000 housing-api
```

Then visit http://127.0.0.1:8000/docs.

## How the model works (talking points)

- **Algorithm**: Ordinary Least Squares Linear Regression — predicts price as a
  weighted sum of the seven features plus an intercept.
- **Features**: `square_footage, bedrooms, bathrooms, year_built, lot_size,
  distance_to_city_center, school_rating`.
- **Evaluation**: an 80/20 train/test split (fixed `random_state=42`) reports
  R², MAE and RMSE on unseen data.
- **Why Linear Regression**: interpretable coefficients map directly to the
  `/model-info` response, making it easy to explain how each feature moves price.
