# Multi-Application Next.js Portal

A unified Next.js portal hosting two independent property applications with different backend technologies, both powered by the same ML model from Task 1.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Portal (3000)                │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │  App 1: Estimator    │  │  App 2: Market Analysis  │ │
│  │  /estimator          │  │  /market                 │ │
│  └──────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│  Python BFF      │          │  Java Service    │
│  FastAPI (8001)  │          │  Spring (8080)   │
└──────────────────┘          └──────────────────┘
         │                              │
         └──────────────┬───────────────┘
                        ▼
              ┌──────────────────┐
              │  Model API       │
              │  FastAPI (8000)  │
              └──────────────────┘
```

## Features

### Portal (Next.js 14 + App Router)
- Unified navigation and layout
- Server and client components
- Tailwind CSS styling
- Loading and error boundaries
- Responsive design

### App 1: Property Value Estimator (Python Backend)
**Frontend:**
- Property details form with validation
- Real-time price predictions
- Estimate history with localStorage persistence
- Interactive chart visualization
- Side-by-side property comparison

**Backend (FastAPI):**
- Input validation with Pydantic
- Single and batch estimation endpoints
- Proxies requests to ML model API
- CORS enabled for browser access

### App 2: Property Market Analysis (Java Backend)
**Frontend:**
- Market statistics dashboard
- Interactive data visualizations
- Filterable property table with sorting
- What-if scenario analysis tool
- CSV and PDF export functionality

**Backend (Spring Boot):**
- REST API with market analytics
- Dataset aggregation and filtering
- Caffeine caching for performance
- Integration with ML model API
- Server-side data loading (RSC)

## Tech Stack

### Portal
- Next.js 14.2 (App Router)
- React 18.3
- TypeScript 5.6
- Tailwind CSS 3.4
- Recharts (visualizations)
- React Hook Form + Zod (validation)
- Lucide React (icons)
- jsPDF (PDF export)

### Python BFF
- Python 3.12
- FastAPI
- Pydantic
- httpx

### Java Service
- Java 21
- Spring Boot 3.4.4
- Caffeine (caching)
- Spring Actuator

## Project Structure

```
task2/
├── portal/                    # Next.js application
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── layout.tsx    # Root layout with Nav
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── estimator/    # App 1 routes
│   │   │   └── market/       # App 2 routes
│   │   ├── components/       # React components
│   │   │   ├── Nav.tsx       # Navigation
│   │   │   ├── ui/           # Shared UI components
│   │   │   ├── estimator/    # App 1 components
│   │   │   └── market/       # App 2 components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities and API clients
│   ├── package.json
│   └── Dockerfile
├── python-bff/               # FastAPI backend for App 1
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   └── schemas.py       # Pydantic models
│   ├── requirements.txt
│   └── Dockerfile
└── java-service/            # Spring Boot backend for App 2
    ├── src/main/java/com/hsbc/interview/market/
    │   ├── MarketServiceApplication.java
    │   ├── config/          # Configuration classes
    │   ├── controller/      # REST controllers
    │   ├── model/           # Data models
    │   └── service/         # Business logic
    ├── src/main/resources/
    │   ├── application.properties
    │   └── housing-price-dataset.csv
    ├── pom.xml
    └── Dockerfile
```

## Running Locally

### Prerequisites
- Docker and Docker Compose
- OR: Node.js 18+, Python 3.12+, Java 21+, Maven

### Option 1: Docker Compose (Recommended)

From the project root:

```bash
docker-compose up --build
```

This starts all services:
- Portal: http://localhost:3000
- Python BFF: http://localhost:8001
- Java Service: http://localhost:8080
- Model API: http://localhost:8000

### Option 2: Manual Setup

**1. Start the Model API** (from project root):
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python train.py
uvicorn app.main:app --reload
```

**2. Start Python BFF**:
```bash
cd task2/python-bff
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
MODEL_API_URL=http://localhost:8000 uvicorn app.main:app --port 8001 --reload
```

**3. Start Java Service**:
```bash
cd task2/java-service
mvn spring-boot:run
```

**4. Start Next.js Portal**:
```bash
cd task2/portal
npm install
npm run dev
```

Visit http://localhost:3000

## API Endpoints

### Python BFF (8001)
- `GET /health` - Health check
- `POST /estimate` - Single property estimate
- `POST /estimate/batch` - Batch estimates

### Java Service (8080)
- `GET /api/health` - Health check
- `GET /api/market/stats` - Overall market statistics
- `GET /api/market/segments` - Segment analysis (grouped by bedrooms/year)
- `GET /api/properties` - Filterable property list
- `POST /api/whatif` - What-if scenario prediction

## Key Implementation Details

### Next.js App Router
- **Server Components**: Market page fetches initial data server-side
- **Client Components**: Interactive forms, charts, and filters
- **Loading States**: Dedicated `loading.tsx` files
- **Error Boundaries**: Dedicated `error.tsx` files
- **Layouts**: Shared `layout.tsx` with navigation

### State Management
- React Hook Form for form state
- Custom hooks for API calls (`usePrediction`)
- localStorage for estimate history
- URL params for table filters

### Data Fetching
- Server-side: `fetch` in Server Components
- Client-side: Custom API client with error handling
- Caching: Java service uses Caffeine for market stats

### Validation
- Frontend: Zod schemas + React Hook Form
- Backend: Pydantic (Python), Bean Validation (Java)

### Styling
- Tailwind CSS utility classes
- Custom brand colors (blue palette)
- Responsive breakpoints
- Accessible components (ARIA labels)

## Development Notes

### Adding New Features
1. **Portal**: Add routes in `src/app/`, components in `src/components/`
2. **Python BFF**: Add endpoints in `app/main.py`, schemas in `app/schemas.py`
3. **Java Service**: Add controllers in `controller/`, services in `service/`

### Environment Variables
- `NEXT_PUBLIC_BFF_URL`: Python BFF URL (browser)
- `NEXT_PUBLIC_MARKET_URL`: Java service URL (browser)
- `MARKET_API_INTERNAL`: Java service URL (server-side)
- `MODEL_API_URL`: ML model API URL (backends)

### Build for Production
```bash
docker-compose build
docker-compose up -d
```

## Requirements Checklist

### Portal Structure ✓
- [x] Unified navigation and layout
- [x] Next.js App Router
- [x] Consistent design system
- [x] Loading and error states

### App 1: Property Value Estimator ✓
- [x] Property details form with validation
- [x] Tabular and chart result display
- [x] Estimate history feature
- [x] Side-by-side comparison view
- [x] Python backend with validation
- [x] ML model integration

### App 2: Property Market Analysis ✓
- [x] Interactive dashboard with visualizations
- [x] Filterable property segments
- [x] What-if analysis tool
- [x] CSV and PDF export
- [x] Responsive data tables
- [x] Java backend with REST API
- [x] Caching implementation
- [x] ML model integration

### Technical Requirements ✓
- [x] Next.js App Router
- [x] Server and client components
- [x] React Server Components for data loading
- [x] Custom hooks for shared functionality
- [x] Tailwind CSS responsive layouts
- [x] WCAG accessibility guidelines
- [x] Loading states and error boundaries
- [x] Smooth transitions
- [x] Client-side state management
- [x] Form validation
- [x] Efficient data fetching
- [x] Best practices code organization
