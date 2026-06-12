// ---------------------------------------------------------------------------
// Curriculum content types (static, defined in curriculum.ts)
// ---------------------------------------------------------------------------

export interface ReadingItem {
  /** e.g. "Smart Brevity (Axios authors)" */
  title: string;
  /** what to read / scope, e.g. "in full, it's short" */
  scope: string;
}

export interface Drill {
  /** stable id, used to key saved drafts */
  id: string;
  /** short title for navigation */
  title: string;
  /** the scenario prompt */
  scenario: string;
  /** optional coaching note / what good looks like */
  guidance?: string;
  /** true if this drill is best run live with a partner / AI */
  live?: boolean;
}

export interface ExitCriterion {
  /** stable id, used to key progress */
  id: string;
  text: string;
}

export interface Stage {
  /** numeric stage, 0-5 */
  stage: number;
  id: string;
  title: string;
  /** "this week" / "weeks 1 to 2" etc. */
  timeframe: string;
  goal: string;
  /** "Learn" bullets */
  learn?: { term: string; body: string }[];
  /** "Do" bullets (used by setup / mastery stages) */
  doItems?: string[];
  reading?: ReadingItem[];
  drills?: Drill[];
  /** the single habit to install this stage */
  habit?: string;
  exitCriteria: ExitCriterion[];
}

export interface DestinationCriterion {
  id: string;
  short: string;
  text: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  /** render as multiline textarea */
  multiline?: boolean;
}

export interface TemplateDef {
  id: string;
  name: string;
  blurb: string;
  fields: TemplateField[];
  /** builds the output string from filled field values */
  render: (v: Record<string, string>) => string;
}

export interface ProgressSignal {
  id: string;
  label: string;
  target: string;
  /** how this metric is sourced */
  source: "auto" | "manual";
  hint?: string;
}

// ---------------------------------------------------------------------------
// User data types (persisted in localStorage)
// ---------------------------------------------------------------------------

export type CommitmentStatus =
  | "open"
  | "verified"
  | "met"
  | "missed"
  | "cancelled";

export interface Commitment {
  id: string;
  dateMade: string; // ISO date
  what: string;
  where: string;
  verifiedAgainst: string;
  due: string; // ISO date
  status: CommitmentStatus;
  outcome: string;
  createdAt: number;
}

export type RaidCategory = "risk" | "assumption" | "issue" | "dependency";
export type RaidLikelihood = "low" | "medium" | "high";
export type RaidStatus = "open" | "monitoring" | "flagged" | "closed";

export interface RaidEntry {
  id: string;
  category: RaidCategory;
  description: string;
  likelihood: RaidLikelihood;
  impact: string;
  owner: string;
  status: RaidStatus;
  /** date you became aware (drives risk lead time) */
  dateIdentified: string;
  /** date you flagged it to the client, if applicable */
  dateFlagged: string;
  createdAt: number;
}

export interface DrillDraft {
  text: string;
  updatedAt: number;
}

/** Manually-tracked monthly metric readings for the progress signals. */
export interface MetricReading {
  id: string;
  signalId: string;
  month: string; // YYYY-MM
  value: number;
  createdAt: number;
}

export interface AppData {
  /** version for future migrations */
  version: number;
  /** exitCriterionId -> checked */
  progress: Record<string, boolean>;
  commitments: Commitment[];
  raid: RaidEntry[];
  /** drillId -> draft */
  drafts: Record<string, DrillDraft>;
  /** ISO date of last completed pre-send checklist run */
  checklistRuns: number[]; // timestamps
  metrics: MetricReading[];
}
