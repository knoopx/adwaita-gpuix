import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { appConfigPath } from "./config";

export interface Watcher {
  stop(): void;
}

export interface PollOptions {
  pollMs?: number;
  debounceMs?: number;
}

export const DEFAULT_POLL_MS = 1500;
export const DEFAULT_DEBOUNCE_MS = 300;

export function createPollWatcher(
  sample: () => string | number | null,
  onChange: () => void,
  opts: PollOptions = {},
): Watcher {
  const pollMs = opts.pollMs ?? DEFAULT_POLL_MS;
  const debounceMs = opts.debounceMs ?? DEFAULT_DEBOUNCE_MS;

  let lastSeen: string | number | null = null;
  let baseline = false;
  let stopped = false;
  let debounce: ReturnType<typeof setTimeout> | null = null;

  const tick = () => {
    const v = sample();
    if (v === null) return;
    if (!baseline) {
      baseline = true;
      lastSeen = v;
      return;
    }
    if (v === lastSeen) return;
    lastSeen = v;
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      debounce = null;
      if (!stopped) onChange();
    }, debounceMs);
  };

  const interval = setInterval(tick, pollMs);
  tick();

  return {
    stop() {
      stopped = true;
      clearInterval(interval);
      if (debounce) {
        clearTimeout(debounce);
        debounce = null;
      }
    },
  };
}

export function fileSample(path: string): string | number | null {
  try {
    const st = statSync(path);
    return st.isDirectory() ? st.mtimeMs : readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

export function mtimeSample(path: string): string | number {
  try {
    return statSync(path).mtimeMs;
  } catch {
    return "";
  }
}

export function configWatcher(
  app: string,
  envVar: string | undefined,
  onChange: () => void,
  opts?: PollOptions,
): Watcher {
  const path = appConfigPath(app, envVar);
  return createPollWatcher(() => mtimeSample(path), onChange, opts);
}

export function jjOpHeadPath(workspaceRoot: string): string | null {
  const repo = join(workspaceRoot, ".jj", "repo");
  const candidates = [
    join(repo, "op_head"),
    join(repo, "op_meta", "head"),
    join(repo, "op_heads", "heads"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return existsSync(repo) ? repo : null;
}
