import { type JSX, type Ref, useMemo } from "react";
import { type PublicInstance, type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import {
  DIFF_ROW_HEIGHT,
  DIFF_ROW_INSET,
  DIFF_TEXT_SIZE,
  codePalette,
} from "../../theme/code";
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
 * front of it. A header is a band of the surface the pane is drawn on.
 */
function rowFill(t: AdwaitaTheme, kind: DiffRowKind): string | undefined {
  if (kind === "add") return t.color.functional.successTint;
  if (kind === "del") return t.color.functional.destructiveTint;
  if (kind === "file" || kind === "hunk") return t.color.surface.headerbar;
  return undefined;
}

function rowStyle(t: AdwaitaTheme, kind: DiffRowKind): StyleDesc {
  const fill = rowFill(t, kind);
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: DIFF_ROW_HEIGHT,
    flexShrink: 0,
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
        style={{ ...base, minWidth: 0, flexShrink: 1 }}
      >
        {row.text}
      </T>
      {row.kind === "file" ? (
        <T
          size="caption"
          color={t.color.text.dim}
          style={{ ...base, flexShrink: 0, textAlign: "right" }}
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
): JSX.Element {
  return (
    <div key={entry.id} style={rowStyle(t, entry.kind)}>
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
  scroll = false,
  listRef,
  style,
  context = 0,
  maxRows = 0,
  fileHeader = true,
}: DiffTextProps) {
  const t = useAdwaita();
  const palette = codePalette(t);
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
          {drawn.map((entry) => diffRow(t, palette, entry, tokenize))}
        </virtual-list>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {drawn.map((entry) => diffRow(t, palette, entry, tokenize))}
        </div>
      )}
      {view.hidden > 0 ? (
        <div style={rowStyle(t, "ctx")}>
          <T size="caption" color={t.color.text.dim} style={mono()}>
            {`${view.hidden} more line${view.hidden === 1 ? "" : "s"} not shown`}
          </T>
        </div>
      ) : null}
    </div>
  );
}
