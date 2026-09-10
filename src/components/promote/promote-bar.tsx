import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PromoteBar({
  pageName,
  builderHref,
  view,
  onViewChange,
}: {
  pageName: string;
  builderHref: string;
  view: "page" | "promote";
  onViewChange: (view: "page" | "promote") => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-6 bg-foreground px-5 py-3 text-background">
      <Button
        asChild
        variant="ghost"
        className="h-auto px-0 text-sm font-normal text-background hover:bg-transparent hover:text-background/80"
      >
        <Link href={builderHref}>Page builder</Link>
      </Button>
      <p className="hidden min-w-0 truncate text-sm tracking-[0.07px] text-background/80 sm:block">
        {pageName}
      </p>
      <div className="flex items-center gap-4">
        {view === "promote" ? (
          <Button
            type="button"
            variant="ghost"
            className="h-auto px-0 text-sm font-normal text-background hover:bg-transparent hover:text-background/80"
            onClick={() => onViewChange("page")}
          >
            View page
          </Button>
        ) : null}
        <Button
          type="button"
          className={
            view === "promote"
              ? "bg-background text-foreground hover:bg-background/90"
              : "border-background/30 bg-transparent text-background hover:bg-background/10"
          }
          variant={view === "promote" ? "default" : "outline"}
          onClick={() => onViewChange("promote")}
        >
          Promote
        </Button>
      </div>
    </div>
  );
}
