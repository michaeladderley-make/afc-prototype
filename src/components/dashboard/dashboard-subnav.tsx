import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  dashboardHref,
  type DashboardView,
} from "@/lib/reporting-links";
import { cn } from "@/lib/utils";

const LINKS = [
  { view: "overview", label: "Overview" },
  { view: "performance", label: "Page Performance" },
] as const satisfies ReadonlyArray<{ view: DashboardView; label: string }>;

export function DashboardSubnav({
  query,
  view,
}: {
  query: string;
  view: DashboardView;
}) {
  return (
    <nav
      className="absolute top-24 left-5 flex w-44 flex-col items-start gap-3"
      aria-label="Dashboard"
    >
      {LINKS.map((link) => {
        const active = view === link.view;
        return (
          <Button
            key={link.view}
            asChild
            variant="ghost"
            className={cn(
              "h-auto px-0 text-sm font-normal tracking-[0.07px] hover:bg-transparent hover:text-foreground",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Link
              href={dashboardHref(query, link.view)}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
