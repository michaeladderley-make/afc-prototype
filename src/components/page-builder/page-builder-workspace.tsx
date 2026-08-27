"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PageBuilderEdit } from "@/components/page-builder/page-builder-edit";
import { PageBuilderToolbar } from "@/components/page-builder/page-builder-toolbar";
import { PageBuilderWelcome } from "@/components/page-builder/page-builder-welcome";
import type { PreviewMode } from "@/components/page-builder/preview-mode";
import { PartnerHeader } from "@/components/partner/partner-header";
import type { School } from "@/lib/mock-schools";
import type { PartnerContext } from "@/lib/partner-context";

export function PageBuilderWorkspace({
  school,
  context,
  userName,
  query,
  showWelcome = false,
}: {
  school: School;
  context: PartnerContext;
  userName: string;
  query: string;
  showWelcome?: boolean;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<PreviewMode>("desktop");
  const [welcomeOpen, setWelcomeOpen] = useState(showWelcome);

  function dismissWelcome() {
    setWelcomeOpen(false);
    router.replace(`/page-builder?${query}`);
  }

  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr] bg-muted">
      <div className="sticky top-0 z-20 bg-background">
        <PartnerHeader
          userName={userName}
          schoolName={school.name}
          query={query}
        />
        <PageBuilderToolbar
          title={`Personalize ${school.name}`}
          preview={preview}
          onPreviewChange={setPreview}
          continueHref={`/publish?${query}`}
        />
      </div>
      <PageBuilderEdit school={school} context={context} preview={preview} />
      <PageBuilderWelcome
        open={welcomeOpen}
        onOpenChange={(open) => {
          if (!open) {
            dismissWelcome();
          }
        }}
      />
    </div>
  );
}
