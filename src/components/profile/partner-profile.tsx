"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OrganizationDetailsSection } from "@/components/profile/organization-details";
import { ProfileSection } from "@/components/profile/profile-section";
import { PartnershipAgreementPrompt } from "@/components/partnership/partnership-agreement-prompt";
import { SmsSecurityPrompt } from "@/components/sms-security/sms-security-prompt";
import { LogoSlot } from "@/components/settings/logo-slot";
import { TrackingPixelField } from "@/components/settings/tracking-pixel-field";
import {
  Field,
  FieldGroup,
  FieldLabel,
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
      <div className="flex flex-col gap-5">
        <h1 className="text-left text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Profile
        </h1>
        <PartnershipAgreementPrompt
          email={context.email}
          school={context.school}
          query={partnerQuery(context)}
          from="profile"
        />
        <SmsSecurityPrompt
          email={context.email}
          query={partnerQuery(context)}
          from="profile"
        />
      </div>
      <div className="flex w-full flex-col gap-10">
        <ProfileSection
          title="Contact Info"
          description="Your account details and the contact shown on donation pages."
        >
          <FieldGroup className="gap-5">
            <p className="text-sm font-medium tracking-[0.07px] text-foreground">
              Account
            </p>
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
                <Input
                  id="profile-last-name"
                  value={context.lastName}
                  readOnly
                />
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
            <p className="pt-2 text-sm font-medium tracking-[0.07px] text-foreground">
              Donation page contact
            </p>
            <FieldGroup className="flex-row gap-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="contact-first-name">First name</FieldLabel>
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
                <FieldLabel htmlFor="contact-last-name">Last name</FieldLabel>
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
              <FieldLabel htmlFor="contact-phone">Phone number</FieldLabel>
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
              <FieldLabel htmlFor="contact-email">Email address</FieldLabel>
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
          </FieldGroup>
        </ProfileSection>

        <OrganizationDetailsSection schoolId={context.school} />

        <ProfileSection
          title="Page Defaults"
          description="These apply to every page unless you change them on that page."
        >
          <FieldGroup className="gap-5">
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
            <TrackingPixelField
              idPrefix="profile-pixel"
              values={settings.pixel}
              onChange={(pixel) => update({ pixel })}
              description="These are your Portal defaults. New pages start from them. Changing IDs on a page does not change these defaults."
            />
          </FieldGroup>
        </ProfileSection>
      </div>
    </div>
  );
}
