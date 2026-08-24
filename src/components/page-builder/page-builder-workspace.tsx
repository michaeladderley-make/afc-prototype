"use client";

import { useState } from "react";

import { PageBuilderEdit } from "@/components/page-builder/page-builder-edit";
import { PageBuilderToolbar } from "@/components/page-builder/page-builder-toolbar";
import type { PreviewMode } from "@/components/page-builder/preview-mode";
import { PartnerHeader } from "@/components/partner/partner-header";
import type { School } from "@/lib/mock-schools";

export function PageBuilderWorkspace({
  school,
  userName,
  query,
}: {
  school: School;
  userName: string;
  query: string;
}) {
  const [preview, setPreview] = useState<PreviewMode>("desktop");

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
        />
      </div>
      <PageBuilderEdit school={school} preview={preview} />
    </div>
  );
}
