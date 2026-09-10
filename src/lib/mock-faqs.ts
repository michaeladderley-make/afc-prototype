export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const MOCK_FAQS: FaqItem[] = [
  {
    id: "who-can-register",
    question: "Who can register as an AFC partner?",
    answer:
      "School and network staff with a work email on their organization’s domain can start registration. The first approved person for a school becomes the Owner. Placeholder copy — replace with the final eligibility policy.",
  },
  {
    id: "owner-role",
    question: "What is a school Owner?",
    answer:
      "The Owner is the first approved person for a school and there is only one Owner per school. Owners can claim the school, publish fundraising pages, and invite others. Placeholder copy — replace with the final role definitions.",
  },
  {
    id: "what-you-need",
    question: "What do I need to claim a school?",
    answer:
      "Have your school’s 9-digit EIN, legal name and mailing address, a work email on the school domain, and a PNG or SVG of your school logo. Placeholder copy — replace with the official claim checklist.",
  },
  {
    id: "email-verification",
    question: "How does email verification work?",
    answer:
      "After you submit your work email, we send a 6-digit code. Enter that code to continue. In this prototype, the authorized code is 123456. Placeholder copy — replace with the live verification details.",
  },
  {
    id: "multiple-people",
    question: "Can more than one person from my school register?",
    answer:
      "Yes. After a school is claimed, additional staff can request access. Only one Owner is allowed; other approved people receive a partner role. Placeholder copy — replace with the access-request flow.",
  },
  {
    id: "already-claimed",
    question: "What if my school is already claimed?",
    answer:
      "If a school shows as claimed, use Request Access so the Owner can approve you. You cannot create a second Owner account for that school. Placeholder copy — replace with the request-access policy.",
  },
  {
    id: "donation-pages",
    question: "How do public fundraising pages work?",
    answer:
      "Each claimed school can build a donation page with a welcome statement, school story, and logo. Drafts stay private until you publish. Placeholder copy — replace with page-builder guidance.",
  },
  {
    id: "student-designations",
    question: "Can donors give to a specific student?",
    answer:
      "Gifts support the school’s programs — tutoring, dual-credit fees, and emergency student support — not individual student designations. Placeholder copy — replace with the designation rules.",
  },
  {
    id: "allocation",
    question: "How does allocation work after donations come in?",
    answer:
      "Partners can review incoming gifts and allocate funds to approved school needs from the Allocation area. Placeholder copy — replace with the allocation workflow.",
  },
  {
    id: "more-help",
    question: "Where can I get more help?",
    answer:
      "Use Need help? in the header to send a message to AFC support, or email support@afc.com. Placeholder copy — replace with the real support channels and hours.",
  },
];
