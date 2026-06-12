import { useMemo, useState } from "react";
import { CheckCircle2, Circle, RotateCcw, Send } from "lucide-react";
import { CHECKLIST } from "../data/curriculum";
import { useStore } from "../store/AppStore";

export default function Checklist() {
  const { data, recordChecklistRun } = useStore();
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const [justSent, setJustSent] = useState(false);

  const doneCount = useMemo(
    () => CHECKLIST.filter((c) => ticked[c.id]).length,
    [ticked]
  );
  const allDone = doneCount === CHECKLIST.length;

  const lastRun = data.checklistRuns[0];
  const runsToday = data.checklistRuns.filter(
    (t) => new Date(t).toDateString() === new Date().toDateString()
  ).length;

  function reset() {
    setTicked({});
    setJustSent(false);
  }

  function send() {
    recordChecklistRun();
    setJustSent(true);
    setTimeout(reset, 1400);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">
          Pre-send Checklist
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Run this on every client message — no exceptions for "quick" replies.
          All eight must pass before you send.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 text-sm text-ink-500">
        <span>
          <strong className="text-ink-900">{runsToday}</strong> run
          {runsToday === 1 ? "" : "s"} today
        </span>
        <span>
          <strong className="text-ink-900">{data.checklistRuns.length}</strong>{" "}
          total
        </span>
        {lastRun && (
          <span>
            last: <strong className="text-ink-900">
              {new Date(lastRun).toLocaleString()}
            </strong>
          </span>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 bg-ink-50/60 px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-700">
              {doneCount}/{CHECKLIST.length} checks passed
            </span>
            <button className="btn-ghost" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
        <ul className="divide-y divide-ink-100">
          {CHECKLIST.map((c, i) => {
            const on = !!ticked[c.id];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() =>
                    setTicked((t) => ({ ...t, [c.id]: !t[c.id] }))
                  }
                  className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition ${
                    on ? "bg-emerald-50/60" : "hover:bg-ink-50"
                  }`}
                >
                  {on ? (
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                  ) : (
                    <Circle size={20} className="mt-0.5 shrink-0 text-ink-300" />
                  )}
                  <span className="flex gap-2 text-sm text-ink-800">
                    <span className="font-semibold text-ink-400">{i + 1}.</span>
                    {c.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center justify-end gap-3">
        {justSent ? (
          <span className="text-sm font-medium text-emerald-600">
            Logged — clear to send. ✓
          </span>
        ) : (
          <span className="text-sm text-ink-400">
            {allDone
              ? "All checks pass."
              : `${CHECKLIST.length - doneCount} to go.`}
          </span>
        )}
        <button className="btn-primary" disabled={!allDone} onClick={send}>
          <Send size={16} /> Mark as sent
        </button>
      </div>
    </div>
  );
}
