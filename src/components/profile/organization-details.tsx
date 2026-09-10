"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { ProfileSection } from "@/components/profile/profile-section";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createOrganizationFee,
  RELIGIOUS_AFFILIATIONS,
  STUDENT_COUNT_RANGES,
} from "@/lib/organization-details";
import { useOrganizationDetails } from "@/lib/use-organization-details";

export function OrganizationDetailsSection({ schoolId }: { schoolId: string }) {
  const { details, update } = useOrganizationDetails(schoolId);
  const [saved, setSaved] = useState(false);
  const skipFirstSave = useRef(true);

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    setSaved(false);
    const timer = window.setTimeout(() => {
      setSaved(true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [details]);

  const marketplaceValue =
    details.marketplaceParticipates === true
      ? "yes"
      : details.marketplaceParticipates === false
        ? "no"
        : "";

  return (
    <ProfileSection
      title="Organizational Details"
      description="These fields are optional and do not block setup or publication."
      action={
        <p
          aria-live="polite"
          className="flex min-h-7 shrink-0 items-center gap-1 text-sm tracking-[0.07px] text-emerald-800"
        >
          {saved ? (
            <>
              <Check className="size-4" aria-hidden />
              Saved
            </>
          ) : null}
        </p>
      }
    >
      <FieldGroup className="gap-5">
        <Field className="gap-2">
          <FieldLabel htmlFor="org-tuition">Average annual tuition</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="org-tuition"
              inputMode="decimal"
              placeholder="0"
              value={details.averageAnnualTuition}
              onChange={(event) =>
                update({ averageAnnualTuition: event.target.value })
              }
            />
          </InputGroup>
        </Field>

        <Field className="gap-2">
          <FieldLabel>Fees</FieldLabel>
          <FieldDescription>
            Add any repeating fees, such as activity or registration fees.
          </FieldDescription>
          <div className="flex flex-col gap-3">
            {details.fees.map((fee, index) => (
              <div key={fee.id} className="flex flex-col gap-3 sm:flex-row">
                <Field className="gap-2">
                  <FieldLabel htmlFor={`org-fee-name-${fee.id}`}>
                    Fee name
                  </FieldLabel>
                  <Input
                    id={`org-fee-name-${fee.id}`}
                    value={fee.name}
                    placeholder="Activity fee"
                    onChange={(event) =>
                      update({
                        fees: details.fees.map((item) =>
                          item.id === fee.id
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      })
                    }
                  />
                </Field>
                <Field className="gap-2 sm:max-w-[160px]">
                  <FieldLabel htmlFor={`org-fee-amount-${fee.id}`}>
                    Amount
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id={`org-fee-amount-${fee.id}`}
                      inputMode="decimal"
                      placeholder="0"
                      value={fee.amount}
                      aria-label={`Amount for fee ${index + 1}`}
                      onChange={(event) =>
                        update({
                          fees: details.fees.map((item) =>
                            item.id === fee.id
                              ? { ...item, amount: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </InputGroup>
                </Field>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      update({
                        fees: details.fees.filter((item) => item.id !== fee.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() =>
                update({
                  fees: [...details.fees, createOrganizationFee()],
                })
              }
            >
              Add fee
            </Button>
          </div>
        </Field>

        <Field className="gap-2">
          <FieldLabel>Marketplace participation</FieldLabel>
          <RadioGroup
            value={marketplaceValue || undefined}
            onValueChange={(value) =>
              update({ marketplaceParticipates: value === "yes" })
            }
            className="flex w-full gap-5"
          >
            <Field orientation="horizontal" className="w-auto shrink-0 gap-1.5">
              <RadioGroupItem
                id="org-marketplace-yes"
                value="yes"
                className="border-border data-checked:border-foreground data-checked:bg-foreground [&_[data-slot=radio-group-indicator]>span]:hidden"
              />
              <FieldLabel
                htmlFor="org-marketplace-yes"
                className="text-sm font-normal tracking-[0.07px]"
              >
                Yes
              </FieldLabel>
            </Field>
            <Field orientation="horizontal" className="w-auto shrink-0 gap-1.5">
              <RadioGroupItem
                id="org-marketplace-no"
                value="no"
                className="border-border data-checked:border-foreground data-checked:bg-foreground [&_[data-slot=radio-group-indicator]>span]:hidden"
              />
              <FieldLabel
                htmlFor="org-marketplace-no"
                className="text-sm font-normal tracking-[0.07px]"
              >
                No
              </FieldLabel>
            </Field>
          </RadioGroup>
        </Field>

        {details.marketplaceParticipates === true ? (
          <Field className="gap-2">
            <FieldLabel htmlFor="org-marketplace-name">
              Marketplace name
            </FieldLabel>
            <Input
              id="org-marketplace-name"
              value={details.marketplaceName}
              placeholder="Marketplace name"
              onChange={(event) =>
                update({ marketplaceName: event.target.value })
              }
            />
          </Field>
        ) : null}

        <Field className="gap-2">
          <FieldLabel htmlFor="org-student-count">Student-count range</FieldLabel>
          <Select
            value={details.studentCountRange || undefined}
            onValueChange={(value) => update({ studentCountRange: value })}
          >
            <SelectTrigger
              id="org-student-count"
              className="w-full"
              aria-label="Student-count range"
            >
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {STUDENT_COUNT_RANGES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="org-affiliation">Religious affiliation</FieldLabel>
          <Select
            value={details.religiousAffiliation || undefined}
            onValueChange={(value) => update({ religiousAffiliation: value })}
          >
            <SelectTrigger
              id="org-affiliation"
              className="w-full"
              aria-label="Religious affiliation"
            >
              <SelectValue placeholder="Select an affiliation" />
            </SelectTrigger>
            <SelectContent>
              {RELIGIOUS_AFFILIATIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </ProfileSection>
  );
}
