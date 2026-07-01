"use client";

import { Stat } from "@/components/ui";
import { MarketCharts } from "./MarketCharts";
import { PropertyTable } from "./PropertyTable";
import { WhatIfTool } from "./WhatIfTool";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { MarketStats, Property } from "@/lib/types";

export function MarketDashboard({
  stats,
  properties,
}: {
  stats: MarketStats;
  properties: Property[];
}) {
  return (
    <div className="fade-in space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Property Market Analysis</h1>
        <p className="text-slate-600">
          Aggregate statistics, segment analysis, and what-if scenarios.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Properties" value={formatNumber(stats.count)} />
        <Stat label="Average price" value={formatCurrency(stats.avgPrice)} />
        <Stat label="Median price" value={formatCurrency(stats.medianPrice)} />
        <Stat label="Avg $ / sq ft" value={formatCurrency(stats.avgPricePerSqft)} />
      </div>

      <MarketCharts stats={stats} properties={properties} />

      <WhatIfTool />

      <PropertyTable initial={properties} />
    </div>
  );
}
