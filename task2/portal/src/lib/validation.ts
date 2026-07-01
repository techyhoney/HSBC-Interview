import { z } from "zod";

/**
 * Shared validation schema for property features. Mirrors the backend Pydantic
 * constraints so the user gets immediate, client-side feedback.
 */
export const housingSchema = z.object({
  square_footage: z.coerce.number().gt(0, "Must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  year_built: z.coerce.number().int().min(1800).max(2100),
  lot_size: z.coerce.number().gt(0, "Must be greater than 0"),
  distance_to_city_center: z.coerce.number().min(0),
  school_rating: z.coerce.number().min(0).max(10),
});

export type HousingFormValues = z.infer<typeof housingSchema>;

export const defaultHousingValues: HousingFormValues = {
  square_footage: 1800,
  bedrooms: 3,
  bathrooms: 2,
  year_built: 2000,
  lot_size: 7300,
  distance_to_city_center: 4.5,
  school_rating: 8,
};
