import { PartnerCalendar } from "@/components/calendar/partner-calendar";
import { PartnerHeader } from "@/components/partner/partner-header";
import { requirePartnerPage } from "@/lib/require-partner";

export default async function CalendarPage({
  searchParams,
}: PageProps<"/calendar">) {
  const { context, school, query } = requirePartnerPage(await searchParams);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={`${context.firstName} ${context.lastName}`}
        schoolName={school.name}
        query={query}
        context={context}
        activeNav="calendar"
        showDraftBadge={false}
      />
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <PartnerCalendar helpEmail={context.email} />
      </main>
    </div>
  );
}
