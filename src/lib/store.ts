import { useSyncExternalStore } from "react";
import {
  emptyJob,
  emptyResume,
  type GeneratedResumeRecord,
  type JobPosting,
  type Resume,
} from "@/types/resume";

const KEY = "matchcv:state:v1";

export interface AppState {
  resume: Resume;
  rawResumeText: string;
  job: JobPosting;
  records: GeneratedResumeRecord[];
  activeRecordId: string | null;
}

const initialState: AppState = {
  resume: emptyResume,
  rawResumeText: "",
  job: emptyJob,
  records: [],
  activeRecordId: null,
};

let state: AppState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initialState, ...(JSON.parse(raw) as AppState) };
  } catch {
    /* ignore corrupted state */
  }
  emit();
}

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => initialState;

export function useAppState<T>(selector: (s: AppState) => T): T {
  return selector(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));
}

export function saveRecord(record: GeneratedResumeRecord) {
  setState((s) => ({
    records: [record, ...s.records.filter((r) => r.id !== record.id)],
    activeRecordId: record.id,
  }));
}

export function updateRecordResume(id: string, resume: Resume) {
  setState((s) => ({
    records: s.records.map((r) => (r.id === id ? { ...r, resume } : r)),
  }));
}

export function deleteRecord(id: string) {
  setState((s) => ({
    records: s.records.filter((r) => r.id !== id),
    activeRecordId: s.activeRecordId === id ? null : s.activeRecordId,
  }));
}
