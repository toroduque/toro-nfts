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
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink-200 ${className}`}>
      <div
        className="h-full rounded-full bg-brand-600 transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
        {children}
      </h2>
      {hint && <p className="mt-0.5 text-sm text-ink-400">{hint}</p>}
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
    <div className="rounded-xl border border-dashed border-ink-300 bg-white/50 px-6 py-10 text-center">
      <p className="font-medium text-ink-700">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">{children}</p>}
    </div>
  );
}

const CHIP_TONES: Record<string, string> = {
  gray: "bg-ink-100 text-ink-700",
  blue: "bg-brand-100 text-brand-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
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
  return <span className={`chip ${CHIP_TONES[tone] ?? CHIP_TONES.gray}`}>{children}</span>;
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
  const ring =
    tone === "green"
      ? "text-emerald-600"
      : tone === "red"
      ? "text-red-600"
      : tone === "amber"
      ? "text-amber-600"
      : "text-ink-900";
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold ${ring}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}
