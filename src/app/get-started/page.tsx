import { ClaimProgress } from "@/components/registration/claim-progress";
import { GettingStartedForm } from "@/components/registration/getting-started-form";
import { RegistrationNeeds } from "@/components/registration/registration-needs";
import { RegistrationShell } from "@/components/registration/registration-shell";

export default async function GetStartedPage({
  searchParams,
}: PageProps<"/get-started">) {
  const { email, type, experience } = await searchParams;
  const defaultEmail = typeof email === "string" ? email : "";
  const defaultType = type === "network" ? "network" : "school";
  const selectedExperience = typeof experience === "string" ? experience : "";

  return (
    <RegistrationShell
      email={defaultEmail}
      experience={selectedExperience}
      progress={<ClaimProgress currentStep={1} />}
      contentClassName="flex flex-1 justify-center px-16 pt-24 pb-16"
    >
      <div className="flex w-[640px] flex-col gap-16">
        <GettingStartedForm
          defaultEmail={defaultEmail}
          defaultType={defaultType}
        />
        <RegistrationNeeds />
      </div>
    </RegistrationShell>
  );
}
