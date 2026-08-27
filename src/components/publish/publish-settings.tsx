"use client";

import { useState } from "react";
import Link from "next/link";

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
import type { PartnerContext } from "@/lib/partner-context";
import {
  isContactOverridden,
  isPixelOverridden,
} from "@/lib/partner-settings";
import { usePageDefaults } from "@/lib/use-partner-settings";

const PAGE_URL_BASE = "donations.afc.com/";

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
  const { settings, override, update } = usePageDefaults(context, school.id);
  const canPublish = path.trim().length > 0;
  const contactHint = isContactOverridden(override)
    ? "Custom for this page. Profile still holds the default."
    : "Default from Profile. Edits apply to this page only.";
  const pixelHint = isPixelOverridden(override)
    ? "Custom for this page. Profile still holds the default."
    : "Default from Profile. Edits apply to this page only.";

  return (
    <form
      className="flex w-full max-w-[640px] flex-col items-start gap-5"
      onSubmit={(event) => {
        event.preventDefault();
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
        />

        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href={`/page-builder?${query}`}>Edit page</Link>
          </Button>
          <Button type="submit" disabled={!canPublish}>
            Publish
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
