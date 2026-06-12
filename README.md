# Reliable Comms

An interactive learning app for the **Stakeholder Communication: Structured
Learning Path** — a sequenced route from "reactive communicator" to
"exceptionally reliable communicator," built for ~3 hours a week over 12 weeks.

It turns the static curriculum into working tools: the path itself with
exit-criteria gating, plus the instruments the path tells you to build (a
commitment log, a RAID log, fillable message templates, a pre-send checklist,
practice drills, and a metrics dashboard that auto-computes things like
commitment hit-rate and risk lead time).

## The destination

You are reliable when all six hold:

1. **No surprises** — the client never learns of a risk on the day it lands.
2. **Accuracy** — you never assert a fact about system state you haven't verified.
3. **Precision** — every update names versions, dates, statuses, owners exactly.
4. **Managed bad news** — bad news arrives with a plan and a checkpoint.
5. **Under-promise** — you quote dates you beat 90% of the time.
6. **One truth** — internal and external messages share identical facts in
   different registers.

## Features

- **Dashboard** — overall progress, live metrics, current stage, the six
  reliability conditions, and the full stage rail.
- **Learning Path** — six stages (0–5). Each has a goal, what to learn and
  read, drills, one habit to install, and **exit criteria you tick off**.
  Don't move on until you pass them.
- **Commitment & Decision Log** — one row per date promised or fact asserted.
  Drives the commitment hit-rate metric. Nothing reaches the client unlogged.
- **RAID Log** — risks, assumptions, issues, dependencies. Records when a risk
  was identified vs. flagged, and computes your risk lead time automatically.
- **Templates** — release status, early risk flag, bad news/delay, and weekly
  update. Fill the fields, copy the message.
- **Pre-send Checklist** — the eight-point gate to run on every client message.
- **Practice Drills** — every scenario from the path, with coaching notes and
  autosaved drafts.
- **Progress Signals** — the five monthly metrics, two auto-computed from your
  logs, plus export / import / reset of all your data.

## Data & privacy

Everything is stored in your browser's `localStorage` — no backend, no account,
nothing leaves your machine. Use **Progress Signals → Export backup** to save a
JSON copy or move between machines.

## Running it

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Stack

Vite · React 18 · TypeScript (strict) · React Router · Tailwind CSS ·
lucide-react. No backend.

## Start here

The single highest-leverage step is **Stage 0, today**: the commitment log plus
the 24-hour risk-flag rule. They directly prevent the two failures that trigger
most complaints, require no reading, and the client feels the difference within
a week.
