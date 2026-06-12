import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Circle,
  Dumbbell,
  GraduationCap,
  ListChecks,
  Repeat,
  Target,
} from "lucide-react";
import { STAGES } from "../data/curriculum";
import { useStore } from "../store/AppStore";

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-brand-600" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-600">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function StageDetail() {
  const { stageId } = useParams();
  const { data, toggleCriterion } = useStore();
  const idx = STAGES.findIndex((s) => s.id === stageId);
  const s = STAGES[idx];

  if (!s) {
    return (
      <div className="space-y-4">
        <p className="text-ink-500">Stage not found.</p>
        <Link to="/path" className="btn-outline">
          <ArrowLeft size={16} /> Back to path
        </Link>
      </div>
    );
  }

  const prev = STAGES[idx - 1];
  const next = STAGES[idx + 1];
  const done = s.exitCriteria.filter((c) => data.progress[c.id]).length;
  const complete = done === s.exitCriteria.length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/path"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft size={15} /> Learning Path
        </Link>
      </div>

      <header className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Stage {s.stage} · {s.timeframe}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">{s.title}</h1>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-brand-50 px-4 py-3">
          <Target size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <p className="text-sm text-brand-900">
            <span className="font-semibold">Goal: </span>
            {s.goal}
          </p>
        </div>
      </header>

      {s.doItems && (
        <Block icon={ListChecks} title="Do">
          <ol className="space-y-2">
            {s.doItems.map((d, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-500">
                  {i + 1}
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {s.learn && (
        <Block icon={GraduationCap} title="Learn">
          <dl className="space-y-4">
            {s.learn.map((l, i) => (
              <div key={i}>
                <dt className="text-sm font-semibold text-ink-900">{l.term}</dt>
                <dd className="mt-0.5 text-sm text-ink-600">{l.body}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {s.reading && (
        <Block icon={BookMarked} title="Read">
          <ul className="space-y-3">
            {s.reading.map((r, i) => (
              <li key={i} className="flex gap-3">
                <BookMarked size={16} className="mt-0.5 shrink-0 text-ink-400" />
                <p className="text-sm text-ink-700">
                  <span className="font-semibold text-ink-900">{r.title}</span>
                  {" — "}
                  <span className="text-ink-500">{r.scope}</span>
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {s.drills && s.drills.length > 0 && (
        <Block icon={Dumbbell} title="Practise">
          <p className="mb-3 text-sm text-ink-500">
            {s.drills.length} drill{s.drills.length > 1 ? "s" : ""} for this
            stage. Draft your responses and they'll be saved.
          </p>
          <ul className="space-y-2">
            {s.drills.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/drills#${d.id}`}
                  className="flex items-center justify-between rounded-lg border border-ink-200 px-3 py-2 text-sm hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="font-medium text-ink-800">{d.title}</span>
                  <ArrowRight size={15} className="text-ink-400" />
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {s.habit && (
        <Block icon={Repeat} title="Habit to install">
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {s.habit}
          </p>
        </Block>
      )}

      {/* Exit criteria */}
      <section
        className={`card p-5 ${complete ? "ring-2 ring-emerald-300" : ""}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={18}
              className={complete ? "text-emerald-500" : "text-ink-400"}
            />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-600">
              Exit criteria
            </h2>
          </div>
          <span className="text-xs text-ink-400">
            {done}/{s.exitCriteria.length}
          </span>
        </div>
        <p className="mb-3 text-sm text-ink-500">
          Do not move on until all are checked.
        </p>
        <ul className="space-y-2">
          {s.exitCriteria.map((c) => {
            const checked = !!data.progress[c.id];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => toggleCriterion(c.id)}
                  className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    checked
                      ? "border-emerald-200 bg-emerald-50 text-ink-700"
                      : "border-ink-200 hover:border-ink-300 hover:bg-ink-50"
                  }`}
                >
                  {checked ? (
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                  ) : (
                    <Circle size={18} className="mt-0.5 shrink-0 text-ink-300" />
                  )}
                  <span className={checked ? "line-through decoration-ink-300" : ""}>
                    {c.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {complete && (
          <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
            Stage complete — you've earned the next one.
          </p>
        )}
      </section>

      {/* Prev / next */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {prev ? (
          <Link to={`/path/${prev.id}`} className="btn-outline">
            <ArrowLeft size={16} /> Stage {prev.stage}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/path/${next.id}`} className="btn-outline">
            Stage {next.stage} <ArrowRight size={16} />
          </Link>
        ) : (
          <Link to="/metrics" className="btn-primary">
            See your progress signals <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
