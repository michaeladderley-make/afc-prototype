import { redirect } from "next/navigation";

import { MyPages } from "@/components/pages/my-pages";
import { PartnerHeader } from "@/components/partner/partner-header";
import { getSchoolById } from "@/lib/mock-schools";
import { partnerQuery } from "@/lib/partner-context";

export default async function PagesPage({
  searchParams,
}: PageProps<"/pages">) {
  const { email, type, school: schoolId, firstName, lastName, role } =
    await searchParams;
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

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={`${givenName} ${familyName}`}
        schoolName={school.name}
        query={partnerQuery(context)}
        context={context}
        activeNav="pages"
        showDraftBadge={false}
      />
      <main className="flex w-full justify-center px-16 pt-24 pb-16">
        <MyPages context={context} />
      </main>
    </div>
  );
}
