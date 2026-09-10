import type { ReactNode } from "react";

export function ProfileSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-b border-border pb-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
            {title}
          </h2>
          {action}
        </div>
        {description ? (
          <p className="text-sm leading-5 tracking-[0.07px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
