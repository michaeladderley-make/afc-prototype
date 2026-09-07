"use client";

import { useMemo } from "react";

import { PageBuilderEdit } from "@/components/page-builder/page-builder-edit";
import type { PartnerContext } from "@/lib/partner-context";
import { resolvePublishedDonationFrom } from "@/lib/partner-pages";
import { usePartnerPages } from "@/lib/use-partner-pages";

function donorContext(schoolId: string): PartnerContext {
  return {
    email: "donor@afc.local",
    type: "school",
    school: schoolId,
    firstName: "Donor",
    lastName: "Visitor",
    role: "donor",
  };
}

export function PublicDonationPage({ slug }: { slug: string }) {
  const { pages } = usePartnerPages();
  const resolved = useMemo(
    () => resolvePublishedDonationFrom(pages, slug),
    [pages, slug],
  );

  if (!resolved) {
    return (
      <main className="flex min-h-dvh w-full items-center justify-center bg-background px-8">
        <div className="flex max-w-md flex-col gap-2 text-center">
          <h1 className="text-[28px] leading-[34px] font-medium text-foreground">
            Page not found
          </h1>
          <p className="text-base leading-6 text-muted-foreground">
            This donation page is not published, or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-background">
      <PageBuilderEdit
        school={resolved.school}
        context={donorContext(resolved.school.id)}
        publicView
        slug={slug}
      />
    </main>
  );
}
