/**
 * A patch as the rows it paints.
 *
 * A unified patch is a run of files, each a run of hunks, each a run of lines
 * that were kept, dropped or added. That is exactly the shape a diff pane
 * draws, so the patch is read into one flat list of rows once and everything
 * downstream — what is shown, what is coloured, what is counted — reads those
 * rows rather than the patch text again.
 *
 * A row carries its own place in the patch (`file`, `path`, `hunk`, `line`) and
 * a stable `id`, so an app that colours the text later can hand tokens back to
 * one row without holding the row list itself.
 */
export type DiffRowKind = "file" | "hunk" | "add" | "del" | "ctx";

export interface DiffRow {
  /** stable across a re-parse of the same patch: `f0h1+42` */
  id: string;

  kind: DiffRowKind;

  /** the line without its `+`/`-`/space marker, or the header itself */
  text: string;

  /** which file of the patch, 0-based */
  file: number;

  /** the file this row belongs to, as the patch names it ("" until it is known) */
  path: string;

  /** which hunk of that file, 0-based; -1 above the first hunk */
  hunk: number;

  /** the line number on the side the row belongs to (0 when it has none) */
  line: number;

  /** a file row's own totals, so a header can print them */
  additions: number;
  deletions: number;
}

const META_HEADS = [
  "index ",
  "new file mode",
  "old mode",
  "new mode",
  "deleted file mode",
  "similarity index",
  "rename from ",
  "rename to ",
  "copy from ",
  "copy to ",
  "Binary files",
  "GIT binary patch",
];

function stripSide(path: string): string {
  const p = path.trim();
  if ((p.startsWith("a/") || p.startsWith("b/")) && p.length > 2)
    return p.slice(2);
  return p;
}

/** The path of a `diff --git a/x b/y` line; git quotes a path with spaces. */
function pathFromGitHeader(line: string): string {
  const rest = line.slice("diff --git ".length).trim();
  const quoted = /"([^"]*)"$/.exec(rest);
  if (quoted?.[1] !== undefined) return quoted[1];
  return stripSide(rest.split(" ").pop() ?? "");
}

interface OpenFile {
  index: number;
  path: string;
  rows: DiffRow[];
  hunk: number;
  oldNo: number;
  newNo: number;
  afterHunk: boolean;
}

function patchLines(patch: string): string[] {
  const lines = patch.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines.map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
}

function openFile(index: number, path: string): OpenFile {
  return {
    index,
    path,
    rows: [
      {
        id: `f${index}#`,
        kind: "file",
        text: path,
        file: index,
        path,
        hunk: -1,
        line: 0,
        additions: 0,
        deletions: 0,
      },
    ],
    hunk: -1,
    oldNo: 0,
    newNo: 0,
    afterHunk: false,
  };
}

/** Fill in the file row's name and totals, which only the whole file knows. */
function closeFile(file: OpenFile): void {
  let additions = 0;
  let deletions = 0;
  for (const row of file.rows) {
    row.path = file.path;
    if (row.kind === "add") additions++;
    else if (row.kind === "del") deletions++;
  }
  const header = file.rows[0];
  if (header === undefined) return;
  header.text = file.path;
  header.additions = additions;
  header.deletions = deletions;
}

/**
 * One line of the patch into the row it is.
 *
 * A `@@` line opens a hunk and carries the two line counters that every line
 * below it steps forward, and those counters are what a row is numbered by. The
 * `index`/`mode`/`rename` bookkeeping git writes between a file name and its
 * first hunk is read and answered with nothing: a diff pane shows lines.
 */
function applyLine(file: OpenFile, line: string): void {
  const push = (
    kind: DiffRowKind,
    mark: string,
    no: number,
    text: string,
  ): void => {
    file.rows.push({
      id: `f${file.index}h${Math.max(0, file.hunk)}${mark}${no}`,
      kind,
      text,
      file: file.index,
      path: file.path,
      hunk: Math.max(0, file.hunk),
      line: no,
      additions: 0,
      deletions: 0,
    });
  };

  if (line.startsWith("@@")) {
    const m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    file.oldNo = m ? Number(m[1]) : 0;
    file.newNo = m ? Number(m[2]) : 0;
    file.hunk += 1;
    file.afterHunk = true;
    file.rows.push({
      id: `f${file.index}h${file.hunk}@`,
      kind: "hunk",
      text: line,
      file: file.index,
      path: file.path,
      hunk: file.hunk,
      line: 0,
      additions: 0,
      deletions: 0,
    });
    return;
  }

  if (META_HEADS.some((head) => line.startsWith(head))) return;
  if (line.startsWith("\\")) return;

  if (line.startsWith("+")) {
    push("add", "+", file.newNo, line.slice(1));
    file.newNo++;
    return;
  }

  if (line.startsWith("-")) {
    push("del", "-", file.oldNo, line.slice(1));
    file.oldNo++;
    return;
  }

  push("ctx", "~", file.newNo, line.startsWith(" ") ? line.slice(1) : line);
  file.newNo++;
  file.oldNo++;
}

