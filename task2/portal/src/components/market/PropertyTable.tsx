"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Download, FileText } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorBanner,
  Field,
  Spinner,
} from "@/components/ui";
import { getProperties } from "@/lib/api";
import { exportCsv, exportPdf } from "@/lib/export";
import { formatCurrency } from "@/lib/format";
import type { Property } from "@/lib/types";

type SortKey = keyof Property;
type Filters = {
  minBedrooms?: number;
  maxBedrooms?: number;
  minYear?: number;
  minSchoolRating?: number;
};

const columns: { key: SortKey; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "squareFootage", label: "Sq Ft" },
  { key: "bedrooms", label: "Beds" },
  { key: "bathrooms", label: "Baths" },
  { key: "yearBuilt", label: "Year" },
  { key: "schoolRating", label: "School" },
  { key: "price", label: "Price" },
];

export function PropertyTable({ initial }: { initial: Property[] }) {
  const [rows, setRows] = useState<Property[]>(initial);
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<SortKey>("price");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await getProperties({ ...filters, sortBy, order }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const toggleSort = (key: SortKey) => {
    if (key === sortBy) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setOrder("asc");
    }
  };

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value === "" ? undefined : Number(value) }));

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>Properties ({rows.length})</CardTitle>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs" onClick={() => exportCsv(rows)}>
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button variant="secondary" className="text-xs" onClick={() => exportPdf(rows)}>
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <Field
            label="Min beds"
            type="number"
            onChange={(e) => setFilter("minBedrooms", e.target.value)}
          />
          <Field
            label="Max beds"
            type="number"
            onChange={(e) => setFilter("maxBedrooms", e.target.value)}
          />
          <Field
            label="Min year"
            type="number"
            onChange={(e) => setFilter("minYear", e.target.value)}
          />
          <Field
            label="Min school"
            type="number"
            step="0.1"
            onChange={(e) => setFilter("minSchoolRating", e.target.value)}
          />
        </div>

        {error && <ErrorBanner message={error} />}
        {loading && <Spinner label="Loading properties" />}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                {columns.map((c) => (
                  <th key={c.key} className="py-2 pr-4">
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
                    >
                      {c.label}
                      {sortBy === c.key &&
                        (order === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 pr-4 text-slate-500">{p.id}</td>
                  <td className="py-2 pr-4">{p.squareFootage}</td>
                  <td className="py-2 pr-4">{p.bedrooms}</td>
                  <td className="py-2 pr-4">{p.bathrooms}</td>
                  <td className="py-2 pr-4">{p.yearBuilt}</td>
                  <td className="py-2 pr-4">{p.schoolRating}</td>
                  <td className="py-2 pr-4 font-medium text-slate-900">
                    {formatCurrency(p.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
