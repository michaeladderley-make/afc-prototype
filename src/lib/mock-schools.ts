export type SchoolStatus = "available" | "claimed";

export type School = {
  id: string;
  name: string;
  meta: string;
  address: string;
  status: SchoolStatus;
  welcomeStatement: string;
  schoolStory: string;
};

export function getSchoolById(id: string) {
  return MOCK_SCHOOLS.find((school) => school.id === id);
}

export const MOCK_SCHOOLS: School[] = [
  {
    id: "lincoln-high",
    name: "Lincoln High School",
    meta: "Public  ·  High  ·  Grades 9–12",
    address: "1842 Oak Street, Austin, TX 78704  ·  Austin ISD",
    status: "available",
    welcomeStatement: "Make a Donation to Lincoln High School",
    schoolStory:
      "Lincoln High serves 1,800 students in Austin ISD. Gifts fund tutoring, dual-credit fees, and emergency student support — not individual student designations.",
  },
  {
    id: "lincoln-middle",
    name: "Lincoln Middle School",
    meta: "Public  ·  Middle  ·  Grades 6–8",
    address: "210 N Lamar Blvd, Austin, TX 78703  ·  Austin ISD",
    status: "available",
    welcomeStatement: "Make a Donation to Lincoln Middle School",
    schoolStory:
      "Lincoln Middle serves students in Austin ISD. Gifts fund tutoring, enrichment, and emergency student support — not individual student designations.",
  },
  {
    id: "lincoln-elementary",
    name: "Lincoln Elementary",
    meta: "Public  ·  Elementary  ·  Grades PK–5",
    address: "91 Barton Springs Rd, Austin, TX 78704  ·  Austin ISD",
    status: "claimed",
    welcomeStatement: "Make a Donation to Lincoln Elementary",
    schoolStory:
      "Lincoln Elementary serves students in Austin ISD. Gifts fund tutoring, classroom needs, and emergency student support — not individual student designations.",
  },
];
