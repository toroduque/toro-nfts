import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  RaidCategory,
  RaidLikelihood,
  RaidStatus,
} from "../data/types";
import { useStore } from "../store/AppStore";
import { riskLeadTime } from "../store/derive";
import { Chip, EmptyState, Stat } from "../components/ui";

const CATEGORIES: { value: RaidCategory; label: string; tone: string }[] = [
  { value: "risk", label: "Risk", tone: "red" },
  { value: "assumption", label: "Assumption", tone: "violet" },
  { value: "issue", label: "Issue", tone: "amber" },
  { value: "dependency", label: "Dependency", tone: "blue" },
];

const LIKELIHOODS: RaidLikelihood[] = ["low", "medium", "high"];
const STATUSES: { value: RaidStatus; label: string; tone: string }[] = [
  { value: "open", label: "Open", tone: "gray" },
  { value: "monitoring", label: "Monitoring", tone: "blue" },
  { value: "flagged", label: "Flagged", tone: "amber" },
  { value: "closed", label: "Closed", tone: "green" },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RaidLog() {
  const { data, addRaid, updateRaid, removeRaid } = useStore();
  const [filter, setFilter] = useState<RaidCategory | "all">("all");
  const lead = riskLeadTime(data.raid);

  const visible =
    filter === "all"
      ? data.raid
      : data.raid.filter((r) => r.category === filter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">RAID Log</h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Risks, assumptions, issues, dependencies for this account. Review
          every Monday. Any risk crossing ~30% likelihood of moving a
          client-facing date gets flagged that day — set the flagged date here
          and your lead time is computed automatically.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Entries" value={data.raid.length} />
        <Stat
          label="Open risks"
          value={
            data.raid.filter(
              (r) => r.category === "risk" && r.status !== "closed"
            ).length
          }
        />
        <Stat
          label="Avg lead time"
          value={lead.avg === null ? "—" : `${lead.avg}d`}
          sub="identified → flagged"
          tone={lead.avg === null ? "gray" : lead.avg <= 1 ? "green" : "amber"}
        />
        <Stat
          label="Flagged ≤ 1 day"
          value={lead.count ? `${lead.withinOneDay}/${lead.count}` : "—"}
          tone="gray"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`chip ${
              filter === "all"
                ? "bg-ink-900 text-white"
                : "bg-ink-100 text-ink-600"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`chip ${
                filter === c.value
                  ? "bg-ink-900 text-white"
                  : "bg-ink-100 text-ink-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            addRaid({
              category: "risk",
              description: "",
              likelihood: "medium",
              impact: "",
              owner: "",
              status: "open",
              dateIdentified: today(),
              dateFlagged: "",
            })
          }
        >
          <Plus size={16} /> Add entry
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No entries">
          Seed the log with every risk to the next two releases. The earlier you
          flag, the less anything lands as a surprise.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => {
            const cat = CATEGORIES.find((c) => c.value === r.category)!;
            return (
              <div key={r.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="input max-w-[150px]"
                    value={r.category}
                    onChange={(e) =>
                      updateRaid(r.id, {
                        category: e.target.value as RaidCategory,
                      })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <Chip tone={cat.tone}>{cat.label}</Chip>
                  <div className="ml-auto">
                    <button
                      className="btn-danger"
                      title="Delete entry"
                      onClick={() => removeRaid(r.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <textarea
                  className="input mt-3"
                  rows={2}
                  placeholder="Description — e.g. Vendor patch we depend on may slip past the test window."
                  value={r.description}
                  onChange={(e) =>
                    updateRaid(r.id, { description: e.target.value })
                  }
                />

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="label">Likelihood</label>
                    <select
                      className="input"
                      value={r.likelihood}
                      onChange={(e) =>
                        updateRaid(r.id, {
                          likelihood: e.target.value as RaidLikelihood,
                        })
                      }
                    >
                      {LIKELIHOODS.map((l) => (
                        <option key={l} value={l}>
                          {l[0].toUpperCase() + l.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Owner</label>
                    <input
                      className="input"
                      placeholder="who owns it"
                      value={r.owner}
                      onChange={(e) =>
                        updateRaid(r.id, { owner: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={r.status}
                      onChange={(e) =>
                        updateRaid(r.id, {
                          status: e.target.value as RaidStatus,
                        })
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="label">Impact if it lands</label>
                    <input
                      className="input"
                      placeholder="what client-facing date / outcome it threatens"
                      value={r.impact}
                      onChange={(e) =>
                        updateRaid(r.id, { impact: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Date identified</label>
                    <input
                      type="date"
                      className="input"
                      value={r.dateIdentified}
                      onChange={(e) =>
                        updateRaid(r.id, { dateIdentified: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Date flagged to client</label>
                    <input
                      type="date"
                      className="input"
                      value={r.dateFlagged}
                      onChange={(e) =>
                        updateRaid(r.id, { dateFlagged: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    {r.dateFlagged && r.dateIdentified ? (
                      <LeadChip
                        from={r.dateIdentified}
                        to={r.dateFlagged}
                      />
                    ) : r.category === "risk" ? (
                      <Chip tone="amber">not yet flagged</Chip>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LeadChip({ from, to }: { from: string; to: string }) {
  const days = Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000
  );
  if (Number.isNaN(days)) return null;
  const tone = days <= 1 ? "green" : days <= 3 ? "amber" : "red";
  return (
    <Chip tone={tone}>
      lead time: {days}d{days <= 1 ? " ✓" : ""}
    </Chip>
  );
}
