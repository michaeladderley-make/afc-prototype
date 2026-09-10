import { redirect } from "next/navigation";

import { ClaimProgress } from "@/components/registration/claim-progress";
import { RegistrationShell } from "@/components/registration/registration-shell";
import { SelectSchoolList } from "@/components/registration/select-school-list";

export default async function SelectSchoolPage({
  searchParams,
}: PageProps<"/select-school">) {
  const { email, type } = await searchParams;
  const workEmail = typeof email === "string" ? email.trim() : "";
  const registrantType = typeof type === "string" ? type : "school";

  if (!workEmail) {
    redirect("/");
  }

  return (
    <RegistrationShell
      email={workEmail}
      progress={
        <ClaimProgress
          currentStep={2}
          currentFill={0.5}
          mutedUpcoming
        />
      }
      contentClassName="flex w-full flex-1 flex-col items-center px-16 pt-24 pb-16"
    >
      <SelectSchoolList email={workEmail} registrantType={registrantType} />
    </RegistrationShell>
  );
}
