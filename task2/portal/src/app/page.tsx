import Link from "next/link";
import { Building2, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

const apps = [
  {
    href: "/estimator",
    title: "Property Value Estimator",
    description:
      "Enter property details to get an instant price estimate. Save, review history, and compare multiple properties side-by-side.",
    tech: "Next.js + Python (FastAPI)",
    icon: Building2,
  },
  {
    href: "/market",
    title: "Property Market Analysis",
    description:
      "Explore market statistics, filter segments, run what-if scenarios, and export reports as CSV or PDF.",
    tech: "Next.js + Java (Spring Boot)",
    icon: LineChart,
  },
];

export default function HomePage() {
  return (
    <div className="fade-in space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Property Portal</h1>
        <p className="max-w-2xl text-slate-600">
          A unified portal hosting two independent applications, both powered by
          the same machine-learning price model.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {apps.map(({ href, title, description, tech, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardContent className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-600">{description}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                  {tech}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
