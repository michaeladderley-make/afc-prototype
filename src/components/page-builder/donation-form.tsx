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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DEFAULT_AMOUNTS = [40, 100, 200, 1000, 2500, 5000];
const MAX_ENABLED_CADENCES = 2;
const CADENCE_LIMIT_MESSAGE =
  "Only two cadences can be on at a time. Turn one off before turning another on.";

const CADENCES = [
  { value: "one-time", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

type Cadence = (typeof CADENCES)[number]["value"];

type CadenceSettings = {
  enabled: boolean;
  amounts: number[];
};

type CadenceDraft = {
  enabled: boolean;
  amounts: string[];
};

type CadenceMap<T> = Record<Cadence, T>;

function defaultSettings(): CadenceMap<CadenceSettings> {
  return {
    "one-time": { enabled: true, amounts: [...DEFAULT_AMOUNTS] },
    weekly: { enabled: false, amounts: [...DEFAULT_AMOUNTS] },
    monthly: { enabled: true, amounts: [...DEFAULT_AMOUNTS] },
  };
}

function toDraft(settings: CadenceMap<CadenceSettings>): CadenceMap<CadenceDraft> {
  return {
    "one-time": {
      enabled: settings["one-time"].enabled,
      amounts: settings["one-time"].amounts.map(String),
    },
    weekly: {
      enabled: settings.weekly.enabled,
      amounts: settings.weekly.amounts.map(String),
    },
    monthly: {
      enabled: settings.monthly.enabled,
      amounts: settings.monthly.amounts.map(String),
    },
  };
}

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

function amountsAreValid(amounts: string[]) {
  return amounts.every((value) => {
    const parsed = parseAmount(value);
    return parsed !== null && parsed > 0;
  });
}

export function DonationFormElement({
  className,
  publicView = false,
  schoolName,
}: {
  className?: string;
  publicView?: boolean;
  schoolName: string;
}) {
  const [cadences, setCadences] = useState(defaultSettings);
  const [frequency, setFrequency] = useState<Cadence>("one-time");
  const [amount, setAmount] = useState(DEFAULT_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState(String(DEFAULT_AMOUNTS[0]));
  const [dedicate, setDedicate] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [draft, setDraft] = useState(() => toDraft(defaultSettings()));
  const [cadenceLimitNotice, setCadenceLimitNotice] = useState<string | null>(
    null,
  );
  const [giftState, setGiftState] = useState<"idle" | "confirm" | "complete">(
    "idle",
  );

  const enabledCadences = CADENCES.filter(
    (cadence) => cadences[cadence.value].enabled,
  );
  const activeAmounts = cadences[frequency].amounts;
  const parsedDraft = CADENCES.map((cadence) => ({
    ...cadence,
    enabled: draft[cadence.value].enabled,
    amounts: draft[cadence.value].amounts.map(parseAmount),
  }));
  const enabledDrafts = parsedDraft.filter((cadence) => cadence.enabled);
  const canSave =
    enabledDrafts.length > 0 &&
    enabledDrafts.length <= MAX_ENABLED_CADENCES &&
    enabledDrafts.every((cadence) =>
      amountsAreValid(draft[cadence.value].amounts),
    );
  const atCadenceLimit = enabledDrafts.length >= MAX_ENABLED_CADENCES;
  const giftAmount = parseAmount(customAmount);
  const canDonate = giftAmount !== null && giftAmount > 0;
  const selectedCadence =
    CADENCES.find((cadence) => cadence.value === frequency)?.label ?? "One time";

  function setCadenceEnabled(cadence: Cadence, enabled: boolean) {
    if (enabled && !draft[cadence].enabled && atCadenceLimit) {
      setCadenceLimitNotice(CADENCE_LIMIT_MESSAGE);
      return;
    }

    setCadenceLimitNotice(null);
    setDraft((current) => ({
      ...current,
      [cadence]: {
        ...current[cadence],
        enabled,
      },
    }));
  }

  function closeManage() {
    setManageOpen(false);
    setCadenceLimitNotice(null);
  }

  function selectAmount(nextAmount: number) {
    setAmount(nextAmount);
    setCustomAmount(String(nextAmount));
  }

  function selectFrequency(nextFrequency: Cadence) {
    setFrequency(nextFrequency);
    const nextAmounts = cadences[nextFrequency].amounts;
    if (!nextAmounts.includes(amount)) {
      selectAmount(nextAmounts[0]);
    }
  }

  function openManage() {
    setDraft(toDraft(cadences));
    setCadenceLimitNotice(null);
    setManageOpen(true);
  }

  function saveManage() {
    if (!canSave) {
      return;
    }
    const nextCadences = {
      "one-time": {
        enabled: draft["one-time"].enabled,
        amounts: draft["one-time"].amounts.map(parseAmount) as number[],
      },
      weekly: {
        enabled: draft.weekly.enabled,
        amounts: draft.weekly.amounts.map(parseAmount) as number[],
      },
      monthly: {
        enabled: draft.monthly.enabled,
        amounts: draft.monthly.amounts.map(parseAmount) as number[],
      },
    } satisfies CadenceMap<CadenceSettings>;
    const nextEnabled = CADENCES.filter(
      (cadence) => nextCadences[cadence.value].enabled,
    );
    const nextFrequency = nextCadences[frequency].enabled
      ? frequency
      : nextEnabled[0].value;
    const nextAmounts = nextCadences[nextFrequency].amounts;

    setCadences(nextCadences);
    setFrequency(nextFrequency);
    if (!nextAmounts.includes(amount)) {
      selectAmount(nextAmounts[0]);
    }
    closeManage();
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-[360px] shrink-0 flex-col gap-2",
        className,
      )}
    >
      {publicView ? null : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-end"
          onClick={openManage}
        >
          Manage widget
        </Button>
      )}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 text-foreground">
        {enabledCadences.length > 0 ? (
          <div
            className={cn(
              "grid gap-2",
              enabledCadences.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {enabledCadences.map((cadence) => (
              <button
                key={cadence.value}
                type="button"
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium",
                  frequency === cadence.value
                    ? "border-foreground"
                    : "border-border",
                )}
                aria-pressed={frequency === cadence.value}
                onClick={() => selectFrequency(cadence.value)}
              >
                {cadence.value === "monthly" ? (
                  <Heart className="size-3.5 fill-current" />
                ) : null}
                {cadence.label}
              </button>
            ))}
          </div>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          Your most generous donation
        </p>

        <div className="grid grid-cols-3 gap-2">
          {activeAmounts.map((preset, index) => (
            <button
              key={`${frequency}-${preset}-${index}`}
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
              setAmount(activeAmounts.includes(nextAmount) ? nextAmount : 0);
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

        <div className="flex flex-col gap-1">
          <Button
            type="button"
            className="w-full"
            disabled={!canDonate}
            onClick={() => {
              if (!canDonate) {
                return;
              }
              setGiftState("confirm");
            }}
          >
            Donate and Support
          </Button>
          <p className="text-center text-xs tracking-[0.12px] text-muted-foreground">
            By donating, I agree to share my data
          </p>
        </div>
      </div>

      <Dialog
        open={manageOpen}
        onOpenChange={(open) => {
          if (open) {
            openManage();
            return;
          }
          closeManage();
        }}
      >
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage widget</DialogTitle>
            <DialogDescription>
              Choose which donation cadences appear and set suggested amounts
              for each one that is on. Up to two cadences can be on at a time.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="max-h-[min(60vh,520px)] gap-5 overflow-y-auto pr-1">
            {cadenceLimitNotice ? (
              <FieldError>{cadenceLimitNotice}</FieldError>
            ) : atCadenceLimit ? (
              <FieldDescription>
                Two cadences are on. Turn one off before turning another on.
              </FieldDescription>
            ) : null}
            {CADENCES.map((cadence, index) => {
              const settings = draft[cadence.value];
              const switchId = `show-${cadence.value}`;
              return (
                <div key={cadence.value} className="flex flex-col gap-5">
                  {index > 0 ? <FieldSeparator /> : null}
                  <Field orientation="horizontal">
                    <FieldLabel htmlFor={switchId} className="flex-1">
                      {cadence.label}
                    </FieldLabel>
                    <Switch
                      id={switchId}
                      checked={settings.enabled}
                      aria-invalid={
                        Boolean(cadenceLimitNotice) && !settings.enabled
                      }
                      onCheckedChange={(checked) =>
                        setCadenceEnabled(cadence.value, checked === true)
                      }
                    />
                  </Field>
                  {settings.enabled ? (
                    <Field className="gap-2">
                      <FieldLabel>Suggested amounts</FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {settings.amounts.map((value, amountIndex) => (
                          <Input
                            key={`${cadence.value}-${amountIndex}`}
                            inputMode="numeric"
                            aria-label={`${cadence.label} suggested amount ${amountIndex + 1}`}
                            value={value}
                            onChange={(event) => {
                              const nextValue = event.target.value.replace(
                                /[^\d]/g,
                                "",
                              );
                              setDraft((current) => ({
                                ...current,
                                [cadence.value]: {
                                  ...current[cadence.value],
                                  amounts: current[cadence.value].amounts.map(
                                    (amountValue, currentIndex) =>
                                      currentIndex === amountIndex
                                        ? nextValue
                                        : amountValue,
                                  ),
                                },
                              }));
                            }}
                          />
                        ))}
                      </div>
                      <FieldDescription>
                        Enter a whole-dollar amount for each preset.
                      </FieldDescription>
                    </Field>
                  ) : (
                    <FieldDescription>
                      Turn this on to show {cadence.label.toLowerCase()} on the
                      donation form and set suggested amounts.
                    </FieldDescription>
                  )}
                </div>
              );
            })}
            {enabledDrafts.length === 0 ? (
              <FieldDescription>
                Turn on at least one cadence to save.
              </FieldDescription>
            ) : null}
          </FieldGroup>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeManage}
            >
              Cancel
            </Button>
            <Button type="button" disabled={!canSave} onClick={saveManage}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={giftState !== "idle"}
        onOpenChange={(open) => {
          if (!open) {
            setGiftState("idle");
          }
        }}
      >
        <DialogContent className="rounded-[4px] sm:max-w-md">
          {giftState === "complete" ? (
            <>
              <DialogHeader>
                <DialogTitle>Thank you</DialogTitle>
                <DialogDescription>
                  Your {selectedCadence.toLowerCase()} gift of $
                  {formatAmount(giftAmount ?? 0)} to {schoolName} has been
                  recorded for this prototype. No payment was taken.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" onClick={() => setGiftState("idle")}>
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm your gift</DialogTitle>
                <DialogDescription>
                  Give ${formatAmount(giftAmount ?? 0)}{" "}
                  {selectedCadence.toLowerCase()} to {schoolName}? This is a
                  prototype — no card or payment information is collected.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGiftState("idle")}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={() => setGiftState("complete")}>
                  Confirm gift
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
