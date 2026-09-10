import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FaqsLink({
  query,
  active = false,
  className,
}: {
  query?: string;
  active?: boolean;
  className?: string;
}) {
  const href = query ? `/faqs?${query}` : "/faqs";

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "h-auto px-0 text-sm font-normal hover:bg-transparent hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      <Link href={href}>FAQs & Calendar</Link>
    </Button>
  );
}
