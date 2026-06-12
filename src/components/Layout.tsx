import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Overview", end: true },
  { to: "/path", label: "Learning Path" },
  { to: "/commitments", label: "Commitment Log" },
  { to: "/raid", label: "RAID Log" },
  { to: "/templates", label: "Templates" },
  { to: "/checklist", label: "Pre-send Checklist" },
  { to: "/drills", label: "Practice Drills" },
  { to: "/metrics", label: "Progress Signals" },
];

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <div className="leading-none">
      <p
        className={`kicker mb-1.5 ${small ? "text-[10px]" : ""}`}
        style={{ color: "#C5371B" }}
      >
        12-week path
      </p>
      <p
        className={`font-display font-medium tracking-tight text-ink-900 ${
          small ? "text-xl" : "text-[1.7rem]"
        }`}
      >
        Reliable
        <br className={small ? "hidden" : ""} /> Comms
      </p>
    </div>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5">
      {NAV.map(({ to, label, end }, i) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-ink-900 text-paper"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`font-display text-xs tabular-nums ${
                  isActive ? "text-brand-300" : "text-ink-400"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden w-[272px] shrink-0 flex-col border-r border-ink-200/80 bg-paper px-6 py-8 lg:flex">
        <Wordmark />
        <div className="mt-10 flex-1">
          <NavItems />
        </div>
        <div className="border-t border-ink-200 pt-5">
          <p className="text-[11px] leading-relaxed text-ink-400">
            Boring reliability is the product. Everything you log stays in this
            browser.
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-paper px-6 py-7 shadow-lift">
            <div className="flex items-start justify-between">
              <Wordmark small />
              <button
                className="btn-ghost -mr-2"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-8 flex-1">
              <NavItems onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-200/80 bg-paper/85 px-4 py-3 backdrop-blur lg:hidden">
          <Wordmark small />
          <button
            className="btn-ghost"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div
            key={pathname}
            className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-12 lg:py-14 animate-rise"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
