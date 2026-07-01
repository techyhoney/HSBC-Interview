"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EstimateHistoryItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export function HistoryChart({ history }: { history: EstimateHistoryItem[] }) {
  if (history.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No estimates yet. Submit the form to see results here.
      </p>
    );
  }

  const data = [...history]
    .reverse()
    .map((h) => ({ name: h.label, price: h.predicted_price }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
  );
}
