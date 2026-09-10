import Link from "next/link";

import { FaqsLink } from "@/components/faqs/faqs-link";
import { NeedHelp } from "@/components/help/need-help";
import { ExperienceBadge } from "@/components/prototype/experience-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function PublicHeader({
  email,
  experience,
}: {
  email?: string;
  experience?: string;
}) {
  return (
    <div>
      <header className="flex w-full items-center justify-between bg-background px-16 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[21px] leading-[28px] font-medium text-foreground"
          >
            AFC
          </Link>
          <ExperienceBadge experience={experience} />
        </div>
        <div className="flex items-center gap-6">
          <Button
            asChild
            variant="ghost"
            className="h-auto px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <Link href="/sign-in">Partner</Link>
          </Button>
          <NeedHelp email={email} />
          <FaqsLink />
        </div>
      </header>
      <Separator />
    </div>
  );
}
