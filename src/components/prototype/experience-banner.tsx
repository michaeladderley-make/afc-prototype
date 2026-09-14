"use client";

import { useEffect } from "react";

import { PrototypeBanner } from "@/components/prototype/prototype-banner";
import {
  EXPERIENCE_LABEL,
  parseExperience,
  saveExperience,
} from "@/lib/experience";
import { useExperience } from "@/lib/use-experience";

export function ExperienceBanner({ experience }: { experience?: string }) {
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
    <PrototypeBanner variant="inverse">
      Prototype experience: {EXPERIENCE_LABEL[resolved]}
    </PrototypeBanner>
  );
}
