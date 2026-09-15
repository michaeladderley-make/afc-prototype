import { PartnerCalendar } from "@/components/calendar/partner-calendar";
import { PartnerHeader } from "@/components/partner/partner-header";
import { PublicHeader } from "@/components/registration/public-header";
import { getSchoolById } from "@/lib/mock-schools";
import {
  optionalPartnerContext,
  partnerQuery,
} from "@/lib/partner-context";

export default async function CalendarPage({
  searchParams,
}: PageProps<"/calendar">) {
  const params = await searchParams;
  const context = optionalPartnerContext(params);
  const school = context ? getSchoolById(context.school) : undefined;
  const workEmail = typeof params.email === "string" ? params.email.trim() : "";

  return (
    <div className="flex min-h-full flex-col bg-background">
      {context && school ? (
        <PartnerHeader
          userName={`${context.firstName} ${context.lastName}`}
          schoolName={school.name}
          query={partnerQuery(context)}
          context={context}
          activeNav="calendar"
          showDraftBadge={false}
        />
      ) : (
        <PublicHeader email={workEmail || undefined} activeNav="calendar" />
      )}
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <PartnerCalendar helpEmail={workEmail} />
      </main>
    </div>
  );
}
