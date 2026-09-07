"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronDown, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { copyText } from "@/lib/copy-text";
import { publicDonationPath, publicDonationUrl } from "@/lib/page-urls";
import { cn } from "@/lib/utils";

export const DONATION_WIDGET_ID = "donation-widget";

export function scrollToDonationWidget() {
  document
    .getElementById(DONATION_WIDGET_ID)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const RAISED_SO_FAR = 0;
const DEFAULT_GOAL = 50000;

function formatDollars(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function parseGoal(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    return null;
  }
  return Number(digits);
}

export function DonationGoalSection({
  compact = false,
  publicView = false,
}: {
  compact?: boolean;
  publicView?: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [draft, setDraft] = useState(String(DEFAULT_GOAL));
  const [open, setOpen] = useState(false);
  const parsedDraft = parseGoal(draft);
  const canSave = parsedDraft !== null && parsedDraft > 0;
  const percent = goal > 0 ? Math.min(100, (RAISED_SO_FAR / goal) * 100) : 0;

  if (publicView && !visible) {
    return null;
  }

  return (
    <section className={sectionClass(compact)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[21px] leading-[28px] font-medium text-foreground">
          Donation Goal
        </h2>
        {publicView ? null : (
          <Field orientation="horizontal" className="w-auto shrink-0">
            <FieldLabel htmlFor="show-donation-goal" className="text-sm font-normal">
              Show
            </FieldLabel>
            <Switch
              id="show-donation-goal"
              checked={visible}
              onCheckedChange={setVisible}
            />
          </Field>
        )}
      </div>
      {visible ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-[28px] leading-[34px] font-medium text-foreground">
              {formatDollars(RAISED_SO_FAR)}{" "}
              <span className="text-sm font-normal tracking-[0.07px] text-muted-foreground">
                raised
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm tracking-[0.07px] text-muted-foreground">
                of {formatDollars(goal)} goal
              </p>
              {publicView ? null : (
                <button
                  type="button"
                  className="inline-flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label="Edit donation goal"
                  onClick={() => {
                    setDraft(String(goal));
                    setOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" />
                </button>
              )}
            </div>
          </div>
          <Progress value={percent} className="h-2.5" />
        </>
      ) : (
        <p className="text-sm tracking-[0.07px] text-muted-foreground">
          Hidden on the public page.
        </p>
      )}
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setDraft(String(goal));
          }
        }}
      >
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit donation goal</DialogTitle>
            <DialogDescription>
              Set the dollar amount this school is trying to raise.
            </DialogDescription>
          </DialogHeader>
          <Field className="gap-2">
            <FieldLabel htmlFor="donation-goal">Goal amount</FieldLabel>
            <Input
              id="donation-goal"
              inputMode="numeric"
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value.replace(/[^\d]/g, ""))
              }
            />
            <FieldDescription>Enter a whole-dollar amount.</FieldDescription>
          </Field>
          <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!canSave}
              onClick={() => {
                if (!canSave || parsedDraft === null) {
                  return;
                }
                setGoal(parsedDraft);
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

const HOW_IT_WORKS = [
  {
    step: "Step 1",
    title: "You give",
    body: "Make a gift to AFC Scholarship Fund designated to this school.",
  },
  {
    step: "Step 2",
    title: "AFC issues a scholarship",
    body: "AFC reviews your gift and issues a scholarship from it.",
  },
  {
    step: "Step 3",
    titlePrefix: "A student at ",
    titleSuffix: " is funded",
    body: "A student at this school receives scholarship support.",
  },
  {
    step: "Step 4",
    title: "You claim up to $1,700",
    body: "Eligible donors may claim a federal tax credit of up to $1,700.",
  },
] as const;

const STATE_OPTIONS = [
  "CA",
  "FL",
  "GA",
  "IL",
  "NC",
  "NY",
  "OH",
  "PA",
  "TX",
] as const;

function faqItems(schoolName: string) {
  return [
    {
      question: "Is this a deduction or a credit?",
      answer:
        "This gift may qualify for a federal tax credit of up to $1,700, not a deduction.",
    },
    {
      question: "When do I get the $1,700 back?",
      answer:
        "Eligible donors claim the credit when they file federal taxes. Treasury rules are pending.",
    },
    {
      question: `Does my gift stay with ${schoolName}?`,
      answer: `Yes. Your gift is credited to ${schoolName} through AFC Scholarship Fund.`,
    },
    {
      question: "What can a scholarship pay for?",
      answer:
        "Scholarships can cover tuition and qualified education expenses. Gifts are not designated to individual students.",
    },
    {
      question: "We file jointly — do we each get $1,700?",
      answer:
        "Joint filers should consult a tax advisor. This page is not tax or legal advice.",
    },
    {
      question: "Can I give monthly?",
      answer: "Yes. You can give one time or monthly.",
    },
  ];
}

export function HowItWorksSection({
  schoolName,
  compact = false,
}: {
  schoolName: string;
  compact?: boolean;
}) {
  return (
    <section className={sectionClass(compact)}>
      <h2 className="text-[21px] leading-[28px] font-medium text-foreground">
        How it works
      </h2>
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-1" : "grid-cols-4",
        )}
      >
        {HOW_IT_WORKS.map((item) => (
          <Card
            key={item.step}
            className="rounded-[4px] py-0 shadow-none"
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium tracking-[0.12px] text-muted-foreground uppercase">
                {item.step}
              </p>
              <p className="text-sm font-medium text-foreground">
                {"title" in item
                  ? item.title
                  : `${item.titlePrefix}${schoolName}${item.titleSuffix}`}
              </p>
              <p className="text-sm tracking-[0.07px] text-muted-foreground">
                {item.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CreditSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={sectionClass(compact)}>
      <h2 className="text-[21px] leading-[28px] font-medium text-foreground">
        A credit, not a deduction. That is a $1,292 difference.
      </h2>
      <div className={cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-2")}>
        <Card className="rounded-[4px] py-0 shadow-none">
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-xs font-medium tracking-[0.12px] text-muted-foreground uppercase">
              A $1,700 deduction
            </p>
            <p className="text-[28px] leading-[34px] font-medium text-muted-foreground">
              $408 back
            </p>
            <p className="text-sm tracking-[0.07px] text-muted-foreground">
              A charitable deduction returns a fraction of what you give.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[4px] py-0 shadow-none ring-2 ring-foreground">
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-xs font-medium tracking-[0.12px] text-foreground uppercase">
              A $1,700 EFTC credit
            </p>
            <p className="text-[28px] leading-[34px] font-medium text-foreground">
              $1,700 back
            </p>
            <p className="text-sm tracking-[0.07px] text-muted-foreground">
              Eligible donors may claim a federal tax credit of up to $1,700.
            </p>
          </CardContent>
        </Card>
      </div>
      <Button type="button" variant="outline" className="w-fit">
        Check what you would get back
      </Button>
    </section>
  );
}

export function ImpactSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={sectionClass(compact)}>
      <div
        className={cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-3")}
      >
        <StatCard value="$12,400" label="Raised for this school" />
        <StatCard value="18" label="Donors" />
        <Card className="rounded-[4px] border-dashed py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-1 p-5 text-center">
            <p className="text-base font-medium text-muted-foreground">
              Students funded
            </p>
            <p className="text-xs tracking-[0.12px] text-muted-foreground uppercase">
              Reporting opens 2027
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className={cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-4")}
      >
        {["Qualified SGO", "EIN 41-3421652", "Powered by Odyssey", "Audit trail"].map(
          (label) => (
            <Card key={label} className="rounded-[4px] py-0 shadow-none">
              <CardContent className="p-3 text-center text-xs font-medium tracking-[0.12px] text-muted-foreground uppercase">
                {label}
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </section>
  );
}

export function FaqAndCaptureSection({
  schoolName,
  compact = false,
}: {
  schoolName: string;
  compact?: boolean;
}) {
  const items = faqItems(schoolName);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={sectionClass(compact)}>
      <div
        className={cn(
          "grid items-start gap-6",
          compact ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-[21px] leading-[28px] font-medium text-foreground">
            Frequently asked questions
          </h2>
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <Card key={item.question} className="rounded-[4px] py-0 shadow-none">
                <CardContent className="p-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-foreground"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {item.question}
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  {open ? (
                    <p className="border-t border-border px-4 py-3 text-sm tracking-[0.07px] text-muted-foreground">
                      {item.answer}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <EmailCaptureCard />
      </div>
    </section>
  );
}

export function SharePageSection({
  slug,
  compact = false,
  publicView = false,
}: {
  slug: string;
  compact?: boolean;
  publicView?: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const shareUrl = useSyncExternalStore(
    () => () => {},
    () => `${window.location.origin}${publicDonationPath(slug)}`,
    () => publicDonationUrl(slug),
  );

  async function copyLink() {
    if (!(await copyText(shareUrl))) {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (publicView && !visible) {
    return null;
  }

  return (
    <section className={sectionClass(compact)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[21px] leading-[28px] font-medium text-foreground">
          Share this donation page
        </h2>
        {publicView ? null : (
          <Field orientation="horizontal" className="w-auto shrink-0">
            <FieldLabel htmlFor="show-share-page" className="text-sm font-normal">
              Show
            </FieldLabel>
            <Switch
              id="show-share-page"
              checked={visible}
              onCheckedChange={setVisible}
            />
          </Field>
        )}
      </div>
      {visible ? (
        <>
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            Copy a link to share this page with donors and families.
          </p>
          <p className="text-sm tracking-[0.07px] text-foreground break-all">
            {shareUrl}
          </p>
          <Button type="button" className="w-fit" onClick={copyLink}>
            {copied ? "Copied" : "Copy link"}
          </Button>
        </>
      ) : (
        <p className="text-sm tracking-[0.07px] text-muted-foreground">
          Hidden on the public page.
        </p>
      )}
    </section>
  );
}

export function ClosingSection({
  schoolName,
  compact = false,
}: {
  schoolName: string;
  compact?: boolean;
}) {
  return (
    <section className={cn(sectionClass(compact), "last:border-b-0")}>
      <div className="flex flex-col items-center gap-3 rounded-[4px] bg-foreground px-6 py-10 text-center text-background">
        <h2 className="text-[21px] leading-[28px] font-medium">
          One gift. One student. Up to $1,700 back.
        </h2>
        <p className="text-sm tracking-[0.07px] text-background/80">
          Give today and a student at {schoolName} is funded.
        </p>
        <Button
          type="button"
          className="bg-background text-foreground hover:bg-background/90"
          onClick={scrollToDonationWidget}
        >
          Give now
        </Button>
      </div>
      <div className="flex flex-col gap-2 rounded-[4px] border border-border p-4">
        <p className="text-xs font-medium tracking-[0.12px] text-foreground uppercase">
          AFC Scholarship Fund
        </p>
        <p className="text-xs tracking-[0.12px] text-muted-foreground">
          About · Funds · For schools &amp; SGOs · Privacy · Contact
        </p>
        <p className="text-xs tracking-[0.12px] text-muted-foreground">
          © 2027 AFC Scholarship Fund. EIN 41-3421652. Not tax or legal advice.{" "}
          {schoolName} is a partner of the AFC Scholarship Fund network — gifts
          are made to AFC Scholarship Fund.
        </p>
      </div>
    </section>
  );
}

function EmailCaptureCard() {
  const [state, setState] = useState("TX");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="rounded-[4px] py-0 shadow-none">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-medium text-foreground">
            Not ready to give today?
          </h3>
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            We will tell you when the credit opens.
          </p>
        </div>
        {submitted ? (
          <p className="text-sm tracking-[0.07px] text-foreground">
            Your information has been submitted.
          </p>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <FieldGroup className="grid grid-cols-2 gap-3">
              <Field className="col-span-2 gap-2">
                <FieldLabel htmlFor="capture-email">Email</FieldLabel>
                <Input
                  id="capture-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="capture-first">First name</FieldLabel>
                <Input
                  id="capture-first"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="capture-last">Last name</FieldLabel>
                <Input
                  id="capture-last"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Field>
              <Field className="col-span-2 gap-2">
                <FieldLabel htmlFor="capture-state">State</FieldLabel>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="capture-state" className="w-full">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <Button type="submit" className="w-full">
              Keep me informed
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="rounded-[4px] py-0 shadow-none">
      <CardContent className="flex flex-col items-center gap-1 p-5 text-center">
        <p className="text-[28px] leading-[34px] font-medium text-foreground">
          {value}
        </p>
        <p className="text-xs tracking-[0.12px] text-muted-foreground uppercase">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

function sectionClass(compact: boolean) {
  return cn(
    "flex flex-col gap-4 border-b border-border last:border-b-0",
    compact ? "px-5 py-6" : "px-8 py-8",
  );
}
