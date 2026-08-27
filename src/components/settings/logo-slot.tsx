"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export function LogoSlot({
  added,
  onChange,
  hint,
  stacked = false,
  className,
  emptyLabel = "School Logo",
  addedLabel = "School logo added",
}: {
  added: boolean;
  onChange: () => void;
  hint?: string;
  stacked?: boolean;
  className?: string;
  emptyLabel?: string;
  addedLabel?: string;
}) {
  return (
    <Empty
      className={cn(
        "flex-none rounded-[4px] border border-dashed border-muted-foreground bg-muted",
        stacked ? "flex-col gap-2 p-3" : "flex-row gap-3 p-0",
        className,
      )}
    >
      <EmptyTitle className="text-xs font-medium tracking-normal text-muted-foreground">
        {added ? addedLabel : emptyLabel}
      </EmptyTitle>
      <EmptyContent className="w-auto max-w-none">
        <Button type="button" variant="outline" size="sm" onClick={onChange}>
          {added ? "Replace" : "Change"}
        </Button>
        {hint ? (
          <p className="text-xs tracking-[0.12px] text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}
