import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function appConfigPath(app: string, envVar?: string): string {
  if (envVar) {
    const override = process.env[envVar];
    if (override) return override;
  }
  return join(homedir(), ".config", app, "config.json");
}

export function loadJsonConfig<T>(path: string): T | undefined {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf8")) as T;
    }
  } catch {}
  return undefined;
}

export function configCandidates(
  app: string,
  cwd: string = process.cwd(),
): string[] {
  const out = [join(cwd, "config.json")];
  const home = homedir();
  if (home) out.push(join(home, ".config", app, "config.json"));
  return out;
}

export function loadAppConfig<T extends object>(
  app: string,
  defaults: T,
  cwd?: string,
): T {
  for (const path of configCandidates(app, cwd)) {
    const parsed = loadJsonConfig<Partial<T>>(path);
    if (parsed === undefined) continue;
    return { ...defaults, ...parsed };
  }
  return { ...defaults };
}
