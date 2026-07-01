export interface HousingFeatures {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

export interface EstimateResponse {
  predicted_price: number;
  features: HousingFeatures;
}

export interface EstimateHistoryItem extends EstimateResponse {
  id: string;
  label: string;
  createdAt: number;
}

export interface SegmentStat {
  segment: string;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface MarketStats {
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  medianPrice: number;
  avgSquareFootage: number;
  avgPricePerSqft: number;
  priceByBedrooms: SegmentStat[];
}

export interface Property {
  id: number;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  distanceToCityCenter: number;
  schoolRating: number;
  price: number;
}

export interface WhatIfResponse {
  predictedPrice: number;
  datasetAvgPrice: number;
  differenceFromAvg: number;
}
