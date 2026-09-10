"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isValidWorkEmail } from "@/lib/partnership-agreement";

export const SUPPORT_EMAIL = "support@afc.com";

export function NeedHelp({
  email = "",
  label = "Need help?",
  variant = "ghost",
  idPrefix = "help",
}: {
  email?: string;
  label?: string;
  variant?: "ghost" | "default";
  idPrefix?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [userEmail, setUserEmail] = useState(email);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const canSend = isValidWorkEmail(userEmail) && message.trim().length > 0;

  function resetForm() {
    setSent(false);
    setUserEmail(email);
    setMessage("");
    setEmailError(null);
    setMessageError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      resetForm();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextEmail = userEmail.trim();
    const nextMessage = message.trim();
    let invalid = false;
    if (!isValidWorkEmail(nextEmail)) {
      setEmailError("Enter a valid email so we can reply.");
      invalid = true;
    }
    if (!nextMessage) {
      setMessageError("Enter a message to send your request.");
      invalid = true;
    }
    if (invalid) {
      return;
    }
    setSent(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={
            variant === "ghost"
              ? "h-auto px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
              : undefined
          }
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[4px] sm:max-w-lg">
        {sent ? (
          <>
            <DialogHeader>
              <DialogTitle>Your request was sent</DialogTitle>
              <DialogDescription>
                We received your message. You can also reach us at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>Need help?</DialogTitle>
              <DialogDescription>
                Send a message to AFC support. We’ll get back to you by email.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="gap-5">
              <Field data-invalid={emailError ? true : undefined} className="gap-2">
                <FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
                <Input
                  id={`${idPrefix}-email`}
                  type="email"
                  required
                  autoComplete="email"
                  value={userEmail}
                  placeholder="you@school.edu"
                  aria-invalid={emailError ? true : undefined}
                  onChange={(event) => {
                    setUserEmail(event.target.value);
                    if (emailError) {
                      setEmailError(null);
                    }
                  }}
                />
                <FieldError>{emailError}</FieldError>
              </Field>
              <Field
                data-invalid={messageError ? true : undefined}
                className="gap-2"
              >
                <FieldLabel htmlFor={`${idPrefix}-message`}>Message</FieldLabel>
                <Textarea
                  id={`${idPrefix}-message`}
                  required
                  value={message}
                  placeholder="How can we help?"
                  aria-invalid={messageError ? true : undefined}
                  className="min-h-28"
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (messageError) {
                      setMessageError(null);
                    }
                  }}
                />
                <FieldError>{messageError}</FieldError>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button type="submit" disabled={!canSend}>
                Send request
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
