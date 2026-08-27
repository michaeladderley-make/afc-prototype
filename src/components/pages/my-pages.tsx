"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MOCK_PAGES, type PartnerPage } from "@/lib/mock-pages";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";
import { cn } from "@/lib/utils";

function PlaceholderSlot({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Empty
      className={cn(
        "flex-none flex-col gap-2 rounded-[4px] border border-dashed border-muted-foreground bg-muted p-3",
        className,
      )}
    >
      <EmptyTitle className="text-xs font-medium tracking-normal text-muted-foreground">
        {label}
      </EmptyTitle>
      <EmptyContent className="w-auto max-w-none">
        <Button type="button" variant="outline" size="sm">
          Change
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function MyPages({ context }: { context: PartnerContext }) {
  const [pages, setPages] = useState(MOCK_PAGES);
  const [deleteTarget, setDeleteTarget] = useState<PartnerPage | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<PartnerPage | null>(
    null,
  );
  const [duplicateTitle, setDuplicateTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const pendingActionRef = useRef<"duplicate" | "delete" | null>(null);
  const pendingPageRef = useRef<PartnerPage | null>(null);
  const canDuplicate = duplicateTitle.trim().length > 0;

  function openDuplicate(page: PartnerPage) {
    setDuplicateTitle(`${page.name} copy`);
    setDuplicateTarget(page);
  }

  function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    setPages((current) =>
      current.filter((page) => page.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  }

  function confirmDuplicate() {
    if (!duplicateTarget || !canDuplicate) {
      return;
    }
    const nextPage: PartnerPage = {
      ...duplicateTarget,
      id: `${duplicateTarget.id}-copy-${Date.now()}`,
      name: duplicateTitle.trim(),
      status: "Draft",
    };
    setPages((current) => {
      const index = current.findIndex((page) => page.id === duplicateTarget.id);
      if (index === -1) {
        return [...current, nextPage];
      }
      return [
        ...current.slice(0, index + 1),
        nextPage,
        ...current.slice(index + 1),
      ];
    });
    setDuplicateTarget(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-medium text-foreground">My Pages</h1>
        <Button type="button">Add Page</Button>
      </div>

      {pages.map((page) => {
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
            <div className="flex shrink-0 items-center gap-3">
              {editHref ? (
                <Button asChild variant="outline">
                  <Link href={editHref}>Edit</Link>
                </Button>
              ) : (
                <Button type="button" variant="outline">
                  Edit
                </Button>
              )}
              <DropdownMenu
                modal={false}
                open={openMenuId === page.id}
                onOpenChange={(open) => {
                  setOpenMenuId(open ? page.id : null);
                  if (open) {
                    return;
                  }
                  const action = pendingActionRef.current;
                  const target = pendingPageRef.current;
                  pendingActionRef.current = null;
                  pendingPageRef.current = null;
                  if (!action || !target) {
                    return;
                  }
                  if (action === "duplicate") {
                    openDuplicate(target);
                    return;
                  }
                  setDeleteTarget(target);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label={`More actions for ${page.name}`}
                  >
                    ...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-40 rounded-[4px]"
                >
                  <DropdownMenuItem
                    onSelect={() => {
                      pendingActionRef.current = "duplicate";
                      pendingPageRef.current = page;
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      pendingActionRef.current = "delete";
                      pendingPageRef.current = page;
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent
          className="z-[60] rounded-[4px] sm:max-w-lg"
          overlayClassName="z-[60]"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this page?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={confirmDelete}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={duplicateTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDuplicateTarget(null);
          }
        }}
      >
        <DialogContent
          className="z-[60] rounded-[4px] sm:max-w-lg"
          overlayClassName="z-[60]"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Duplicate this page</DialogTitle>
            <DialogDescription>
              Change the logo, cover image, and title for the new page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <PlaceholderSlot label="School Logo" className="min-h-[120px]" />
              <PlaceholderSlot label="Cover Image" className="min-h-[120px]" />
            </div>
            <Field className="gap-2">
              <FieldLabel htmlFor="duplicate-title">Page title</FieldLabel>
              <Input
                id="duplicate-title"
                value={duplicateTitle}
                onChange={(event) => setDuplicateTitle(event.target.value)}
              />
            </Field>
          </div>
          <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDuplicateTarget(null)}
            >
              Dismiss
            </Button>
            <Button
              type="button"
              disabled={!canDuplicate}
              onClick={confirmDuplicate}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
