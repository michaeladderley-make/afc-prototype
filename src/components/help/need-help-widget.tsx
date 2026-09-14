"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getNeedHelpEmail,
  getNeedHelpOpen,
  setNeedHelpEmail,
  setNeedHelpOpen,
  subscribeNeedHelp,
} from "@/lib/need-help";
import { isValidWorkEmail } from "@/lib/partnership-agreement";
import { getAnyPartnerSession } from "@/lib/partner-session";

export const SUPPORT_EMAIL = "support@afc.com";

export function NeedHelpWidget() {
  const searchParams = useSearchParams();
  const open = useSyncExternalStore(
    subscribeNeedHelp,
    getNeedHelpOpen,
    () => false,
  );
  const storedEmail = useSyncExternalStore(
    subscribeNeedHelp,
    getNeedHelpEmail,
    () => "",
  );
  const [sent, setSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const canSend = isValidWorkEmail(userEmail) && message.trim().length > 0;

  useEffect(() => {
    const queryEmail = searchParams.get("email")?.trim() ?? "";
    const sessionEmail = getAnyPartnerSession()?.email ?? "";
    if (!getNeedHelpEmail()) {
      setNeedHelpEmail(queryEmail || sessionEmail);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSent(false);
    setUserEmail(storedEmail);
    setMessage("");
    setEmailError(null);
    setMessageError(null);
  }, [open, storedEmail]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNeedHelpOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
    <div className="fixed right-5 bottom-5 z-[80] flex flex-col items-end gap-3">
      {open ? (
        <section
          id="need-help-popout"
          aria-label="Need help"
          className="w-[min(22.5rem,calc(100vw-2.5rem))] rounded-[4px] border border-border bg-background p-5 shadow-lg"
        >
          {sent ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-medium tracking-[0.07px] text-foreground">
                    Your request was sent
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    We received your message. You can also reach us at{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="underline underline-offset-3"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close help"
                  onClick={() => setNeedHelpOpen(false)}
                >
                  <X />
                </Button>
              </div>
              <Button type="button" onClick={() => setNeedHelpOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={submit}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-medium tracking-[0.07px] text-foreground">
                    Need help?
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Send a message to AFC support. We’ll get back to you by
                    email.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close help"
                  onClick={() => setNeedHelpOpen(false)}
                >
                  <X />
                </Button>
              </div>
              <FieldGroup className="gap-4">
                <Field
                  data-invalid={emailError ? true : undefined}
                  className="gap-2"
                >
                  <FieldLabel htmlFor="help-email">Email</FieldLabel>
                  <Input
                    id="help-email"
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
                  <FieldLabel htmlFor="help-message">Message</FieldLabel>
                  <Textarea
                    id="help-message"
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
              <Button type="submit" disabled={!canSend}>
                Send request
              </Button>
            </form>
          )}
        </section>
      ) : null}
      <Button
        type="button"
        size="icon-lg"
        aria-expanded={open}
        aria-controls="need-help-popout"
        aria-label={open ? "Close help" : "Need help?"}
        className="size-14 rounded-full shadow-lg"
        onClick={() => setNeedHelpOpen(!open)}
      >
        {open ? <X /> : <MessageCircle />}
      </Button>
    </div>
  );
}
