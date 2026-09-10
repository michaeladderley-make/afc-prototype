"use client";

import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  EXPERIENCE_LABEL,
  parseExperience,
  saveExperience,
} from "@/lib/experience";
import { useExperience } from "@/lib/use-experience";

export function ExperienceBadge({ experience }: { experience?: string }) {
  const stored = useExperience();
  const fromQuery = parseExperience(experience);
  const resolved = fromQuery ?? stored;

  useEffect(() => {
    if (fromQuery) {
      saveExperience(fromQuery);
    }
  }, [fromQuery]);

  if (!resolved) {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
    >
      {EXPERIENCE_LABEL[resolved]}
    </Badge>
  );
}
