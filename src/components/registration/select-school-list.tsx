"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SchoolResultCard } from "@/components/registration/school-result-card";
import { Button } from "@/components/ui/button";
import { MOCK_SCHOOLS } from "@/lib/mock-schools";

export function SelectSchoolList({
  email,
  registrantType,
}: {
  email: string;
  registrantType: string;
}) {
  const router = useRouter();
  const changeHref = `/?${new URLSearchParams({
    email,
    type: registrantType,
  }).toString()}`;

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col items-stretch gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          {MOCK_SCHOOLS.length} results for “{email}”
        </h1>
        <Button
          asChild
          variant="outline"
          className="h-auto rounded-[4px] border-foreground px-2 py-1.5 text-sm font-medium tracking-[0.07px] shadow-none"
        >
          <Link href={changeHref}>Change</Link>
        </Button>
      </div>

      {MOCK_SCHOOLS.map((school) => (
        <SchoolResultCard
          key={school.id}
          school={school}
          onSelect={(nextSchool) => {
            const params = new URLSearchParams({
              email,
              type: registrantType,
              school: nextSchool.id,
            });
            router.push(`/claim-school?${params.toString()}`);
          }}
        />
      ))}

      <p className="text-sm tracking-[0.07px] text-foreground">
        Can’t find your school?{" "}
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 text-sm font-normal tracking-[0.07px] text-foreground"
        >
          Request help from AFC.
        </Button>
      </p>
    </div>
  );
}
