import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Lock } from "lucide-react";
import { STAGES } from "../data/curriculum";
import { useStore } from "../store/AppStore";
import { stageProgress } from "../store/derive";
import { Kicker, ProgressBar } from "../components/ui";

export default function LearningPath() {
  const { data } = useStore();
  const prog = stageProgress(data);

  // A stage is "reachable" if all earlier stages are complete; we surface this
  // as a soft hint rather than a hard block.
  const firstIncomplete = prog.find((p) => !p.complete)?.stage ?? 99;

  return (
    <div className="space-y-8">
      <header>
        <Kicker index="01">Twelve weeks</Kicker>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink-900 sm:text-5xl">
          Learning Path
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          Six stages over twelve weeks. Each has a goal, what to learn and read,
          drills to practise, one habit to install, and exit criteria. Don't
          move on until you pass them.
        </p>
      </header>

      <div className="space-y-3">
        {STAGES.map((s) => {
          const p = prog.find((x) => x.stage === s.stage)!;
          const locked = s.stage > firstIncomplete;
          return (
            <Link
              key={s.id}
              to={`/path/${s.id}`}
              className={`card block p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-soft ${
                locked ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                  {p.complete ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : locked ? (
                    <Lock className="text-ink-300" size={22} />
                  ) : (
                    <Circle className="text-brand-400" size={24} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Stage {s.stage}
                    </span>
                    <h2 className="font-display text-lg font-medium text-ink-900">
                      {s.title}
                    </h2>
                    <span className="text-xs text-ink-400">· {s.timeframe}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{s.goal}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar
                      value={p.total ? (p.done / p.total) * 100 : 0}
                      className="max-w-sm"
                    />
                    <span className="shrink-0 text-xs text-ink-400">
                      {p.done}/{p.total} exit criteria
                    </span>
                  </div>
                </div>
                <ArrowRight className="mt-1 shrink-0 text-ink-300" size={18} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
