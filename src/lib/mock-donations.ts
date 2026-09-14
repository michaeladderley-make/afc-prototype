export const GIFT_TYPES = [
  "One-time",
  "Weekly",
  "Biweekly",
  "Monthly",
] as const;

export const GIFT_STATUSES = [
  "Completed",
  "Refunded",
  "Chargeback",
  "Corrected",
  "Delayed",
  "Unmatched",
] as const;

export const DONATION_SOURCES = [
  "Fundraising page",
  "Recurring",
  "Matching gift",
  "Mail",
  "Phone",
  "Event",
] as const;

export const DONATION_SORTS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Amount high to low" },
  { value: "amount-asc", label: "Amount low to high" },
] as const;

export type GiftType = (typeof GIFT_TYPES)[number];
export type GiftStatus = (typeof GIFT_STATUSES)[number];
export type DonationSource = (typeof DONATION_SOURCES)[number];
export type DonationSort = (typeof DONATION_SORTS)[number]["value"];

export type GiftAdjustmentKind = "Refund" | "Chargeback" | "Correction";

export type GiftAdjustment = {
  kind: GiftAdjustmentKind;
  date: string;
  time: string;
  amount: number;
  note?: string;
};

export type SchoolGift = {
  id: string;
  schoolId: string;
  amount: number;
  date: string;
  time: string;
  giftType: GiftType;
  status: GiftStatus;
  source: DonationSource;
  pageId: string;
  page: string;
  organizationType: "School" | "Network";
  schoolPreference?: string;
  relatedAdjustment?: GiftAdjustment;
  donorName?: string;
  email?: string;
  phone?: string;
};

type SchoolGiftSeed = Omit<
  SchoolGift,
  "time" | "organizationType" | "schoolPreference" | "relatedAdjustment"
>;

export type DonationFilters = {
  pageId?: string;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string;
  toDate?: string;
};

export const DONATIONS_PAGE_SIZE = 10;

const GIFT_DETAILS: Record<
  string,
  Pick<SchoolGift, "time"> &
    Partial<Pick<SchoolGift, "schoolPreference" | "relatedAdjustment">>
> = {
  "gift-24": { time: "2:40 PM" },
  "gift-23": { time: "1:15 PM" },
  "gift-22": { time: "11:08 AM" },
  "gift-21": {
    time: "4:22 PM",
    schoolPreference: "Lincoln High School",
  },
  "gift-20": { time: "9:05 AM" },
  "gift-19": { time: "3:41 PM" },
  "gift-18": {
    time: "8:16 AM",
    relatedAdjustment: {
      kind: "Refund",
      date: "2026-08-31",
      time: "9:12 AM",
      amount: 250,
      note: "Recurring gift refunded at the donor’s request.",
    },
  },
  "gift-17": {
    time: "6:02 PM",
    relatedAdjustment: {
      kind: "Refund",
      date: "2026-08-22",
      time: "10:04 AM",
      amount: 75,
      note: "One-time gift refunded at the donor’s request.",
    },
  },
  "gift-16": { time: "10:27 AM" },
  "gift-15": { time: "1:55 PM" },
  "gift-14": {
    time: "4:09 PM",
    schoolPreference: "Lincoln High School",
  },
  "gift-13": { time: "12:05 PM" },
  "gift-12": {
    time: "7:48 AM",
    relatedAdjustment: {
      kind: "Chargeback",
      date: "2026-06-11",
      time: "3:15 PM",
      amount: 500,
      note: "The cardholder disputed this recurring gift.",
    },
  },
  "gift-11": {
    time: "2:14 PM",
    schoolPreference: "Lincoln High School",
    relatedAdjustment: {
      kind: "Correction",
      date: "2026-05-23",
      time: "1:02 PM",
      amount: 250,
      note: "Amount corrected from $200.00.",
    },
  },
  "gift-10": { time: "9:33 AM" },
  "gift-09": { time: "5:12 PM" },
  "gift-08": {
    time: "6:40 PM",
    schoolPreference: "Lincoln High School",
  },
  "gift-07": {
    time: "8:20 AM",
    relatedAdjustment: {
      kind: "Refund",
      date: "2026-03-21",
      time: "11:30 AM",
      amount: 100,
      note: "Recurring gift refunded at the donor’s request.",
    },
  },
  "gift-06": { time: "11:51 AM" },
  "gift-05": { time: "3:03 PM" },
  "gift-04": {
    time: "1:18 PM",
    schoolPreference: "Lincoln High School",
    relatedAdjustment: {
      kind: "Chargeback",
      date: "2026-02-08",
      time: "8:45 AM",
      amount: 1000,
      note: "The cardholder disputed this matching gift.",
    },
  },
  "gift-03": {
    time: "10:44 AM",
    relatedAdjustment: {
      kind: "Correction",
      date: "2026-01-22",
      time: "9:18 AM",
      amount: 40,
      note: "Amount corrected from $35.00.",
    },
  },
  "gift-02": { time: "2:27 PM" },
  "gift-01": { time: "4:55 PM" },
};

