import { BFF_URL, MARKET_URL, MARKET_URL_SERVER } from "@/lib/config";
import type {
  EstimateResponse,
  HousingFeatures,
  MarketStats,
  Property,
  WhatIfResponse,
} from "@/lib/types";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? detail;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(`Request failed (${res.status}): ${detail}`);
  }
  return res.json() as Promise<T>;
}

/* ---------- App 1: Property Value Estimator (Python BFF) ---------- */

export async function estimate(features: HousingFeatures): Promise<EstimateResponse> {
  const res = await fetch(`${BFF_URL}/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  return handle<EstimateResponse>(res);
}

export async function estimateBatch(
  items: HousingFeatures[],
): Promise<{ estimates: EstimateResponse[] }> {
  const res = await fetch(`${BFF_URL}/estimate/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return handle<{ estimates: EstimateResponse[] }>(res);
}

/* ---------- App 2: Property Market Analysis (Java) ---------- */

// Server-side (RSC) fetch used for initial dashboard load.
export async function getMarketStatsServer(): Promise<MarketStats> {
  const res = await fetch(`${MARKET_URL_SERVER}/api/market/stats`, {
    cache: "no-store",
  });
  return handle<MarketStats>(res);
}

export async function getPropertiesServer(): Promise<Property[]> {
  const res = await fetch(`${MARKET_URL_SERVER}/api/properties`, {
    cache: "no-store",
  });
  return handle<Property[]>(res);
}

// Client-side properties fetch with filters + sorting (browser -> Java).
export async function getProperties(
  params: Record<string, string | number | undefined>,
): Promise<Property[]> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const res = await fetch(`${MARKET_URL}/api/properties?${query.toString()}`);
  return handle<Property[]>(res);
}

// Client-side what-if call.
export async function whatIf(features: HousingFeatures): Promise<WhatIfResponse> {
  const payload = {
    squareFootage: features.square_footage,
    bedrooms: features.bedrooms,
    bathrooms: features.bathrooms,
    yearBuilt: features.year_built,
    lotSize: features.lot_size,
    distanceToCityCenter: features.distance_to_city_center,
    schoolRating: features.school_rating,
  };
  const res = await fetch(`${MARKET_URL}/api/whatif`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<WhatIfResponse>(res);
}
