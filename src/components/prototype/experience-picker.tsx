"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { saveExperience, type Experience } from "@/lib/experience";

const EXPERIENCES = [
  { id: "school", label: "School", comingSoon: false },
  { id: "network", label: "Network", comingSoon: true },
  { id: "afc", label: "AFC", comingSoon: true },
] as const satisfies ReadonlyArray<{
  id: Experience;
  label: string;
  comingSoon: boolean;
}>;

export function ExperiencePicker() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-16 py-24">
      <div className="flex w-full max-w-[880px] flex-col items-center gap-10">
        <h1 className="text-center text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Select an experience
        </h1>
        <div className="flex w-full flex-row items-stretch justify-center gap-6">
          {EXPERIENCES.map((experience) => (
            <Link
              key={experience.id}
              href={`/get-started?experience=${experience.id}`}
              onClick={() => saveExperience(experience.id)}
              className="flex h-40 w-56 flex-col items-center justify-center gap-2 rounded-[4px] border border-border bg-background text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground hover:ring-2 hover:ring-foreground"
            >
              {experience.label}
              {experience.comingSoon ? (
                <Badge
                  variant="secondary"
                  className="h-auto rounded-[4px] border border-border px-2 py-0.5 text-xs font-normal tracking-[0.12px]"
                >
                  Coming Soon
                </Badge>
              ) : null}
            </Link>
          ))}
        </div>
        <p className="max-w-[640px] text-center text-sm leading-6 tracking-[0.07px] text-muted-foreground">
          School and Network users are treated as approved Owners or Admins with
          full access to that organization.
        </p>
      </div>
    </div>
  );
}
