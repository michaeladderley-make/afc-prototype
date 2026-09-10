"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { isValidWorkEmail } from "@/lib/partnership-agreement";
import {
  pageBuilderHref,
  resolveSignInContext,
} from "@/lib/partner-session";
import { MOCK_VERIFICATION_CODE } from "@/components/registration/verify-email-form";
import { MOCK_SMS_CODE } from "@/lib/sms-security";
import { isDeviceTrusted, trustDevice } from "@/lib/trusted-device";
import { useSmsSecurity } from "@/lib/use-sms-security";

function mobileEnding(mobile: string) {
  const digits = mobile.replace(/\D/g, "");
  return digits.slice(-4);
}

export function PartnerSignIn() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "email-code" | "sms">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeError, setEmailCodeError] = useState<string | null>(null);
  const [emailResent, setEmailResent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [smsError, setSmsError] = useState<string | null>(null);
  const [smsResent, setSmsResent] = useState(false);
  const [trustThisDevice, setTrustThisDevice] = useState(false);
  const { complete: smsComplete, mobile } = useSmsSecurity(email);
  const ending = mobile ? mobileEnding(mobile) : "";

  function finishSignIn() {
    if (trustThisDevice) {
      trustDevice(email);
    }
    router.push(pageBuilderHref(resolveSignInContext(email)));
  }

  function sendEmailCode() {
    const nextEmail = email.trim();
    if (!isValidWorkEmail(nextEmail)) {
      setEmailError("Enter a valid work email to continue.");
      return;
    }
    setEmail(nextEmail);
    setEmailError(null);
    setEmailCode("");
    setEmailCodeError(null);
    setEmailResent(false);
    setStep("email-code");
  }

  function continueAfterEmailCode() {
    if (emailCode.trim() !== MOCK_VERIFICATION_CODE) {
      setEmailCodeError("Enter the 6-digit code we sent you.");
      setEmailResent(false);
      return;
    }
    if (smsComplete && !isDeviceTrusted(email)) {
      setSmsCode("");
      setSmsError(null);
      setSmsResent(false);
      setTrustThisDevice(false);
      setStep("sms");
      return;
    }
    finishSignIn();
  }

  function verifySms() {
    if (smsCode.trim() !== MOCK_SMS_CODE) {
      setSmsError("Enter the 6-digit code we sent you.");
      setSmsResent(false);
      return;
    }
    finishSignIn();
  }

  if (step === "sms") {
    return (
      <form
        className="flex w-full max-w-[640px] flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          verifySms();
        }}
      >
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Verify your mobile number
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          SMS security is on for this account. Enter the code we sent to the
          number ending in {ending || "••••"}.
        </p>
        <FieldGroup className="gap-5">
          <Field className="gap-2">
            <FieldLabel>Mobile number ending</FieldLabel>
            <p className="text-sm tracking-[0.07px] text-foreground">
              {ending ? `Ending in ${ending}` : "Ending in ••••"}
            </p>
          </Field>
          <Field data-invalid={smsError ? true : undefined} className="gap-2">
            <FieldLabel htmlFor="sign-in-sms-code">Six-digit code</FieldLabel>
            <InputOTP
              id="sign-in-sms-code"
              maxLength={6}
              value={smsCode}
              autoComplete="one-time-code"
              aria-invalid={smsError ? true : undefined}
              onChange={(value) => {
                setSmsCode(value);
                if (smsError) {
                  setSmsError(null);
                }
                if (smsResent) {
                  setSmsResent(false);
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
            <FieldError>{smsError}</FieldError>
            {smsResent ? (
              <FieldDescription>
                We sent a new code to the number ending in {ending || "••••"}.
              </FieldDescription>
            ) : null}
          </Field>
          <Field orientation="horizontal" className="w-auto items-start gap-2">
            <Checkbox
              id="trust-device"
              checked={trustThisDevice}
              onCheckedChange={(checked) =>
                setTrustThisDevice(checked === true)
              }
            />
            <FieldLabel
              htmlFor="trust-device"
              className="text-sm font-normal tracking-[0.07px]"
            >
              Trust this device for 30 days
            </FieldLabel>
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Verify and sign in</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSmsCode("");
                setSmsError(null);
                setSmsResent(true);
              }}
            >
              Resend code
            </Button>
          </div>
        </FieldGroup>
      </form>
    );
  }

  if (step === "email-code") {
    return (
      <form
        className="flex w-full max-w-[640px] flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          continueAfterEmailCode();
        }}
      >
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Check your email
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          Enter the 6-digit code we sent to {email}.
        </p>
        <FieldGroup className="gap-5">
          <Field
            data-invalid={emailCodeError ? true : undefined}
            className="gap-2"
          >
            <FieldLabel htmlFor="sign-in-email-code">
              Six-digit email code
            </FieldLabel>
            <InputOTP
              id="sign-in-email-code"
              maxLength={6}
              value={emailCode}
              autoComplete="one-time-code"
              aria-invalid={emailCodeError ? true : undefined}
              onChange={(value) => {
                setEmailCode(value);
                if (emailCodeError) {
                  setEmailCodeError(null);
                }
                if (emailResent) {
                  setEmailResent(false);
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
            <FieldError>{emailCodeError}</FieldError>
            {emailResent ? (
              <FieldDescription>
                We sent a new code to {email}.
              </FieldDescription>
            ) : null}
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Continue</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEmailCode("");
                setEmailCodeError(null);
                setEmailResent(true);
              }}
            >
              Resend code
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStep("email");
                setEmailCode("");
                setEmailCodeError(null);
                setEmailResent(false);
              }}
            >
              Change email
            </Button>
          </div>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form
      className="flex w-full max-w-[640px] flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        sendEmailCode();
      }}
    >
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Partner sign-in
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        Use your work email to sign in. This is separate from creating a new
        account.
      </p>
      <FieldGroup className="gap-5">
        <Field data-invalid={emailError ? true : undefined} className="gap-2">
          <FieldLabel htmlFor="sign-in-email">Work email</FieldLabel>
          <Input
            id="sign-in-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            placeholder="user@example.com"
            aria-invalid={emailError ? true : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError(null);
              }
            }}
          />
          <FieldError>{emailError}</FieldError>
        </Field>
        <Button type="submit" className="w-fit" disabled={!isValidWorkEmail(email)}>
          Send code
        </Button>
      </FieldGroup>
    </form>
  );
}
