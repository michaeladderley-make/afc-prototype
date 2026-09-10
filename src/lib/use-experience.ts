"use client";

import { useSyncExternalStore } from "react";

import {
  emptyExperience,
  getExperience,
  subscribeExperience,
} from "@/lib/experience";

export function useExperience() {
  return useSyncExternalStore(
    subscribeExperience,
    getExperience,
    emptyExperience,
  );
}
