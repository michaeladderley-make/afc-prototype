const NEEDS = [
  {
    number: "1",
    title: "Employer Identification Number (EIN)",
    description:
      "The school’s 9-digit federal tax ID. You only need the number — not a scanned tax form.",
  },
  {
    number: "2",
    title: "Organization details",
    description:
      "Legal name as registered, mailing address, and a work email on your school’s domain so we can match you to the official record.",
  },
  {
    number: "3",
    title: "School logo file",
    description:
      "A PNG or SVG of your school mark. You’ll use this on the public fundraising page — have a clear, high-resolution file ready.",
  },
] as const;

export function RegistrationNeeds() {
  return (
    <aside className="flex w-full flex-col gap-5 border-t border-border pt-8">
      <p className="text-xs tracking-[0.07px] text-muted-foreground">
        You may need the following items during registration
      </p>
      <ol className="flex w-full flex-col gap-4">
        {NEEDS.map((need) => (
          <li key={need.number} className="flex items-start gap-3">
            <span className="w-4 shrink-0 text-xs leading-5 text-muted-foreground">
              {need.number}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium leading-5 text-muted-foreground">
                {need.title}
              </p>
              <p className="text-sm leading-5 tracking-[0.07px] text-muted-foreground">
                {need.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
