"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatJoinedDate, type SchoolUser } from "@/lib/school-users";
import { useSchoolUsers } from "@/lib/use-school-users";

export function UsersDirectory({
  schoolId,
  schoolName,
}: {
  schoolId: string;
  schoolName: string;
}) {
  const { users, setUsers } = useSchoolUsers(schoolId);
  const [ready, setReady] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<SchoolUser | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [removedNotice, setRemovedNotice] = useState(false);
  const pendingUserRef = useRef<SchoolUser | null>(null);
  const dialogUserRef = useRef<SchoolUser | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  if (removeTarget) {
    dialogUserRef.current = removeTarget;
  }
  const dialogUser = removeTarget ?? dialogUserRef.current;

  function showAccessRemoved() {
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
    }
    setRemovedNotice(true);
    noticeTimerRef.current = window.setTimeout(() => {
      setRemovedNotice(false);
    }, 4000);
  }

  function confirmRemove() {
    if (!removeTarget) {
      return;
    }
    setUsers(users.filter((user) => user.id !== removeTarget.id));
    setRemoveTarget(null);
    showAccessRemoved();
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Users
        </h1>
        <p
          aria-live="polite"
          className="flex min-h-7 shrink-0 items-center gap-1 text-sm tracking-[0.07px] text-emerald-800"
        >
          {removedNotice ? (
            <>
              <Check className="size-4" aria-hidden />
              Access removed
            </>
          ) : null}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-0">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Full access</TableHead>
            <TableHead>Date joined</TableHead>
            <TableHead className="px-0 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!ready ? null : users.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="px-0 py-8 text-sm text-muted-foreground"
              >
                No one currently has access to {schoolName}.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-transparent">
                <TableCell className="px-0 font-medium text-foreground">
                  {user.name}
                </TableCell>
                <TableCell className="text-foreground">{user.email}</TableCell>
                <TableCell className="text-foreground">Full access</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatJoinedDate(user.joinedOn)}
                </TableCell>
                <TableCell className="px-0 text-right">
                  <DropdownMenu
                    modal={false}
                    open={openMenuId === user.id}
                    onOpenChange={(open) => {
                      setOpenMenuId(open ? user.id : null);
                      if (open) {
                        return;
                      }
                      const target = pendingUserRef.current;
                      pendingUserRef.current = null;
                      if (target) {
                        setRemoveTarget(target);
                      }
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        aria-label={`Actions for ${user.name}`}
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
                          pendingUserRef.current = user;
                        }}
                      >
                        Remove access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null);
          }
        }}
      >
        <DialogContent
          className="z-[60] rounded-[4px] sm:max-w-lg"
          overlayClassName="z-[60]"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Remove access for {dialogUser?.name} at {schoolName}?
            </DialogTitle>
            <DialogDescription>
              {dialogUser?.name} will lose access to {schoolName}. They will no
              longer be able to sign in or manage this school.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemoveTarget(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={confirmRemove}>
              Remove access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
