import { ALL_EXIT_CRITERIA, STAGES } from "../data/curriculum";
import type { AppData, Commitment, RaidEntry } from "../data/types";

/** Working-day-ish difference in whole days between two ISO dates. */
function dayDiff(fromISO: string, toISO: string): number | null {
  if (!fromISO || !toISO) return null;
  const a = new Date(fromISO).getTime();
  const b = new Date(toISO).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86_400_000);
}

export interface HitRate {
  met: number;
  missed: number;
  /** percentage 0-100, or null if no resolved commitments */
  rate: number | null;
}

export function commitmentHitRate(commitments: Commitment[]): HitRate {
  const met = commitments.filter((c) => c.status === "met").length;
  const missed = commitments.filter((c) => c.status === "missed").length;
  const total = met + missed;
  return { met, missed, rate: total ? Math.round((met / total) * 100) : null };
}

export interface LeadTime {
  /** average lead time in days across flagged risks, or null */
  avg: number | null;
  count: number;
  /** how many were flagged within 1 day */
  withinOneDay: number;
}

export function riskLeadTime(raid: RaidEntry[]): LeadTime {
  const diffs = raid
    .filter((r) => r.category === "risk" && r.dateFlagged && r.dateIdentified)
    .map((r) => dayDiff(r.dateIdentified, r.dateFlagged))
    .filter((d): d is number => d !== null && d >= 0);
  if (!diffs.length) return { avg: null, count: 0, withinOneDay: 0 };
  const sum = diffs.reduce((a, b) => a + b, 0);
  return {
    avg: Math.round((sum / diffs.length) * 10) / 10,
    count: diffs.length,
    withinOneDay: diffs.filter((d) => d <= 1).length,
  };
}

export interface StageProgress {
  stage: number;
  id: string;
  title: string;
  done: number;
  total: number;
  complete: boolean;
}

export function stageProgress(data: AppData): StageProgress[] {
  return STAGES.map((s) => {
    const total = s.exitCriteria.length;
    const done = s.exitCriteria.filter((c) => data.progress[c.id]).length;
    return {
      stage: s.stage,
      id: s.id,
      title: s.title,
      done,
      total,
      complete: total > 0 && done === total,
    };
  });
}

export function overallProgress(data: AppData): {
  done: number;
  total: number;
  pct: number;
} {
  const total = ALL_EXIT_CRITERIA.length;
  const done = ALL_EXIT_CRITERIA.filter((c) => data.progress[c.id]).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/**
 * A stage is "unlocked" if every earlier stage is complete. Stage 0 and 1 are
 * always available so the user can get going; later stages indicate gating
 * visually rather than hard-blocking (it's a personal tool, not a prison).
 */
export function currentStage(data: AppData): number {
  const prog = stageProgress(data);
  for (const p of prog) {
    if (!p.complete) return p.stage;
  }
  return STAGES[STAGES.length - 1].stage;
}
