"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field } from "@/components/ui";
import {
  defaultHousingValues,
  housingSchema,
  type HousingFormValues,
} from "@/lib/validation";

const fields: { name: keyof HousingFormValues; label: string; step?: string }[] = [
  { name: "square_footage", label: "Square footage" },
  { name: "bedrooms", label: "Bedrooms" },
  { name: "bathrooms", label: "Bathrooms", step: "0.5" },
  { name: "year_built", label: "Year built" },
  { name: "lot_size", label: "Lot size" },
  { name: "distance_to_city_center", label: "Distance to city center", step: "0.1" },
  { name: "school_rating", label: "School rating", step: "0.1" },
];

export function EstimatorForm({
  onSubmit,
  loading,
  defaults,
}: {
  onSubmit: (values: HousingFormValues) => void;
  loading: boolean;
  defaults?: HousingFormValues;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HousingFormValues>({
    resolver: zodResolver(housingSchema),
    defaultValues: defaults ?? defaultHousingValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field
            key={f.name}
            label={f.label}
            type="number"
            step={f.step ?? "1"}
            error={errors[f.name]?.message}
            {...register(f.name)}
          />
        ))}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Estimating..." : "Estimate price"}
      </Button>
    </form>
  );
}
