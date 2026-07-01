import { MarketDashboard } from "@/components/market/MarketDashboard";
import { getMarketStatsServer, getPropertiesServer } from "@/lib/api";

// Server Component: initial dashboard data is fetched on the server (RSC).
export default async function MarketPage() {
  const [stats, properties] = await Promise.all([
    getMarketStatsServer(),
    getPropertiesServer(),
  ]);

  return <MarketDashboard stats={stats} properties={properties} />;
}
