import type { AppData } from "../data/types";

export const STORAGE_KEY = "reliable-comms:v1";

export const EMPTY_DATA: AppData = {
  version: 1,
  progress: {},
  commitments: [],
  raid: [],
  drafts: {},
  checklistRuns: [],
  metrics: [],
};

export function loadData(): AppData {
  if (typeof localStorage === "undefined") return structuredClone(EMPTY_DATA);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(EMPTY_DATA);
    const parsed = JSON.parse(raw) as Partial<AppData>;
    // Merge against EMPTY_DATA so missing keys (from older versions) are filled.
    return { ...structuredClone(EMPTY_DATA), ...parsed };
  } catch {
    return structuredClone(EMPTY_DATA);
  }
}

export function saveData(data: AppData): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Quota or serialization failure — fail quietly; this is a personal tool.
  }
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
