import { type JSX, type Ref, useMemo } from "react";
import { type PublicInstance, type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import {
  DIFF_ROW_HEIGHT,
  DIFF_ROW_INSET,
  DIFF_TEXT_SIZE,
  codePalette,
} from "../../theme/code";
import { diffHeaderFill } from "../../theme/vcs";
import { T } from "../text";
import { useListWindow } from "../../lib/listWindow";
import {
  diffRowsOf,
  diffRowsShown,
  type DiffRowKind,
  type DiffRow,
  type DiffVisibility,
} from "../../lib/vcs/rows";
import type { DiffToken, DiffTokenKind } from "../../lib/vcs/tokens";

export interface DiffTextProps extends DiffVisibility {
  patch: string;

  /**
   * The patch's rows, from `diffRowsOf`. Pass what the app already parsed when
   * it hands colour back for the same rows, so a patch is read once.
   */
  rows?: readonly DiffRow[];

  /**
   * The colour a row's text reads in, as the app's own reading of the language.
   * Absent, or answering nothing for a row, the row is one colour: a diff that
   * cannot be parsed still says what changed.
   */
  tokenize?: (row: DiffRow) => DiffToken[] | undefined;

  /**
   * The band the patch's `@@` and per-file rows wear.
   *
   * Absent, the header is measured off the app's page — `diffHeaderFill` — which is
   * right for a patch drawn on the page itself. An app that draws a patch on a plate
   * of its own has to name that plate, because a header measured off the page arrives
   * as a strip of the page running across the middle of the diff, and one measured
   * *toward the ink* arrives as a slab standing above the rows it labels — louder than
   * the added and taken rows, which is the one thing a patch's header may not be.
   */
  headerFill?: string;

  /**
   * Own a scroller. On in a pane of bounded height, where a long patch is
   * virtualised; off inline in a log, where the log is the scroller and a row
   * cap is what keeps the body short.
   */
  scroll?: boolean;

  listRef?: Ref<PublicInstance>;

  style?: Partial<StyleDesc>;
}

type Palette = Record<DiffTokenKind, string>;

function listStyle(): StyleDesc {
  return {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
    width: "100%",
  };
}

/**
 * The row's fill: a changed line wears the tint of what happened to it, because
 * a diff row is told apart by its colour and not by a `+` or `-` stamped in
 * front of it. A header is a rung off the surface the patch is drawn on: the app
 * names that surface with `headerFill`, and `diffHeaderFill` measures the page's own
 * case — which is why a header is measured and never a surface role.
 */
function rowFill(
  t: AdwaitaTheme,
  kind: DiffRowKind,
  headerFill: string,
): string | undefined {
  if (kind === "add") return t.color.functional.successTint;
  if (kind === "del") return t.color.functional.destructiveTint;
  if (kind === "file" || kind === "hunk") return headerFill;
  return undefined;
}

/**
 * One row of the patch.
 *
 * The row states the list's width rather than taking its own. A virtual list
 * measures each row at its content, and a diff row's content is one unwrapped
 * line: left to measure itself the row is as wide as the longest line of the
 * patch, so its tint runs past the pane, its text is never given the chance to
 * give the room back, and the row that changed and the row that did not stop
 * sharing an edge. Naming the width is what makes `flexShrink` on the text run
 * mean anything, and what keeps every row of one patch the same shape.
 */
function rowStyle(
  t: AdwaitaTheme,
  kind: DiffRowKind,
  headerFill: string,
): StyleDesc {
  const fill = rowFill(t, kind, headerFill);
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: DIFF_ROW_HEIGHT,
    flexShrink: 0,
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    paddingLeft: DIFF_ROW_INSET,
    paddingRight: DIFF_ROW_INSET,
    ...(fill === undefined ? {} : { backgroundColor: fill }),
  };
}

