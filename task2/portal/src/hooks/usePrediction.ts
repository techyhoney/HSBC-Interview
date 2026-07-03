"use client";

import { useCallback, useState } from "react";
import { estimate } from "@/lib/api";
import type { EstimateResponse, HousingFeatures } from "@/lib/types";

// Hook for property price estimation with state management.
export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  const run = useCallback(async (features: HousingFeatures) => {
    setLoading(true);
    setError(null);
    try {
      const res = await estimate(features);
      setResult(res);
      return res;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error, result };
}
