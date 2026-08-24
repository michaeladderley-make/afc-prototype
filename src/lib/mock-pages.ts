export type PageStatus = "Published" | "Draft";

export type PartnerPage = {
  id: string;
  name: string;
  status: PageStatus;
  meta: string;
  address: string;
  editableSchoolId?: string;
};

export const MOCK_PAGES: PartnerPage[] = [
  {
    id: "lincoln-high",
    name: "Lincoln High School",
    status: "Published",
    meta: "Public  ·  High  ·  Grades 9–12",
    address: "1842 Oak Street, Austin, TX 78704  ·  Austin ISD",
    editableSchoolId: "lincoln-high",
  },
  {
    id: "page-b",
    name: "Pagename B",
    status: "Draft",
    meta: "Public  ·  High  ·  Grades 9–12",
    address: "1842 Oak Street, Austin, TX 78704  ·  Austin ISD",
  },
  {
    id: "page-c",
    name: "Pagename C",
    status: "Published",
    meta: "Public  ·  High  ·  Grades 9–12",
    address: "1842 Oak Street, Austin, TX 78704  ·  Austin ISD",
  },
];
