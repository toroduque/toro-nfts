import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DESTINATION, STAGES } from "../data/curriculum";
import { useStore } from "../store/AppStore";
import {
  commitmentHitRate,
  currentStage,
  overallProgress,
  riskLeadTime,
  stageProgress,
} from "../store/derive";
import { Kicker, ProgressBar, SectionTitle } from "../components/ui";

export default function Dashboard() {
  const { data } = useStore();
  const overall = overallProgress(data);
  const stages = stageProgress(data);
  const cur = currentStage(data);
  const curStage = STAGES.find((s) => s.stage === cur)!;
  const hit = commitmentHitRate(data.commitments);
  const lead = riskLeadTime(data.raid);

  return (
    <div className="space-y-16">
      {/* Hero ------------------------------------------------------------ */}
      <header>
        <Kicker index="00">The destination</Kicker>
        <h1 className="mt-5 max-w-3xl font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight text-ink-900 sm:text-6xl">
          From reactive to
          <span className="text-brand-600"> remarkably reliable.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
          A sequenced path built for ~3 hours a week over 12 weeks —
          front-loaded with the changes that stop surprises and inaccuracy
          before they start. Work the stages in order. Don't move on until you
          pass the exit criteria.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to={`/path/${curStage.id}`} className="btn-primary">
            Continue Stage {curStage.stage} <ArrowRight size={16} />
          </Link>
          <Link to="/commitments" className="btn-outline">
            Open commitment log
          </Link>
        </div>
      </header>

      {/* Metrics --------------------------------------------------------- */}
      <section>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-200/80 bg-ink-200/80 lg:grid-cols-4">
          <FigureCell
            label="Overall progress"
            value={`${overall.pct}%`}
            sub={`${overall.done} of ${overall.total} criteria`}
          />
          <FigureCell
            label="Commitment hit rate"
            value={hit.rate === null ? "—" : `${hit.rate}%`}
            sub={hit.rate === null ? "no resolved dates" : "target ≥ 90%"}
            tone={hit.rate === null ? "ink" : hit.rate >= 90 ? "good" : "warn"}
          />
          <FigureCell
            label="Avg risk lead time"
            value={lead.avg === null ? "—" : `${lead.avg}d`}
            sub={lead.avg === null ? "no flagged risks" : "target < 1 day"}
            tone={lead.avg === null ? "ink" : lead.avg <= 1 ? "good" : "warn"}
          />
          <FigureCell
            label="Current stage"
            value={`0${curStage.stage}`}
            sub={curStage.timeframe}
          />
        </div>
      </section>

      {/* Current stage feature ------------------------------------------ */}
      <section>
        <Link
          to={`/path/${curStage.id}`}
          className="group block overflow-hidden rounded-3xl border border-ink-200/80 bg-ink-900 text-paper transition-shadow duration-300 hover:shadow-lift"
        >
          <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
            <div className="max-w-xl">
              <span className="kicker text-brand-300">
                Where you are now
              </span>
              <p className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                {curStage.title}
              </p>
              <p className="mt-3 text-ink-300">{curStage.goal}</p>
            </div>
            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <span className="font-display text-6xl leading-none text-ink-700">
                0{curStage.stage}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-paper">
                Open
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Start here ------------------------------------------------------ */}
      <section className="rounded-3xl border border-brand-200 bg-brand-50/60 p-8 sm:p-10">
        <Kicker>Start here</Kicker>
        <p className="mt-4 max-w-2xl font-display text-2xl font-medium leading-snug tracking-tight text-ink-900">
          The single highest-leverage step is Stage 0, today.
        </p>
        <p className="mt-3 max-w-2xl text-ink-700">
          The commitment log plus the 24-hour risk-flag rule directly prevent
          the two failures that trigger most complaints, require no reading, and
          the client feels the difference within a week.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/commitments" className="btn-accent">
            Commitment log <ArrowRight size={16} />
          </Link>
          <Link to="/raid" className="btn-outline">
            RAID log
          </Link>
        </div>
      </section>

      {/* The destination ------------------------------------------------- */}
      <section>
        <SectionTitle index="01" hint="You are reliable when all six hold.">
          The destination
        </SectionTitle>
        <ol className="border-t border-ink-200">
          {DESTINATION.map((d, i) => (
            <li
              key={d.id}
              className="group flex items-baseline gap-5 border-b border-ink-200 py-5"
            >
              <span className="font-display text-2xl tabular-nums text-ink-300 transition-colors group-hover:text-brand-500">
                0{i + 1}
              </span>
              <div>
                <p className="font-display text-lg font-medium text-ink-900">
                  {d.short}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
                  {d.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The path -------------------------------------------------------- */}
      <section>
        <SectionTitle index="02" hint="Exit criteria gate each stage.">
          The path
        </SectionTitle>
        <div className="border-t border-ink-200">
          {stages.map((s) => (
            <Link
              key={s.id}
              to={`/path/${s.id}`}
              className="group flex items-center gap-5 border-b border-ink-200 py-5 transition-colors hover:bg-ink-50/60"
            >
              <span
                className={`font-display text-2xl tabular-nums ${
                  s.complete ? "text-brand-500" : "text-ink-300"
                }`}
              >
                0{s.stage}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-medium text-ink-900">
                  {s.title}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar
                    value={s.total ? (s.done / s.total) * 100 : 0}
                    className="max-w-[200px]"
                  />
                  <span className="shrink-0 text-xs tabular-nums text-ink-400">
                    {s.done}/{s.total}
                    {s.complete && (
                      <span className="ml-1.5 text-emerald-600">✓</span>
                    )}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-ink-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink-900"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FigureCell({
  label,
  value,
  sub,
  tone = "ink",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "ink" | "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-emerald-700"
      : tone === "warn"
      ? "text-brand-600"
      : "text-ink-900";
  return (
    <div className="bg-white p-5 transition-colors hover:bg-ink-50/50">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
        {label}
      </p>
      <p
        className={`mt-3 font-display text-4xl font-medium leading-none tracking-tight sm:text-5xl ${color}`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-ink-400">{sub}</p>
    </div>
  );
}
