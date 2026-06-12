import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  CheckSquare,
  ClipboardList,
  FileText,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Menu,
  ShieldAlert,
  Target,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/path", label: "Learning Path", icon: BookOpen },
  { to: "/commitments", label: "Commitment Log", icon: ClipboardList },
  { to: "/raid", label: "RAID Log", icon: ShieldAlert },
  { to: "/templates", label: "Templates", icon: FileText },
  { to: "/checklist", label: "Pre-send Checklist", icon: CheckSquare },
  { to: "/drills", label: "Practice Drills", icon: ListChecks },
  { to: "/metrics", label: "Progress Signals", icon: Gauge },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-600 text-white"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Target size={20} />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-ink-900">Reliable Comms</p>
        <p className="text-xs text-ink-400">Stakeholder path</p>
      </div>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200 bg-white p-4 lg:flex">
        <Brand />
        <div className="mt-6 flex-1">
          <NavItems />
        </div>
        <p className="px-1 pt-4 text-[11px] leading-relaxed text-ink-400">
          Boring reliability is the product. Data stays in this browser.
        </p>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <Brand />
              <button className="btn-ghost" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 flex-1">
              <NavItems onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
          <button className="btn-ghost" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <Brand />
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
