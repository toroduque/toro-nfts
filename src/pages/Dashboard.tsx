import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { DESTINATION, STAGES } from "../data/curriculum";
import { useStore } from "../store/AppStore";
import {
  commitmentHitRate,
  currentStage,
  overallProgress,
  riskLeadTime,
  stageProgress,
} from "../store/derive";
import { ProgressBar, SectionTitle, Stat } from "../components/ui";

export default function Dashboard() {
  const { data } = useStore();
  const overall = overallProgress(data);
  const stages = stageProgress(data);
  const cur = currentStage(data);
  const curStage = STAGES.find((s) => s.stage === cur)!;
  const hit = commitmentHitRate(data.commitments);
  const lead = riskLeadTime(data.raid);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-brand-600">
          Reactive → exceptionally reliable
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">
          Stakeholder Communication Path
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          ~3 hours a week, 12 weeks. Front-loaded with the changes that prevent
          surprises and inaccuracy. Work the stages in order — don't move on
          until you pass the exit criteria.
        </p>
      </header>

      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Overall progress"
          value={`${overall.pct}%`}
          sub={`${overall.done}/${overall.total} exit criteria`}
        />
        <Stat
          label="Commitment hit rate"
          value={hit.rate === null ? "—" : `${hit.rate}%`}
          sub={hit.rate === null ? "no resolved dates yet" : `target ≥ 90%`}
          tone={
            hit.rate === null ? "gray" : hit.rate >= 90 ? "green" : "red"
          }
        />
        <Stat
          label="Avg risk lead time"
          value={lead.avg === null ? "—" : `${lead.avg}d`}
          sub={lead.avg === null ? "no flagged risks yet" : "target < 1 day"}
          tone={
            lead.avg === null ? "gray" : lead.avg <= 1 ? "green" : "amber"
          }
        />
        <Stat
          label="Current stage"
          value={`Stage ${cur}`}
          sub={curStage.timeframe}
          tone="gray"
        />
      </div>

      {/* Current stage callout */}
      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 bg-ink-50/60 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <Sparkles size={16} className="text-brand-600" />
            Where you are now
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Stage {curStage.stage} · {curStage.timeframe}
            </p>
            <h3 className="mt-0.5 text-lg font-semibold text-ink-900">
              {curStage.title}
            </h3>
            <p className="mt-1 max-w-xl text-sm text-ink-500">{curStage.goal}</p>
          </div>
          <Link to={`/path/${curStage.id}`} className="btn-primary shrink-0">
            Open stage <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Quick start */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="text-sm font-semibold text-brand-900">
          Start here — the single highest-leverage step
        </p>
        <p className="mt-1 text-sm text-brand-900/80">
          Stage 0, today: the commitment log plus the 24-hour risk-flag rule.
          They directly prevent the two failures that triggered the complaint,
          require no reading, and the client feels the difference within a week.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/commitments" className="btn-primary">
            <ClipboardList size={16} /> Commitment log
          </Link>
          <Link to="/raid" className="btn-outline">
            <ShieldAlert size={16} /> RAID log
          </Link>
        </div>
      </div>

      {/* Destination */}
      <section>
        <SectionTitle hint="You are reliable when all six hold.">
          The destination
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {DESTINATION.map((d, i) => (
            <div key={d.id} className="card flex items-start gap-3 p-4">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{d.short}</p>
                <p className="text-sm text-ink-500">{d.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stage rail */}
      <section>
        <SectionTitle hint="Exit criteria gate each stage.">
          The path
        </SectionTitle>
        <div className="space-y-2">
          {stages.map((s) => (
            <Link
              key={s.id}
              to={`/path/${s.id}`}
              className="card flex items-center gap-4 p-4 transition hover:border-brand-300 hover:shadow"
            >
              {s.complete ? (
                <CheckCircle2 className="shrink-0 text-emerald-500" size={22} />
              ) : (
                <Circle className="shrink-0 text-ink-300" size={22} />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Stage {s.stage}
                  </span>
                  <span className="truncate text-sm font-semibold text-ink-900">
                    {s.title}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar
                    value={s.total ? (s.done / s.total) * 100 : 0}
                    className="max-w-xs"
                  />
                  <span className="shrink-0 text-xs text-ink-400">
                    {s.done}/{s.total}
                  </span>
                </div>
              </div>
              <ArrowRight className="shrink-0 text-ink-300" size={18} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
