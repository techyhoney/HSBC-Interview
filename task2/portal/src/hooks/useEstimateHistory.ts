"use client";

import { useCallback, useEffect, useState } from "react";
import type { EstimateHistoryItem, EstimateResponse } from "@/lib/types";

const STORAGE_KEY = "estimate-history";

// Manages estimate history with localStorage persistence.
export function useEstimateHistory() {
  const [history, setHistory] = useState<EstimateHistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const persist = useCallback((items: EstimateHistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const add = useCallback(
    (estimate: EstimateResponse, label?: string) => {
      const item: EstimateHistoryItem = {
        ...estimate,
        id: crypto.randomUUID(),
        label: label?.trim() || `Estimate ${history.length + 1}`,
        createdAt: Date.now(),
      };
      persist([item, ...history]);
      return item;
    },
    [history, persist],
  );

  const remove = useCallback(
    (id: string) => persist(history.filter((h) => h.id !== id)),
    [history, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { history, add, remove, clear };
}
