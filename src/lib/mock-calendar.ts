export type CalendarItem = {
  id: string;
  title: string;
  description: string;
  start: string;
  end?: string;
  dateLabel: string;
  href?: string;
  linkLabel?: string;
};

export const MOCK_CALENDAR: CalendarItem[] = [
  {
    id: "fall-office-hours",
    title: "Fall partnership office hours",
    description:
      "Drop in with questions about publishing, readiness, and page setup.",
    start: "2026-09-18",
    dateLabel: "September 18, 2026",
    href: "https://afc.com/events/fall-office-hours",
    linkLabel: "Join office hours",
  },
  {
    id: "publishing-workshop",
    title: "Publishing workshop",
    description:
      "A three-day walkthrough of donation page content, review, and publish.",
    start: "2026-10-01",
    end: "2026-10-03",
    dateLabel: "October 1–3, 2026",
  },
  {
    id: "q4-kickoff",
    title: "Q4 fundraising kickoff",
    description:
      "What’s new for the fall giving season and how to share your page.",
    start: "2026-10-15",
    dateLabel: "October 15, 2026",
    href: "https://afc.com/events/q4-kickoff",
    linkLabel: "View agenda",
  },
  {
    id: "allocation-training",
    title: "Allocation training",
    description:
      "How gifts move from published pages into school allocation.",
    start: "2026-11-12",
    dateLabel: "November 12, 2026",
  },
  {
    id: "january-briefing",
    title: "New year partner briefing",
    description: "Dates, reporting windows, and what to prepare for 2027.",
    start: "2027-01-08",
    dateLabel: "January 8, 2027",
    href: "https://afc.com/events/january-briefing",
    linkLabel: "Open briefing",
  },
];

export function upcomingCalendarItems(items = MOCK_CALENDAR) {
  return items.slice().sort((a, b) => a.start.localeCompare(b.start));
}

export function parseCalendarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(left: Date, right: Date) {
  return formatDateKey(left) === formatDateKey(right);
}

export function itemOccursOn(item: CalendarItem, date: Date) {
  const start = startOfDay(parseCalendarDate(item.start));
  const end = startOfDay(parseCalendarDate(item.end ?? item.start));
  const current = startOfDay(date);
  return current >= start && current <= end;
}

export function itemsOnDate(items: CalendarItem[], date: Date) {
  return items.filter((item) => itemOccursOn(item, date));
}
