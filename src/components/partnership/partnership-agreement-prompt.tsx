"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { partnershipAgreementHref } from "@/lib/partnership-agreement";
import { usePartnershipAgreement } from "@/lib/use-partnership-agreement";
import { cn } from "@/lib/utils";

export function PartnershipAgreementPrompt({
  email,
  school,
  query,
  from,
  tone = "default",
  className,
}: {
  email: string;
  school: string;
  query: string;
  from: "profile" | "page-builder" | "publish";
  tone?: "default" | "warning";
  className?: string;
}) {
  const { signed } = usePartnershipAgreement(email, school);

  if (signed) {
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
        <FileText className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium tracking-[0.07px]">
          Partnership Agreement
        </p>
        <p
          className={cn(
            "text-xs tracking-[0.12px]",
            tone === "warning" ? "text-orange-900/70" : "text-muted-foreground",
          )}
        >
          Complete before publishing your donation page
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href={partnershipAgreementHref(query, from)}>Review</Link>
      </Button>
    </div>
  );
}
