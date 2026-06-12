import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function ProgressBar({
  value,
  className = "",
}: {
  value: number; // 0-100
  className?: string;
}) {
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-200/70 ${className}`}
    >
      <div
        className="h-full rounded-full bg-ink-900 transition-all duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Kicker({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}) {
  return (
    <span className="kicker">
      {index && <span className="text-ink-400">{index}</span>}
      {index && <span className="h-px w-6 bg-ink-300" />}
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  hint,
  index,
}: {
  children: ReactNode;
  hint?: string;
  index?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-3">
        {index && (
          <span className="font-display text-sm text-ink-400">{index}</span>
        )}
        <h2 className="font-display text-xl font-medium tracking-tight text-ink-900">
          {children}
        </h2>
      </div>
      {hint && <p className="mt-1 text-sm text-ink-500">{hint}</p>}
    </div>
  );
}

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // Clipboard may be unavailable (e.g. non-secure context).
        }
      }}
    >
      {done ? (
        <>
          <Check size={15} /> Copied
        </>
      ) : (
        <>
          <Copy size={15} /> {label}
        </>
      )}
    </button>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-300 bg-white/40 px-6 py-14 text-center">
      <p className="font-display text-lg text-ink-800">{title}</p>
      {children && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          {children}
        </p>
      )}
    </div>
  );
}

const CHIP_TONES: Record<string, string> = {
  gray: "bg-ink-100 text-ink-700",
  blue: "bg-sky-100 text-sky-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-900",
  red: "bg-red-100 text-red-700",
  violet: "bg-violet-100 text-violet-800",
};

export function Chip({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: keyof typeof CHIP_TONES | string;
}) {
  return (
    <span className={`chip ${CHIP_TONES[tone] ?? CHIP_TONES.gray}`}>
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "gray",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: keyof typeof CHIP_TONES;
}) {
  const valueColor =
    tone === "green"
      ? "text-emerald-700"
      : tone === "red"
      ? "text-brand-600"
      : tone === "amber"
      ? "text-amber-700"
      : "text-ink-900";
  return (
    <div className="card p-5 transition-shadow duration-300 hover:shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-4xl font-medium leading-none tracking-tight ${valueColor}`}
      >
        {value}
      </p>
      {sub && <p className="mt-2 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}
