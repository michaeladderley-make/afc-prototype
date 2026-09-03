"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LogoSlot } from "@/components/settings/logo-slot";
import { TrackingPixelField } from "@/components/settings/tracking-pixel-field";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  partnerQuery,
  type PartnerContext,
} from "@/lib/partner-context";
import { ROLE_OPTIONS } from "@/lib/school-roles";
import { useGlobalDefaults } from "@/lib/use-partner-settings";

export function PartnerProfile({ context }: { context: PartnerContext }) {
  const router = useRouter();
  const [role, setRole] = useState(context.role);
  const { settings, update } = useGlobalDefaults(context);

  function updateRole(nextRole: string) {
    setRole(nextRole);
    router.replace(
      `/profile?${partnerQuery({ ...context, role: nextRole })}`,
    );
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col items-stretch gap-10">
      <h1 className="text-left text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
        Profile
      </h1>
      <FieldGroup className="w-full gap-5">
        <FieldGroup className="flex-row gap-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="profile-first-name">First name</FieldLabel>
            <Input
              id="profile-first-name"
              value={context.firstName}
              readOnly
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="profile-last-name">Last name</FieldLabel>
            <Input id="profile-last-name" value={context.lastName} readOnly />
          </Field>
        </FieldGroup>
        <Field className="gap-2">
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <Input
            id="profile-email"
            type="email"
            value={context.email}
            readOnly
          />
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="profile-role">Role</FieldLabel>
          <Select value={role} onValueChange={updateRole}>
            <SelectTrigger
              id="profile-role"
              className="w-full"
              aria-label="Role"
            >
              <SelectValue placeholder="Principal, development officer, or other" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Defaults for donation pages</FieldLegend>
          <FieldDescription>
            These apply to every page unless you change them on that page.
          </FieldDescription>
          <FieldGroup className="mt-4 gap-5">
            <Field className="gap-2">
              <FieldLabel>School logo</FieldLabel>
              <LogoSlot
                added={settings.logo.added}
                stacked
                className="min-h-[120px] w-full"
                onChange={() => update({ logo: { added: true } })}
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel>Cover photo</FieldLabel>
              <LogoSlot
                added={settings.cover.added}
                stacked
                emptyLabel="Cover Photo"
                addedLabel="Cover photo added"
                className="aspect-[16/9] min-h-[160px] w-full"
                onChange={() => update({ cover: { added: true } })}
              />
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
              <FieldLabel htmlFor="contact-phone">
                Contact phone number
              </FieldLabel>
              <Input
                id="contact-phone"
                type="tel"
                value={settings.contact.phone}
                autoComplete="tel"
                onChange={(event) =>
                  update({ contact: { phone: event.target.value } })
                }
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="contact-email">
                Contact email address
              </FieldLabel>
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
              idPrefix="profile-pixel"
              values={settings.pixel}
              onChange={(pixel) => update({ pixel })}
              description="New pages inherit these IDs. A page only differs if you change it on that page."
            />
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
