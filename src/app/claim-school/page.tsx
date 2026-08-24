import { redirect } from "next/navigation";

import { ClaimProgress } from "@/components/registration/claim-progress";
import { ClaimSchoolForm } from "@/components/registration/claim-school-form";
import { RegistrationShell } from "@/components/registration/registration-shell";
import { getSchoolById } from "@/lib/mock-schools";

export default async function ClaimSchoolPage({
  searchParams,
}: PageProps<"/claim-school">) {
  const { email, type, school: schoolId } = await searchParams;
  const workEmail = typeof email === "string" ? email.trim() : "";
  const registrantType = typeof type === "string" ? type : "school";
  const selectedSchoolId = typeof schoolId === "string" ? schoolId : "";
  const school = getSchoolById(selectedSchoolId);

  if (!workEmail) {
    redirect("/");
  }

  if (!school || school.status !== "available") {
    redirect(
      `/select-school?${new URLSearchParams({
        email: workEmail,
        type: registrantType,
      }).toString()}`,
    );
  }

  return (
    <RegistrationShell
      progress={
        <ClaimProgress
          currentStep={3}
          currentFill={0.5}
          mutedUpcoming
        />
      }
      contentClassName="flex w-full flex-1 flex-col items-center px-16 pt-24 pb-16"
    >
      <ClaimSchoolForm
        email={workEmail}
        registrantType={registrantType}
        school={school}
      />
    </RegistrationShell>
  );
}
