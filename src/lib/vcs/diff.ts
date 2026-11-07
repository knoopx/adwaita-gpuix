import type { FileChange } from "./types";

/** A file mentioned by a git-format patch, and how the patch changed it. */
export interface DiffFileEntry {
  path: string;
  status: FileChange["status"];
}

/** Added / modified / deleted from a `jj diff --git` (or git) patch. */
function statusFromDevNull(
  fromDevNull: boolean,
  toDevNull: boolean,
): FileChange["status"] {
  if (fromDevNull) return "A";
  if (toDevNull) return "D";
  return "M";
}

/**
 * List every file a git-format patch touches. Each `diff --git` header is
 * scanned for its `b/…` path, then the block for `--- /dev/null` (added) and
 * `+++ /dev/null` (deleted) markers.
 */
export function extractDiffFiles(patch: string): DiffFileEntry[] {
  const lines = patch.split("\n");
  const out: DiffFileEntry[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (!line.startsWith("diff --git")) continue;
    const token = line.split(" ")[3] ?? "";
    const path =
      token.startsWith("a/") || token.startsWith("b/") ? token.slice(2) : token;
    if (path.length === 0) continue;

    let fromDevNull = false;
    let toDevNull = false;
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j] ?? "";
      if (l.startsWith("diff --git")) break;
      if (l.startsWith("--- ") && l.slice(4) === "/dev/null") fromDevNull = true;
      else if (l.startsWith("+++ ") && l.slice(4) === "/dev/null") toDevNull = true;
    }
    out.push({ path, status: statusFromDevNull(fromDevNull, toDevNull) });
  }
  return out;
}

/** Line counts of a patch, plus the file status it implies. */
export interface FileStat {
  status: FileChange["status"];
  insertions: number;
  deletions: number;
}

/** Count `+` / `-` lines of a single-file patch. */
export function filePatchStats(patch: string): FileStat {
  let insertions = 0;
  let deletions = 0;
  let fromDevNull = false;
  let toDevNull = false;
  for (const line of patch.split("\n")) {
    if (line.startsWith("--- ")) {
      if (line.slice(4) === "/dev/null") fromDevNull = true;
    } else if (line.startsWith("+++ ")) {
      if (line.slice(4) === "/dev/null") toDevNull = true;
    } else if (line.startsWith("+")) insertions++;
    else if (line.startsWith("-")) deletions++;
  }
  return {
    status: statusFromDevNull(fromDevNull, toDevNull),
    insertions,
    deletions,
  };
}

/** Run `fn` over `items` with at most `limit` in flight, keeping order. */
export async function mapConcurrent<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      for (;;) {
        const i = next++;
        if (i >= items.length) break;
        results[i] = await fn(items[i]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

/**
 * Diff every file of a change: one whole-change diff to enumerate the files,
 * then one diff per file (in parallel) for its line counts.
 *
 * `gitDiff` runs `jj diff --git <args>` and returns the patch text, so the
 * caller keeps control of the binary, the working copy and any mocking.
 */
export async function changedFiles(
  changeId: string,
  gitDiff: (args: string[]) => Promise<string>,
  limit: number = 8,
): Promise<FileChange[]> {
  const entries = extractDiffFiles(await gitDiff(["-r", changeId]));
  const rows = await mapConcurrent(entries, limit, async (entry) => {
    const stat = filePatchStats(await gitDiff(["-r", changeId, entry.path]));
    return {
      path: entry.path,
      status: entry.status,
      insertions: stat.insertions,
      deletions: stat.deletions,
    };
  });
  return rows.sort((a, b) => a.path.localeCompare(b.path));
}
