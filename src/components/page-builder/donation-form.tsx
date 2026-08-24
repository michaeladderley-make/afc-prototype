"use client";

import { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DEFAULT_AMOUNTS = [40, 100, 200, 1000, 2500, 5000];

function formatAmount(value: number) {
  return value.toLocaleString("en-US");
}

function parseAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    return null;
  }
  return Number(digits);
}

export function DonationFormElement({ className }: { className?: string }) {
  const [frequency, setFrequency] = useState<"one-time" | "monthly">(
    "one-time",
  );
  const [showMonthly, setShowMonthly] = useState(true);
  const [amounts, setAmounts] = useState(DEFAULT_AMOUNTS);
  const [amount, setAmount] = useState(DEFAULT_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState(String(DEFAULT_AMOUNTS[0]));
  const [dedicate, setDedicate] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [draftShowMonthly, setDraftShowMonthly] = useState(true);
  const [draftAmounts, setDraftAmounts] = useState(
    DEFAULT_AMOUNTS.map((value) => String(value)),
  );

  const parsedDraftAmounts = draftAmounts.map(parseAmount);
  const canSave = parsedDraftAmounts.every(
    (value) => value !== null && value > 0,
  );

  function selectAmount(nextAmount: number) {
    setAmount(nextAmount);
    setCustomAmount(String(nextAmount));
  }

  function openManage() {
    setDraftShowMonthly(showMonthly);
    setDraftAmounts(amounts.map((value) => String(value)));
    setManageOpen(true);
  }

  function saveManage() {
    if (!canSave) {
      return;
    }
    const nextAmounts = parsedDraftAmounts as number[];
    setShowMonthly(draftShowMonthly);
    setAmounts(nextAmounts);

    if (!draftShowMonthly) {
      setFrequency("one-time");
    }

    if (!nextAmounts.includes(amount)) {
      selectAmount(nextAmounts[0]);
    }
    setManageOpen(false);
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-[360px] shrink-0 flex-col gap-2",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-end"
        onClick={openManage}
      >
        Manage widget
      </Button>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 text-foreground">
        {showMonthly ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium",
                frequency === "one-time"
                  ? "border-foreground"
                  : "border-border",
              )}
              aria-pressed={frequency === "one-time"}
              onClick={() => setFrequency("one-time")}
            >
              One time
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium",
                frequency === "monthly"
                  ? "border-foreground"
                  : "border-border",
              )}
              aria-pressed={frequency === "monthly"}
              onClick={() => setFrequency("monthly")}
            >
              <Heart className="size-3.5 fill-current" />
              Monthly
            </button>
          </div>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          Your most generous donation
        </p>

        <div className="grid grid-cols-3 gap-2">
          {amounts.map((preset, index) => (
            <button
              key={`${preset}-${index}`}
              type="button"
              className={cn(
                "rounded-md border py-3 text-sm font-medium",
                amount === preset ? "border-foreground" : "border-border",
              )}
              aria-pressed={amount === preset}
              onClick={() => selectAmount(preset)}
            >
              ${formatAmount(preset)}
            </button>
          ))}
        </div>

        <div className="flex items-center rounded-md border border-border px-3 py-2">
          <span className="text-xl font-semibold">$</span>
          <input
            aria-label="Donation amount"
            className="min-w-0 flex-1 bg-transparent px-2 text-xl font-semibold text-foreground outline-none"
            value={customAmount}
            onChange={(event) => {
              const nextValue = event.target.value.replace(/[^\d]/g, "");
              setCustomAmount(nextValue);
              const nextAmount = Number(nextValue);
              setAmount(amounts.includes(nextAmount) ? nextAmount : 0);
            }}
          />
          <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            USD
            <ChevronDown className="size-4" />
          </span>
        </div>

        <Label className="font-normal text-foreground">
          <Checkbox
            checked={dedicate}
            onCheckedChange={(checked) => setDedicate(checked === true)}
          />
          Dedicate this donation
        </Label>

        <button
          type="button"
          className="w-fit text-sm text-muted-foreground underline underline-offset-2"
        >
          Add Comment
        </button>

        <Button type="button" className="w-full">
          Donate and Support
        </Button>
      </div>

      <Dialog
        open={manageOpen}
        onOpenChange={(open) => {
          setManageOpen(open);
          if (open) {
            setDraftShowMonthly(showMonthly);
            setDraftAmounts(amounts.map((value) => String(value)));
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage widget</DialogTitle>
            <DialogDescription>
              Choose whether monthly giving appears and set the suggested
              amounts.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-5">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="show-monthly" className="flex-1">
                Monthly
              </FieldLabel>
              <Switch
                id="show-monthly"
                checked={draftShowMonthly}
                onCheckedChange={setDraftShowMonthly}
              />
            </Field>
            <FieldDescription>
              Show One time and Monthly on the donation form. Turn this off to
              hide that choice.
            </FieldDescription>
            <Field className="gap-2">
              <FieldLabel>Suggested amounts</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {draftAmounts.map((value, index) => (
                  <Input
                    key={index}
                    inputMode="numeric"
                    aria-label={`Suggested amount ${index + 1}`}
                    value={value}
                    onChange={(event) => {
                      const nextValue = event.target.value.replace(
                        /[^\d]/g,
                        "",
                      );
                      setDraftAmounts((current) =>
                        current.map((amountValue, amountIndex) =>
                          amountIndex === index ? nextValue : amountValue,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
              <FieldDescription>
                Enter a whole-dollar amount for each preset.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setManageOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={!canSave} onClick={saveManage}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
