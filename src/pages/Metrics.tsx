import { useRef, useState } from "react";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import { SIGNALS } from "../data/curriculum";
import { useStore } from "../store/AppStore";
import { commitmentHitRate, riskLeadTime } from "../store/derive";
import { Chip, Stat } from "../components/ui";

function thisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export default function Metrics() {
  const { data, addMetric, removeMetric, exportData, importData, resetData } =
    useStore();
  const hit = commitmentHitRate(data.commitments);
  const lead = riskLeadTime(data.raid);

  const autoValue: Record<string, { value: string; tone: string }> = {
    "sig-hit-rate": {
      value: hit.rate === null ? "—" : `${hit.rate}%`,
      tone: hit.rate === null ? "gray" : hit.rate >= 90 ? "green" : "red",
    },
    "sig-lead-time": {
      value: lead.avg === null ? "—" : `${lead.avg}d`,
      tone: lead.avg === null ? "gray" : lead.avg <= 1 ? "green" : "amber",
    },
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">
          Progress Signals
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Review monthly. Two are computed automatically from your logs; the
          rest you log here. This is the evidence you walk into the renewal
          conversation with.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {SIGNALS.map((s) => {
          const auto = autoValue[s.id];
          if (auto) {
            return (
              <Stat
                key={s.id}
                label={s.label}
                value={auto.value}
                sub={`target ${s.target} · auto`}
                tone={auto.tone as "gray" | "green" | "red" | "amber"}
              />
            );
          }
          const readings = data.metrics
            .filter((m) => m.signalId === s.id)
            .sort((a, b) => b.month.localeCompare(a.month));
          const latest = readings[0];
          return (
            <Stat
              key={s.id}
              label={s.label}
              value={latest ? latest.value : "—"}
              sub={
                latest ? `${latest.month} · target ${s.target}` : `target ${s.target}`
              }
            />
          );
        })}
      </div>

      {/* Manual signal logging */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
          Log a monthly reading
        </h2>
        {SIGNALS.filter((s) => s.source === "manual").map((s) => (
          <ManualSignal
            key={s.id}
            signalId={s.id}
            label={s.label}
            target={s.target}
            readings={data.metrics
              .filter((m) => m.signalId === s.id)
              .sort((a, b) => b.month.localeCompare(a.month))}
            onAdd={(month, value) =>
              addMetric({ signalId: s.id, month, value })
            }
            onRemove={removeMetric}
          />
        ))}
      </section>

      {/* Data management */}
      <DataManagement
        onExport={exportData}
        onImport={importData}
        onReset={resetData}
      />
    </div>
  );
}

function ManualSignal({
  signalId,
  label,
  target,
  readings,
  onAdd,
  onRemove,
}: {
  signalId: string;
  label: string;
  target: string;
  readings: { id: string; month: string; value: number }[];
  onAdd: (month: string, value: number) => void;
  onRemove: (id: string) => void;
}) {
  const [month, setMonth] = useState(thisMonth());
  const [value, setValue] = useState("");

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px]">
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          <p className="text-xs text-ink-400">target {target}</p>
        </div>
        <div>
          <label className="label" htmlFor={`m-${signalId}`}>
            Month
          </label>
          <input
            id={`m-${signalId}`}
            type="month"
            className="input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div className="w-28">
          <label className="label" htmlFor={`v-${signalId}`}>
            Value
          </label>
          <input
            id={`v-${signalId}`}
            type="number"
            className="input"
            placeholder="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          className="btn-primary"
          disabled={value === ""}
          onClick={() => {
            onAdd(month, Number(value));
            setValue("");
          }}
        >
          <Plus size={16} /> Log
        </button>
      </div>

      {readings.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {readings.map((r) => (
            <span
              key={r.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-xs text-ink-700"
            >
              <strong>{r.month}</strong>: {r.value}
              <button
                className="text-ink-400 hover:text-red-600"
                onClick={() => onRemove(r.id)}
                title="Remove reading"
              >
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DataManagement({
  onExport,
  onImport,
  onReset,
}: {
  onExport: () => string;
  onImport: (json: string) => boolean;
  onReset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function download() {
    const blob = new Blob([onExport()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reliable-comms-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImport(String(reader.result));
      setMsg(ok ? "Imported ✓" : "Import failed — invalid file.");
      setTimeout(() => setMsg(null), 2500);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <section className="card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-600">
        Your data
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Everything lives in this browser only. Export a backup before clearing
        browser data, or to move between machines.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn-outline" onClick={download}>
          <Download size={16} /> Export backup
        </button>
        <button className="btn-outline" onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onFile}
        />
        <button
          className="btn-danger"
          onClick={() => {
            if (
              confirm(
                "Reset all progress, logs, drafts and metrics? This cannot be undone."
              )
            ) {
              onReset();
              setMsg("Reset.");
              setTimeout(() => setMsg(null), 2000);
            }
          }}
        >
          <Trash2 size={16} /> Reset everything
        </button>
        {msg && <Chip tone="blue">{msg}</Chip>}
      </div>
    </section>
  );
}
