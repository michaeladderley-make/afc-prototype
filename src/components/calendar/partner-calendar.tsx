"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CalendarBoard,
  CalendarBoardSkeleton,
  type CalendarView,
} from "@/components/calendar/calendar-board";
import { NeedHelp } from "@/components/help/need-help";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

export function PartnerCalendar({ helpEmail = "" }: { helpEmail?: string }) {
  const [today, setToday] = useState<Date | null>(null);
  const [cursor, setCursor] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>("month");

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCursor(now);
  }, []);
  const [search, setSearch] = useState("");
  const normalized = search.trim().toLowerCase();
  const upcoming = useMemo(() => upcomingCalendarItems(), []);
  const events = normalized
    ? upcoming.filter((item) => matchesQuery(item.title, normalized))
    : upcoming;

  return (
    <div className="flex w-full max-w-[1100px] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Calendar
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          Upcoming dates, listed with the soonest date first.
        </p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        {today && cursor ? (
          <CalendarBoard
            items={upcoming}
            cursor={cursor}
            view={view}
            today={today}
            onCursorChange={setCursor}
            onViewChange={setView}
          />
        ) : (
          <CalendarBoardSkeleton />
        )}

        <section className="flex min-w-0 flex-col gap-5">
          <Field className="gap-2">
            <FieldLabel htmlFor="calendar-search">Search</FieldLabel>
            <Input
              id="calendar-search"
              type="search"
              value={search}
              placeholder="Search calendar"
              onChange={(event) => setSearch(event.target.value)}
            />
          </Field>

          {normalized.length > 0 && events.length === 0 ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-base leading-6 text-muted-foreground">
                No calendar titles match “{search.trim()}”.
              </p>
              <NeedHelp
                email={helpEmail}
                label="Get help"
                variant="default"
                idPrefix="calendar-help"
              />
            </div>
          ) : (
            <CalendarList items={events} />
          )}
        </section>
      </div>
    </div>
  );
}
