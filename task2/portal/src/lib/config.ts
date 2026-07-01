/**
 * API base URLs.
 *
 * - `*_PUBLIC_*` are used by client components (the browser), so they point at
 *   host-mapped ports (localhost) in dev/compose.
 * - The server-only Java URL is used by React Server Components; inside Docker
 *   it resolves to the internal service name.
 */
export const BFF_URL =
  process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:8001";

export const MARKET_URL =
  process.env.NEXT_PUBLIC_MARKET_URL ?? "http://localhost:8080";

// Server-side (RSC) base URL for the Java service.
export const MARKET_URL_SERVER =
  process.env.MARKET_API_INTERNAL ?? MARKET_URL;
