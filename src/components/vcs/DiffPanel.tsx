import { type Ref, useMemo } from "react";
import { type PublicInstance, type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { DataTable } from "../DataTable";
import { DiffHistogram } from "./DiffHistogram";
import { DiffText } from "./DiffText";
import { type TabularSides } from "../../lib/Tabular";
import { diffRowsOf, type DiffRow } from "../../lib/vcs/rows";
import type { DiffToken } from "../../lib/vcs/tokens";

export interface DiffPanelProps {
  patch: string;

  tabular?: TabularSides | null;

  diffRef?: Ref<PublicInstance>;

  framed?: boolean;

  header?: boolean;

  name?: string | null;

  /**
   * Paint the patch's own per-file rows: the path with its two counts. Off where
   * the file is already named outside the diff — a file list above the pane, a
   * tool row's own label — where the row only repeats what is on screen.
   */
  fileHeader?: boolean;

  /**
   * The patch's rows, from `diffRowsOf`, when the app has them already: what it
   * hands to `tokenize` is keyed to those same rows.
   */
  rows?: readonly DiffRow[];

  /** How the text of each row is coloured — the app's reading of its language. */
  tokenize?: (row: DiffRow) => DiffToken[] | undefined;

  /** Unchanged lines kept beside each change. None, unless asked for. */
  context?: number;

  /** How many rows to draw, 0 for all of them. */
  maxRows?: number;
}

export interface DiffSummaryData {
  name: string;
  added: number;
  removed: number;
  changed: number;
}

/** What a patch touches: its last named file and its two totals. */
export function summarizePatch(patch: string): DiffSummaryData {
  let name = "";
  let added = 0;
  let removed = 0;
  for (const row of diffRowsOf(patch)) {
    if (row.kind === "file" && row.path !== "") name = row.path;
    else if (row.kind === "add") added++;
    else if (row.kind === "del") removed++;
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
          {`−${removed}`}
        </T>
      )}
      <DiffHistogram insertions={added} deletions={removed} />
    </div>
  );
}

/**
 * The diff of a patch: its changed lines, one row each, tinted by what happened
 * to them, with the text of a line coloured by what the app finds in it. There
 * are no line-number columns and no `+`/`-` markers — a row's colour says what
 * it is, and its place in the file is not what a reader is looking for.
 */
export function DiffPanel({
  patch,
  tabular = null,
  diffRef,
  framed = false,
  header = false,
  name = null,
  fileHeader = true,
  rows,
  tokenize,
  context = 0,
  maxRows = 0,
}: DiffPanelProps) {
  const t = useAdwaita();

  // The table side is a different widget, and this one is asked for it before it
  // reaches its own hooks: an instance that could switch between the two would
  // render a different number of hooks, so the two are kept as two components.
  if (tabular) {
    return <DataTable sides={tabular} scrollRef={diffRef} name={name} />;
  }

  const summary = useMemo(
    () => (header ? summarizePatch(patch) : null),
    [patch, header],
  );
  const mono: Partial<StyleDesc> = { fontFamily: t.type.fontFamilyMono };
  const changed = summary?.changed ?? 0;

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
            {summary?.name || "diff"}
          </T>
          <T size="caption" color={t.color.text.dim} style={{ flexShrink: 0 }}>
            {`${changed} changed line${changed === 1 ? "" : "s"}`}
          </T>
        </div>
      )}
      <DiffText
        patch={patch}
        rows={rows}
        tokenize={tokenize}
        scroll
        fileHeader={fileHeader}
        context={context}
        maxRows={maxRows}
        listRef={diffRef}
      />
    </div>
  );
}
