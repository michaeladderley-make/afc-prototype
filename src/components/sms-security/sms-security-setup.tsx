"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isValidMobile, MOCK_SMS_CODE } from "@/lib/sms-security";
import { useSmsSecurity } from "@/lib/use-sms-security";

export function SmsSecuritySetup({
  email,
  returnHref,
}: {
  email: string;
  returnHref: string;
}) {
  const { complete, mobile: storedMobile, saveMobile, completeSetup } =
    useSmsSecurity(email);
  const [mobile, setMobile] = useState("");
  const displayMobile = mobile || storedMobile;
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const canSend = isValidMobile(displayMobile);

  function sendCode() {
    const nextMobile = displayMobile.trim();
    if (!isValidMobile(nextMobile)) {
      setMobileError("Enter a mobile number with at least 10 digits.");
      return;
    }
    saveMobile(nextMobile);
    setMobile(nextMobile);
    setMobileError(null);
    setCode("");
    setCodeError(null);
    setCodeSent(true);
    setResent(false);
  }

  function resendCode() {
    if (!isValidMobile(displayMobile)) {
      setMobileError("Enter a mobile number with at least 10 digits.");
      return;
    }
    saveMobile(displayMobile.trim());
    setCode("");
    setCodeError(null);
    setResent(true);
    setCodeSent(true);
  }

  function verifyCode() {
    if (code.trim() !== MOCK_SMS_CODE) {
      setCodeError("Enter the 6-digit code we sent you.");
      setResent(false);
      return;
    }
    completeSetup(displayMobile.trim());
  }

  if (complete) {
    return (
      <div className="flex w-full max-w-[640px] flex-col gap-5">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          SMS security is set up
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          Two-factor authentication is complete
          {storedMobile ? ` for ${storedMobile}` : ""}. You can publish your
          donation page.
        </p>
        <Button asChild variant="outline" className="w-fit">
          <Link href={returnHref}>Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-[640px] flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!codeSent) {
          sendCode();
          return;
        }
        verifyCode();
      }}
    >
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Set up SMS security
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        Add a mobile number and verify a one-time code. This is a prototype —
        use code {MOCK_SMS_CODE}. Publishing stays locked until this is
        complete.
      </p>

      <FieldGroup className="gap-5">
        <Field
          data-invalid={mobileError ? true : undefined}
          className="gap-2"
        >
          <FieldLabel htmlFor="sms-mobile">Mobile number</FieldLabel>
          <Input
            id="sms-mobile"
            type="tel"
            autoComplete="tel"
            value={displayMobile}
            aria-invalid={mobileError ? true : undefined}
            onChange={(event) => {
              setMobile(event.target.value);
              if (mobileError) {
                setMobileError(null);
              }
            }}
          />
          <FieldError>{mobileError}</FieldError>
        </Field>

        {codeSent ? (
          <Field data-invalid={codeError ? true : undefined} className="gap-2">
            <FieldLabel htmlFor="sms-code">SMS code</FieldLabel>
            <InputOTP
              id="sms-code"
              maxLength={6}
              value={code}
              autoComplete="one-time-code"
              aria-invalid={codeError ? true : undefined}
              onChange={(value) => {
                setCode(value);
                if (codeError) {
                  setCodeError(null);
                }
                if (resent) {
                  setResent(false);
                }
              }}
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
            <FieldError>{codeError}</FieldError>
            {resent ? (
              <FieldDescription>
                We sent a new code to {displayMobile.trim()}.
              </FieldDescription>
            ) : (
              <FieldDescription>
                We sent a code to {displayMobile.trim()}.
              </FieldDescription>
            )}
          </Field>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {codeSent ? (
            <>
              <Button type="button" variant="outline" onClick={resendCode}>
                Resend code
              </Button>
              <Button type="submit">Verify</Button>
            </>
          ) : (
            <Button type="submit" disabled={!canSend}>
              Send code
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href={returnHref}>Back</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
