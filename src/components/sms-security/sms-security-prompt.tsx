"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { smsSecurityHref } from "@/lib/sms-security";
import { useSmsSecurity } from "@/lib/use-sms-security";
import { cn } from "@/lib/utils";

export function SmsSecurityPrompt({
  email,
  query,
  from,
  tone = "default",
  className,
}: {
  email: string;
  query: string;
  from: "profile" | "publish";
  tone?: "default" | "warning";
  className?: string;
}) {
  const { complete } = useSmsSecurity(email);

  if (complete) {
    return null;
  }

  return (
    <div
      role={tone === "warning" ? "alert" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3",
        tone === "warning"
          ? "border-orange-300 bg-orange-50 text-orange-950"
          : "border-border bg-background text-foreground",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          tone === "warning" ? "bg-orange-100" : "bg-muted text-foreground",
        )}
      >
        <Smartphone className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium tracking-[0.07px]">SMS security</p>
        <p
          className={cn(
            "text-xs tracking-[0.12px]",
            tone === "warning" ? "text-orange-900/70" : "text-muted-foreground",
          )}
        >
          Set up 2FA before you can publish your donation page
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href={smsSecurityHref(query, from)}>Setup</Link>
      </Button>
    </div>
  );
}
