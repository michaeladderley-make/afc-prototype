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
