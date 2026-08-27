"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const canSearch = isValidEmail(email) && acceptedTerms;

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!acceptedTerms) {
          return;
        }
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
              I represent a school
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
              I represent a network
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
          />
          <FieldError>{emailError}</FieldError>
        </Field>

        <FieldDescription className="tracking-[0.07px]">
          The first approved person for this school becomes the Owner. Only one
          Owner is allowed.
        </FieldDescription>

        <Field orientation="horizontal" className="w-auto items-start gap-2">
          <Checkbox
            id="accept-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          />
          <FieldLabel
            htmlFor="accept-terms"
            className="text-sm font-normal tracking-[0.07px]"
          >
            Read Our{" "}
            <button
              type="button"
              className="underline underline-offset-4 hover:text-foreground"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setTermsOpen(true);
              }}
            >
              Terms and Conditions
            </button>
          </FieldLabel>
        </Field>

        <Button type="submit" className="w-fit" disabled={!canSearch}>
          Verify email
        </Button>
      </FieldGroup>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Placeholder terms for this prototype. A full legal agreement will
              replace this copy later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto text-sm leading-6 text-foreground">
            <p>
              By creating a partner account, you agree to use the AFC Partner
              Portal only for fundraising on behalf of your school or network.
            </p>
            <p>
              You confirm that you are authorized to represent this
              organization, that donation pages you publish are accurate, and
              that you will not designate gifts to individual students.
            </p>
            <p>
              AFC may update these terms. Continued use of the portal after an
              update constitutes acceptance of the revised terms.
            </p>
          </div>
          <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTermsOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setAcceptedTerms(true);
                setTermsOpen(false);
              }}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
