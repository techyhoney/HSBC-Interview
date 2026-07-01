"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import type { MarketStats, Property } from "@/lib/types";

export function MarketCharts({
  stats,
  properties,
}: {
  stats: MarketStats;
  properties: Property[];
}) {
  const bedroomData = stats.priceByBedrooms.map((s) => ({
    name: s.segment,
    avg: s.avgPrice,
  }));

  const scatterData = properties.map((p) => ({
    x: p.squareFootage,
    y: p.price,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Average price by bedrooms</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bedroomData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="avg" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price vs. square footage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="Sq ft"
                tick={{ fontSize: 12 }}
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Price"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v: number, name) =>
                  name === "Price" ? formatCurrency(v) : v
                }
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter data={scatterData} fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
