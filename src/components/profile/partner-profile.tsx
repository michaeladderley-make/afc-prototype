"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Field,
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
import {
  partnerQuery,
  type PartnerContext,
} from "@/lib/partner-context";
import { ROLE_OPTIONS } from "@/lib/school-roles";

export function PartnerProfile({ context }: { context: PartnerContext }) {
  const router = useRouter();
  const [role, setRole] = useState(context.role);

  function updateRole(nextRole: string) {
    setRole(nextRole);
    router.replace(
      `/profile?${partnerQuery({ ...context, role: nextRole })}`,
    );
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-10">
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Profile
      </h1>
      <FieldGroup className="w-full gap-5">
        <FieldGroup className="flex-row gap-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="profile-first-name">First name</FieldLabel>
            <Input
              id="profile-first-name"
              value={context.firstName}
              readOnly
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="profile-last-name">Last name</FieldLabel>
            <Input id="profile-last-name" value={context.lastName} readOnly />
          </Field>
        </FieldGroup>
        <Field className="gap-2">
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <Input
            id="profile-email"
            type="email"
            value={context.email}
            readOnly
          />
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="profile-role">Role</FieldLabel>
          <Select value={role} onValueChange={updateRole}>
            <SelectTrigger
              id="profile-role"
              className="w-full"
              aria-label="Role"
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
        </Field>
      </FieldGroup>
    </div>
  );
}
