"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { EstimatorForm } from "./EstimatorForm";
import { HistoryChart } from "./HistoryChart";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorBanner,
  Spinner,
} from "@/components/ui";
import { usePrediction } from "@/hooks/usePrediction";
import { useEstimateHistory } from "@/hooks/useEstimateHistory";
import { formatCurrency } from "@/lib/format";
import type { HousingFormValues } from "@/lib/validation";

const featureLabels: Record<string, string> = {
  square_footage: "Square footage",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  year_built: "Year built",
  lot_size: "Lot size",
  distance_to_city_center: "Distance to city center",
  school_rating: "School rating",
};

export function EstimatorApp() {
  const { run, loading, error, result } = usePrediction();
  const { history, add, remove, clear } = useEstimateHistory();

  async function handleSubmit(values: HousingFormValues) {
    const res = await run(values);
    add(res);
  }

  return (
    <div className="fade-in space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Property Value Estimator</h1>
        <p className="text-slate-600">
          Enter property details to estimate its market price.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EstimatorForm onSubmit={handleSubmit} loading={loading} />
            {error && <ErrorBanner message={error} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated price</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <Spinner label="Contacting model" />}
            {!loading && !result && (
              <p className="text-sm text-slate-500">
                Submit the form to see the estimated price and a breakdown.
              </p>
            )}
            {!loading && result && (
              <div className="space-y-4">
                <p className="text-3xl font-bold text-brand-700">
                  {formatCurrency(result.predicted_price)}
                </p>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(result.features).map(([key, value]) => (
                      <tr key={key} className="border-t border-slate-100">
                        <td className="py-1.5 text-slate-500">
                          {featureLabels[key] ?? key}
                        </td>
                        <td className="py-1.5 text-right font-medium text-slate-800">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Estimate history</CardTitle>
          <div className="flex gap-2">
            <Link href="/estimator/compare">
              <Button variant="secondary" className="text-xs">
                Compare
              </Button>
            </Link>
            {history.length > 0 && (
              <Button variant="ghost" className="text-xs" onClick={clear}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <HistoryChart history={history} />
          {history.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {history.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">
                      {item.features.bedrooms} bd · {item.features.square_footage} sqft ·{" "}
                      built {item.features.year_built}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(item.predicted_price)}
                    </span>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.label}`}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
