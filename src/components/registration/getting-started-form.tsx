"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RegistrantType = "school" | "network";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function GettingStartedForm({
  defaultEmail = "",
  defaultType = "school",
}: {
  defaultEmail?: string;
  defaultType?: RegistrantType;
}) {
  const router = useRouter();
  const [registrantType, setRegistrantType] = useState<RegistrantType>(
    defaultType === "network" ? "network" : "school",
  );
  const [email, setEmail] = useState(defaultEmail);
  const [emailError, setEmailError] = useState<string | null>(null);

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const nextEmail = email.trim();
        if (!isValidEmail(nextEmail)) {
          setEmailError("Enter a valid work email to continue.");
          return;
        }
        const params = new URLSearchParams({
          email: nextEmail,
          type: registrantType,
        });
        router.push(`/verify-email?${params.toString()}`);
      }}
    >
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Get Started
      </h1>

      <FieldGroup className="gap-5">
        <RadioGroup
          value={registrantType}
          onValueChange={(value) => setRegistrantType(value as RegistrantType)}
          className="flex w-full gap-5"
        >
          <Field orientation="horizontal" className="w-auto shrink-0 gap-1.5">
            <RadioGroupItem
              id="type-school"
              value="school"
              className="border-border data-checked:border-foreground data-checked:bg-foreground [&_[data-slot=radio-group-indicator]>span]:hidden"
            />
            <FieldLabel
              htmlFor="type-school"
              className="text-lg leading-6 font-normal"
            >
              Register as a School
            </FieldLabel>
          </Field>
          <Field
            orientation="horizontal"
            className="min-w-0 flex-1 gap-1.5"
          >
            <RadioGroupItem
              id="type-network"
              value="network"
              className="border-border data-checked:border-foreground data-checked:bg-foreground [&_[data-slot=radio-group-indicator]>span]:hidden"
            />
            <FieldLabel
              htmlFor="type-network"
              className="text-lg leading-6 font-normal"
            >
              Register as a Network
            </FieldLabel>
          </Field>
        </RadioGroup>

        <Field data-invalid={emailError ? true : undefined} className="gap-2">
          <FieldLabel htmlFor="work-email" className="tracking-[0.07px]">
            Work email
          </FieldLabel>
          <Input
            id="work-email"
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError(null);
              }
            }}
            placeholder="user@example.com"
            aria-invalid={emailError ? true : undefined}
            className="h-12 rounded-[4px] px-4 text-base shadow-none md:text-base"
          />
          <FieldError>{emailError}</FieldError>
        </Field>

        <FieldDescription className="tracking-[0.07px]">
          The first approved person for this school becomes the Owner. Only one
          Owner is allowed.
        </FieldDescription>

        <Button type="submit" className="h-12 w-fit rounded-[4px] px-6 text-base">
          Search
        </Button>
      </FieldGroup>
    </form>
  );
}
