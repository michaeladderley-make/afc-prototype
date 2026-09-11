import { redirect } from "next/navigation";

import { PartnerHeader } from "@/components/partner/partner-header";
import { PartnershipAgreementView } from "@/components/partnership/partnership-agreement-view";
import { getSchoolById } from "@/lib/mock-schools";
import { partnerQuery } from "@/lib/partner-context";

export default async function PartnershipAgreementPage({
  searchParams,
}: PageProps<"/partnership-agreement">) {
  const {
    email,
    type,
    school: schoolId,
    firstName,
    lastName,
    role,
    from,
  } = await searchParams;
  const workEmail = typeof email === "string" ? email.trim() : "";
  const registrantType = typeof type === "string" ? type : "school";
  const selectedSchoolId = typeof schoolId === "string" ? schoolId : "";
  const givenName = typeof firstName === "string" ? firstName.trim() : "";
  const familyName = typeof lastName === "string" ? lastName.trim() : "";
  const schoolRole = typeof role === "string" ? role.trim() : "";
  const school = getSchoolById(selectedSchoolId);

  if (!workEmail) {
    redirect("/");
  }

  if (!school || !givenName || !familyName || !schoolRole) {
    redirect("/");
  }

  const context = {
    email: workEmail,
    type: registrantType,
    school: school.id,
    firstName: givenName,
    lastName: familyName,
    role: schoolRole,
  };
  const query = partnerQuery(context);
  const returnHref =
    from === "page-builder"
      ? `/page-builder?${query}`
      : from === "publish"
        ? `/publish?${query}`
        : `/profile?${query}`;

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={`${givenName} ${familyName}`}
        schoolName={school.name}
        query={query}
        context={context}
        showDraftBadge={false}
      />
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <PartnershipAgreementView
          email={workEmail}
          school={school.id}
          schoolName={school.name}
          firstName={givenName}
          lastName={familyName}
          role={schoolRole}
          returnHref={returnHref}
        />
      </main>
    </div>
  );
}
