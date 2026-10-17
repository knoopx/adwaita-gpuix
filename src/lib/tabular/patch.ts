export interface PatchSides {
  old: string[];
  next: string[];
}

const PATCH_HEADER_PREFIXES = [
  "diff --git",
  "--- ",
  "+++ ",
  "index ",
  "new file mode",
  "deleted file mode",
  "old mode",
  "new mode",
  "similarity index",
  "rename from",
  "rename to",
  "Binary files",
  "GIT binary patch",
  "@@",
];

function findPatchStart(lines: string[], path?: string): number {
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith("diff --git")) continue;
    const b = lines[i].split(" ")[3] ?? "";
    const p = b.startsWith("b/") ? b.slice(2) : b;
    if (!path || p === path) return i;
  }
  return -1;
}

function findPatchEnd(lines: string[], start: number): number {
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("diff --git")) return i;
  }
  return lines.length;
}

function isPatchHeaderLine(line: string): boolean {
  return PATCH_HEADER_PREFIXES.some((p) => line.startsWith(p));
}

function collectPatchSides(
  lines: string[],
  start: number,
  end: number,
): PatchSides | null {
  const old: string[] = [];
  const next: string[] = [];
  for (let i = start + 1; i < end; i++) {
    const l = lines[i];
    if (isPatchHeaderLine(l)) {
      if (l.startsWith("Binary files") || l.startsWith("GIT binary patch"))
        return null;
      continue;
    }
    if (l.startsWith("+")) next.push(l.slice(1));
    else if (l.startsWith("-")) old.push(l.slice(1));
    else {
      const c = l.startsWith(" ") ? l.slice(1) : l;
      old.push(c);
      next.push(c);
    }
  }
  return { old, next };
}

export function patchSides(patch: string, path?: string): PatchSides | null {
  const lines = patch.split("\n");
  const start = findPatchStart(lines, path);
  if (start < 0) return null;
  const end = findPatchEnd(lines, start);
  return collectPatchSides(lines, start, end);
}