function mono(): Partial<StyleDesc> {
  return {
    fontSize: DIFF_TEXT_SIZE,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
}

function headerRow(
  t: AdwaitaTheme,
  palette: Palette,
  row: DiffRow,
): JSX.Element {
  const base = { ...mono(), fontFamily: t.type.fontFamilyMono };
  return (
    <>
      <T
        size="caption"
        color={row.kind === "file" ? t.color.text.secondary : palette.comment}
        style={{ ...base, flexGrow: 1, minWidth: 0, flexShrink: 1 }}
      >
        {row.text}
      </T>
      {row.kind === "file" ? (
        // The two counts belong to the file named on the row, but they are its
        // figure, not a continuation of its name: they stand at the row's end,
        // where every other row of the panel puts its figure, with the air the
        // gap buys between a path and a number.
        <T
          size="caption"
          color={t.color.text.dim}
          style={{
            ...base,
            marginLeft: t.space.sm,
            flexShrink: 0,
            textAlign: "right",
          }}
        >
          {`+${row.additions} −${row.deletions}`}
        </T>
      ) : null}
    </>
  );
}

/**
 * The line itself: one text run per kind of thing the app found in it, each in
 * the palette, with only the tail of the line giving way so an over-wide line is
 * cut at the pane edge the way a terminal cuts it.
 */
function textRow(
  t: AdwaitaTheme,
  palette: Palette,
  row: DiffRow,
  tokenize: ((row: DiffRow) => DiffToken[] | undefined) | undefined,
): JSX.Element {
  const tokens = tokenize?.(row);
  const runs: DiffToken[] =
    tokens !== undefined && tokens.length > 0
      ? tokens
      : [{ text: row.text, kind: "plain" }];

  return (
    <>
      {runs.map((token, i) => (
        <T
          key={i}
          size="caption"
          color={palette[token.kind]}
          style={{
            ...mono(),
            fontFamily: t.type.fontFamilyMono,
            flexShrink: i === runs.length - 1 ? 1 : 0,
            minWidth: 0,
          }}
        >
          {token.text}
        </T>
      ))}
    </>
  );
}

function diffRow(
  t: AdwaitaTheme,
  palette: Palette,
  entry: DiffRow,
  tokenize: ((row: DiffRow) => DiffToken[] | undefined) | undefined,
  headerFill: string,
): JSX.Element {
  return (
    <div key={entry.id} style={rowStyle(t, entry.kind, headerFill)}>
      {entry.kind === "file" || entry.kind === "hunk"
        ? headerRow(t, palette, entry)
        : textRow(t, palette, entry, tokenize)}
    </div>
  );
}

/**
 * The body of a diff: one row per line of a patch, with no line numbers and no
 * marker column in front of the text. What happened to a line is said by the
 * row's tint and what its text is made of by its colours; everything else a
 * patch carries — the two counters, the `@@` range, which side a line was on —
 * stays in the rows and off the screen.
 */
export function DiffText({
  patch,
  rows,
  tokenize,
  headerFill,
  scroll = false,
  listRef,
  style,
  context = 0,
  maxRows = 0,
  fileHeader = true,
}: DiffTextProps) {
  const t = useAdwaita();
  const palette = codePalette(t);
  const header = headerFill ?? diffHeaderFill(t);
  const parsed = useMemo(() => rows ?? diffRowsOf(patch), [rows, patch]);
  const view = useMemo(
    () => diffRowsShown(parsed, { context, maxRows, fileHeader }),
    [parsed, context, maxRows, fileHeader],
  );
  const shown = view.rows;
  const win = useListWindow(shown.length, DIFF_ROW_HEIGHT);
  const drawn = scroll ? win.slice(shown) : shown;

  if (shown.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: scroll ? 1 : 0,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      {scroll ? (
        <virtual-list
          ref={listRef}
          estimatedItemHeight={DIFF_ROW_HEIGHT}
          itemCount={win.itemCount}
          windowStart={win.windowStart}
          overdraw={win.overdraw}
          onVisibleRange={win.onVisibleRange}
          style={listStyle()}
        >
          {drawn.map((entry) => diffRow(t, palette, entry, tokenize, header))}
        </virtual-list>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: 0,
          }}
        >
          {drawn.map((entry) => diffRow(t, palette, entry, tokenize, header))}
        </div>
      )}
      {view.hidden > 0 ? (
        <div style={rowStyle(t, "ctx", header)}>
          <T size="caption" color={t.color.text.dim} style={mono()}>
            {`${view.hidden} more line${view.hidden === 1 ? "" : "s"} not shown`}
          </T>
        </div>
      ) : null}
    </div>
  );
}
