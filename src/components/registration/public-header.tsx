import Link from "next/link";

import { FaqsLink } from "@/components/faqs/faqs-link";
import { ExperienceBanner } from "@/components/prototype/experience-banner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function PublicHeader({
  experience,
  activeNav,
}: {
  email?: string;
  experience?: string;
  activeNav?: "calendar" | "faqs";
}) {
  return (
    <div>
      <ExperienceBanner experience={experience} />
      <header className="flex w-full items-center justify-between bg-background px-16 py-6">
        <Link
          href="/"
          className="text-[21px] leading-[28px] font-medium text-foreground"
        >
          AFC
        </Link>
        <div className="flex items-center gap-6">
          <Button
            asChild
            variant="ghost"
            className="h-auto px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <Link href="/sign-in">Partner</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "h-auto px-0 text-sm font-normal hover:bg-transparent hover:text-foreground",
              activeNav === "calendar"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            <Link href="/calendar">Calendar</Link>
          </Button>
          <FaqsLink active={activeNav === "faqs"} />
        </div>
      </header>
      <Separator />
    </div>
  );
}
