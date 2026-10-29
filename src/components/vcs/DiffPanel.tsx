import { useMemo } from "react";
import type { Ref } from "react";
import {
  useGpuixRequired,
  type PublicInstance,
  type StyleDesc,
} from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { nativeDiffTheme } from "../../theme/vcs";
import { T } from "../common";
import { DataTable } from "../DataTable";
import type { TabularSides } from "../../lib/Tabular";


const MAX_DIFF_LINES = 500;

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
  if (
    (path.startsWith("a/") || path.startsWith("b/")) &&
    path.length > 2
  ) {
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
}

export interface DiffSummaryData {
  name: string;
  added: number;
  removed: number;
  changed: number;
}


export function summarizePatch(patch: string): DiffSummaryData {
  const file = parsePatch(patch);
  return {
    name: file.name,
    added: file.added,
    removed: file.removed,
    changed: file.added + file.removed,
  };
}

export function DiffSummary({
  added,
  removed,
}: {
  added: number;
  removed: number;
}) {
  const t = useAdwaita();
  const { colors, typography } = t;
  const mono: Partial<StyleDesc> = { fontFamily: typography.fontFamilyMono };
  if (added + removed === 0)
    return (
      <T size="caption" color={colors.dim_fg}>
        no changes
      </T>
    );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {added > 0 && (
        <T size="caption" weight={600} color={colors.success} style={mono}>
          {`+${added}`}
        </T>
      )}
      {removed > 0 && (
        <T size="caption" weight={600} color={colors.destructive} style={mono}>
          {`-${removed}`}
        </T>
      )}
    </div>
  );
}

export function DiffPanel({
  patch,
  tabular = null,
  diffRef,
  framed = false,
  header = false,
}: DiffPanelProps) {
  const t = useAdwaita();
  const { colors, typography, radii, spacing } = t;

  useGpuixRequired();

  if (tabular) {
    return <DataTable sides={tabular} scrollRef={diffRef} />;
  }

  const file = useMemo(() => parsePatch(patch), [patch]);
  const mono: Partial<StyleDesc> = { fontFamily: typography.fontFamilyMono };
  const changed = file.added + file.removed;

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
              borderRadius: radii.card,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.view_bg,
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
            gap: spacing.gap,
            padding: spacing.paddingTight,
            backgroundColor: colors.headerbar_bg,
            borderBottomWidth: 1,
            borderColor: colors.border,
            flexShrink: 0,
          }}
        >
          <T
            size="caption"
            weight={600}
            color={colors.fg}
            style={{
              ...mono,
              flexGrow: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {file.name || "diff"}
          </T>
          <T size="caption" color={colors.dim_fg} style={{ flexShrink: 0 }}>
            {`${changed} changed line${changed === 1 ? "" : "s"}`}
          </T>
        </div>
      )}
      <div
        ref={diffRef}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          alignSelf: "stretch",
          overflow: "scroll",
        }}
      >
        <diff
          patch={patch}
          wordDiff
          maxLines={MAX_DIFF_LINES}
          theme={nativeDiffTheme(t)}
        />
      </div>
    </div>
  );
}
