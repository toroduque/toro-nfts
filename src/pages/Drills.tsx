import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Lightbulb, Radio, Save } from "lucide-react";
import { STAGES } from "../data/curriculum";
import type { Drill } from "../data/types";
import { useStore } from "../store/AppStore";
import { Chip, Kicker } from "../components/ui";

const STAGE_DRILLS = STAGES.filter((s) => s.drills && s.drills.length > 0).map(
  (s) => ({ stage: s.stage, title: s.title, drills: s.drills! })
);

export default function Drills() {
  const { hash } = useLocation();

  // Scroll to a drill when arriving via /drills#drill-id
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-brand-300");
      const t = setTimeout(
        () => el.classList.remove("ring-2", "ring-brand-300"),
        2000
      );
      return () => clearTimeout(t);
    }
  }, [hash]);

  return (
    <div className="space-y-6">
      <header>
        <Kicker index="06">Practise</Kicker>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink-900 sm:text-5xl">
          Practice Drills
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          Draft your response to each scenario — drafts save automatically. The
          point isn't a perfect answer; it's building the reflex so the real
          message writes itself under pressure.
        </p>
      </header>

      {STAGE_DRILLS.map((group) => (
        <section key={group.stage} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
            Stage {group.stage} · {group.title}
          </h2>
          {group.drills.map((d) => (
            <DrillCard key={d.id} drill={d} />
          ))}
        </section>
      ))}
    </div>
  );
}

function DrillCard({ drill }: { drill: Drill }) {
  const { data, setDraft } = useStore();
  const saved = data.drafts[drill.id];
  const [text, setText] = useState(saved?.text ?? "");
  const [showGuidance, setShowGuidance] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Debounced autosave
  useEffect(() => {
    if (text === (saved?.text ?? "")) return;
    const t = setTimeout(() => {
      setDraft(drill.id, text);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div id={drill.id} className="card scroll-mt-6 p-5 transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-medium text-ink-900">
          {drill.title}
        </h3>
        {drill.live && (
          <Chip tone="violet">
            <Radio size={12} /> run live
          </Chip>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-600">{drill.scenario}</p>

      {drill.guidance && (
        <div className="mt-3">
          <button
            onClick={() => setShowGuidance((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            <Lightbulb size={14} />
            {showGuidance ? "Hide" : "Show"} coaching note
            <ChevronDown
              size={14}
              className={`transition ${showGuidance ? "rotate-180" : ""}`}
            />
          </button>
          {showGuidance && (
            <p className="mt-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-900 animate-fade-in">
              {drill.guidance}
            </p>
          )}
        </div>
      )}

      <textarea
        className="input mt-3 min-h-[120px]"
        placeholder="Draft your response…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-1.5 flex items-center justify-between text-xs text-ink-400">
        <span>{text.trim() ? `${text.trim().split(/\s+/).length} words` : "no draft yet"}</span>
        <span className="inline-flex items-center gap-1">
          <Save size={12} />
          {savedFlash
            ? "Saved"
            : saved
            ? `Saved ${new Date(saved.updatedAt).toLocaleDateString()}`
            : "Autosaves"}
        </span>
      </div>
    </div>
  );
}
