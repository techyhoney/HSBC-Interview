# HSBC Interview Tasks - Property Price Platform

Complete implementation of both interview tasks: a containerized ML model API and a multi-application Next.js portal.

## Overview

**Task 1**: Housing price prediction model API (FastAPI + scikit-learn)  
**Task 2**: Multi-application Next.js portal with Python and Java backends

## Quick Start

```bash
docker-compose up --build
```

Then visit:
- **Portal**: http://localhost:3000 (Next.js apps)
- **Model API**: http://localhost:8000/docs (Swagger UI)
- **Python BFF**: http://localhost:8001/docs
- **Java Service**: http://localhost:8080/api/health

---

## Task 1: Housing Price Prediction API

FastAPI service that predicts housing prices using Linear Regression.

### Features

- `GET /health` — Health check
- `GET /model-info` — Model coefficients and metrics (R², MAE, RMSE)
- `POST /predict` — Single or batch predictions
- Interactive Swagger UI at `/docs`

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

### Model Details

- **Algorithm**: Linear Regression (OLS)
- **Features**: `square_footage, bedrooms, bathrooms, year_built, lot_size, distance_to_city_center, school_rating`
- **Evaluation**: 80/20 train/test split (R², MAE, RMSE)
- **Why Linear Regression**: Interpretable coefficients for `/model-info` endpoint

---

## Task 2: Multi-Application Portal

Unified Next.js portal hosting two independent applications with different backend technologies.

### Applications

**App 1: Property Value Estimator** (`/estimator`)
- Python FastAPI backend
- Property details form with validation
- Price predictions with history tracking
- Interactive charts
- Side-by-side comparison view

**App 2: Property Market Analysis** (`/market`)
- Java Spring Boot backend
- Market statistics dashboard
- Filterable property segments
- What-if scenario analysis
- CSV/PDF export

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Python BFF**: FastAPI, Pydantic, httpx
- **Java Service**: Spring Boot 3.4.4, Java 21, Caffeine cache

See [`task2/README.md`](task2/README.md) for detailed documentation.

---

## Repository Structure

```
.
├── app/                    # Task 1: Model API
├── data/                   # Housing dataset
├── task2/                  # Task 2: Portal + backends
│   ├── portal/            # Next.js application
│   ├── python-bff/        # App 1 backend
│   └── java-service/      # App 2 backend
├── tests/                  # API tests
├── train.py               # Model training script
├── Dockerfile             # Task 1 container
└── docker-compose.yml     # All services
```

## Development

### Local Setup (without Docker)

**1. Train the model:**
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python train.py
```

**2. Run Task 1 API:**
```bash
uvicorn app.main:app --reload
```

**3. Run Task 2 services:**
```bash
# Python BFF
cd task2/python-bff
pip install -r requirements.txt
MODEL_API_URL=http://localhost:8000 uvicorn app.main:app --port 8001 --reload

# Java Service
cd task2/java-service
mvn spring-boot:run

# Next.js Portal
cd task2/portal
npm install
npm run dev
```

### Testing

```bash
pytest -v
```