const MOCK_SCHOOL_GIFTS: SchoolGiftSeed[] = [
  {
    id: "gift-24",
    schoolId: "lincoln-high",
    amount: 500,
    date: "2026-09-14",
    giftType: "One-time",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Priya Shah",
    email: "priya.shah@example.com",
  },
  {
    id: "gift-23",
    schoolId: "lincoln-high",
    amount: 250,
    date: "2026-09-14",
    giftType: "Monthly",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Jordan Hale",
    email: "jordan.hale@example.com",
  },
  {
    id: "gift-22",
    schoolId: "lincoln-high",
    amount: 100,
    date: "2026-09-12",
    giftType: "One-time",
    status: "Delayed",
    source: "Fundraising page",
    pageId: "page-c",
    page: "Pagename C",
    donorName: "Elena Ruiz",
    email: "elena.ruiz@example.com",
  },
  {
    id: "gift-21",
    schoolId: "lincoln-high",
    amount: 1000,
    date: "2026-09-11",
    giftType: "One-time",
    status: "Completed",
    source: "Matching gift",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Marcus Chen",
    email: "marcus.chen@example.com",
  },
  {
    id: "gift-20",
    schoolId: "lincoln-high",
    amount: 250,
    date: "2026-09-08",
    giftType: "Monthly",
    status: "Completed",
    source: "Recurring",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Camila Ortiz",
    email: "camila.ortiz@example.com",
  },
  {
    id: "gift-19",
    schoolId: "lincoln-high",
    amount: 75,
    date: "2026-09-03",
    giftType: "Weekly",
    status: "Completed",
    source: "Fundraising page",
    pageId: "page-b",
    page: "Pagename B",
    donorName: "Noah Patel",
    email: "noah.patel@example.com",
  },
  {
    id: "gift-18",
    schoolId: "lincoln-high",
    amount: 250,
    date: "2026-08-30",
    giftType: "Monthly",
    status: "Refunded",
    source: "Recurring",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Camila Ortiz",
    email: "camila.ortiz@example.com",
  },
  {
    id: "gift-17",
    schoolId: "lincoln-high",
    amount: 75,
    date: "2026-08-21",
    giftType: "One-time",
    status: "Refunded",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Avery Brooks",
    email: "avery.brooks@example.com",
  },
  {
    id: "gift-16",
    schoolId: "lincoln-high",
    amount: 40,
    date: "2026-08-14",
    giftType: "One-time",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    email: "renee.park@example.com",
  },
  {
    id: "gift-15",
    schoolId: "lincoln-high",
    amount: 200,
    date: "2026-07-29",
    giftType: "Biweekly",
    status: "Completed",
    source: "Fundraising page",
    pageId: "page-c",
    page: "Pagename C",
    donorName: "Sofia Alvarez",
    email: "sofia.alvarez@example.com",
  },
  {
    id: "gift-14",
    schoolId: "lincoln-high",
    amount: 100,
    date: "2026-07-16",
    giftType: "One-time",
    status: "Completed",
    source: "Phone",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    phone: "(512) 555-0142",
  },
  {
    id: "gift-13",
    schoolId: "lincoln-high",
    amount: 5000,
    date: "2026-06-18",
    giftType: "One-time",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Grace Holloway",
    email: "grace.holloway@example.com",
  },
  {
    id: "gift-12",
    schoolId: "lincoln-high",
    amount: 500,
    date: "2026-06-04",
    giftType: "Monthly",
    status: "Chargeback",
    source: "Recurring",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Liam Nguyen",
    email: "liam.nguyen@example.com",
  },
  {
    id: "gift-11",
    schoolId: "lincoln-high",
    amount: 250,
    date: "2026-05-22",
    giftType: "One-time",
    status: "Corrected",
    source: "Mail",
    pageId: "page-c",
    page: "Pagename C",
    donorName: "Olivia Bennett",
    email: "olivia.bennett@example.com",
  },
  {
    id: "gift-10",
    schoolId: "lincoln-high",
    amount: 120,
    date: "2026-05-09",
    giftType: "One-time",
    status: "Unmatched",
    source: "Mail",
    pageId: "lincoln-high",
    page: "Lincoln High School",
  },
  {
    id: "gift-09",
    schoolId: "lincoln-high",
    amount: 40,
    date: "2026-04-27",
    giftType: "Weekly",
    status: "Delayed",
    source: "Fundraising page",
    pageId: "page-b",
    page: "Pagename B",
    donorName: "Theo Brooks",
    email: "theo.brooks@example.com",
  },
  {
    id: "gift-08",
    schoolId: "lincoln-high",
    amount: 750,
    date: "2026-04-03",
    giftType: "One-time",
    status: "Completed",
    source: "Event",
    pageId: "page-c",
    page: "Pagename C",
    donorName: "Miles Carter",
    email: "miles.carter@example.com",
  },
  {
    id: "gift-07",
    schoolId: "lincoln-high",
    amount: 100,
    date: "2026-03-19",
    giftType: "Monthly",
    status: "Refunded",
    source: "Recurring",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Isla Walker",
    email: "isla.walker@example.com",
  },
  {
    id: "gift-06",
    schoolId: "lincoln-high",
    amount: 250,
    date: "2026-03-02",
    giftType: "One-time",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    email: "donated@example.com",
  },
  {
    id: "gift-05",
    schoolId: "lincoln-high",
    amount: 250,
    date: "2026-02-14",
    giftType: "Biweekly",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Hannah Cole",
    email: "hannah.cole@example.com",
  },
  {
    id: "gift-04",
    schoolId: "lincoln-high",
    amount: 1000,
    date: "2026-02-02",
    giftType: "One-time",
    status: "Chargeback",
    source: "Matching gift",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Owen Kim",
    email: "owen.kim@example.com",
  },
  {
    id: "gift-03",
    schoolId: "lincoln-high",
    amount: 40,
    date: "2026-01-21",
    giftType: "Weekly",
    status: "Corrected",
    source: "Fundraising page",
    pageId: "page-b",
    page: "Pagename B",
    donorName: "Chloe Hughes",
    email: "chloe.hughes@example.com",
  },
  {
    id: "gift-02",
    schoolId: "lincoln-high",
    amount: 100,
    date: "2026-01-09",
    giftType: "One-time",
    status: "Completed",
    source: "Fundraising page",
    pageId: "lincoln-high",
    page: "Lincoln High School",
    donorName: "Felix Ward",
    email: "felix.ward@example.com",
  },
  {
    id: "gift-01",
    schoolId: "lincoln-high",
    amount: 60,
    date: "2026-01-04",
    giftType: "One-time",
    status: "Unmatched",
    source: "Event",
    pageId: "page-c",
    page: "Pagename C",
  },
];

