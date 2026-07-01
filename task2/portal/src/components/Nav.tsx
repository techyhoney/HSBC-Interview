"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Building2, Home, LineChart } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/estimator", label: "Value Estimator", icon: Building2 },
  { href: "/market", label: "Market Analysis", icon: LineChart },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3"
        aria-label="Primary"
      >
        <span className="mr-4 text-lg font-bold text-brand-700">PropPortal</span>
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
