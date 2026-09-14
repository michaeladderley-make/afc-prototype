import Link from "next/link";

import { PartnerSessionSync } from "@/components/partner/partner-session-sync";
import { ExperienceBanner } from "@/components/prototype/experience-banner";
import { PrototypeBanner } from "@/components/prototype/prototype-banner";
import { ReadinessMenu } from "@/components/readiness/readiness-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PartnerContext } from "@/lib/partner-context";
import type { ReadinessFrom } from "@/lib/readiness";
import { cn } from "@/lib/utils";

export type PartnerNav =
  | "dashboard"
  | "profile"
  | "pages"
  | "calendar"
  | "faqs";

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "h-auto px-0 text-sm font-normal tracking-[0.07px] hover:bg-transparent hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

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
  activeNav?: PartnerNav;
  showDraftBadge?: boolean;
  outOfSow?: boolean;
}) {
  return (
    <div>
      <PartnerSessionSync context={context} />
      <ExperienceBanner />
      <header className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center bg-background px-5 py-6">
        <div className="flex items-center gap-8 justify-self-start">
          <Link
            href="/"
            className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground"
          >
            AFC
          </Link>
          <nav className="flex items-start gap-6">
            <NavLink
              href={`/dashboard?${query}`}
              active={activeNav === "dashboard"}
            >
              Dashboard
            </NavLink>
            <NavLink href={`/pages?${query}`} active={activeNav === "pages"}>
              Pages
            </NavLink>
            <NavLink
              href={`/calendar?${query}`}
              active={activeNav === "calendar"}
            >
              Calendar
            </NavLink>
            <NavLink href={`/faqs?${query}`} active={activeNav === "faqs"}>
              FAQs
            </NavLink>
          </nav>
        </div>
        <ReadinessMenu
          context={context}
          query={query}
          from={readinessFrom}
        />
        <div className="flex items-center justify-end gap-6 justify-self-end">
          <div className="flex items-center gap-3">
            {showDraftBadge ? (
              <Badge
                variant="secondary"
                className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
              >
                Draft
              </Badge>
            ) : null}
            <Link
              href={`/profile?${query}`}
              className={cn(
                "text-sm tracking-[0.07px] hover:text-foreground",
                activeNav === "profile"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {userName} · {schoolName}
            </Link>
          </div>
        </div>
      </header>
      {outOfSow ? (
        <PrototypeBanner className="border-t">
          This page is not in the current SOW. It is included in the prototype
          only and will not be part of the first release.
        </PrototypeBanner>
      ) : null}
      <Separator />
    </div>
  );
}
