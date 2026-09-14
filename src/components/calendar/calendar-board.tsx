"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  formatDateKey,
  isSameDay,
  itemsOnDate,
  type CalendarItem,
} from "@/lib/mock-calendar";
import { cn } from "@/lib/utils";

export type CalendarView = "day" | "week" | "month";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfWeek(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function monthCells(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function weekCells(cursor: Date) {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function shiftCursor(cursor: Date, view: CalendarView, direction: -1 | 1) {
  const next = new Date(cursor);
  if (view === "day") {
    next.setDate(next.getDate() + direction);
  } else if (view === "week") {
    next.setDate(next.getDate() + 7 * direction);
  } else {
    next.setMonth(next.getMonth() + direction);
  }
  return next;
}

function rangeLabel(cursor: Date, view: CalendarView) {
  if (view === "day") {
    return cursor.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  if (view === "week") {
    const start = startOfWeek(cursor);
    const end = addDays(start, 6);
    const startLabel = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endLabel = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startLabel} – ${endLabel}`;
  }
  return cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function EventChip({ item }: { item: CalendarItem }) {
  return (
    <p className="truncate text-xs leading-4 tracking-[0.12px] text-foreground">
      {item.title}
    </p>
  );
}

export function CalendarBoardSkeleton() {
  return (
    <section className="flex min-w-0 flex-col gap-4" aria-hidden>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md border border-border" />
          <div className="size-8 rounded-md border border-border" />
          <div className="h-8 w-16 rounded-md border border-border" />
          <div className="h-5 w-36" />
        </div>
        <div className="h-9 w-48 rounded-md border border-border" />
      </div>
      <div className="min-h-[420px] rounded-[4px] border border-border" />
    </section>
  );
}

export function CalendarBoard({
  items,
  cursor,
  view,
  today,
  onCursorChange,
  onViewChange,
}: {
  items: CalendarItem[];
  cursor: Date;
  view: CalendarView;
  today: Date;
  onCursorChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Previous"
            onClick={() => onCursorChange(shiftCursor(cursor, view, -1))}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Next"
            onClick={() => onCursorChange(shiftCursor(cursor, view, 1))}
          >
            <ChevronRight />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCursorChange(today)}
          >
            Today
          </Button>
          <p className="pl-1 text-sm font-medium tracking-[0.07px] text-foreground">
            {rangeLabel(cursor, view)}
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value === "day" || value === "week" || value === "month") {
              onViewChange(value);
            }
          }}
          variant="outline"
          spacing={0}
          aria-label="Calendar view"
        >
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "day" ? (
        <DayView items={items} cursor={cursor} />
      ) : view === "week" ? (
        <WeekView
          items={items}
          cursor={cursor}
          today={today}
          onSelect={onCursorChange}
        />
      ) : (
        <MonthView
          items={items}
          cursor={cursor}
          today={today}
          onSelect={onCursorChange}
        />
      )}
    </section>
  );
}

function DayView({
  items,
  cursor,
}: {
  items: CalendarItem[];
  cursor: Date;
}) {
  const events = itemsOnDate(items, cursor);

  return (
    <div className="rounded-[4px] border border-border px-5 py-5">
      {events.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">
          No events on this day.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {events.map((item) => (
            <li key={item.id} className="flex flex-col gap-1">
              <p className="text-sm font-medium tracking-[0.07px] text-foreground">
                {item.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WeekView({
  items,
  cursor,
  today,
  onSelect,
}: {
  items: CalendarItem[];
  cursor: Date;
  today: Date;
  onSelect: (date: Date) => void;
}) {
  const days = weekCells(cursor);

  return (
    <div className="overflow-hidden rounded-[4px] border border-border">
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((day) => (
          <p
            key={formatDateKey(day)}
            className="px-2 py-2 text-center text-xs tracking-[0.12px] text-muted-foreground"
          >
            {WEEKDAYS[day.getDay()]} {day.getDate()}
          </p>
        ))}
      </div>
      <div className="grid min-h-[280px] grid-cols-7">
        {days.map((day) => {
          const events = itemsOnDate(items, day);
          const selected = isSameDay(day, cursor);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={formatDateKey(day)}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "flex min-h-[280px] flex-col items-start gap-2 border-r border-border px-2 py-2 text-left last:border-r-0",
                selected ? "bg-muted" : "bg-background",
              )}
              aria-pressed={selected}
              aria-current={isToday ? "date" : undefined}
            >
              {events.length === 0 ? (
                <p className="text-xs tracking-[0.12px] text-muted-foreground">
                  No events
                </p>
              ) : (
                events.map((item) => <EventChip key={item.id} item={item} />)
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MonthView({
  items,
  cursor,
  today,
  onSelect,
}: {
  items: CalendarItem[];
  cursor: Date;
  today: Date;
  onSelect: (date: Date) => void;
}) {
  const days = monthCells(cursor);

  return (
    <div className="overflow-hidden rounded-[4px] border border-border">
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((label) => (
          <p
            key={label}
            className="px-2 py-2 text-center text-xs tracking-[0.12px] text-muted-foreground"
          >
            {label}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const events = itemsOnDate(items, day);
          const selected = isSameDay(day, cursor);
          const isToday = isSameDay(day, today);
          const outside = day.getMonth() !== cursor.getMonth();
          return (
            <button
              key={formatDateKey(day)}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "flex min-h-[92px] flex-col items-start gap-1 border-r border-b border-border px-2 py-2 text-left [&:nth-child(7n)]:border-r-0",
                selected ? "bg-muted" : "bg-background",
              )}
              aria-pressed={selected}
              aria-current={isToday ? "date" : undefined}
            >
              <span
                className={cn(
                  "text-xs tracking-[0.12px]",
                  outside ? "text-muted-foreground/50" : "text-foreground",
                  isToday &&
                    "flex size-5 items-center justify-center rounded-full bg-foreground text-background",
                )}
              >
                {day.getDate()}
              </span>
              {events.slice(0, 2).map((item) => (
                <EventChip key={item.id} item={item} />
              ))}
              {events.length > 2 ? (
                <p className="text-xs tracking-[0.12px] text-muted-foreground">
                  +{events.length - 2} more
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
