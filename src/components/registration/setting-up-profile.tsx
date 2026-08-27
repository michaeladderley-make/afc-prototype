import { RegistrationLoading } from "@/components/registration/registration-loading";

export function SettingUpProfile({ nextHref }: { nextHref: string }) {
  return (
    <RegistrationLoading
      nextHref={nextHref}
      message="Setting up your profile..."
    />
  );
}
