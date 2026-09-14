import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PrototypeBanner({
  children,
  variant = "muted",
  className,
}: {
  children: ReactNode;
  variant?: "muted" | "inverse";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-5 py-2",
        variant === "inverse"
          ? "bg-black text-white"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <p className="text-center text-xs tracking-[0.12px]">{children}</p>
    </div>
  );
}
