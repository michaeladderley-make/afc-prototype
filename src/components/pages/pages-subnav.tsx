import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  pagesSectionHref,
  type PagesSection,
} from "@/lib/reporting-links";
import { cn } from "@/lib/utils";

const LINKS = [
  { section: "pages", label: "Pages" },
  { section: "performance", label: "Page Performance" },
] as const satisfies ReadonlyArray<{
  section: PagesSection;
  label: string;
}>;

export function PagesSubnav({
  query,
  section,
}: {
  query: string;
  section: PagesSection;
}) {
  return (
    <nav
      className="absolute top-24 left-5 flex w-44 flex-col items-start gap-3"
      aria-label="Pages"
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
              href={pagesSectionHref(query, link.section)}
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
