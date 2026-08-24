import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function PartnerHeader({
  userName,
  schoolName,
  query,
  activeNav,
  showDraftBadge = true,
}: {
  userName: string;
  schoolName: string;
  query: string;
  activeNav?: "profile" | "pages";
  showDraftBadge?: boolean;
}) {
  return (
    <div>
      <header className="flex w-full items-center justify-between bg-background px-5 py-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground"
          >
            AFC
          </Link>
          <nav className="flex items-start gap-6">
            <Button
              type="button"
              variant="ghost"
              className="h-auto px-0 text-sm font-normal tracking-[0.07px] text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              Profile
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
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {showDraftBadge ? (
            <Badge
              variant="secondary"
              className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
            >
              Draft
            </Badge>
          ) : null}
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            {userName} · {schoolName}
          </p>
        </div>
      </header>
      <Separator />
    </div>
  );
}
