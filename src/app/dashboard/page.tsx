import { PartnerDashboard } from "@/components/dashboard/partner-dashboard";
import { PartnerHeader } from "@/components/partner/partner-header";
import { parseDashboardView } from "@/lib/reporting-links";
import { requirePartnerPage } from "@/lib/require-partner";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const params = await searchParams;
  const { context, school, query } = requirePartnerPage(params);
  const view = parseDashboardView(params.view);

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
        <PartnerDashboard
          context={context}
          schoolName={school.name}
          view={view}
        />
      </main>
    </div>
  );
}
