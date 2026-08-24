import { redirect } from "next/navigation";

import { PageBuilderWorkspace } from "@/components/page-builder/page-builder-workspace";
import { getSchoolById } from "@/lib/mock-schools";
import { partnerQuery } from "@/lib/partner-context";

export default async function PageBuilderPage({
  searchParams,
}: PageProps<"/page-builder">) {
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

  if (!school || school.status !== "available" || !givenName || !familyName || !schoolRole) {
    redirect(
      `/claim-school?${new URLSearchParams({
        email: workEmail,
        type: registrantType,
        school: selectedSchoolId,
      }).toString()}`,
    );
  }

  return (
    <PageBuilderWorkspace
      school={school}
      userName={`${givenName} ${familyName}`}
      query={partnerQuery({
        email: workEmail,
        type: registrantType,
        school: school.id,
        firstName: givenName,
        lastName: familyName,
        role: schoolRole,
      })}
    />
  );
}
