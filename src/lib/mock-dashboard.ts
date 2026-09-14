import type { PartnerPage } from "@/lib/mock-pages";

export const REPORTING_PERIODS = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
] as const;

export type ReportingPeriod = (typeof REPORTING_PERIODS)[number]["value"];

export type DashboardTrendPoint = {
  label: string;
  amount: number;
};

export type DashboardGift = {
  id: string;
  date: string;
  donor: string;
  pageId: string;
  page: string;
  amount: number;
};

export type DashboardPageRow = {
  pageId: string;
  page: string;
  gifts: number;
  amount: number;
};

export type DashboardSnapshot = {
  period: ReportingPeriod;
  periodLabel: string;
  rangeLabel: string;
  netAmount: number;
  giftCount: number;
  uniqueDonors: number;
  trend: DashboardTrendPoint[];
  gifts: DashboardGift[];
  byPage: DashboardPageRow[];
};

const PERIOD_KEY = "afc-reporting-period";
const listeners = new Set<() => void>();

const SNAPSHOTS: Record<ReportingPeriod, DashboardSnapshot> = {
  day: {
    period: "day",
    periodLabel: "Day",
    rangeLabel: "Sep 14, 2026",
    netAmount: 2340,
    giftCount: 9,
    uniqueDonors: 8,
    trend: [
      { label: "9am", amount: 180 },
      { label: "10am", amount: 240 },
      { label: "11am", amount: 310 },
      { label: "12pm", amount: 420 },
      { label: "1pm", amount: 390 },
      { label: "2pm", amount: 410 },
      { label: "3pm", amount: 390 },
    ],
    gifts: [
      {
        id: "day-1",
        date: "Sep 14, 2:40pm",
        donor: "Priya Shah",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 500,
      },
      {
        id: "day-2",
        date: "Sep 14, 1:15pm",
        donor: "Jordan Hale",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 250,
      },
      {
        id: "day-3",
        date: "Sep 14, 12:05pm",
        donor: "Elena Ruiz",
        pageId: "page-c",
        page: "Pagename C",
        amount: 100,
      },
      {
        id: "day-4",
        date: "Sep 14, 11:22am",
        donor: "Marcus Chen",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 1000,
      },
      {
        id: "day-5",
        date: "Sep 14, 9:48am",
        donor: "Avery Brooks",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 75,
      },
    ],
    byPage: [
      { pageId: "lincoln-high", page: "Lincoln High School", gifts: 7, amount: 2140 },
      { pageId: "page-c", page: "Pagename C", gifts: 2, amount: 200 },
    ],
  },
  month: {
    period: "month",
    periodLabel: "Month",
    rangeLabel: "September 2026",
    netAmount: 12480,
    giftCount: 48,
    uniqueDonors: 41,
    trend: [
      { label: "Week 1", amount: 2180 },
      { label: "Week 2", amount: 3560 },
      { label: "Week 3", amount: 4400 },
      { label: "Week 4", amount: 2340 },
    ],
    gifts: [
      {
        id: "month-1",
        date: "Sep 14",
        donor: "Priya Shah",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 500,
      },
      {
        id: "month-2",
        date: "Sep 13",
        donor: "Jordan Hale",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 250,
      },
      {
        id: "month-3",
        date: "Sep 12",
        donor: "Elena Ruiz",
        pageId: "page-c",
        page: "Pagename C",
        amount: 100,
      },
      {
        id: "month-4",
        date: "Sep 11",
        donor: "Marcus Chen",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 1000,
      },
      {
        id: "month-5",
        date: "Sep 8",
        donor: "Camila Ortiz",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 250,
      },
      {
        id: "month-6",
        date: "Sep 3",
        donor: "Noah Patel",
        pageId: "page-b",
        page: "Pagename B",
        amount: 75,
      },
    ],
    byPage: [
      { pageId: "lincoln-high", page: "Lincoln High School", gifts: 39, amount: 10840 },
      { pageId: "page-c", page: "Pagename C", gifts: 7, amount: 1320 },
      { pageId: "page-b", page: "Pagename B", gifts: 2, amount: 320 },
    ],
  },
  year: {
    period: "year",
    periodLabel: "Year",
    rangeLabel: "2026",
    netAmount: 128940,
    giftCount: 512,
    uniqueDonors: 387,
    trend: [
      { label: "Jan", amount: 8420 },
      { label: "Feb", amount: 9780 },
      { label: "Mar", amount: 12140 },
      { label: "Apr", amount: 10960 },
      { label: "May", amount: 14680 },
      { label: "Jun", amount: 26750 },
      { label: "Jul", amount: 14980 },
      { label: "Aug", amount: 18750 },
      { label: "Sep", amount: 12480 },
    ],
    gifts: [
      {
        id: "year-1",
        date: "Sep 14",
        donor: "Priya Shah",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 500,
      },
      {
        id: "year-2",
        date: "Aug 30",
        donor: "Camila Ortiz",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 250,
      },
      {
        id: "year-3",
        date: "Jun 18",
        donor: "Grace Holloway",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 5000,
      },
      {
        id: "year-4",
        date: "Apr 3",
        donor: "Miles Carter",
        pageId: "page-c",
        page: "Pagename C",
        amount: 750,
      },
      {
        id: "year-5",
        date: "Feb 14",
        donor: "Hannah Cole",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 250,
      },
      {
        id: "year-6",
        date: "Jan 9",
        donor: "Felix Ward",
        pageId: "lincoln-high",
        page: "Lincoln High School",
        amount: 100,
      },
    ],
    byPage: [
      { pageId: "lincoln-high", page: "Lincoln High School", gifts: 401, amount: 106220 },
      { pageId: "page-c", page: "Pagename C", gifts: 73, amount: 15480 },
      { pageId: "page-b", page: "Pagename B", gifts: 38, amount: 7240 },
    ],
  },
};

export function isReportingPeriod(value: string): value is ReportingPeriod {
  return REPORTING_PERIODS.some((option) => option.value === value);
}

export function getDashboardSnapshot(period: ReportingPeriod) {
  return SNAPSHOTS[period];
}

export function getPagePerformance(
  snapshot: DashboardSnapshot,
  pages: PartnerPage[],
) {
  return pages.map((page) => {
    const row = snapshot.byPage.find((entry) => entry.pageId === page.id);
    return {
      page,
      gifts: row?.gifts ?? 0,
      amount: row?.amount ?? 0,
    };
  });
}

export function giftsForPage(snapshot: DashboardSnapshot, pageId?: string) {
  if (!pageId) {
    return snapshot.gifts;
  }
  return snapshot.gifts.filter((gift) => gift.pageId === pageId);
}

export function getAverageGift(snapshot: DashboardSnapshot) {
  if (snapshot.giftCount === 0) {
    return 0;
  }
  return snapshot.netAmount / snapshot.giftCount;
}

export function formatDashboardMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDashboardCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function organizationScopeLabel(type: string) {
  if (type === "network") {
    return "Network";
  }
  if (type === "afc") {
    return "AFC";
  }
  return "School";
}

export function defaultReportingPeriod(): ReportingPeriod {
  return "month";
}

export function getReportingPeriod(): ReportingPeriod {
  const stored = window.localStorage.getItem(PERIOD_KEY);
  return stored && isReportingPeriod(stored)
    ? stored
    : defaultReportingPeriod();
}

export function setReportingPeriod(period: ReportingPeriod) {
  window.localStorage.setItem(PERIOD_KEY, period);
  listeners.forEach((listener) => listener());
}

export function subscribeReportingPeriod(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
