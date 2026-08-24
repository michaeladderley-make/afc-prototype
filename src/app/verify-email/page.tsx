import { redirect } from "next/navigation";

import { ClaimProgress } from "@/components/registration/claim-progress";
import { RegistrationShell } from "@/components/registration/registration-shell";
import { VerifyEmailForm } from "@/components/registration/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const { email, type } = await searchParams;
  const workEmail = typeof email === "string" ? email.trim() : "";
  const registrantType = typeof type === "string" ? type : "school";

  if (!workEmail) {
    redirect("/");
  }

  return (
    <RegistrationShell
      progress={
        <ClaimProgress
          currentStep={1}
          currentFill={0.5}
          mutedUpcoming
        />
      }
      contentClassName="flex flex-1 justify-center px-16 py-24"
    >
      <div className="flex w-[640px] flex-col">
        <VerifyEmailForm email={workEmail} registrantType={registrantType} />
      </div>
    </RegistrationShell>
  );
}
