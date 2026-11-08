import { type Ref, useMemo } from "react";
import {
  type PublicInstance,
  type StyleDesc,
  useGpuixRequired,
} from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { FILE_HEADER_ROW_HEIGHT, nativeDiffTheme } from "../../theme/vcs";
import { T } from "../text";
import { DataTable } from "../DataTable";
import { DiffHistogram } from "./DiffHistogram";
import { type TabularSides } from "../../lib/Tabular";

const MAX_DIFF_LINES = 5000;

type DiffLineKind = "add" | "del" | "ctx" | "hunk";

interface DiffLine {
  kind: DiffLineKind;

  no: number | null;

  text: string;
}

interface DiffFile {
  name: string;

  lines: DiffLine[];

  added: number;

  removed: number;
}

function stripSide(path: string): string {
  if ((path.startsWith("a/") || path.startsWith("b/")) && path.length > 2) {
    return path.slice(2);
  }
  return path;
}

interface PatchState {
  name: string;

  oldNo: number;

  newNo: number;

  added: number;

  removed: number;

  lines: DiffLine[];
}

function isMetaLine(line: string): boolean {
  return (
    line.startsWith("index ") ||
    line.startsWith("new file mode") ||
    line.startsWith("old mode") ||
    line.startsWith("new mode") ||
    line.startsWith("similarity index") ||
    line.startsWith("rename ") ||
    line.startsWith("copy ") ||
    line.startsWith("Binary files")
  );
}

function updateNameFromSide(state: PatchState, path: string): void {
  const p = stripSide(path.trim());
  if (p !== "/dev/null") state.name = p;
}

function pushHunk(state: PatchState, line: string): void {
  const m = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (m) {
    state.oldNo = Number(m[1]);
    state.newNo = Number(m[2]);
  }
  state.lines.push({ kind: "hunk", no: null, text: line });
}

function pushChange(
  state: PatchState,
  line: string,
  kind: "add" | "del",
): void {
  if (kind === "add") {
    state.lines.push({ kind: "add", no: state.newNo++, text: line.slice(1) });
    state.added++;
  } else {
    state.lines.push({ kind: "del", no: state.oldNo++, text: line.slice(1) });
    state.removed++;
  }
}

function pushContext(state: PatchState, line: string): void {
  state.lines.push({
    kind: "ctx",
    no: state.newNo++,
    text: line.startsWith(" ") ? line.slice(1) : line,
  });
  state.oldNo++;
}

function startFileBlock(state: PatchState, line: string): boolean {
  if (!line.startsWith("diff --git ")) return false;
  const parts = line.split(" ");
  state.name = stripSide(parts[parts.length - 1] ?? "");
  state.oldNo = 0;
  state.newNo = 0;
  return true;
}

function isFileSideLine(line: string): boolean {
  return line.startsWith("--- ") || line.startsWith("+++ ");
}

function applyPatchLine(state: PatchState, raw: string): void {
  const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
  if (startFileBlock(state, line)) return;
  if (isFileSideLine(line)) {
    updateNameFromSide(state, line.slice(4));
    return;
  }
  if (isMetaLine(line)) return;
  if (line.startsWith("@@")) {
    pushHunk(state, line);
    return;
  }
  if (line.startsWith("\\")) return;
  if (line.startsWith("+")) {
    pushChange(state, line, "add");
    return;
  }
  if (line.startsWith("-")) {
    pushChange(state, line, "del");
    return;
  }
  pushContext(state, line);
}

function parsePatch(patch: string): DiffFile {
  const state: PatchState = {
    name: "",
    oldNo: 0,
    newNo: 0,
    added: 0,
    removed: 0,
    lines: [],
  };

  for (const raw of patch.split("\n")) {
    applyPatchLine(state, raw);
  }

  return {
    name: state.name,
    lines: state.lines.slice(0, MAX_DIFF_LINES),
    added: state.added,
    removed: state.removed,
  };
}

export interface DiffPanelProps {
  patch: string;

  tabular?: TabularSides | null;

  diffRef?: Ref<PublicInstance>;

  framed?: boolean;

  header?: boolean;

  name?: string | null;

