export interface DiffMetrics {
  textSize: number;
  lineHeight: number;
  fileHeaderHeight: number;
  hunkHeaderHeight: number;
  noticeHeight: number;
  bodyBottomPad: number;
}

export const DIFF_METRICS: DiffMetrics = {
  textSize: 12,
  lineHeight: 21,
  fileHeaderHeight: 36,
  hunkHeaderHeight: 28,
  noticeHeight: 24,
  bodyBottomPad: 8,
};

export interface DiffRowCounts {
  header: number;
  notices: number;
  hunkHeaders: number;
  lines: number;
  bodyPads: number;
  showMore: boolean;
}

type FileStatus = "modified" | "added" | "deleted" | "renamed";

interface FileModel {
  status: FileStatus;
  binary: boolean;
  modeNotices: number;
  hunks: number[];
}

function isGitHeader(line: string): boolean {
  return line.startsWith("diff --git ");
}

function isIndexHeader(line: string): boolean {
  return line.startsWith("Index: ");
}

function isOldPathLine(line: string): boolean {
  return line.startsWith("--- ");
}

function isNewPathLine(line: string): boolean {
  return line.startsWith("+++ ");
}

function isHunkHeader(line: string): boolean {
  return line.startsWith("@@");
}

function isBodyLine(line: string): boolean {
  return (
    line === "" ||
    line.startsWith("+") ||
    line.startsWith("-") ||
    line.startsWith(" ") ||
    line.startsWith("\\")
  );
}

function isDevNull(line: string, prefix: string): boolean {
  return (
    line.startsWith(prefix) && line.slice(prefix.length).trim() === "/dev/null"
  );
}

function parsesUnsigned(token: string): boolean {
  return /^\d+$/.test(token);
}

function hunkHeaderParses(line: string): boolean {
  const rest = line.slice(2);
  const minus = rest.indexOf("-");
  if (minus < 0) return false;
  if (!parsesUnsigned(rest.slice(minus + 1).split(/[\s,]/)[0])) return false;
  const plus = rest.indexOf("+");
  if (plus < 0) return false;
  return parsesUnsigned(rest.slice(plus + 1).split(/[\s,]/)[0]);
}

function patchLines(patch: string): string[] {
  const lines = patch.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines.map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
}

function lastFile(files: FileModel[]): FileModel {
  return files[files.length - 1];
}

function openFile(files: FileModel[]): void {
  files.push({ status: "modified", binary: false, modeNotices: 0, hunks: [] });
}

function parseFiles(patch: string): FileModel[] {
  const files: FileModel[] = [];
  let inHunk = false;

  for (const line of patchLines(patch)) {
    if (isGitHeader(line) || isIndexHeader(line)) {
      openFile(files);
      inHunk = false;
      continue;
    }

    if (isHunkHeader(line)) {
      if (files.length === 0) {
        openFile(files);
      }
      if (hunkHeaderParses(line)) {
        lastFile(files).hunks.push(0);
        inHunk = true;
      }
      continue;
    }

    if (inHunk && isBodyLine(line)) {
      const hunks = lastFile(files).hunks;
      hunks[hunks.length - 1] += 1;
      continue;
    }

    inHunk = false;
    if (files.length === 0) {
      continue;
    }
    const file = lastFile(files);

    if (line.startsWith("new file mode")) {
      file.status = "added";
    } else if (line.startsWith("deleted file mode")) {
      file.status = "deleted";
    } else if (line.startsWith("rename from ")) {
      file.status = "renamed";
    } else if (line.startsWith("rename to ")) {
      file.status = "renamed";
    } else if (
      line.startsWith("Binary files") ||
      line.startsWith("GIT binary patch")
    ) {
      file.binary = true;
    } else if (line.startsWith("new mode ")) {
      file.modeNotices++;
    } else if (isNewPathLine(line)) {
      if (isDevNull(line, "+++ ")) {
        file.status = "deleted";
      }
    } else if (isOldPathLine(line)) {
      if (isDevNull(line, "--- ")) {
        file.status = "added";
      } else if (file.hunks.length > 0) {
        openFile(files);
      }
    }
  }

  return files;
}

function noticesOf(file: FileModel): number {
  const statusNotice = file.status === "modified" ? 0 : 1;
  const binaryNotice = file.binary ? 1 : 0;
  return statusNotice + binaryNotice + file.modeNotices;
}

function linesAfter(
  files: FileModel[],
  fileIx: number,
  hunkIx: number,
  lineIx: number,
): number {
  const fromCurrent = files[fileIx].hunks
    .slice(hunkIx)
    .reduce(
      (sum, count, i) => sum + Math.max(0, count - (i === 0 ? lineIx : 0)),
      0,
    );
  const fromLater = files
    .slice(fileIx + 1)
    .reduce((sum, file) => sum + file.hunks.reduce((a, b) => a + b, 0), 0);
  return fromCurrent + fromLater;
}

export function diffRowCounts(patch: string, maxLines = 0): DiffRowCounts {
  const files = parseFiles(patch);
  const counts: DiffRowCounts = {
    header: 0,
    notices: 0,
    hunkHeaders: 0,
    lines: 0,
    bodyPads: 0,
    showMore: false,
  };
  const cap = maxLines > 0 ? maxLines : Number.POSITIVE_INFINITY;

  for (let f = 0; f < files.length; f++) {
    if (f > 0 && counts.lines >= cap) {
      counts.showMore = linesAfter(files, f, 0, 0) > 0;
      break;
    }

    counts.header++;
    counts.notices += noticesOf(files[f]);

    let capped = false;
    for (let h = 0; h < files[f].hunks.length; h++) {
      if (counts.lines >= cap) {
        counts.showMore = linesAfter(files, f, h, 0) > 0;
        capped = true;
        break;
      }
      counts.hunkHeaders++;
      for (let i = 0; i < files[f].hunks[h]; i++) {
        if (counts.lines >= cap) {
          counts.showMore = linesAfter(files, f, h, i) > 0;
          capped = true;
          break;
        }
        counts.lines++;
      }
      if (capped) break;
    }
    if (capped) break;

    counts.bodyPads++;
  }

  return counts;
}

export function diffHeightOf(
  patch: string,
  maxLines = 0,
  metrics: DiffMetrics = DIFF_METRICS,
): number {
  const counts = diffRowCounts(patch, maxLines);
  return (
    counts.header * metrics.fileHeaderHeight +
    counts.notices * metrics.noticeHeight +
    counts.hunkHeaders * metrics.hunkHeaderHeight +
    counts.lines * metrics.lineHeight +
    counts.bodyPads * metrics.bodyBottomPad +
    (counts.showMore ? metrics.fileHeaderHeight : 0)
  );
}
