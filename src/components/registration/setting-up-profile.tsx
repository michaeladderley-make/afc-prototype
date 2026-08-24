"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { PublicHeader } from "@/components/registration/public-header";

const SETUP_DURATION_MS = 5000;

export function SettingUpProfile({ nextHref }: { nextHref: string }) {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      router.push(nextHref);
    }, SETUP_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [nextHref, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <Empty className="flex-1 border-0 p-0" role="status" aria-live="polite">
        <EmptyHeader className="gap-2">
          <EmptyMedia className="mb-0">
            <Spinner className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-lg font-normal tracking-normal">
            Setting up your profile...
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
