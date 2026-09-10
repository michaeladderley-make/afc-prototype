import { FaqsAndCalendar } from "@/components/faqs/faqs-and-calendar";
import { PartnerHeader } from "@/components/partner/partner-header";
import { PublicHeader } from "@/components/registration/public-header";
import { getSchoolById } from "@/lib/mock-schools";
import { partnerQuery } from "@/lib/partner-context";

export default async function FaqsPage({
  searchParams,
}: PageProps<"/faqs">) {
  const { email, type, school: schoolId, firstName, lastName, role } =
    await searchParams;
  const workEmail = typeof email === "string" ? email.trim() : "";
  const registrantType = typeof type === "string" ? type : "school";
  const selectedSchoolId = typeof schoolId === "string" ? schoolId : "";
  const givenName = typeof firstName === "string" ? firstName.trim() : "";
  const familyName = typeof lastName === "string" ? lastName.trim() : "";
  const schoolRole = typeof role === "string" ? role.trim() : "";
  const school = getSchoolById(selectedSchoolId);

  const partnerContext =
    workEmail && school && givenName && familyName && schoolRole
      ? {
          email: workEmail,
          type: registrantType,
          school: school.id,
          schoolName: school.name,
          firstName: givenName,
          lastName: familyName,
          role: schoolRole,
        }
      : null;

  return (
    <div className="flex min-h-full flex-col bg-background">
      {partnerContext ? (
        <PartnerHeader
          userName={`${partnerContext.firstName} ${partnerContext.lastName}`}
          schoolName={partnerContext.schoolName}
          query={partnerQuery({
            email: partnerContext.email,
            type: partnerContext.type,
            school: partnerContext.school,
            firstName: partnerContext.firstName,
            lastName: partnerContext.lastName,
            role: partnerContext.role,
          })}
          context={{
            email: partnerContext.email,
            type: partnerContext.type,
            school: partnerContext.school,
            firstName: partnerContext.firstName,
            lastName: partnerContext.lastName,
            role: partnerContext.role,
          }}
          activeNav="faqs"
          showDraftBadge={false}
        />
      ) : (
        <PublicHeader email={workEmail || undefined} />
      )}
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <FaqsAndCalendar helpEmail={workEmail} />
      </main>
    </div>
  );
}