/** The line that opens a file, and the name it gives that file. */
function headerPathOf(line: string): string | null {
  if (line.startsWith("diff --git ")) return pathFromGitHeader(line);
  if (line.startsWith("Index: ")) return stripSide(line.slice("Index: ".length));
  return null;
}

interface PatchReader {
  files: OpenFile[];

  /** the `--- ` side of the file being read, which a `+++ /dev/null` falls back to */
  oldSide: string | null;
}

function openFileOf(reader: PatchReader, path: string): OpenFile {
  const file = openFile(reader.files.length, path);
  reader.files.push(file);
  reader.oldSide = null;
  return file;
}

function lastFileOf(reader: PatchReader): OpenFile | undefined {
  return reader.files[reader.files.length - 1];
}

/**
 * A `--- `/`+++ ` pair: the file of a patch that has no `diff --git` line, and
 * the side of it that is missing — `/dev/null` is the side with no file, so a
 * `+++ /dev/null` says the file was deleted and its name is the `--- ` one.
 * A `--- ` that comes after a hunk has been read is the next file starting.
 */
function readSideLine(reader: PatchReader, line: string): void {
  const path = stripSide(line.slice(4));
  const last = lastFileOf(reader);

  if (line.startsWith("--- ")) {
    if (last === undefined || last.afterHunk)
      openFileOf(reader, path === "/dev/null" ? "" : path);
    reader.oldSide = path === "/dev/null" ? null : path;
    return;
  }

  if (last === undefined) return;
  if (path !== "/dev/null") last.path = path;
  else if (reader.oldSide !== null) last.path = reader.oldSide;
}

/** A `@@`, `+`, `-` or context line of the file being read. */
function readBodyLine(reader: PatchReader, line: string): void {
  let file = lastFileOf(reader);
  if (file === undefined) {
    const opensBody =
      line.startsWith("@@") || line.startsWith("+") || line.startsWith("-");
    if (!opensBody) return;
    file = openFileOf(reader, "");
  }
  applyLine(file, line);
}

/** Every row of a git-format patch, in order, with unchanged lines kept. */
export function diffRowsOf(patch: string): DiffRow[] {
  const reader: PatchReader = { files: [], oldSide: null };

  for (const line of patchLines(patch)) {
    const header = headerPathOf(line);
    if (header !== null) {
      openFileOf(reader, header);
      continue;
    }
    if (line.startsWith("--- ") || line.startsWith("+++ ")) {
      readSideLine(reader, line);
      continue;
    }
    readBodyLine(reader, line);
  }

  const rows: DiffRow[] = [];
  for (const file of reader.files) {
    closeFile(file);
    for (const row of file.rows) rows.push(row);
  }
  return rows;
}

export interface DiffVisibility {
  /** unchanged lines kept on each side of a change (0 shows only what changed) */
  context?: number;

  /** how many rows to draw, 0 for all of them */
  maxRows?: number;

  /** draw the patch's own per-file header rows */
  fileHeader?: boolean;
}

/** The rows a pane draws, and how many of its own rows it had to leave out. */
export interface DiffShown {
  rows: DiffRow[];
  hidden: number;
}

/** Which of the rows a pane draws at all, before any row cap is applied. */
function keepMarks(
  rows: readonly DiffRow[],
  context: number,
  fileHeader: boolean,
): boolean[] {
  const keep = new Array<boolean>(rows.length).fill(false);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as DiffRow;
    if (row.kind === "ctx") continue;
    if (row.kind === "file" && !fileHeader) continue;
    keep[i] = true;
    if (context <= 0) continue;
    for (
      let j = Math.max(0, i - context);
      j <= Math.min(rows.length - 1, i + context);
      j++
    )
      if ((rows[j] as DiffRow).kind === "ctx") keep[j] = true;
  }
  return keep;
}

/**
 * The rows a pane draws.
 *
 * Unchanged lines are the bulk of most patches and say nothing, so a pane keeps
 * only the ones beside a change it was asked for — none, by default. The row
 * list still holds the rest, because the text around a change is what makes a
 * changed line parse as code, and because leaving them out is a choice the pane
 * makes, not lines it ran out of room for: only a `maxRows` cut is counted as
 * hidden.
 */
export function diffRowsShown(
  rows: readonly DiffRow[],
  { context = 0, maxRows = 0, fileHeader = true }: DiffVisibility = {},
): DiffShown {
  const keep = keepMarks(rows, context, fileHeader);

  const shown: DiffRow[] = [];
  let hidden = 0;
  for (let i = 0; i < rows.length; i++) {
    if (keep[i] !== true) continue;
    if (maxRows > 0 && shown.length >= maxRows) hidden++;
    else shown.push(rows[i] as DiffRow);
  }
  return { rows: shown, hidden };
}

/** A patch's rows grouped by the hunk they stand in, headers left out. */
export function diffHunkRows(rows: readonly DiffRow[]): Map<string, DiffRow[]> {
  const hunks = new Map<string, DiffRow[]>();
  for (const row of rows) {
    if (row.kind === "file" || row.kind === "hunk") continue;
    const key = `${row.file}:${row.hunk}`;
    const bucket = hunks.get(key);
    if (bucket === undefined) hunks.set(key, [row]);
    else bucket.push(row);
  }
  return hunks;
}
