"use client";

import { useSyncExternalStore } from "react";

import {
  defaultSchoolUsers,
  getSchoolUsers,
  saveSchoolUsers,
  subscribeSchoolUsers,
  type SchoolUser,
} from "@/lib/school-users";

export function useSchoolUsers(schoolId: string) {
  const users = useSyncExternalStore(
    subscribeSchoolUsers,
    () => getSchoolUsers(schoolId),
    defaultSchoolUsers,
  );

  function setUsers(next: SchoolUser[]) {
    saveSchoolUsers(schoolId, next);
  }

  return { users, setUsers };
}
