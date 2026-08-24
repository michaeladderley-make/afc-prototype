"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { School } from "@/lib/mock-schools";

const ROLE_OPTIONS = [
  { value: "principal", label: "Principal" },
  { value: "development-officer", label: "Development officer" },
  { value: "athletic-director", label: "Athletic director" },
  { value: "other", label: "Other" },
] as const;

export function ClaimSchoolForm({
  email,
  registrantType,
  school,
}: {
  email: string;
  registrantType: string;
  school: School;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Jordan");
  const [lastName, setLastName] = useState("Lee");
  const [role, setRole] = useState("");
  const canContinue =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    role.length > 0;
  const resultsHref = `/select-school?${new URLSearchParams({
    email,
    type: registrantType,
  }).toString()}`;

  return (
    <form
      className="flex w-full max-w-[640px] flex-col items-start gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canContinue) {
          return;
        }
        const params = new URLSearchParams({
          email,
          type: registrantType,
          school: school.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role,
        });
        router.push(`/setting-up-profile?${params.toString()}`);
      }}
    >
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Claim this school
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        Use your work email. If it matches the school’s approved domain, we can
        approve you automatically.
      </p>

      <Card className="w-full rounded-[4px] py-0 shadow-none">
        <CardContent className="flex flex-col items-start gap-2 px-6 py-5">
          <CardTitle className="text-[21px] leading-[28px] font-medium">
            {school.name}
          </CardTitle>
          <CardDescription className="text-sm tracking-[0.07px] whitespace-pre">
            {school.meta}
          </CardDescription>
          <CardDescription className="text-sm tracking-[0.07px] whitespace-pre">
            {school.address}
          </CardDescription>
          <Badge
            variant="secondary"
            className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
          >
            Available to claim
          </Badge>
        </CardContent>
      </Card>

      <FieldGroup className="w-full gap-5">
        <Field className="gap-2">
          <FieldLabel htmlFor="work-email" className="tracking-[0.07px]">
            Work email (read only)
          </FieldLabel>
          <Input
            id="work-email"
            type="email"
            value={email}
            readOnly
            className="h-12 rounded-[4px] text-base text-muted-foreground opacity-40 shadow-none"
          />
        </Field>

        <FieldGroup className="flex-row gap-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="first-name" className="tracking-[0.07px]">
              First name
            </FieldLabel>
            <Input
              id="first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="h-12 rounded-[4px] text-base shadow-none"
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="last-name" className="tracking-[0.07px]">
              Last name
            </FieldLabel>
            <Input
              id="last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="h-12 rounded-[4px] text-base shadow-none"
            />
          </Field>
        </FieldGroup>

        <Field className="gap-2">
          <FieldLabel className="tracking-[0.07px]">Role at school</FieldLabel>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger
              className="h-12 w-full rounded-[4px] px-4 text-base shadow-none data-[size=default]:h-12"
              aria-label="Role at school"
            >
              <SelectValue placeholder="Principal, development officer, or other" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription className="text-xs tracking-[0.12px]">
            The first approved person for this school becomes the Owner. Only
            one Owner is allowed.
          </FieldDescription>
        </Field>

        <ButtonGroup className="gap-3">
          <ButtonGroup>
            <Button
              type="submit"
              disabled={!canContinue}
              className="h-12 rounded-[4px] px-6 text-base"
            >
              Continue
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              asChild
              type="button"
              variant="outline"
              className="h-12 rounded-[4px] border-foreground px-6 text-base shadow-none"
            >
              <Link href={resultsHref}>Back to results</Link>
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </FieldGroup>
    </form>
  );
}
