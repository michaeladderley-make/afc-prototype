import Link from "next/link";

import { FaqsLink } from "@/components/faqs/faqs-link";
import { NeedHelp } from "@/components/help/need-help";
import { ExperienceBadge } from "@/components/prototype/experience-badge";
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
          <NeedHelp email={email} />
          <FaqsLink />
        </div>
      </header>
      <Separator />
    </div>
  );
}
