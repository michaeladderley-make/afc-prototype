"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const MOCK_VERIFICATION_CODE = "123456";

export function VerifyEmailForm({
  email,
  registrantType,
}: {
  email: string;
  registrantType: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "resent">("idle");

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (code.trim() !== MOCK_VERIFICATION_CODE) {
          setError("Enter the 6-digit code we sent you.");
          setStatus("idle");
          return;
        }
        const params = new URLSearchParams({
          email,
          type: registrantType,
        });
        router.push(`/select-school?${params.toString()}`);
      }}
    >
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Verify email address
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        Enter the code we sent to “{email}”
      </p>

      <FieldGroup className="gap-5">
        <Field data-invalid={error ? true : undefined} className="gap-2">
          <FieldLabel htmlFor="verification-code" className="tracking-[0.07px]">
            Verification Code
          </FieldLabel>
          <InputOTP
            id="verification-code"
            maxLength={6}
            value={code}
            onChange={(value) => {
              setCode(value);
              if (error) {
                setError(null);
              }
              if (status === "resent") {
                setStatus("idle");
              }
            }}
            autoComplete="one-time-code"
            aria-invalid={error ? true : undefined}
          >
            <InputOTPGroup className="rounded-[4px]">
              <InputOTPSlot
                index={0}
                className="size-12 text-base shadow-none first:rounded-l-[4px]"
              />
              <InputOTPSlot index={1} className="size-12 text-base shadow-none" />
              <InputOTPSlot index={2} className="size-12 text-base shadow-none" />
              <InputOTPSlot index={3} className="size-12 text-base shadow-none" />
              <InputOTPSlot index={4} className="size-12 text-base shadow-none" />
              <InputOTPSlot
                index={5}
                className="size-12 text-base shadow-none last:rounded-r-[4px]"
              />
            </InputOTPGroup>
          </InputOTP>
          <FieldError>{error}</FieldError>
          {status === "resent" ? (
            <FieldDescription>We sent a new code to {email}.</FieldDescription>
          ) : null}
        </Field>

        <ButtonGroup className="gap-3">
          <ButtonGroup>
            <Button type="submit" className="h-12 w-fit rounded-[4px] px-6 text-base">
              Verify
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-fit rounded-[4px] border-foreground px-6 text-base shadow-none"
              onClick={() => {
                setCode("");
                setError(null);
                setStatus("resent");
              }}
            >
              Resend Code
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </FieldGroup>
    </form>
  );
}
