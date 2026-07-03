// API base URLs for client and server components.
export const BFF_URL =
  process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:8001";

export const MARKET_URL =
  process.env.NEXT_PUBLIC_MARKET_URL ?? "http://localhost:8080";

// Server-side (RSC) base URL for the Java service.
export const MARKET_URL_SERVER =
  process.env.MARKET_API_INTERNAL ?? MARKET_URL;
