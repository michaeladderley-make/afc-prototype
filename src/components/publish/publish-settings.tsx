"use client";

import { useState } from "react";
import Link from "next/link";

import { PartnershipAgreementPrompt } from "@/components/partnership/partnership-agreement-prompt";
import { SmsSecurityPrompt } from "@/components/sms-security/sms-security-prompt";
import { PublishSuccess } from "@/components/publish/publish-success";
import { TrackingPixelField } from "@/components/settings/tracking-pixel-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import type { School } from "@/lib/mock-schools";
import { PAGE_URL_BASE } from "@/lib/page-urls";
import type { PartnerContext } from "@/lib/partner-context";
import { usePartnershipAgreement } from "@/lib/use-partnership-agreement";
import { useSmsSecurity } from "@/lib/use-sms-security";
import {
  clearPagePixelOverride,
  establishGlobalPixels,
  hasAnyPixelId,
  isContactOverridden,
  isPixelOverridden,
} from "@/lib/partner-settings";
import { usePartnerPages } from "@/lib/use-partner-pages";
import { usePageDefaults } from "@/lib/use-partner-settings";

function sanitizePath(value: string) {
  return value.replace(/^\/*/, "").replace(/\s+/g, "-");
}

export function PublishSettings({
  school,
  context,
  query,
}: {
  school: School;
  context: PartnerContext;
  query: string;
}) {
  const [path, setPath] = useState(school.id);
  const [publishState, setPublishState] = useState<
    "idle" | "published" | "globals-saved"
  >("idle");
  const { settings, globalSettings, override, update } = usePageDefaults(
    context,
    school.id,
  );
  const { signed } = usePartnershipAgreement(context.email, school.id);
  const { complete: smsComplete } = useSmsSecurity(context.email);
  const { publishPage } = usePartnerPages();
  const canPublish = path.trim().length > 0 && signed && smsComplete;
  const contactHint = isContactOverridden(override)
    ? "Custom for this page. Profile still holds the default."
    : "Default from Profile. Edits apply to this page only.";
  const hasGlobalPixels = hasAnyPixelId(globalSettings.pixel);
  const pixelInherited = hasGlobalPixels && !isPixelOverridden(override);
  const pixelHint = pixelInherited
    ? "Inherited from your global tracking settings. Change these only if this page needs different IDs."
    : hasGlobalPixels
      ? "Custom for this page. Your global tracking settings stay as they are."
      : "These become your global tracking settings when you publish, and every new page will start from them.";

  function customizePixels() {
    setPublishState("idle");
    update({ pixel: settings.pixel });
  }

  function resetPixels() {
    setPublishState("idle");
    clearPagePixelOverride(school.id);
  }

  function publish() {
    if (!canPublish) {
      return;
    }
    const slug = path.trim();
    if (!hasGlobalPixels && hasAnyPixelId(settings.pixel)) {
      establishGlobalPixels(context, school.id, settings.pixel);
      publishPage(school, slug);
      setPublishState("globals-saved");
      return;
    }
    publishPage(school, slug);
    setPublishState("published");
  }

  if (publishState !== "idle") {
    return (
      <PublishSuccess
        schoolName={school.name}
        slug={path.trim()}
        query={query}
        globalsSaved={publishState === "globals-saved"}
      />
    );
  }

  return (
    <form
      className="flex w-full max-w-[640px] flex-col items-start gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        publish();
      }}
    >
      <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Publish {school.name}
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        Set the public URL for this page. Contact and tracking start from your
        Profile defaults.
      </p>

      <FieldGroup className="w-full gap-5">
        <Field className="gap-2">
          <FieldLabel htmlFor="page-url-path">URL path</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>{PAGE_URL_BASE}</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="page-url-path"
              value={path}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setPath(sanitizePath(event.target.value))}
            />
          </InputGroup>
          <FieldDescription>
            {PAGE_URL_BASE}
            {path.trim() || "your-path"}
          </FieldDescription>
        </Field>

        <FieldGroup className="flex-row gap-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="contact-first-name">
              Contact first name
            </FieldLabel>
            <Input
              id="contact-first-name"
              value={settings.contact.firstName}
              autoComplete="given-name"
              onChange={(event) =>
                update({ contact: { firstName: event.target.value } })
              }
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="contact-last-name">
              Contact last name
            </FieldLabel>
            <Input
              id="contact-last-name"
              value={settings.contact.lastName}
              autoComplete="family-name"
              onChange={(event) =>
                update({ contact: { lastName: event.target.value } })
              }
            />
          </Field>
        </FieldGroup>

        <Field className="gap-2">
          <FieldLabel htmlFor="contact-phone">Contact phone number</FieldLabel>
          <Input
            id="contact-phone"
            type="tel"
            value={settings.contact.phone}
            autoComplete="tel"
            onChange={(event) =>
              update({ contact: { phone: event.target.value } })
            }
          />
          <FieldDescription>{contactHint}</FieldDescription>
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="contact-email">Contact email address</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            value={settings.contact.email}
            autoComplete="email"
            onChange={(event) =>
              update({ contact: { email: event.target.value } })
            }
          />
        </Field>

        <TrackingPixelField
          idPrefix="page-pixel"
          values={settings.pixel}
          onChange={(pixel) => update({ pixel })}
          description={pixelHint}
          inherited={pixelInherited}
          onCustomize={customizePixels}
          onReset={hasGlobalPixels ? resetPixels : undefined}
        />

        <div className="flex w-full flex-col gap-5">
          <SmsSecurityPrompt
            email={context.email}
            query={query}
            from="publish"
            tone="warning"
          />
          <PartnershipAgreementPrompt
            email={context.email}
            school={school.id}
            query={query}
            from="publish"
            tone="warning"
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link href={`/page-builder?${query}`}>Edit page</Link>
              </Button>
              <Button type="submit" disabled={!canPublish}>
                Publish
              </Button>
            </div>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
