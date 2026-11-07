/**
 * Project metadata shared by the GPUix apps that show a project header: which
 * language a tree is written in, which license it carries, what its README
 * says, which agent instructions file it has and which npm scripts it offers.
 *
 * Everything here is best-effort by design — a missing or unreadable file is
 * `null`, never a throw — because it runs on trees the user did not author.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Directories the language scan never descends into. */
export const PROJECT_SCAN_SKIP_DIRS: ReadonlySet<string> = new Set([
  "node_modules",
  ".git",
  ".jj",
  "dist",
  "build",
  "target",
  ".venv",
  "venv",
  "hf-cache",
  ".next",
  "out",
  "coverage",
]);

/** File extension -> language name, keyed by lowercase extension. */
export const LANG_EXT: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  mts: "TypeScript",
  cts: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  rs: "Rust",
  py: "Python",
  go: "Go",
  nix: "Nix",
  c: "C/C++",
  cc: "C/C++",
  cpp: "C/C++",
  cu: "CUDA",
  h: "C/C++",
  hpp: "C/C++",
  zig: "Zig",
  java: "Java",
  kt: "Kotlin",
  swift: "Swift",
  sh: "Shell",
  nu: "Nushell",
  lua: "Lua",
  rb: "Ruby",
  php: "PHP",
  svelte: "Svelte",
  vue: "Vue",
  css: "CSS",
  scss: "CSS",
  md: "Markdown",
};

/** GitHub linguist colours for the languages in LANG_EXT. */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Python: "#3572A5",
  Go: "#00ADD8",
  Nix: "#5276af",
  "C/C++": "#599eff",
  CUDA: "#76b900",
  Zig: "#ec915a",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Shell: "#89e051",
  Nushell: "#d39c67",
  Lua: "#000080",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Svelte: "#ff3e00",
  Vue: "#42b883",
  CSS: "#563d7c",
  Markdown: "#083fa1",
};

/** The dot colour for a language name, or null for an unknown language. */
export function languageColor(language: string | null): string | null {
  if (language === null) return null;
  return LANGUAGE_COLORS[language] ?? null;
}

export interface ProjectScanOptions {
  /** Stop after this many files. */
  fileLimit?: number;
  /** Stop descending past this directory depth. */
  maxDepth?: number;
  /** Directory names to skip; defaults to PROJECT_SCAN_SKIP_DIRS. */
  skipDirs?: ReadonlySet<string>;
}

/** True when `path` is a jujutsu working copy. */
export function isProjectRoot(path: string): boolean {
  return existsSync(join(path, ".jj"));
}

/** Read a UTF-8 file, or null when it is missing or unreadable. */
export function readTextFile(path: string): string | null {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function readPlainEntries(
  dir: string,
): { name: string; isDirectory: boolean }[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => !e.isSymbolicLink())
      .map((e) => ({ name: e.name, isDirectory: e.isDirectory() }));
  } catch {
    return [];
  }
}

/** The first non-empty, de-heading line of the project README. */
export function readDescription(repoPath: string): string | null {
  const text = readTextFile(join(repoPath, "README.md"));
  if (text === null) return null;
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (t.length === 0) continue;
    const stripped = t.replace(/^#{1,6}\s*/, "").trim();
    return stripped.length > 0 ? stripped : null;
  }
  return null;
}

function licenseLabelFromName(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("mit")) return "MIT";
  if (n.includes("apache")) return "Apache-2.0";
  if (n.includes("lgpl")) return "LGPL";
  if (n.includes("gpl"))
    return n.includes("3") ? "GPL-3.0" : n.includes("2") ? "GPL-2.0" : "GPL";
  if (n.includes("bsd")) return "BSD";
  return null;
}

function licenseLabelFromText(text: string): string | null {
  const head = text.slice(0, 4000);
  if (/apache (software )?license/i.test(head)) return "Apache-2.0";
  if (/gnu general public license/i.test(head)) {
    if (/lesser/i.test(head)) return "LGPL";
    if (/version 3/i.test(head)) return "GPL-3.0";
    if (/version 2/i.test(head)) return "GPL-2.0";
    return "GPL";
  }
  if (/bsd license/i.test(head)) return "BSD";
  if (
    /\bmit license\b/i.test(head) ||
    /permission is hereby granted, free of charge/i.test(head)
  )
    return "MIT";
  return null;
}

/** Licence label for a tree, from the licence file name then its contents. */
export function detectLicense(repoPath: string): string | null {
  for (const name of [
    "LICENSE",
    "LICENSE.md",
    "LICENSE.txt",
    "COPYING",
    "LICENCE",
  ]) {
    const byName = licenseLabelFromName(name);
    if (byName !== null) return byName;
    const text = readTextFile(join(repoPath, name));
    if (text === null) continue;
    const byText = licenseLabelFromText(text);
    if (byText !== null) return byText;
  }
  return null;
}

/**
 * The most common known extension in the tree, capped by `fileLimit` and
 * `maxDepth` so a huge checkout does not stall the first paint.
 */
export function detectLanguage(
  repoPath: string,
  options: ProjectScanOptions = {},
): string | null {
  const fileLimit = options.fileLimit ?? 400;
  const maxDepth = options.maxDepth ?? 3;
  const skipDirs = options.skipDirs ?? PROJECT_SCAN_SKIP_DIRS;

  const counts = new Map<string, number>();
  let visited = 0;
  const walk = (dir: string, depth: number): void => {
    if (visited >= fileLimit || depth > maxDepth) return;
    for (const entry of readPlainEntries(dir)) {
      if (visited >= fileLimit) return;
      if (entry.name.startsWith(".") || skipDirs.has(entry.name)) continue;
      if (entry.isDirectory) {
        walk(join(dir, entry.name), depth + 1);
        continue;
      }
      visited++;
      const dot = entry.name.lastIndexOf(".");
      if (dot <= 0) continue;
      const lang = LANG_EXT[entry.name.slice(dot + 1).toLowerCase()];
      if (lang === undefined) continue;
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    }
  };
  walk(repoPath, 0);

  let best: string | null = null;
  let bestCount = 0;
  for (const [lang, count] of counts) {
    if (count > bestCount) {
      best = lang;
      bestCount = count;
    }
  }
  return best;
}

const AGENT_FILES = [
  "AGENTS.md",
  "CLAUDE.md",
  ".cursorrules",
  "CONTRIBUTING.md",
];

/** The first agent-instructions file present in the tree. */
export function detectAgentsFile(repoPath: string): string | null {
  for (const name of AGENT_FILES) {
    if (existsSync(join(repoPath, name))) return name;
  }
  return null;
}

/** The npm script names declared by the project's package.json. */
export function readScripts(repoPath: string): string[] {
  const text = readTextFile(join(repoPath, "package.json"));
  if (text === null) return [];
  try {
    const pkg = JSON.parse(text) as { scripts?: Record<string, unknown> };
    return Object.keys(pkg.scripts ?? {});
  } catch {
    return [];
  }
}

/** "just now" / "12m ago" / "3d ago", falling back to an ISO date. */
export function humanizeAgo(
  ms: number | null,
  now: number = Date.now(),
): string {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) return "never";
  const d = now - ms;
  if (d < 60_000) return "just now";
  if (d < 3_600_000) return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  if (d < 7 * 86_400_000) return `${Math.floor(d / 86_400_000)}d ago`;
  if (d < 35 * 86_400_000) return `${Math.floor(d / (7 * 86_400_000))}w ago`;
  return new Date(ms).toISOString().slice(0, 10);
}

/** Grouped decimal count, e.g. 12,480. */
export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}
