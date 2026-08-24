"use client";

import { useState } from "react";

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
import { cn } from "@/lib/utils";
import type { PreviewMode } from "@/components/page-builder/preview-mode";
import type { School } from "@/lib/mock-schools";

const WELCOME_STATEMENT_MAX_LENGTH = 80;
const SCHOOL_STORY_MAX_LENGTH = 300;

function PlaceholderSlot({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Empty
      className={cn(
        "flex-none flex-row gap-3 rounded-[4px] border border-dashed border-muted-foreground bg-muted p-0",
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
  className,
  rows = 3,
}: {
  value: string;
  maxLength: number;
  dialogTitle: string;
  dialogDescription: string;
  fieldId: string;
  fieldLabel: string;
  className?: string;
  rows?: number;
}) {
  const [text, setText] = useState(value);
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDraft(text);
          setOpen(true);
        }}
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
    </>
  );
}

export function PageBuilderEdit({
  school,
  preview = "desktop",
}: {
  school: School;
  preview?: PreviewMode;
}) {
  const isMobile = preview === "mobile";

  return (
    <div
      className={cn(
        "flex min-h-0",
        isMobile
          ? "h-full items-stretch justify-center px-6 py-10"
          : "flex-col px-12 pt-16 pb-16",
      )}
    >
      <div
        className={cn(
          isMobile
            ? "flex h-full w-full max-w-[390px] flex-col gap-5 overflow-hidden rounded-[28px] border border-border bg-background p-5"
            : "flex flex-col",
        )}
      >
        <div
          className={cn(
            "flex",
            isMobile ? "flex-col items-start gap-4" : "items-center gap-7",
          )}
        >
          <PlaceholderSlot
            label="School Logo"
            className={isMobile ? "size-[120px] shrink-0" : "size-[250px] shrink-0"}
          />
          <div
            className={cn(
              "flex min-w-0 flex-col gap-4",
              isMobile ? "w-full" : "flex-1",
            )}
          >
            <p className="text-xs font-medium text-muted-foreground">
              Welcome Statement
            </p>
            <CanvasTextEditor
              value={school.welcomeStatement}
              maxLength={WELCOME_STATEMENT_MAX_LENGTH}
              dialogTitle="Edit welcome statement"
              dialogDescription="This is the headline on the school’s public fundraising page."
              fieldId="welcome-statement"
              fieldLabel="Welcome statement"
              className={cn(
                "text-left font-bold text-foreground",
                isMobile ? "text-[28px] leading-8" : "text-[44px] leading-none",
              )}
            />
          </div>
          <DonationFormElement className={isMobile ? "max-w-none" : undefined} />
        </div>

        <PlaceholderSlot
          label="Cover Image"
          className={
            isMobile ? "min-h-[220px] w-full flex-1" : "mt-5 h-[500px] w-full"
          }
        />

        <div
          className={cn(
            "flex flex-col items-center gap-4 text-center",
            isMobile ? "w-full" : "mx-auto mt-12 w-full max-w-[747px]",
          )}
        >
          <p className="text-xs font-medium text-muted-foreground">
            School Story
          </p>
          <CanvasTextEditor
            value={school.schoolStory}
            maxLength={SCHOOL_STORY_MAX_LENGTH}
            dialogTitle="Edit school story"
            dialogDescription="This is the story visitors see on the school’s public fundraising page."
            fieldId="school-story"
            fieldLabel="School story"
            rows={6}
            className={cn(
              "text-center text-foreground",
              isMobile ? "text-base leading-6" : "text-[28px] leading-[1.4]",
            )}
          />
        </div>
      </div>
    </div>
  );
}
