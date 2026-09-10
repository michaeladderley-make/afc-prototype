"use client";

import { useEffect, useMemo, useState } from "react";

import { FaqAccordion } from "@/components/faqs/faq-accordion";
import { NeedHelp } from "@/components/help/need-help";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MOCK_FAQS } from "@/lib/mock-faqs";
import {
  upcomingCalendarItems,
  type CalendarItem,
} from "@/lib/mock-calendar";

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

function CalendarList({ items }: { items: CalendarItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-base leading-6 text-muted-foreground">
        No upcoming dates
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-6">
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-2">
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            {item.dateLabel}
          </p>
          <h3 className="text-base font-medium tracking-[0.07px] text-foreground">
            {item.title}
          </h3>
          <p className="text-base leading-6 text-muted-foreground">
            {item.description}
          </p>
          {item.href ? (
            <a
              href={item.href}
              className="w-fit text-sm tracking-[0.07px] text-foreground underline underline-offset-4"
            >
              {item.linkLabel ?? item.href}
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function FaqsAndCalendar({
  helpEmail = "",
  focusSection,
}: {
  helpEmail?: string;
  focusSection?: "faqs" | "calendar";
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const upcoming = useMemo(() => upcomingCalendarItems(), []);

  useEffect(() => {
    if (!focusSection) {
      return;
    }
    document.getElementById(focusSection)?.scrollIntoView({ block: "start" });
  }, [focusSection]);

  const faqs = normalized
    ? MOCK_FAQS.filter((faq) => matchesQuery(faq.question, normalized))
    : MOCK_FAQS;
  const events = normalized
    ? upcoming.filter((item) => matchesQuery(item.title, normalized))
    : upcoming;
  const noMatches = normalized.length > 0 && faqs.length === 0 && events.length === 0;

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
            FAQs & Calendar
          </h1>
          <p className="text-base leading-6 text-muted-foreground">
            Search questions and upcoming dates. Calendar items are listed with
            the soonest date first.
          </p>
        </div>
        <Field className="gap-2">
          <FieldLabel htmlFor="faqs-calendar-search">Search</FieldLabel>
          <Input
            id="faqs-calendar-search"
            type="search"
            value={query}
            placeholder="Search FAQs and Calendar"
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>
      </div>

      {noMatches ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-base leading-6 text-muted-foreground">
            No FAQs or calendar titles match “{query.trim()}”.
          </p>
          <NeedHelp
            email={helpEmail}
            label="Get help"
            variant="default"
            idPrefix="search-help"
          />
        </div>
      ) : (
        <>
          <section id="faqs" className="flex flex-col gap-5">
            <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
              FAQs
            </h2>
            {faqs.length > 0 ? (
              <FaqAccordion items={faqs} />
            ) : (
              <p className="text-base leading-6 text-muted-foreground">
                No matching FAQs.
              </p>
            )}
          </section>
          <section id="calendar" className="flex flex-col gap-5">
            <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
              Calendar
            </h2>
            <CalendarList items={events} />
          </section>
        </>
      )}
    </div>
  );
}
