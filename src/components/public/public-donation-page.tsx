"use client";

import { useEffect, useMemo, useState } from "react";

import { PageBuilderEdit } from "@/components/page-builder/page-builder-edit";
import { PromoteBar } from "@/components/promote/promote-bar";
import { PromotionView } from "@/components/promote/promotion-view";
import type { PartnerContext } from "@/lib/partner-context";
import { resolveDonationFrom } from "@/lib/partner-pages";
import {
  findPartnerSessionForSchool,
  pageBuilderHref,
} from "@/lib/partner-session";
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

export function PublicDonationPage({
  slug,
  partnerContext = null,
  openPromote = false,
}: {
  slug: string;
  partnerContext?: PartnerContext | null;
  openPromote?: boolean;
}) {
  const { pages } = usePartnerPages();
  const [viewer, setViewer] = useState<PartnerContext | null>(partnerContext);
  const [sessionReady, setSessionReady] = useState(Boolean(partnerContext));
  const [view, setView] = useState<"page" | "promote">(
    openPromote ? "promote" : "page",
  );

  useEffect(() => {
    if (partnerContext) {
      setViewer(partnerContext);
      setSessionReady(true);
      return;
    }
    setViewer(findPartnerSessionForSchool(slug));
    setSessionReady(true);
  }, [partnerContext, slug]);

  const resolved = useMemo(
    () =>
      resolveDonationFrom(pages, slug, {
        allowUnpublished: Boolean(viewer),
      }),
    [pages, slug, viewer],
  );

  if (!resolved) {
    if (!sessionReady) {
      return <main className="min-h-dvh w-full bg-background" />;
    }
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

  const builderHref = viewer
    ? pageBuilderHref({
        ...viewer,
        school: resolved.page.editableSchoolId ?? viewer.school,
      })
    : "/sign-in";

  return (
    <main className="min-h-dvh w-full bg-background">
      <PromoteBar
        pageName={resolved.page.name}
        builderHref={builderHref}
        view={view}
        onViewChange={setView}
      />
      {view === "promote" ? (
        <PromotionView page={resolved.page} schoolName={resolved.school.name} />
      ) : (
        <PageBuilderEdit
          school={resolved.school}
          context={donorContext(resolved.school.id)}
          publicView
          slug={slug}
        />
      )}
    </main>
  );
}