function completeGift(gift: SchoolGiftSeed): SchoolGift {
  const details = GIFT_DETAILS[gift.id];
  return {
    ...gift,
    time: details?.time ?? "12:00 PM",
    organizationType: "School",
    schoolPreference: details?.schoolPreference,
    relatedAdjustment: details?.relatedAdjustment,
  };
}

export function giftsForSchool(schoolId: string) {
  return MOCK_SCHOOL_GIFTS.filter((gift) => gift.schoolId === schoolId).map(
    completeGift,
  );
}

export function formatGiftDateTime(gift: Pick<SchoolGift, "date" | "time">) {
  return `${formatGiftDate(gift.date)} · ${gift.time}`;
}

export function isDonationSort(value: string): value is DonationSort {
  return DONATION_SORTS.some((option) => option.value === value);
}

export function parseAmountFilter(value: string) {
  const trimmed = value.trim().replace(/[$,]/g, "");
  if (!trimmed) {
    return undefined;
  }
  const amount = Number(trimmed);
  return Number.isFinite(amount) ? amount : undefined;
}

export function filterSchoolGifts(
  gifts: SchoolGift[],
  filters: DonationFilters,
) {
  return gifts.filter((gift) => {
    if (filters.pageId && gift.pageId !== filters.pageId) {
      return false;
    }
    if (filters.minAmount !== undefined && gift.amount < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount !== undefined && gift.amount > filters.maxAmount) {
      return false;
    }
    if (filters.fromDate && gift.date < filters.fromDate) {
      return false;
    }
    if (filters.toDate && gift.date > filters.toDate) {
      return false;
    }
    return true;
  });
}

export function sortSchoolGifts(gifts: SchoolGift[], sort: DonationSort) {
  const sorted = [...gifts];
  sorted.sort((a, b) => {
    if (sort === "amount-desc") {
      return b.amount - a.amount;
    }
    if (sort === "amount-asc") {
      return a.amount - b.amount;
    }
    if (sort === "date-asc") {
      return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
    }
    return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
  });
  return sorted;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatGiftDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function giftContactLines(gift: SchoolGift) {
  const lines: string[] = [];
  if (gift.donorName) {
    lines.push(gift.donorName);
  }
  if (gift.email) {
    lines.push(gift.email);
  }
  if (gift.phone) {
    lines.push(gift.phone);
  }
  return lines;
}
