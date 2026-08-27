"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CONNECTED_PAGE_COUNT,
  MOCK_STUDENTS,
  TOTAL_FUNDS_CENTS,
} from "@/lib/mock-students";

function formatFunds(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function AllocationBoard() {
  const [allocatedIds, setAllocatedIds] = useState<string[]>([]);

  function allocate(studentId: string) {
    setAllocatedIds((current) =>
      current.includes(studentId) ? current : [...current, studentId],
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-medium text-foreground">
            Allocation
          </h1>
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            Funds connected across your donation pages, ready to assign to
            students.
          </p>
        </div>
        <div className="flex items-end justify-between gap-6 rounded-[4px] border border-border px-6 py-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-[0.12px] text-muted-foreground">
              Total funds
            </p>
            <p className="text-[32px] leading-[38px] font-medium text-foreground">
              {formatFunds(TOTAL_FUNDS_CENTS)}
            </p>
          </div>
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            Connected across {CONNECTED_PAGE_COUNT} pages · {MOCK_STUDENTS.length}{" "}
            students
          </p>
        </div>
      </section>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-0">First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="px-0 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_STUDENTS.map((student) => {
            const allocated = allocatedIds.includes(student.id);

            return (
              <TableRow key={student.id} className="hover:bg-transparent">
                <TableCell className="px-0 font-medium text-foreground">
                  {student.firstName}
                </TableCell>
                <TableCell className="text-foreground">
                  {student.lastName}
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {student.address}
                </TableCell>
                <TableCell className="px-0 text-right">
                  <Button
                    type="button"
                    variant={allocated ? "secondary" : "outline"}
                    disabled={allocated}
                    onClick={() => allocate(student.id)}
                  >
                    {allocated ? "Allocated" : "Allocate"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
