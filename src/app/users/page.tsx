import { DashboardSubnav } from "@/components/dashboard/dashboard-subnav";
import { PartnerHeader } from "@/components/partner/partner-header";
import { UsersDirectory } from "@/components/users/users-directory";
import { requirePartnerPage } from "@/lib/require-partner";

export default async function UsersPage({
  searchParams,
}: PageProps<"/users">) {
  const { context, school, query } = requirePartnerPage(await searchParams);

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
        <DashboardSubnav query={query} section="users" />
        <UsersDirectory schoolId={school.id} schoolName={school.name} />
      </main>
    </div>
  );
}
