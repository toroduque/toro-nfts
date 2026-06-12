import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { TEMPLATES } from "../data/curriculum";
import { CopyButton, Kicker } from "../components/ui";

export default function Templates() {
  const [activeId, setActiveId] = useState(TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const active = TEMPLATES.find((t) => t.id === activeId)!;
  const fieldValues = values[activeId] ?? {};

  const output = useMemo(() => active.render(fieldValues), [active, fieldValues]);

  function setField(key: string, val: string) {
    setValues((prev) => ({
      ...prev,
      [activeId]: { ...(prev[activeId] ?? {}), [key]: val },
    }));
  }

  function clearActive() {
    setValues((prev) => ({ ...prev, [activeId]: {} }));
  }

  return (
    <div className="space-y-6">
      <header>
        <Kicker index="04">Appendix A</Kicker>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink-900 sm:text-5xl">
          Templates
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          Fill the fields, copy the result. Each template enforces the right
          structure so the bottom line leads and nothing decision-relevant is
          buried.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`btn ${
              t.id === activeId
                ? "bg-brand-600 text-white"
                : "border border-ink-300 bg-white text-ink-700 hover:bg-ink-50"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-500">{active.blurb}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-600">
              Fields
            </h2>
            <button className="btn-ghost" onClick={clearActive}>
              <RotateCcw size={14} /> Clear
            </button>
          </div>
          <div className="space-y-3">
            {active.fields.map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                {f.multiline ? (
                  <textarea
                    className="input min-h-[72px]"
                    rows={3}
                    placeholder={f.placeholder}
                    value={fieldValues[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="input"
                    placeholder={f.placeholder}
                    value={fieldValues[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="card flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-600">
              Preview
            </h2>
            <CopyButton text={output} label="Copy message" />
          </div>
          <pre className="flex-1 whitespace-pre-wrap rounded-xl border border-ink-200 bg-ink-50/70 p-5 font-mono text-[13px] leading-relaxed text-ink-800">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
