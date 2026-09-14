"use client";

import { Button } from "@/components/ui/button";
import { openNeedHelp } from "@/lib/need-help";

export { SUPPORT_EMAIL } from "@/components/help/need-help-widget";

export function NeedHelp({
  email = "",
  label = "Need help?",
  variant = "ghost",
}: {
  email?: string;
  label?: string;
  variant?: "ghost" | "default" | "outline" | "link";
  idPrefix?: string;
  overlayClassName?: string;
  contentClassName?: string;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className={
        variant === "ghost"
          ? "h-auto px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          : variant === "outline"
            ? "w-full"
            : variant === "link"
              ? "h-auto px-0 text-sm font-normal tracking-[0.07px] text-foreground"
              : undefined
      }
      onClick={() => openNeedHelp(email)}
    >
      {label}
    </Button>
  );
}
