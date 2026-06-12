import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppData,
  Commitment,
  DrillDraft,
  MetricReading,
  RaidEntry,
} from "../data/types";
import { EMPTY_DATA, loadData, newId, saveData } from "./storage";

interface AppStore {
  data: AppData;

  // progress (exit criteria)
  toggleCriterion: (id: string) => void;

  // commitments
  addCommitment: (c: Omit<Commitment, "id" | "createdAt">) => void;
  updateCommitment: (id: string, patch: Partial<Commitment>) => void;
  removeCommitment: (id: string) => void;

  // raid
  addRaid: (r: Omit<RaidEntry, "id" | "createdAt">) => void;
  updateRaid: (id: string, patch: Partial<RaidEntry>) => void;
  removeRaid: (id: string) => void;

  // drills
  setDraft: (drillId: string, text: string) => void;

  // checklist
  recordChecklistRun: () => void;

  // metrics
  addMetric: (m: Omit<MetricReading, "id" | "createdAt">) => void;
  removeMetric: (id: string) => void;

  // data management
  exportData: () => string;
  importData: (json: string) => boolean;
  resetData: () => void;
}

const Ctx = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  // Persist on every change (debounced via microtask batching is unnecessary
  // here — writes are tiny and infrequent for a single user).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveData(data);
  }, [data]);

  const toggleCriterion = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      progress: { ...d.progress, [id]: !d.progress[id] },
    }));
  }, []);

  const addCommitment = useCallback(
    (c: Omit<Commitment, "id" | "createdAt">) => {
      setData((d) => ({
        ...d,
        commitments: [
          { ...c, id: newId("cm"), createdAt: Date.now() },
          ...d.commitments,
        ],
      }));
    },
    []
  );

  const updateCommitment = useCallback(
    (id: string, patch: Partial<Commitment>) => {
      setData((d) => ({
        ...d,
        commitments: d.commitments.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      }));
    },
    []
  );

  const removeCommitment = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      commitments: d.commitments.filter((c) => c.id !== id),
    }));
  }, []);

  const addRaid = useCallback((r: Omit<RaidEntry, "id" | "createdAt">) => {
    setData((d) => ({
      ...d,
      raid: [{ ...r, id: newId("raid"), createdAt: Date.now() }, ...d.raid],
    }));
  }, []);

  const updateRaid = useCallback((id: string, patch: Partial<RaidEntry>) => {
    setData((d) => ({
      ...d,
      raid: d.raid.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const removeRaid = useCallback((id: string) => {
    setData((d) => ({ ...d, raid: d.raid.filter((r) => r.id !== id) }));
  }, []);

  const setDraft = useCallback((drillId: string, text: string) => {
    const draft: DrillDraft = { text, updatedAt: Date.now() };
    setData((d) => ({ ...d, drafts: { ...d.drafts, [drillId]: draft } }));
  }, []);

  const recordChecklistRun = useCallback(() => {
    setData((d) => ({
      ...d,
      checklistRuns: [Date.now(), ...d.checklistRuns].slice(0, 200),
    }));
  }, []);

  const addMetric = useCallback(
    (m: Omit<MetricReading, "id" | "createdAt">) => {
      setData((d) => ({
        ...d,
        metrics: [
          { ...m, id: newId("mt"), createdAt: Date.now() },
          ...d.metrics,
        ],
      }));
    },
    []
  );

  const removeMetric = useCallback((id: string) => {
    setData((d) => ({ ...d, metrics: d.metrics.filter((m) => m.id !== id) }));
  }, []);

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<AppData>;
      setData({ ...structuredClone(EMPTY_DATA), ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    setData(structuredClone(EMPTY_DATA));
  }, []);

  const value = useMemo<AppStore>(
    () => ({
      data,
      toggleCriterion,
      addCommitment,
      updateCommitment,
      removeCommitment,
      addRaid,
      updateRaid,
      removeRaid,
      setDraft,
      recordChecklistRun,
      addMetric,
      removeMetric,
      exportData,
      importData,
      resetData,
    }),
    [
      data,
      toggleCriterion,
      addCommitment,
      updateCommitment,
      removeCommitment,
      addRaid,
      updateRaid,
      removeRaid,
      setDraft,
      recordChecklistRun,
      addMetric,
      removeMetric,
      exportData,
      importData,
      resetData,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within AppStoreProvider");
  return ctx;
}
