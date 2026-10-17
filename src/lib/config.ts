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
