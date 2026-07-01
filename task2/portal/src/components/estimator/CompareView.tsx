"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useEstimateHistory } from "@/hooks/useEstimateHistory";
import { formatCurrency } from "@/lib/format";

const rows: { key: keyof import("@/lib/types").HousingFeatures | "predicted_price"; label: string }[] = [
  { key: "predicted_price", label: "Predicted price" },
  { key: "square_footage", label: "Square footage" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "year_built", label: "Year built" },
  { key: "lot_size", label: "Lot size" },
  { key: "distance_to_city_center", label: "Distance to city" },
  { key: "school_rating", label: "School rating" },
];

export function CompareView() {
  const { history } = useEstimateHistory();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const chosen = history.filter((h) => selected.has(h.id));
  const active = chosen.length > 0 ? chosen : history;

  const chartData = active.map((h) => ({
    name: h.label,
    price: h.predicted_price,
  }));

  return (
    <div className="fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare properties</h1>
          <p className="text-slate-600">
            Analyse saved estimates side-by-side.
          </p>
        </div>
        <Link href="/estimator">
          <Button variant="secondary">Back to estimator</Button>
        </Link>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent>
            <p className="py-8 text-center text-sm text-slate-500">
              No saved estimates yet. Create some in the estimator first.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select estimates ({selected.size || "all"})</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => toggle(h.id)}
                  aria-pressed={selected.has(h.id)}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition-colors " +
                    (selected.has(h.id)
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50")
                  }
                >
                  {h.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="price" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Side-by-side details</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-2 pr-4 font-medium text-slate-500">Feature</th>
                    {active.map((h) => (
                      <th key={h.id} className="py-2 px-3 font-semibold text-slate-800">
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-500">{row.label}</td>
                      {active.map((h) => {
                        const value =
                          row.key === "predicted_price"
                            ? formatCurrency(h.predicted_price)
                            : h.features[row.key as keyof typeof h.features];
                        return (
                          <td
                            key={h.id}
                            className={
                              "py-2 px-3 " +
                              (row.key === "predicted_price"
                                ? "font-semibold text-brand-700"
                                : "text-slate-800")
                            }
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
