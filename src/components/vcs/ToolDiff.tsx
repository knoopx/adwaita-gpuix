import { type StyleDesc } from "@gpuix/react";
import { useMemo } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { DiffText } from "./DiffText";
import { summarizePatch } from "./DiffPanel";
import { diffRowsOf, type DiffRow } from "../../lib/vcs/rows";
import type { DiffToken } from "../../lib/vcs/tokens";

/**
 * How many rows a diff in the log may be. A tool's own answer is the point of
 * the row; the patch under it is evidence, and evidence stops where the next
 * row begins.
 */
const MAX_DIFF_ROWS = 40;

export interface ToolDiffProps {
  patch: string;

  path?: string;

  summary?: boolean;

  /** draw the patch's own per-file rows, where the patch names more than one file */
  fileHeader?: boolean;

  /** the patch's rows, from `diffRowsOf`, when the app has them already */
  rows?: readonly DiffRow[];

  /** how the text of each row is coloured — the app's reading of its language */
  tokenize?: (row: DiffRow) => DiffToken[] | undefined;

  maxRows?: number;

  style?: Partial<StyleDesc>;
}

export function ToolDiff({
  patch,
  path,
  summary = false,
  fileHeader = false,
  rows,
  tokenize,
  maxRows = MAX_DIFF_ROWS,
  style,
}: ToolDiffProps) {
  const t = useAdwaita();
  const parsed = useMemo(() => rows ?? diffRowsOf(patch), [rows, patch]);
  const stats = useMemo(
    () => (summary && fileHeader ? summarizePatch(patch) : null),
    [summary, fileHeader, patch],
  );

  const body = (
    <DiffText
      patch={patch}
      rows={parsed}
      tokenize={tokenize}
      fileHeader={fileHeader}
      maxRows={maxRows}
      style={{ width: "100%", minWidth: 0, flexShrink: 0 }}
    />
  );

  if (stats === null) return body;

  const mono: Partial<StyleDesc> = { fontFamily: t.type.fontFamilyMono };
  const label = path ?? stats.name;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
        ...style,
      }}
    >
      {label !== "" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: t.space.sm,
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <T
            size="caption"
            color={t.color.text.dim}
            style={{
              ...mono,
              flexGrow: 1,
              flexShrink: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {label}
          </T>
          <T
            size="caption"
            weight={t.type.weight.semibold}
            color={t.color.functional.success}
            style={{ ...mono, flexShrink: 0 }}
          >
            {`+${stats.added}`}
          </T>
          <T
            size="caption"
            weight={t.type.weight.semibold}
            color={t.color.functional.destructive}
            style={{ ...mono, flexShrink: 0 }}
          >
            {`−${stats.removed}`}
          </T>
        </div>
      ) : null}
      {body}
    </div>
  );
}
