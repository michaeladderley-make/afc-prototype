"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { downloadPartnershipAgreementPdf } from "@/lib/partnership-agreement-pdf";
import {
  isValidWorkEmail,
  PARTNERSHIP_AGREEMENT_COPY,
  partnershipInviteSignupHref,
} from "@/lib/partnership-agreement";
import { usePartnershipAgreement } from "@/lib/use-partnership-agreement";

export function PartnershipAgreementView({
  email,
  school,
  schoolName,
  firstName,
  lastName,
  returnHref,
}: {
  email: string;
  school: string;
  schoolName: string;
  firstName: string;
  lastName: string;
  returnHref: string;
}) {
  const router = useRouter();
  const { signed, signer, pendingInvite, approve, invite } =
    usePartnershipAgreement(email, school);
  const [hasAuthority, setHasAuthority] = useState(false);
  const [esignConsent, setEsignConsent] = useState(false);
  const [acceptsAgreement, setAcceptsAgreement] = useState(false);
  const [legalName, setLegalName] = useState(
    [firstName, lastName].filter(Boolean).join(" "),
  );
  const [title, setTitle] = useState("");
  const [inviteEmail, setInviteEmail] = useState(pendingInvite?.email ?? "");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSentTo, setInviteSentTo] = useState<string | null>(
    pendingInvite?.email ?? null,
  );

  useEffect(() => {
    if (!pendingInvite?.email) {
      return;
    }
    setInviteEmail(pendingInvite.email);
    setInviteSentTo(pendingInvite.email);
  }, [pendingInvite]);

  const canSign =
    hasAuthority &&
    esignConsent &&
    acceptsAgreement &&
    legalName.trim().length > 0 &&
    title.trim().length > 0;

  function handleSign() {
    if (!canSign) {
      return;
    }
    approve({ legalName: legalName.trim(), title: title.trim() });
    router.push(returnHref);
  }

  function handleInvite() {
    const nextEmail = inviteEmail.trim();
    if (!isValidWorkEmail(nextEmail)) {
      setInviteError("Enter a valid work email.");
      return;
    }
    if (nextEmail.toLowerCase() === email.toLowerCase()) {
      setInviteError("Enter a colleague’s email, not your own.");
      return;
    }
    invite(nextEmail);
    setInviteError(null);
    setInviteSentTo(nextEmail);
  }

  if (signed) {
    return (
      <div className="flex w-full max-w-[640px] flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
            Partnership Agreement
          </h1>
          <p className="text-base leading-6 text-muted-foreground">
            This agreement has been signed for {schoolName}.
          </p>
        </div>
        <div className="space-y-4 text-sm leading-6 tracking-[0.07px] text-foreground">
          {PARTNERSHIP_AGREEMENT_COPY.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {signer ? (
          <p className="text-sm tracking-[0.07px] text-foreground">
            Signed by {signer.legalName}, {signer.title}.
          </p>
        ) : (
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            You have already signed this agreement.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() =>
              downloadPartnershipAgreementPdf({
                schoolName,
                signer,
              })
            }
          >
            Download PDF
          </Button>
          <Button asChild variant="outline">
            <Link href={returnHref}>Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Partnership Agreement
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          Read the agreement, then sign it before publishing. You can skip this
          for now and keep setting up — publishing stays locked until someone
          with authority signs.
        </p>
      </div>

      <div className="space-y-4 text-sm leading-6 tracking-[0.07px] text-foreground">
        {PARTNERSHIP_AGREEMENT_COPY.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <FieldGroup className="gap-5">
        <FieldGroup className="flex-row gap-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="legal-name">Full legal name</FieldLabel>
            <Input
              id="legal-name"
              value={legalName}
              autoComplete="name"
              onChange={(event) => setLegalName(event.target.value)}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="org-title">Title</FieldLabel>
            <Input
              id="org-title"
              value={title}
              autoComplete="organization-title"
              placeholder="e.g. Athletic director"
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
        </FieldGroup>

        <Field orientation="horizontal" className="w-auto items-start gap-2">
          <Checkbox
            id="signing-authority"
            checked={hasAuthority}
            onCheckedChange={(checked) => setHasAuthority(checked === true)}
          />
          <FieldLabel
            htmlFor="signing-authority"
            className="text-sm font-normal tracking-[0.07px]"
          >
            I have signing authority for this partner organization.
          </FieldLabel>
        </Field>

        <Field orientation="horizontal" className="w-auto items-start gap-2">
          <Checkbox
            id="esign-consent"
            checked={esignConsent}
            onCheckedChange={(checked) => setEsignConsent(checked === true)}
          />
          <FieldLabel
            htmlFor="esign-consent"
            className="text-sm font-normal tracking-[0.07px]"
          >
            I consent to use an electronic signature on this agreement.
          </FieldLabel>
        </Field>

        <Field orientation="horizontal" className="w-auto items-start gap-2">
          <Checkbox
            id="accept-agreement"
            checked={acceptsAgreement}
            onCheckedChange={(checked) => setAcceptsAgreement(checked === true)}
          />
          <FieldLabel
            htmlFor="accept-agreement"
            className="text-sm font-normal tracking-[0.07px]"
          >
            I accept this Partnership Agreement.
          </FieldLabel>
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" disabled={!canSign} onClick={handleSign}>
            Sign agreement
          </Button>
          <Button asChild variant="outline">
            <Link href={returnHref}>Continue setup</Link>
          </Button>
        </div>
        <FieldDescription>
          Skipping lets you keep building the page. You still need a signed
          agreement before you can publish.
        </FieldDescription>
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup className="gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-medium tracking-[0.07px] text-foreground">
            Invite someone else to sign
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            If you do not have authority, invite a colleague. They go through
            the regular signup and onboarding, then sign this agreement.
          </p>
        </div>
        <Field className="gap-2">
          <FieldLabel htmlFor="invite-email">Colleague’s work email</FieldLabel>
          <Input
            id="invite-email"
            type="email"
            value={inviteEmail}
            autoComplete="email"
            placeholder="user@example.com"
            aria-invalid={inviteError ? true : undefined}
            onChange={(event) => {
              setInviteEmail(event.target.value);
              if (inviteError) {
                setInviteError(null);
              }
            }}
          />
          <FieldError>{inviteError}</FieldError>
        </Field>
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={handleInvite}
        >
          Send invite
        </Button>
        {inviteSentTo ? (
          <FieldDescription>
            Invite sent to {inviteSentTo}. In this prototype they start signup
            here:{" "}
            <Link
              href={partnershipInviteSignupHref(inviteSentTo)}
              className="underline underline-offset-3 hover:text-foreground"
            >
              Open invite signup
            </Link>
          </FieldDescription>
        ) : null}
      </FieldGroup>
    </div>
  );
}
