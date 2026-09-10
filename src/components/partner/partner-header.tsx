import Link from "next/link";

import { FaqsLink } from "@/components/faqs/faqs-link";
import { ExperienceBadge } from "@/components/prototype/experience-badge";
import { ReadinessMenu } from "@/components/readiness/readiness-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PartnerContext } from "@/lib/partner-context";
import type { ReadinessFrom } from "@/lib/readiness";
import { cn } from "@/lib/utils";

export function PartnerHeader({
  userName,
  schoolName,
  query,
  context,
  readinessFrom = "profile",
  activeNav,
  showDraftBadge = true,
  outOfSow = false,
}: {
  userName: string;
  schoolName: string;
  query: string;
  context: PartnerContext;
  readinessFrom?: ReadinessFrom;
  activeNav?: "profile" | "pages" | "allocation";
  showDraftBadge?: boolean;
  outOfSow?: boolean;
}) {
  return (
    <div>
      <header className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center bg-background px-5 py-6">
        <div className="flex items-center gap-8 justify-self-start">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground"
            >
              AFC
            </Link>
            <ExperienceBadge />
          </div>
          <nav className="flex items-start gap-6">
            <Button
              asChild
              variant="ghost"
              className={cn(
                "h-auto px-0 text-sm font-normal tracking-[0.07px] hover:bg-transparent hover:text-foreground",
                activeNav === "profile"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Link href={`/profile?${query}`}>Profile</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "h-auto px-0 text-sm font-normal tracking-[0.07px] hover:bg-transparent hover:text-foreground",
                activeNav === "pages"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Link href={`/pages?${query}`}>Pages</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "h-auto px-0 text-sm font-normal tracking-[0.07px] hover:bg-transparent hover:text-foreground",
                activeNav === "allocation"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Link href={`/allocation?${query}`}>Allocation</Link>
            </Button>
          </nav>
        </div>
        <ReadinessMenu
          context={context}
          query={query}
          from={readinessFrom}
        />
        <div className="flex items-center justify-end gap-6 justify-self-end">
          <FaqsLink query={query} />
          <div className="flex items-center gap-3">
            {showDraftBadge ? (
              <Badge
                variant="secondary"
                className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
              >
                Draft
              </Badge>
            ) : null}
            <p className="max-w-[220px] truncate text-sm tracking-[0.07px] text-muted-foreground">
              {userName} · {schoolName}
            </p>
          </div>
        </div>
      </header>
      {outOfSow ? (
        <div className="border-t border-border bg-muted px-5 py-2">
          <p className="text-center text-xs tracking-[0.12px] text-muted-foreground">
            This page is not in the current SOW. It is included in the
            prototype only and will not be part of the first release.
          </p>
        </div>
      ) : null}
      <Separator />
    </div>
  );
}
