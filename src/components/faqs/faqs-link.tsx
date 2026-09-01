import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FaqsLink({
  query,
  className,
}: {
  query?: string;
  className?: string;
}) {
  const href = query ? `/faqs?${query}` : "/faqs";

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "h-auto px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground",
        className,
      )}
    >
      <Link href={href}>FAQs</Link>
    </Button>
  );
}
