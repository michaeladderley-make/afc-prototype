"use client";

import { Monitor, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PreviewMode } from "@/components/page-builder/preview-mode";

export function PageBuilderToolbar({
  title,
  preview,
  onPreviewChange,
}: {
  title: string;
  preview: PreviewMode;
  onPreviewChange: (preview: PreviewMode) => void;
}) {
  return (
    <div>
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 bg-background px-5 py-5">
        <h1 className="min-w-0 text-[28px] font-medium text-foreground">
          {title}
        </h1>
        <ToggleGroup
          type="single"
          value={preview}
          onValueChange={(value) => {
            if (value === "desktop" || value === "mobile") {
              onPreviewChange(value);
            }
          }}
          variant="outline"
          spacing={0}
          aria-label="Preview size"
        >
          <ToggleGroupItem value="desktop" aria-label="Desktop preview">
            <Monitor data-icon="inline-start" />
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Mobile preview">
            <Smartphone data-icon="inline-start" />
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center justify-self-end gap-3">
          <Button type="button" variant="outline">
            Save draft
          </Button>
          <Button type="button">Publish</Button>
        </div>
      </div>
      <Separator />
    </div>
  );
}
