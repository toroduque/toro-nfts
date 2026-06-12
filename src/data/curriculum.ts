import type {
  ChecklistItem,
  DestinationCriterion,
  ProgressSignal,
  Stage,
  TemplateDef,
} from "./types";

// ---------------------------------------------------------------------------
// The destination — the six conditions of reliability
// ---------------------------------------------------------------------------

export const DESTINATION: DestinationCriterion[] = [
  {
    id: "d-no-surprises",
    short: "No surprises",
    text: "The client never learns of a risk on the day it lands.",
  },
  {
    id: "d-accuracy",
    short: "Accuracy",
    text: "You never assert a fact about system state you haven't verified.",
  },
  {
    id: "d-precision",
    short: "Precision",
    text: "Every update names versions, dates, statuses, owners exactly.",
  },
  {
    id: "d-managed",
    short: "Managed bad news",
    text: "Bad news arrives with a plan and a checkpoint — managed, not scrambling.",
  },
  {
    id: "d-under-promise",
    short: "Under-promise",
    text: "You quote dates you beat 90% of the time.",
  },
  {
    id: "d-one-truth",
    short: "One truth",
    text: "Internal and external messages share identical facts in different registers.",
  },
];

// ---------------------------------------------------------------------------
// Stages 0 - 5
// ---------------------------------------------------------------------------

