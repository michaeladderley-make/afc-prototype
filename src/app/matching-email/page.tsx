import { redirect } from "next/navigation";

import { RegistrationLoading } from "@/components/registration/registration-loading";

export default async function MatchingEmailPage({
  searchParams,
}: PageProps<"/matching-email">) {
  const { email, type } = await searchParams;
  const workEmail = typeof email === "string" ? email.trim() : "";
  const registrantType = typeof type === "string" ? type : "school";

  if (!workEmail) {
    redirect("/");
  }

  const nextHref = `/select-school?${new URLSearchParams({
    email: workEmail,
    type: registrantType,
  }).toString()}`;

  return (
    <RegistrationLoading
      nextHref={nextHref}
      message="Matching your email address with our database."
    />
  );
}
