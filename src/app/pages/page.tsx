import { PagePerformance } from "@/components/dashboard/page-performance";
import { MyPages } from "@/components/pages/my-pages";
import { PagesSubnav } from "@/components/pages/pages-subnav";
import { PartnerHeader } from "@/components/partner/partner-header";
import { parsePagesView } from "@/lib/reporting-links";
import { requirePartnerPage } from "@/lib/require-partner";

export default async function PagesPage({
  searchParams,
}: PageProps<"/pages">) {
  const params = await searchParams;
  const { context, school, query } = requirePartnerPage(params);
  const view = parsePagesView(params.view);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={`${context.firstName} ${context.lastName}`}
        schoolName={school.name}
        query={query}
        context={context}
        activeNav="pages"
        showDraftBadge={false}
      />
      <main className="relative flex w-full justify-center px-16 pt-24 pb-16">
        <PagesSubnav query={query} section={view} />
        {view === "performance" ? (
          <PagePerformance context={context} schoolName={school.name} />
        ) : (
          <MyPages context={context} />
        )}
      </main>
    </div>
  );
}
