import { randomUUID } from "node:crypto";
import type { GuideJob } from "./types";

type Globals = typeof globalThis & {
  __sermonGuideStore?: Map<string, GuideJob>;
};

function getStore(): Map<string, GuideJob> {
  const g = globalThis as Globals;
  if (!g.__sermonGuideStore) g.__sermonGuideStore = new Map<string, GuideJob>();
  return g.__sermonGuideStore;
}

export function newId(): string {
  return randomUUID();
}

export function saveJob(job: GuideJob): void {
  getStore().set(job.id, job);
}

export function getJob(id: string): GuideJob | undefined {
  return getStore().get(id);
}
