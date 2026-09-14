"use client";

import { useState } from "react";

import { FaqAccordion } from "@/components/faqs/faq-accordion";
import { NeedHelp } from "@/components/help/need-help";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MOCK_FAQS } from "@/lib/mock-faqs";

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export function PartnerFaqs({ helpEmail = "" }: { helpEmail?: string }) {
  const [search, setSearch] = useState("");
  const normalized = search.trim().toLowerCase();
  const faqs = normalized
    ? MOCK_FAQS.filter((faq) => matchesQuery(faq.question, normalized))
    : MOCK_FAQS;

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
            FAQs
          </h1>
          <p className="text-base leading-6 text-muted-foreground">
            Search questions about claiming a school, publishing, and support.
          </p>
        </div>
        <Field className="gap-2">
          <FieldLabel htmlFor="faqs-search">Search</FieldLabel>
          <Input
            id="faqs-search"
            type="search"
            value={search}
            placeholder="Search FAQs"
            onChange={(event) => setSearch(event.target.value)}
          />
        </Field>
      </div>

      {normalized.length > 0 && faqs.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-base leading-6 text-muted-foreground">
            No FAQs match “{search.trim()}”.
          </p>
          <NeedHelp
            email={helpEmail}
            label="Get help"
            variant="default"
            idPrefix="search-help"
          />
        </div>
      ) : (
        <FaqAccordion items={faqs} />
      )}
    </div>
  );
}
