"use client";

import { useState } from "react";
import { EstimatorForm } from "@/components/estimator/EstimatorForm";
import { Card, CardContent, CardHeader, CardTitle, ErrorBanner } from "@/components/ui";
import { whatIf } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { HousingFormValues } from "@/lib/validation";
import type { WhatIfResponse } from "@/lib/types";

export function WhatIfTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WhatIfResponse | null>(null);

  async function handleSubmit(values: HousingFormValues) {
    setLoading(true);
    setError(null);
    try {
      setResult(await whatIf(values));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What-if analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Adjust property attributes and predict the price via the model, with a
          comparison to the dataset average.
        </p>
        <EstimatorForm onSubmit={handleSubmit} loading={loading} />
        {error && <ErrorBanner message={error} />}
        {result && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-brand-50 p-3">
              <p className="text-xs text-slate-500">Predicted price</p>
              <p className="text-xl font-bold text-brand-700">
                {formatCurrency(result.predictedPrice)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Dataset average</p>
              <p className="text-xl font-semibold text-slate-800">
                {formatCurrency(result.datasetAvgPrice)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Difference</p>
              <p
                className={
                  "text-xl font-semibold " +
                  (result.differenceFromAvg >= 0 ? "text-emerald-600" : "text-red-600")
                }
              >
                {result.differenceFromAvg >= 0 ? "+" : ""}
                {formatCurrency(result.differenceFromAvg)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
