import type { ReactNode } from "react";

import { PublicHeader } from "@/components/registration/public-header";

export function RegistrationShell({
  progress,
  children,
  contentClassName,
  email,
}: {
  progress: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  email?: string;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PublicHeader email={email} />
      {progress}
      <main className={contentClassName}>{children}</main>
    </div>
  );
}
