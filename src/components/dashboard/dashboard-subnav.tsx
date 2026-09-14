import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  dashboardSectionHref,
  type DashboardSection,
} from "@/lib/reporting-links";
import { cn } from "@/lib/utils";

const LINKS = [
  { section: "overview", label: "Overview" },
  { section: "performance", label: "Page Performance" },
  { section: "donations", label: "Donations" },
  { section: "allocation", label: "Allocation" },
  { section: "users", label: "Users" },
] as const satisfies ReadonlyArray<{
  section: DashboardSection;
  label: string;
}>;

export function DashboardSubnav({
  query,
  section,
}: {
  query: string;
  section: DashboardSection;
}) {
  return (
    <nav
      className="absolute top-24 left-5 flex w-44 flex-col items-start gap-3"
      aria-label="Dashboard"
    >
      {LINKS.map((link) => {
        const active = section === link.section;
        return (
          <Button
            key={link.section}
            asChild
            variant="ghost"
            className={cn(
              "h-auto px-0 text-sm font-normal tracking-[0.07px] hover:bg-transparent hover:text-foreground",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Link
              href={dashboardSectionHref(query, link.section)}
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
