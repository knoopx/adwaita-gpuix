import type { FileChange } from "./types";

/** A file mentioned by a git-format patch, and how the patch changed it. */
export interface DiffFileEntry {
  path: string;
  status: FileChange["status"];
}

/**
 * One file's block of a git-format patch: its `diff --git` header, its mode and
 * index lines, its `---`/`+++` pair and its hunks — everything up to the next
 * file's header.
 */
export interface DiffBlock {
  path: string;
  patch: string;
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

/** The `b/…` path of a `diff --git a/old b/new` header. */
function pathOfHeader(line: string): string {
  const token = line.split(" ")[3] ?? "";
  return token.startsWith("a/") || token.startsWith("b/")
    ? token.slice(2)
    : token;
}

/**
 * Cut a git-format patch into one block per file, in the order the patch writes
 * them.
 *
 * The block is the same text a per-file diff would have answered with, which is
 * why every count and every status can be read off a single whole-change patch:
 * asking the CLI per file is one subprocess per file, and a change touching five
 * hundred files was five hundred and one `jj` runs, each of which reopens the
 * repo and costs tens of megabytes to answer one path.
 */
export function diffBlocks(patch: string): DiffBlock[] {
  const lines = patch.split("\n");
  const blocks: DiffBlock[] = [];

  let start = -1;
  let path = "";
  const close = (end: number): void => {
    if (start < 0 || path.length === 0) return;
    blocks.push({ path, patch: lines.slice(start, end).join("\n") });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (!line.startsWith("diff --git")) continue;
    close(i);
    start = i;
    path = pathOfHeader(line);
  }
  close(lines.length);

  return blocks;
}

/**
 * List every file a git-format patch touches, with the status its block implies:
 * `--- /dev/null` means added, `+++ /dev/null` deleted, anything else modified.
 */
export function extractDiffFiles(patch: string): DiffFileEntry[] {
  return diffBlocks(patch).map((block) => ({
    path: block.path,
    status: filePatchStats(block.patch).status,
  }));
}

/** Line counts of a patch, plus the file status it implies. */
export interface FileStat {
  status: FileChange["status"];
  insertions: number;
  deletions: number;
}

/**
 * Count `+` / `-` lines of a single file's patch — a whole-change block or a
 * one-file diff, the two are the same text. The `---`/`+++` headers are read for
 * the status they carry and never counted as lines.
 */
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
 * Every file a change touched, with its line counts — from ONE diff.
 *
 * `gitDiff` runs `jj diff --git <args>` and returns the patch text, so the caller
 * keeps control of the binary, the working copy and any mocking. The file list and
 * each file's counts come out of the same patch, because they are already in it:
 * one call per file asked the CLI five hundred times for a change that has five
 * hundred files.
 */
export async function changedFiles(
  changeId: string,
  gitDiff: (args: string[]) => Promise<string>,
): Promise<FileChange[]> {
  return diffBlocks(await gitDiff(["-r", changeId]))
    .map((block) => ({ path: block.path, ...filePatchStats(block.patch) }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
