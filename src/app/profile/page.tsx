import { redirect } from "next/navigation";

import { PartnerHeader } from "@/components/partner/partner-header";
import { PartnerProfile } from "@/components/profile/partner-profile";
import { getSchoolById } from "@/lib/mock-schools";
import { partnerQuery } from "@/lib/partner-context";

export default async function ProfilePage({
  searchParams,
}: PageProps<"/profile">) {
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
  const query = partnerQuery(context);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PartnerHeader
        userName={`${givenName} ${familyName}`}
        schoolName={school.name}
        query={query}
        context={context}
        activeNav="profile"
        showDraftBadge={false}
      />
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <PartnerProfile context={context} />
      </main>
    </div>
  );
}