  /**
   * Paint the diff widget's own per-file header row: the path with the chevron
   * that collapses the file. Off where the file is already named outside the
   * diff — a file list, a tool row's own label — where the row only repeats
   * what is already on screen.
   *
   * The widget has no switch for it, so the theme names the row's height and
   * the body is pulled up that far behind a clip.
   */
  fileHeader?: boolean;
}

export interface DiffSummaryData {
  name: string;
  added: number;
  removed: number;
  changed: number;
}

export function summarizePatch(patch: string): DiffSummaryData {
  let added = 0;
  let removed = 0;
  let name = "";
  let start = 0;
  while (start <= patch.length) {
    const end = patch.indexOf("\n", start);
    const stop = end < 0 ? patch.length : end;
    let line = patch.slice(start, stop);
    if (line.endsWith("\r")) line = line.slice(0, -1);
    if (line.startsWith("diff --git ")) {
      const parts = line.split(" ");
      name = stripSide(parts[parts.length - 1] ?? "") || name;
    } else if (line.startsWith("+++ ")) {
      const side = stripSide(line.slice(4));
      if (side !== "/dev/null") name = side;
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      added++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      removed++;
    }
    if (end < 0) break;
    start = end + 1;
  }
  return { name, added, removed, changed: added + removed };
}

export function DiffSummary({
  added,
  removed,
}: {
  added: number;
  removed: number;
}) {
  const t = useAdwaita();
  const mono: Partial<StyleDesc> = { fontFamily: t.type.fontFamilyMono };
  if (added + removed === 0)
    return (
      <T size="caption" color={t.color.text.dim}>
        no changes
      </T>
    );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {added > 0 && (
        <T
          size="caption"
          weight={600}
          color={t.color.functional.success}
          style={mono}
        >
          {`+${added}`}
        </T>
      )}
      {removed > 0 && (
        <T
          size="caption"
          weight={600}
          color={t.color.functional.destructive}
          style={mono}
        >
          {`-${removed}`}
        </T>
      )}
      <DiffHistogram insertions={added} deletions={removed} />
    </div>
  );
}

export function DiffPanel({
  patch,
  tabular = null,
  diffRef,
  framed = false,
  header = false,
  name = null,
  fileHeader = true,
}: DiffPanelProps) {
  const t = useAdwaita();
  useGpuixRequired();

  if (tabular) {
    return <DataTable sides={tabular} scrollRef={diffRef} name={name} />;
  }

  const file = useMemo(
    () => (header ? parsePatch(patch) : null),
    [patch, header],
  );
  const mono: Partial<StyleDesc> = { fontFamily: t.type.fontFamilyMono };
  const changed = file ? file.added + file.removed : 0;
  const theme = nativeDiffTheme(
    t,
    fileHeader ? undefined : { fileHeaderHeight: FILE_HEADER_ROW_HEIGHT },
  );

  const body = (
    <diff
      ref={diffRef}
      patch={patch}
      wordDiff
      scroll
      maxLines={MAX_DIFF_LINES}
      theme={theme}
      style={{
        flexGrow: 1,
        minHeight: 0,
        alignSelf: "stretch",
        ...(fileHeader ? {} : { marginTop: -FILE_HEADER_ROW_HEIGHT }),
      }}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        ...(framed
          ? {
              borderRadius: t.radius.sm,
              borderWidth: 0,
              backgroundColor: t.color.surface.view,
            }
          : {}),
      }}
    >
      {header && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: t.space.sm,
            padding: t.space.md,
            backgroundColor: t.color.surface.headerbar,
            borderBottomWidth: 1,
            borderColor: t.color.border.default,
            flexShrink: 0,
          }}
        >
          <T
            size="caption"
            weight={600}
            color={t.color.text.primary}
            style={{
              ...mono,
              flexGrow: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {file?.name || "diff"}
          </T>
          <T size="caption" color={t.color.text.dim} style={{ flexShrink: 0 }}>
            {`${changed} changed line${changed === 1 ? "" : "s"}`}
          </T>
        </div>
      )}
      {fileHeader ? (
        body
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
            alignSelf: "stretch",
            overflow: "hidden",
          }}
        >
          {body}
        </div>
      )}
    </div>
  );
}
