"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { DonationFormElement } from "@/components/page-builder/donation-form";
import {
  ClosingSection,
  CreditSection,
  DonationGoalSection,
  DONATION_WIDGET_ID,
  FaqAndCaptureSection,
  HowItWorksSection,
  ImpactSection,
  SharePageSection,
  scrollToDonationWidget,
} from "@/components/page-builder/donation-page-modules";
import { LogoSlot } from "@/components/settings/logo-slot";
import { cn } from "@/lib/utils";
import type { PreviewMode } from "@/components/page-builder/preview-mode";
import type { School } from "@/lib/mock-schools";
import type { PartnerContext } from "@/lib/partner-context";
import { usePageDefaults } from "@/lib/use-partner-settings";

const WELCOME_STATEMENT_MAX_LENGTH = 80;
const SCHOOL_STORY_MAX_LENGTH = 300;

function schoolPlace(address: string) {
  const streetCity = address.split("·")[0]?.trim() ?? address;
  const parts = streetCity.split(",").map((part) => part.trim());
  if (parts.length < 2) {
    return streetCity;
  }
  const city = parts[parts.length - 2];
  const state = parts[parts.length - 1].split(/\s+/)[0];
  return `${city}, ${state}`;
}

function PlaceholderSlot({
  label,
  className,
  stacked = false,
}: {
  label: string;
  className?: string;
  stacked?: boolean;
}) {
  return (
    <Empty
      className={cn(
        "flex-none rounded-[4px] border border-dashed border-muted-foreground bg-muted",
        stacked ? "flex-col gap-2 p-3" : "flex-row gap-3 p-0",
        className,
      )}
    >
      <EmptyTitle className="text-xs font-medium tracking-normal text-muted-foreground">
        {label}
      </EmptyTitle>
      <EmptyContent className="w-auto max-w-none">
        <Button type="button" variant="outline" size="sm">
          Change
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function CanvasTextEditor({
  value,
  maxLength,
  dialogTitle,
  dialogDescription,
  fieldId,
  fieldLabel,
  sectionLabel,
  sectionAlign = "start",
  className,
  rows = 3,
}: {
  value: string;
  maxLength: number;
  dialogTitle: string;
  dialogDescription: string;
  fieldId: string;
  fieldLabel: string;
  sectionLabel: string;
  sectionAlign?: "start" | "center";
  className?: string;
  rows?: number;
}) {
  const [text, setText] = useState(value);
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  function openEditor() {
    setDraft(text);
    setOpen(true);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        sectionAlign === "center" && "items-center text-center",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5",
          sectionAlign === "center" && "justify-center",
        )}
      >
        <p className="text-xs font-medium text-muted-foreground">
          {sectionLabel}
        </p>
        <button
          type="button"
          className="inline-flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={dialogTitle}
          onClick={openEditor}
        >
          <Pencil className="size-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={openEditor}
        className={cn(
          "rounded-[4px] outline-none hover:outline hover:outline-dashed hover:outline-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        {text}
      </button>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setDraft(text);
          }
        }}
      >
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <Field className="gap-2">
            <FieldLabel htmlFor={fieldId}>{fieldLabel}</FieldLabel>
            <Textarea
              id={fieldId}
              value={draft}
              maxLength={maxLength}
              rows={rows}
              onChange={(event) => setDraft(event.target.value)}
            />
            <FieldDescription>
              {draft.length}/{maxLength} characters
            </FieldDescription>
          </Field>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={draft.trim().length === 0}
              onClick={() => {
                const nextText = draft.trim().slice(0, maxLength);
                if (!nextText) {
                  return;
                }
                setText(nextText);
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PageBuilderEdit({
  school,
  context,
  preview = "desktop",
}: {
  school: School;
  context: PartnerContext;
  preview?: PreviewMode;
}) {
  const isMobile = preview === "mobile";
  const place = schoolPlace(school.address);
  const { settings, update } = usePageDefaults(context, school.id);

  return (
    <div
      className={cn(
        "flex min-h-0",
        isMobile
          ? "h-full items-stretch justify-center px-6 py-10"
          : "flex-col items-center px-12 pt-10 pb-16",
      )}
    >
      <div
        className={cn(
          "bg-background",
          isMobile
            ? "flex h-full w-full max-w-[390px] flex-col overflow-y-auto rounded-[28px] border border-border"
            : "flex w-full max-w-[1000px] flex-col overflow-hidden rounded-[4px] border border-border",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b border-border",
            isMobile ? "flex-wrap px-5 py-4" : "px-8 py-4",
          )}
        >
          <p className="text-sm font-medium tracking-[0.07px] text-foreground">
            AFC
          </p>
          <span className="h-5 w-px bg-border" aria-hidden />
          <LogoSlot
            added={settings.logo.added}
            stacked
            className="h-16 w-[148px] shrink-0"
            onChange={() => update({ logo: { added: true } })}
          />
          <Button
            type="button"
            className="ml-auto"
            onClick={scrollToDonationWidget}
          >
            Give now
          </Button>
        </div>

        <section
          className={cn(
            "grid items-start gap-6 border-b border-border",
            isMobile ? "grid-cols-1 px-5 py-6" : "grid-cols-[1.1fr_0.9fr] px-8 py-8",
          )}
        >
          <div className="flex min-w-0 flex-col gap-4">
            <p className="text-xs tracking-[0.12px] text-muted-foreground">
              {school.name} · {place}
            </p>
            <CanvasTextEditor
              value={school.welcomeStatement}
              maxLength={WELCOME_STATEMENT_MAX_LENGTH}
              dialogTitle="Edit welcome statement"
              dialogDescription="This is the headline on the school’s public fundraising page."
              fieldId="welcome-statement"
              fieldLabel="Welcome statement"
              sectionLabel="Welcome Statement"
              className={cn(
                "text-left font-medium text-foreground",
                isMobile
                  ? "text-[28px] leading-8"
                  : "text-[32px] leading-[38px]",
              )}
            />
            <LogoSlot
              added={Boolean(settings.cover?.added)}
              emptyLabel="Cover Image"
              addedLabel="Cover photo added"
              className={
                isMobile
                  ? "aspect-[2/1] min-h-[140px] w-full shrink-0"
                  : "aspect-[16/9] min-h-[180px] w-full"
              }
              onChange={() => update({ cover: { added: true } })}
            />
            <p className="text-xs tracking-[0.12px] text-muted-foreground">
              Qualified SGO · EIN 41-3421652 · Powered by Odyssey · Gift is
              credited to {school.name}
            </p>
          </div>
          <div id={DONATION_WIDGET_ID} className="w-full min-w-0">
            <DonationFormElement
              className={isMobile ? "w-full max-w-none" : "ml-auto"}
            />
          </div>
        </section>

        <DonationGoalSection compact={isMobile} />
        <HowItWorksSection schoolName={school.name} compact={isMobile} />
        <CreditSection compact={isMobile} />

        <section
          className={cn(
            "grid items-center gap-6 border-b border-border",
            isMobile ? "grid-cols-1 px-5 py-6" : "grid-cols-2 px-8 py-8",
          )}
        >
          <div className="flex min-w-0 flex-col gap-4">
            <h2 className="text-[21px] leading-[28px] font-medium text-foreground">
              {school.name}
            </h2>
            <CanvasTextEditor
              value={school.schoolStory}
              maxLength={SCHOOL_STORY_MAX_LENGTH}
              dialogTitle="Edit school story"
              dialogDescription="This is the story visitors see on the school’s public fundraising page."
              fieldId="school-story"
              fieldLabel="School story"
              sectionLabel="School Story"
              rows={6}
              className="text-left text-base leading-6 text-foreground"
            />
          </div>
          <PlaceholderSlot
            label="School Photo"
            stacked
            className={
              isMobile
                ? "aspect-[4/3] min-h-[160px] w-full"
                : "aspect-[4/3] min-h-[200px] w-full"
            }
          />
        </section>

        <ImpactSection compact={isMobile} />
        <FaqAndCaptureSection schoolName={school.name} compact={isMobile} />
        <SharePageSection schoolId={school.id} compact={isMobile} />
        <ClosingSection schoolName={school.name} compact={isMobile} />
      </div>
    </div>
  );
}
