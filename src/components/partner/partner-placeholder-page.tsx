import { PartnerHeader, type PartnerNav } from "@/components/partner/partner-header";
import type { PartnerContext } from "@/lib/partner-context";

export function PartnerPlaceholderPage({
  title,
  userName,
  schoolName,
  query,
  context,
  activeNav,
}: {
  title: string;
  userName: string;
  schoolName: string;
  query: string;
  context: PartnerContext;
  activeNav: PartnerNav;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={userName}
        schoolName={schoolName}
        query={query}
        context={context}
        activeNav={activeNav}
        showDraftBadge={false}
      />
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <h1 className="w-full max-w-[640px] text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          {title}
        </h1>
      </main>
    </div>
  );
}
