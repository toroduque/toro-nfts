import { Plus, Trash2 } from "lucide-react";
import type { CommitmentStatus } from "../data/types";
import { useStore } from "../store/AppStore";
import { commitmentHitRate } from "../store/derive";
import { Chip, EmptyState, Kicker, Stat } from "../components/ui";

const STATUS_OPTIONS: { value: CommitmentStatus; label: string; tone: string }[] =
  [
    { value: "open", label: "Open", tone: "gray" },
    { value: "verified", label: "Verified", tone: "blue" },
    { value: "met", label: "Met", tone: "green" },
    { value: "missed", label: "Missed", tone: "red" },
    { value: "cancelled", label: "Cancelled", tone: "gray" },
  ];

function statusTone(s: CommitmentStatus): string {
  return STATUS_OPTIONS.find((o) => o.value === s)?.tone ?? "gray";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CommitmentLog() {
  const {
    data,
    addCommitment,
    updateCommitment,
    removeCommitment,
  } = useStore();
  const hit = commitmentHitRate(data.commitments);
  const outstanding = data.commitments.filter(
    (c) => c.status === "open" || c.status === "verified"
  ).length;

  return (
    <div className="space-y-6">
      <header>
        <Kicker index="02">Stage 0 · core tool</Kicker>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink-900 sm:text-5xl">
          Commitment &amp; Decision Log
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          One row per date promised or fact asserted to the client. Rule:
          nothing reaches the client unlogged. Verify facts against the source
          of record before sending — and record the check here.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Total logged" value={data.commitments.length} />
        <Stat label="Outstanding" value={outstanding} sub="open or verified" />
        <Stat
          label="Hit rate"
          value={hit.rate === null ? "—" : `${hit.rate}%`}
          sub={`${hit.met} met · ${hit.missed} missed`}
          tone={hit.rate === null ? "gray" : hit.rate >= 90 ? "green" : "red"}
        />
      </div>

      <div className="flex justify-end">
        <button
          className="btn-primary"
          onClick={() =>
            addCommitment({
              dateMade: today(),
              what: "",
              where: "",
              verifiedAgainst: "",
              due: "",
              status: "open",
              outcome: "",
            })
          }
        >
          <Plus size={16} /> Add commitment
        </button>
      </div>

      {data.commitments.length === 0 ? (
        <EmptyState title="No commitments logged yet">
          Backfill everything currently outstanding to the client, then keep it
          live. This log is what your commitment hit-rate metric is computed
          from.
        </EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-3 py-2.5">Date made</th>
                <th className="px-3 py-2.5">What I committed / asserted</th>
                <th className="px-3 py-2.5">Where</th>
                <th className="px-3 py-2.5">Verified against</th>
                <th className="px-3 py-2.5">Due</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Outcome</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {data.commitments.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-ink-100 align-top last:border-0"
                >
                  <td className="px-2 py-2">
                    <input
                      type="date"
                      className="input"
                      value={c.dateMade}
                      onChange={(e) =>
                        updateCommitment(c.id, { dateMade: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <textarea
                      className="input min-h-[38px] min-w-[180px]"
                      rows={1}
                      placeholder="v4.2.1 live by Thu 18th"
                      value={c.what}
                      onChange={(e) =>
                        updateCommitment(c.id, { what: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      className="input min-w-[110px]"
                      placeholder="email / call"
                      value={c.where}
                      onChange={(e) =>
                        updateCommitment(c.id, { where: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      className="input min-w-[130px]"
                      placeholder="release log / ticket"
                      value={c.verifiedAgainst}
                      onChange={(e) =>
                        updateCommitment(c.id, {
                          verifiedAgainst: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="date"
                      className="input"
                      value={c.due}
                      onChange={(e) =>
                        updateCommitment(c.id, { due: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      className="input min-w-[110px]"
                      value={c.status}
                      onChange={(e) =>
                        updateCommitment(c.id, {
                          status: e.target.value as CommitmentStatus,
                        })
                      }
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1">
                      <Chip tone={statusTone(c.status)}>
                        {STATUS_OPTIONS.find((o) => o.value === c.status)?.label}
                      </Chip>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <textarea
                      className="input min-h-[38px] min-w-[140px]"
                      rows={1}
                      placeholder="result / note"
                      value={c.outcome}
                      onChange={(e) =>
                        updateCommitment(c.id, { outcome: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      className="btn-danger"
                      title="Delete row"
                      onClick={() => removeCommitment(c.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
