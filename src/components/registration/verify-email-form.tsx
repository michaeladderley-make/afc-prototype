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
        router.push(`/matching-email?${params.toString()}`);
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
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldError>{error}</FieldError>
          {status === "resent" ? (
            <FieldDescription>We sent a new code to {email}.</FieldDescription>
          ) : null}
        </Field>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCode("");
              setError(null);
              setStatus("resent");
            }}
          >
            Resend Code
          </Button>
          <Button type="submit">Verify</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
