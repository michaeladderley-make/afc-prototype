"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { MOCK_PAGES } from "@/lib/mock-pages";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";

export function MyPages({ context }: { context: PartnerContext }) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-medium text-foreground">My Pages</h1>
        <Button type="button" className="h-12 rounded-[4px] px-6 text-base">
          Add Page
        </Button>
      </div>

      {MOCK_PAGES.map((page) => {
        const editHref = page.editableSchoolId
          ? `/page-builder?${partnerQuery({
              ...context,
              school: page.editableSchoolId,
            })}`
          : null;

        return (
          <div
            key={page.id}
            className="flex w-full items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="flex size-[120px] shrink-0 items-center justify-center border border-border bg-muted">
                <p className="text-sm font-medium text-muted-foreground">
                  Preview
                </p>
              </div>
              <div className="flex w-[320px] flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-[21px] leading-[28px] font-medium text-foreground">
                    {page.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
                  >
                    {page.status}
                  </Badge>
                </div>
                <p className="text-sm tracking-[0.07px] whitespace-pre-wrap text-muted-foreground">
                  {page.meta}
                </p>
                <p className="text-sm tracking-[0.07px] whitespace-pre-wrap text-muted-foreground">
                  {page.address}
                </p>
              </div>
            </div>
            <ButtonGroup className="shrink-0 gap-2">
              <ButtonGroup>
                {editHref ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-[4px] border-foreground px-6 text-base shadow-none"
                  >
                    <Link href={editHref}>Edit</Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-[4px] border-foreground px-6 text-base shadow-none"
                  >
                    Edit
                  </Button>
                )}
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-[4px] border-foreground px-6 text-base shadow-none"
                  aria-label={`More actions for ${page.name}`}
                >
                  ...
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </div>
        );
      })}
    </div>
  );
}
