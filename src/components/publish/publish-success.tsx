"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { copyText } from "@/lib/copy-text";
import { liveDonationUrl, publicDonationPath } from "@/lib/page-urls";

export function PublishSuccess({
  schoolName,
  slug,
  query,
  globalsSaved = false,
}: {
  schoolName: string;
  slug: string;
  query: string;
  globalsSaved?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = liveDonationUrl(slug);

  async function copyUrl() {
    if (!(await copyText(shareUrl))) {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col items-start gap-5">
      <div className="flex items-center gap-2 text-foreground">
        <Check className="size-6" aria-hidden />
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px]">
          {schoolName} is live
        </h1>
      </div>
      <p className="text-base leading-6 text-muted-foreground">
        Congratulations — your donation page is published. Share this URL with
        donors and families.
      </p>
      <Field className="w-full gap-2">
        <FieldLabel htmlFor="published-url">Published URL</FieldLabel>
        <Input id="published-url" readOnly value={shareUrl} />
        {globalsSaved ? (
          <FieldDescription>
            These tracking pixel IDs are now your global settings, so every new
            page starts from them.
          </FieldDescription>
        ) : null}
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={copyUrl}>
          {copied ? "Copied" : "Copy URL"}
        </Button>
        <Button asChild variant="outline">
          <a href={publicDonationPath(slug)} target="_blank" rel="noreferrer">
            View page
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/page-builder?${query}`}>Edit page</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/pages?${query}`}>Back to Pages</Link>
        </Button>
      </div>
    </div>
  );
}
