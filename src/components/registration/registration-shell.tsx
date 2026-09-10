import type { ReactNode } from "react";

import { PublicHeader } from "@/components/registration/public-header";

export function RegistrationShell({
  progress,
  children,
  contentClassName,
  email,
  experience,
}: {
  progress: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  email?: string;
  experience?: string;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PublicHeader email={email} experience={experience} />
      {progress}
      <main className={contentClassName}>{children}</main>
    </div>
  );
}
