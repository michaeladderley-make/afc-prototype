"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { PublicHeader } from "@/components/registration/public-header";

export const REGISTRATION_LOADING_DURATION_MS = 5000;

export function RegistrationLoading({
  nextHref,
  message,
  email,
}: {
  nextHref: string;
  message: string;
  email?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      router.push(nextHref);
    }, REGISTRATION_LOADING_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [nextHref, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader email={email} />
      <Empty className="flex-1 border-0 p-0" role="status" aria-live="polite">
        <EmptyHeader className="gap-2">
          <EmptyMedia className="mb-0">
            <Spinner className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-lg font-normal tracking-normal">
            {message}
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