export const STAGES: Stage[] = [
  {
    stage: 0,
    id: "stage-0",
    title: "Setup",
    timeframe: "This week · ~2 hours",
    goal: "The structural guards go in before any reading — these alone would have prevented your accuracy failure and most of the surprise pattern.",
    doItems: [
      "Create a commitment & decision log: one row per date promised or fact asserted to the client. Backfill everything currently outstanding.",
      "Create a RAID log (risks, assumptions, issues, dependencies) for this account. Seed it with every risk to the next two releases.",
      "Adopt — effective immediately — Verify before assert: any claim about what's live, deployed, or fixed gets checked against the source of record before sending. Log the check.",
      "Adopt — effective immediately — the 24-hour risk flag: the client hears about any date-threatening risk within one working day of you learning it.",
    ],
    exitCriteria: [
      { id: "x0-logs", text: "Both logs exist and are populated." },
      {
        id: "x0-verified-msg",
        text: "You have sent at least one message that went through verification.",
      },
      {
        id: "x0-zero-unlogged",
        text: "Zero unlogged commitments outstanding.",
      },
    ],
  },
  {
    stage: 1,
    id: "stage-1",
    title: "Foundations — tight, answer-first writing",
    timeframe: "Weeks 1–2",
    goal: "Every message leads with the bottom line and wastes no words. This kills the 'scrambling' tone fastest.",
    learn: [
      {
        term: "BLUF (bottom line up front)",
        body: "First sentence carries the decision-relevant fact. e.g. \"v4.2.1 will not release tomorrow. New target: Thursday 18th, pending your sign-off Wednesday.\" Then support.",
      },
      {
        term: "Minto Pyramid (core idea)",
        body: "Answer first, then grouped supporting points. For status updates: headline status → what changed → impact on you → what we're doing → what we need from you.",
      },
    ],
    reading: [
      {
        title: "Smart Brevity (Axios authors)",
        scope: "in full — it's short. Immediate payoff on Slack and email.",
      },
      {
        title: "The Pyramid Principle (Minto)",
        scope: "Part 1 only, chapters 1–5. Skip the rest.",
      },
    ],
    drills: [
      {
        id: "drill-1-rewrite",
        title: "Rewrite your last three client emails",
        scenario:
          "Take your three most recent client emails and rewrite each using BLUF + pyramid. Paste before/after here and compare. Did the bottom line move to sentence one? How many words did you cut?",
        guidance:
          "Bottom line first, then group support into: what changed → impact on you → what we're doing → what we need from you.",
      },
      {
        id: "drill-1-basically",
        title: "The hedging engineer",
        scenario:
          'Your engineer says: "the fix is basically done, should be fine for Friday." Draft the client update.',
        guidance:
          "Don't transmit \"basically\" or \"should be\". Convert them to a verified status, or to a hedged date you control. If you can't verify, say what you're confirming and by when.",
      },
    ],
    habit:
      "Pre-send checklist on every client message. No exceptions for 'quick' replies.",
    exitCriteria: [
      {
        id: "x1-five-pass",
        text: "Five consecutive client messages pass the checklist on first draft.",
      },
      {
        id: "x1-bluf",
        text: "Bottom line is sentence one in all of them.",
      },
    ],
  },
  {
    stage: 2,
    id: "stage-2",
    title: "Precision & proactive risk flagging",
    timeframe: "Weeks 3–4",
    goal: "Delays stop landing as surprises; vagueness disappears.",
    learn: [
      {
        term: "RAID discipline",
        body: "Review the log every Monday. Any risk crossing ~30% likelihood of moving a client-facing date gets flagged that day: what's at risk → why (one factual sentence) → likelihood → what we're doing → fallback plan → when you'll confirm either way.",
      },
      {
        term: "Concreteness",
        body: '"build 4.2.1-rc3 passed 47/47 regression tests in your dedicated test environment" beats "QA is going well." Specifics let the client compute their exposure without guessing.',
      },
      {
        term: "Pre-mortem (Gary Klein)",
        body: "Before committing any date, spend ten minutes assuming it slipped and listing why. Feed results into RAID. Quote the date that survives the pre-mortem.",
      },
    ],
    reading: [
      {
        title: "Made to Stick (Heath brothers)",
        scope: 'chapter 1 plus the "Simple" and "Concrete" chapters. Your imprecision antidote.',
      },
      {
        title: "Writing Without Bullshit (Bernoff)",
        scope: "skim once, keep as reference.",
      },
    ],
    drills: [
      {
        id: "drill-2-vendor",
        title: "The vendor dependency",
        scenario:
          "Monday RAID review surfaces a vendor dependency ~30% likely to push month-end. Old you waits. Draft what new you sends today.",
        guidance:
          "Use the early-flag format. Flag now precisely because it's only 30% — that's what stops it landing as a surprise.",
      },
      {
        id: "drill-2-blocker",
        title: "The Wednesday blocker",
        scenario:
          "Wednesday: QA finds a blocker in a build due for Friday sign-off, 50/50 it's fixed in time. Draft Wednesday's message.",
        guidance:
          "Name the build, the test, the odds as of today, what you're doing, and exactly when you'll confirm either way.",
      },
    ],
    habit:
      "Monday RAID review, calendar-blocked, with same-day flags for anything over threshold.",
    exitCriteria: [
      {
        id: "x2-lead-time",
        text: "Risk lead time (you learning → client hearing) under 1 working day for two consecutive weeks.",
      },
      {
        id: "x2-precision",
        text: "Every update in that period names exact versions, dates, and statuses.",
      },
    ],
  },
  {
    stage: 3,
    id: "stage-3",
    title: "Delivering bad news as managed, not reactive",
    timeframe: "Weeks 5–7",
    goal: "When things do slip, the message strengthens trust instead of draining it.",
    learn: [
      {
        term: "The bad-news formula",
        body: "what happened (factual, cause-neutral) → impact on you (specific, incl. what's NOT affected) → what we've already done → revised plan with dates & owners → next checkpoint. Sequencing matters: 'already done' before 'plan' is what reads as in-control.",
      },
      {
        term: "SBAR (situation, background, assessment, recommendation)",
        body: "For escalations and incidents. Its value for you: it forcibly separates verified fact (S, B) from judgement (A) — the discipline that prevents asserting unverified things.",
      },
      {
        term: "Cause-neutrality externally",
        body: 'Until root cause is confirmed, describe effects, not blame. "A regression in the loyalty module failed QA" not "the team skipped a test suite."',
      },
    ],
    reading: [
      {
        title: "Crucial Conversations",
        scope: "chapters 3–8. Facts first, tentative framing, invite challenge.",
      },
      {
        title: 'Google SRE Workbook — "Postmortem Culture"',
        scope: "free online, one sitting. The gold standard for blameless external incident comms.",
      },
    ],
    drills: [
      {
        id: "drill-3-hold",
        title: "The build hold",
        scenario:
          "A build is scheduled tonight but a dependency patch missed the test environment. Draft the hold recommendation — to a client tired of delays.",
        guidance:
          "Lead with the recommendation and the protection it gives them. Use the bad-news formula; 'already done' before 'plan'.",
      },
      {
        id: "drill-3-register",
        title: "Register split (same incident, two audiences)",
        scenario:
          "An issue was caused by a teammate skipping regression tests. Draft the internal Slack post AND the client email about the same incident. Check: identical facts, different register?",
        guidance:
          "Internal can name the cause for fixing it. External stays cause-neutral. The FACTS must be identical — only tone and detail differ.",
      },
      {
        id: "drill-3-nearmiss",
        title: "The near-miss",
        scenario:
          'You\'re about to send "no builds went to production this week" and something nags. Walk through exactly what you check, where, and what you send if you can\'t verify in time.',
        guidance:
          "Name the source of record you'd check (release log / environment / ticket). If you can't verify before sending, you do not assert — you state what you're confirming and by when.",
      },
    ],
    habit: "Pre-mortem before every committed date.",
    exitCriteria: [
      {
        id: "x3-hit-rate",
        text: "Commitment log shows 90%+ hit rate on dates committed since Stage 0.",
      },
      {
        id: "x3-real-msg",
        text: "One real bad-news / hold message sent using the formula, with no follow-up confusion from the client.",
      },
    ],
  },
  {
    stage: 4,
    id: "stage-4",
    title: "Trust repair & high-stakes conversations",
    timeframe: "Weeks 8–10",
    goal: "Convert your now-reliable mechanics into rebuilt relationship capital ahead of renewal.",
    learn: [
      {
        term: "The trust equation (Maister)",
        body: "trust = (credibility + reliability + intimacy) / self-orientation. Your incident damaged reliability; Stages 0–3 are the repair. This stage works the other three terms — especially lowering self-orientation (the conversation is about their stores, not your process).",
      },
      {
        term: "The three conversations (Stone/Patton/Heen)",
        body: "Every difficult exchange is simultaneously about what happened, feelings, and identity. The written complaint stung at the identity layer — respond to the person and the issue.",
      },
    ],
    reading: [
      {
        title: "The Trusted Advisor",
        scope: "chapters 1–8, especially the trust equation.",
      },
      { title: "Difficult Conversations", scope: "chapters 1–5." },
      {
        title: "Thanks for the Feedback",
        scope: "chapters 1–4. The manual for metabolising the formal complaint without defensiveness.",
      },
    ],
    drills: [
      {
        id: "drill-4-escalation",
        title: "The escalation threat",
        scenario:
          'The client\'s IT director writes: "Third delay this quarter. We are escalating to procurement ahead of renewal." Draft your same-day reply.',
        guidance:
          "Respond to the person and the issue. Lower self-orientation — it's about their exposure, not your process. Facts, ownership, concrete forward plan.",
      },
      {
        id: "drill-4-recommit",
        title: "The recommit",
        scenario:
          "A date you'd already flagged as at-risk now definitively slips. Draft the confirmation — and notice how different it feels from announcing a surprise.",
        guidance:
          "Because you flagged early, this is a confirmation, not a bombshell. Reference the earlier flag explicitly.",
      },
      {
        id: "drill-4-live",
        title: "Run the two hardest drills live",
        scenario:
          "Run the escalation and recommit drills live with an AI or colleague playing the client — with interruptions and pushback.",
        guidance: "Stay on facts under pressure. Don't get pulled into the identity fight.",
        live: true,
      },
    ],
    habit:
      "Weekly stakeholder update — same day, same time, every week, even when uneventful: headline · delivered · coming next · risks · needs from you · open commitments. Boring reliability is the product.",
    exitCriteria: [
      {
        id: "x4-four-updates",
        text: "Four consecutive weekly updates sent on schedule.",
      },
      { id: "x4-zero-surprises", text: "Zero client surprises in the period." },
      {
        id: "x4-positive-signal",
        text: 'At least one unprompted positive signal from the client (or absence of "where are we on X?" chasers).',
      },
    ],
  },
  {
    stage: 5,
    id: "stage-5",
    title: "Mastery & the renewal conversation",
    timeframe: "Weeks 11–12",
    goal: "Consolidate, measure, and walk into renewal with evidence.",
    doItems: [
      "Build your trust-rebuild narrative for the renewal conversation, evidenced by your metrics: risk lead time, surprises per release (target zero), commitment hit rate, accuracy incidents (zero by construction of the log).",
      "Rehearse it aloud, with someone playing the sceptical procurement lead.",
      "Run a monthly self-retro: one communication that went well; one that didn't; one rule to tighten.",
      "Backfill any unread chapters; cherry-pick Lenny's Podcast episodes on stakeholder management for reinforcement during commutes.",
    ],
    exitCriteria: [
      {
        id: "x5-evidence",
        text: "You can show, with logged numbers, that the patterns named in the written complaint have not recurred in 8+ weeks.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Appendix B — pre-send checklist
// ---------------------------------------------------------------------------

export const CHECKLIST: ChecklistItem[] = [
  { id: "c1", text: "Bottom line in the first sentence?" },
  {
    id: "c2",
    text: "Every factual claim verified against a source of record, and logged?",
  },
  { id: "c3", text: "Versions, dates, statuses, owners named exactly?" },
  { id: "c4", text: "If there's a problem: plan + next checkpoint included?" },
  { id: "c5", text: "Every committed date one I'd bet on at 90%?" },
  {
    id: "c6",
    text: "External register: cause-neutral, no internal blame, no speculation?",
  },
  {
    id: "c7",
    text: "Would anything here surprise them? If yes — should they have heard it earlier?",
  },
  { id: "c8", text: "Can I cut a third of the words?" },
];

// ---------------------------------------------------------------------------
// Appendix A — templates
// ---------------------------------------------------------------------------

export const TEMPLATES: TemplateDef[] = [
  {
    id: "tpl-release",
    name: "Release status update",
    blurb: "Routine status with no bad news. Headline fact first.",
    fields: [
      { key: "product", label: "Product", placeholder: "Loyalty Platform" },
      { key: "version", label: "Version", placeholder: "v4.2.1" },
      {
        key: "state",
        label: "State",
        placeholder: "ON TRACK / AT RISK / SLIPPED / LIVE",
      },
      {
        key: "headline",
        label: "Headline fact (one line)",
        placeholder: "v4.2.1 is on track for Thursday 18th sign-off.",
      },
      {
        key: "build",
        label: "Exact build",
        placeholder: "4.2.1-rc3",
      },
      { key: "env", label: "Environment", placeholder: "your dedicated test env" },
      {
        key: "changed",
        label: "What changed (2–3 concrete bullets)",
        placeholder: "- Passed 47/47 regression tests\n- Fixed loyalty point rounding",
        multiline: true,
      },
      {
        key: "impact",
        label: "Impact on you",
        placeholder: 'specific, or "none"',
      },
      {
        key: "need",
        label: "Need from you",
        placeholder: 'ask + deadline, or "nothing"',
      },
      {
        key: "checkpoint",
        label: "Next checkpoint",
        placeholder: "Wed 17th, 4pm",
      },
    ],
    render: (v) =>
      `Subject: ${or(v.product, "[Product]")} release status: ${or(
        v.version,
        "[X.Y.Z]"
      )} — ${or(v.state, "[ON TRACK / AT RISK / SLIPPED / LIVE]")}

${or(v.headline, "[headline fact, one line]")}.

Version: ${or(v.build, "[exact build]")} in ${or(v.env, "[environment]")}.

What changed:
${bullets(v.changed)}

Impact on you: ${or(v.impact, '[specific, or "none"]')}.

Need from you: ${or(v.need, '[ask + deadline, or "nothing"]')}.

Next checkpoint: ${or(v.checkpoint, "[date/time]")}.`,
  },
  {
    id: "tpl-flag",
    name: "Early risk flag",
    blurb: "Flag it before it lands. Under threshold? Still flag.",
    fields: [
      { key: "milestone", label: "Milestone", placeholder: "v4.2.1 sign-off" },
      { key: "date", label: "Date at risk", placeholder: "Thursday 18th" },
      {
        key: "why",
        label: "Why (one factual sentence)",
        placeholder: "A vendor patch we depend on has slipped to the 16th.",
      },
      {
        key: "likelihood",
        label: "Likelihood (as of today)",
        placeholder: "low / medium / high",
      },
      {
        key: "doing",
        label: "What we're doing (1–2 actions)",
        placeholder: "Chasing the vendor daily; preparing a fallback build.",
        multiline: true,
      },
      {
        key: "fallback",
        label: "If it slips (fallback)",
        placeholder: "We ship without module X on the 18th and patch it on the 22nd.",
      },
      {
        key: "confirm",
        label: "I'll confirm either way by",
        placeholder: "Wed 17th, end of day",
      },
    ],
    render: (v) =>
      `Subject: Early flag: ${or(v.milestone, "[milestone]")} is at risk

Flagging early so this doesn't land as a surprise: ${or(
        v.milestone,
        "[milestone]"
      )} on ${or(v.date, "[date]")} is at risk.

Why: ${or(v.why, "[one factual sentence]")}.

Likelihood: ${or(v.likelihood, "[low/med/high]")} as of today.

Doing: ${or(v.doing, "[1–2 actions]")}.

If it slips: ${or(v.fallback, "[fallback]")}.

I'll confirm either way by ${or(v.confirm, "[date/time]")}.`,
  },
  {
    id: "tpl-badnews",
    name: "Bad news / delay",
    blurb: "Already-done before plan. That's what reads as in-control.",
    fields: [
      { key: "milestone", label: "Milestone", placeholder: "v4.2.1 sign-off" },
      { key: "oldDate", label: "Old date", placeholder: "Thursday 18th" },
      { key: "newDate", label: "New committed date", placeholder: "Tuesday 23rd" },
      {
        key: "happened",
        label: "What happened (factual, cause-neutral)",
        placeholder: "A regression in the loyalty module failed QA.",
        multiline: true,
      },
      {
        key: "impact",
        label: "Impact on you (what is and isn't affected)",
        placeholder: "Reporting is unaffected; only point-accrual is held.",
        multiline: true,
      },
      {
        key: "done",
        label: "Already done",
        placeholder: "Isolated the regression; reverted to rc2 in test.",
        multiline: true,
      },
      {
        key: "plan",
        label: "Plan (steps, dates, owners)",
        placeholder: "- Fix + retest by Mon 21 (A. Patel)\n- Sign-off build Tue 23 (you)",
        multiline: true,
      },
      {
        key: "checkpoint",
        label: "Next checkpoint",
        placeholder: "Mon 21st, 10am",
      },
    ],
    render: (v) =>
      `Subject: ${or(v.milestone, "[Milestone]")} is moving to ${or(
        v.newDate,
        "[new date]"
      )} — here's the plan

${or(v.milestone, "[Milestone]")} will not happen on ${or(
        v.oldDate,
        "[old date]"
      )}. New committed date: ${or(v.newDate, "[new date]")}.

What happened: ${or(v.happened, "[factual, cause-neutral]")}.

Impact on you: ${or(v.impact, "[what is and isn't affected]")}.

Already done: ${or(v.done, "[actions]")}.

Plan:
${bullets(v.plan)}

Next checkpoint: ${or(v.checkpoint, "[date/time]")}.`,
  },
  {
    id: "tpl-weekly",
    name: "Weekly update",
    blurb: "Same day, same time, every week — even when uneventful.",
    fields: [
      { key: "account", label: "Account", placeholder: "Acme Retail" },
      { key: "date", label: "Date", placeholder: "12 Jun 2026" },
      {
        key: "headline",
        label: "Headline (one sentence)",
        placeholder: "On track for the 23rd; one new low risk flagged.",
      },
      {
        key: "delivered",
        label: "Delivered (with versions/tickets)",
        placeholder: "- 4.2.1-rc3 to test (TICK-412)\n- Fixed point rounding (TICK-418)",
        multiline: true,
      },
      {
        key: "next",
        label: "Next week (with dates)",
        placeholder: "- Sign-off build Tue 23\n- Begin 4.3 scoping",
        multiline: true,
      },
      {
        key: "risks",
        label: "Risks",
        placeholder: 'from RAID, or "none new"',
        multiline: true,
      },
      {
        key: "needs",
        label: "Needs from you",
        placeholder: 'asks, or "nothing"',
        multiline: true,
      },
      {
        key: "commitments",
        label: "Open commitments (each date + status)",
        placeholder: "- Sign-off 23rd: on track\n- 4.3 scope doc 30th: on track",
        multiline: true,
      },
    ],
    render: (v) =>
      `Subject: ${or(v.account, "[Account]")} weekly update — ${or(
        v.date,
        "[date]"
      )}

Headline: ${or(v.headline, "[one sentence]")}.

Delivered:
${bullets(v.delivered)}

Next week:
${bullets(v.next)}

Risks:
${bullets(v.risks)}

Needs from you:
${bullets(v.needs)}

Open commitments:
${bullets(v.commitments)}`,
  },
];

// ---------------------------------------------------------------------------
// Appendix C — progress signals
// ---------------------------------------------------------------------------

export const SIGNALS: ProgressSignal[] = [
  {
    id: "sig-lead-time",
    label: "Risk lead time",
    target: "< 1 working day",
    source: "auto",
    hint: "Computed from RAID entries: days between identified and flagged.",
  },
  {
    id: "sig-surprises",
    label: "Client surprises per release",
    target: "0",
    source: "manual",
  },
  {
    id: "sig-hit-rate",
    label: "Commitment hit rate",
    target: "≥ 90%",
    source: "auto",
    hint: "Computed from the commitment log: met / (met + missed).",
  },
  {
    id: "sig-accuracy",
    label: "Accuracy incidents",
    target: "0",
    source: "manual",
  },
  {
    id: "sig-chasers",
    label: '"Where are we on X?" chasers',
    target: "→ 0",
    source: "manual",
  },
];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function or(value: string | undefined, fallback: string): string {
  const v = (value ?? "").trim();
  return v.length ? v : fallback;
}

/** Normalise a multiline field into "- " bullets. */
function bullets(value: string | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "- [ … ]";
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("-") ? line : `- ${line}`))
    .join("\n");
}

// All exit criteria flattened — used to compute overall progress.
export const ALL_EXIT_CRITERIA = STAGES.flatMap((s) =>
  s.exitCriteria.map((c) => ({ ...c, stage: s.stage, stageId: s.id }))
);
