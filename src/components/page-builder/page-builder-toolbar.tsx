"use client";

import { Monitor, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
          size="lg"
          aria-label="Preview size"
          className="rounded-[4px]"
        >
          <ToggleGroupItem
            value="desktop"
            aria-label="Desktop preview"
            className="h-12 rounded-l-[4px] px-4 text-base"
          >
            <Monitor />
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mobile"
            aria-label="Mobile preview"
            className="h-12 rounded-r-[4px] px-4 text-base"
          >
            <Smartphone />
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>
        <ButtonGroup className="justify-self-end gap-3">
          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-[4px] border-foreground px-6 text-base shadow-none"
            >
              Save draft
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button type="button" className="h-12 rounded-[4px] px-6 text-base">
              Publish
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
      <Separator />
    </div>
  );
}
