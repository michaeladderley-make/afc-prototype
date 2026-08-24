import { redirect } from "next/navigation";

import { SettingUpProfile } from "@/components/registration/setting-up-profile";
import { getSchoolById } from "@/lib/mock-schools";

export default async function SettingUpProfilePage({
  searchParams,
}: PageProps<"/setting-up-profile">) {
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

  const nextHref = `/page-builder?${new URLSearchParams({
    email: workEmail,
    type: registrantType,
    school: school.id,
    firstName: givenName,
    lastName: familyName,
    role: schoolRole,
    welcome: "1",
  }).toString()}`;

  return <SettingUpProfile nextHref={nextHref} />;
}
