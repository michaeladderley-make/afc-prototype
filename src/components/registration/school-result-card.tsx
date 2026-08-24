import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { School } from "@/lib/mock-schools";

export function SchoolResultCard({
  school,
  selected = false,
  onSelect,
}: {
  school: School;
  selected?: boolean;
  onSelect?: (school: School) => void;
}) {
  const isAvailable = school.status === "available";

  return (
    <Card
      className={cn(
        "w-full rounded-[4px] py-0 shadow-none ring-border",
        selected && "ring-2 ring-foreground",
      )}
    >
      <CardContent className="flex flex-row items-center justify-between gap-6 p-6">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <CardTitle className="text-[21px] leading-[28px] font-medium">
            {school.name}
          </CardTitle>
          <CardDescription className="text-sm tracking-[0.07px] whitespace-pre">
            {school.meta}
          </CardDescription>
          <CardDescription className="text-sm tracking-[0.07px] whitespace-pre">
            {school.address}
          </CardDescription>
          <Badge
            variant="secondary"
            className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
          >
            {isAvailable ? "Available to claim" : "Claimed"}
          </Badge>
        </div>
        {isAvailable ? (
          <Button
            type="button"
            className="h-12 shrink-0 rounded-[4px] px-6 text-base"
            onClick={() => onSelect?.(school)}
          >
            Claim this school
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-12 shrink-0 rounded-[4px] border-foreground px-6 text-base shadow-none"
          >
            Contact AFC
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
