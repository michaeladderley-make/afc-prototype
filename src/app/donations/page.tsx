import { DashboardSubnav } from "@/components/dashboard/dashboard-subnav";
import { PartnerDonations } from "@/components/donations/partner-donations";
import { PartnerHeader } from "@/components/partner/partner-header";
import { requirePartnerPage } from "@/lib/require-partner";

export default async function DonationsPage({
  searchParams,
}: PageProps<"/donations">) {
  const params = await searchParams;
  const { context, school, query } = requirePartnerPage(params);
  const pageId = typeof params.page === "string" ? params.page.trim() : "";

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={`${context.firstName} ${context.lastName}`}
        schoolName={school.name}
        query={query}
        context={context}
        activeNav="dashboard"
        showDraftBadge={false}
      />
      <main className="relative flex w-full justify-center px-16 pt-24 pb-16">
        <DashboardSubnav query={query} section="donations" />
        <PartnerDonations
          context={context}
          schoolName={school.name}
          pageId={pageId || undefined}
        />
      </main>
    </div>
  );
}
