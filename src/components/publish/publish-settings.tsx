"use client";

import { useState } from "react";
import Link from "next/link";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { School } from "@/lib/mock-schools";
import type { PartnerContext } from "@/lib/partner-context";

const PAGE_URL_BASE = "donations.afc.com/";

const PIXEL_PROVIDERS = [
  { value: "gtm", label: "GTM" },
  { value: "ga4", label: "GA4" },
  { value: "meta", label: "Meta" },
  { value: "microsoft-uet", label: "Microsoft UET" },
] as const;

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
  const [firstName, setFirstName] = useState(context.firstName);
  const [lastName, setLastName] = useState(context.lastName);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(context.email);
  const [pixelProvider, setPixelProvider] = useState<string>("gtm");
  const [pixelId, setPixelId] = useState("");
  const canPublish = path.trim().length > 0;

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
        Set the public URL and contact details for this donation page.
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
              value={firstName}
              autoComplete="given-name"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="contact-last-name">
              Contact last name
            </FieldLabel>
            <Input
              id="contact-last-name"
              value={lastName}
              autoComplete="family-name"
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </FieldGroup>

        <Field className="gap-2">
          <FieldLabel htmlFor="contact-phone">Contact phone number</FieldLabel>
          <Input
            id="contact-phone"
            type="tel"
            value={phone}
            autoComplete="tel"
            onChange={(event) => setPhone(event.target.value)}
          />
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="contact-email">Contact email address</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="tracking-pixel-id">Tracking pixel ID</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Select value={pixelProvider} onValueChange={setPixelProvider}>
                <SelectTrigger
                  size="sm"
                  className="h-auto border-0 bg-transparent py-0 pr-1 pl-0 shadow-none dark:bg-transparent"
                  aria-label="Tracking pixel provider"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIXEL_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroupAddon>
            <InputGroupInput
              id="tracking-pixel-id"
              value={pixelId}
              autoComplete="off"
              spellCheck={false}
              placeholder="Pixel ID"
              onChange={(event) => setPixelId(event.target.value)}
            />
          </InputGroup>
        </Field>

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
