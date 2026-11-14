/**
 * The columns of a table, measured once and shared by every row.
 *
 * A table is one grid: the cell in the third column of one row stands under the
 * cell in the third column of the next. The layout engine sizes a flex item by
 * what it holds, so a row whose cells carry no width of their own lays out its
 * own columns — `bun-eval` takes a narrow first column and pulls everything
 * beside it left, `pypi-search-packages` takes a wide one and pushes them right.
 * Every row then draws a different table, and the eye cannot read down a column.
 *
 * So the widths are decided by the whole table: the widest thing each column
 * holds, across every row, given back to each cell of that column. The cells
 * still grow to share the space the table has left, and they grow from the same
 * width, so every row's columns end in the same place.
 */

import { cloneElement, type ReactElement, type ReactNode, isValidElement } from "react";
import { type StyleDesc } from "@gpuix/react";
import { Icon } from "../components/icons";
import { T, type TextSize } from "../components/text";

/** How far one character of the proportional font advances, as a fraction of the
 *  size it is set at — the sibling of the mono advance, and the reason a column
 *  budgeted with it stays a column whatever the font's own advance turns out to be. */
const PROPORTIONAL_ADVANCE = 0.62;

/** The same for the mono family: every character one advance, by definition. */
const MONO_ADVANCE = 0.6;

/** Bolder text prints wider than the same word at a normal weight. */
const BOLD_FACTOR = 1.06;

/** The narrowest a column may stand. A column of icons, switches or empty cells
 *  is still a column, and a zero-width one would stack the next against it. */
const MIN_COLUMN = 24;

/** Cells measured per row before the rest of a very long row is taken to look
 *  like the cells before it. */
const MAX_MEASURED_CELLS = 24;

/** What the walk makes of an element in the tree a `Table` was handed: a band
 *  that holds rows (`TableHeader`, `TableBody`), a row, a cell, or something that
 *  is none of these. */
export type TableNodeRole = "group" | "row" | "cell" | null;

interface CellProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

/** What a cell's words are measured against, and what a mark inside one costs. */
export interface CellMeasureArgs {
  /** The size the table draws this kind of cell at — the fallback for words in
   *  the cell that ask for no size of their own. */
  size: number;

  /** The theme's type scale, so a cell that asks for `"caption"` is measured at
   *  the size it asks for rather than the size the table's density names. */
  sizes: Partial<Record<TextSize, number>>;

  monoFamily: string;
  iconSize: number;
  gap: number;
}

/** The ink a piece of a cell prints in: a size, a family, a weight. All three are
 *  inherited, and all three can be asked for by the element that stands there. */
interface Ink {
  size: number;
  mono: boolean;
  bold: boolean;
}

const advanceOf = (ink: Ink): number =>
  (ink.mono ? MONO_ADVANCE : PROPORTIONAL_ADVANCE) *
  ink.size *
  (ink.bold ? BOLD_FACTOR : 1);

/** How one element changes the ink its content prints in. */
function inkOf(node: ReactElement, ink: Ink, args: CellMeasureArgs): Ink {
  const props = node.props as CellProps & {
    size?: string;
    weight?: string | number;
  };
  const style = props.style;
  const asked =
    typeof style?.fontSize === "number"
      ? style.fontSize
      : node.type === T && typeof props.size === "string"
        ? (args.sizes as Partial<Record<TextSize, number>>)[
            props.size as TextSize
          ] ?? 0
        : 0;
  const weight =
    style?.fontWeight ??
    (node.type === T ? props.weight : undefined);
  return {
    size: asked === 0 ? ink.size : asked,
    mono: style?.fontFamily === args.monoFamily ? true : ink.mono,
    bold:
      weight === "bold" || (typeof weight === "number" && weight >= 600)
        ? true
        : ink.bold,
  };
}

/** How wide one node's content prints, at the size and family it is drawn in.
 *
 *  Two shapes of child, two answers. Children standing beside each other cost
 *  the sum of their parts — the mark, the air, the digits — so a cell that leads
 *  with an icon is that icon wider than its words. Children stacked in a column
 *  cost the widest of them: a cell that says a name over where the name came from
 *  is as wide as its longer line, not as wide as both lines read end to end, and
 *  that is what keeps a stacked cell from pushing the rest of the table off the
 *  row.
 *
 *  An icon is not a word, so it is never measured in characters: it costs the
 *  size the table draws marks at, plus the gap a row keeps beside them. */
function contentWidth(node: ReactNode, ink: Ink, args: CellMeasureArgs): number {
  if (typeof node === "string") return node.length * advanceOf(ink);
  if (typeof node === "number") return String(node).length * advanceOf(ink);
  if (node === null || node === undefined || typeof node === "boolean") return 0;
  if (!isValidElement(node)) return 0;

  const props = node.props as CellProps;
  const inner = inkOf(node, ink, args);
  const group = groupWidth(props.children, inner, args, props.style?.flexDirection);
  return node.type === Icon ? group + args.iconSize + args.gap : group;
}

/** What a cell's children cost side by side — or, stacked, the widest of them. */
function groupWidth(
  children: ReactNode,
  ink: Ink,
  args: CellMeasureArgs,
  direction: string | undefined,
): number {
  const parts: ReactNode[] = Array.isArray(children)
    ? children
    : children === null || children === undefined
      ? []
      : [children];
  if (direction !== "column")
    return parts.reduce<number>((sum, child) => sum + contentWidth(child, ink, args), 0);
  return parts.reduce<number>(
    (widest, child) => Math.max(widest, contentWidth(child, ink, args)),
    0,
  );
}

/** How wide one cell's own content prints, measured at the size and family each
 *  word is actually drawn at. A cell that wrote its own pixel width keeps it: a
 *  column of switches or meters says how wide it is, and that beats a measure
 *  taken from its words. */
export function cellContentWidth(
  cell: ReactElement,
  args: CellMeasureArgs,
): number {
  const props = cell.props as CellProps;
  const declared = typeof props.style?.width === "number" ? props.style.width : 0;
  const ink: Ink = { size: args.size, mono: false, bold: false };
  return Math.max(
    declared,
    groupWidth(props.children, ink, args, props.style?.flexDirection),
  );
}

/** Every row of cells in the tree a `Table` was handed, each row its cells in
 *  order. A row that holds anything but cells — a banner that spans the table, a
 *  message for an empty one — is not part of this grid and is left out, so it is
 *  never squeezed into the width of its first column. */
export function tableRowsOf(
  children: ReactNode,
  roleOf: (el: ReactElement) => TableNodeRole,
): ReactElement[][] {
  const rows: ReactElement[][] = [];

  const cellsOfRow = (row: ReactElement): ReactElement[] | null => {
    const cells: ReactElement[] = [];
    for (const child of asList((row.props as CellProps).children)) {
      if (!isValidElement(child)) continue;
      if (roleOf(child) !== "cell") return null;
      cells.push(child);
    }
    return cells.length > 0 ? cells.slice(0, MAX_MEASURED_CELLS) : null;
  };

  const walk = (node: ReactNode): void => {
    const inline: ReactElement[] = [];
    const flush = (): void => {
      if (inline.length > 0) rows.push(inline.slice(0, MAX_MEASURED_CELLS));
      inline.length = 0;
    };
    for (const child of asList(node)) {
      if (!isValidElement(child)) continue;
      const role = roleOf(child);
      if (role === "cell") {
        inline.push(child);
        continue;
      }
      flush();
      if (role === "row") {
        const cells = cellsOfRow(child);
        if (cells) rows.push(cells);
        continue;
      }
      // A band of the table's own, or a plain wrapper a body put around a row to
      // band it — and nothing else: an app's own element keeps its own contents.
      if (role === "group" || child.type === "div") {
        walk((child.props as CellProps).children);
      }
    }
    flush();
  };

  walk(children);
  return rows;
}

/** One entry per column: the widest content that column holds in any row. */
export function tableColumnWidths(
  rows: ReactElement[][],
  measure: (cell: ReactElement) => number,
): number[] {
  const widths: number[] = [];
  for (const row of rows) {
    for (const [at, cell] of row.entries()) {
      widths[at] = Math.max(widths[at] ?? 0, measure(cell));
    }
  }
  return widths.map((width) => Math.max(MIN_COLUMN, Math.ceil(width)));
}

/**
 * A rebuilt tree is a dynamic list to React even where it was written as static
 * JSX children, and a clone arrives with no key and no memory of ever having
 * been checked — so React warns and matches the child by position anyway. This
 * hands it the position it stands at, which is the identity React was going to
 * use. A key the caller wrote is kept, because that is the one they chose.
 */
function keyedAt(node: ReactElement, at: number): ReactElement {
  return node.key === null || node.key === undefined
    ? cloneElement(node as ReactElement<CellProps>, {
        key: `tcol-${String(at)}`,
      })
    : node;
}

/** Give every cell the width of its column, so every row draws one table. */
export function withTableColumns(
  children: ReactNode,
  roleOf: (el: ReactElement) => TableNodeRole,
  widths: number[],
): ReactNode {
  if (widths.length === 0) return children;

  const sized = (cell: ReactElement, width: number | undefined): ReactElement => {
    if (width === undefined) return cell;
    const props = cell.props as CellProps;
    return cloneElement(cell as ReactElement<CellProps>, {
      style: {
        ...props.style,
        width,
        flexBasis: width,
        minWidth: 0,
        // The column is the measure; words longer than it are cut to it, exactly
        // as a cell cut to its column reads in every other table.
        overflow: "hidden",
      },
    });
  };

  const paintRow = (row: ReactElement): ReactElement => {
    let at = 0;
    const cells = asList((row.props as CellProps).children).map(
      (child, position) => {
        if (isValidElement(child) && roleOf(child) === "cell")
          return keyedAt(sized(child, widths[at++]), position);
        return child;
      },
    );
    return cloneElement(row as ReactElement<CellProps>, {}, ...cells);
  };

  const walk = (node: ReactNode): ReactNode => {
    let at = 0;
    return asList(node).map((child, position) => {
      if (!isValidElement(child)) return child;
      const role = roleOf(child);
      if (role === "cell") return keyedAt(sized(child, widths[at++]), position);
      at = 0;
      if (role === "row") return keyedAt(paintRow(child), position);
      if (role !== "group" && child.type !== "div")
        return keyedAt(child, position);
      const inner = walk((child.props as CellProps).children);
      return keyedAt(
        cloneElement(child as ReactElement<CellProps>, {}, inner),
        position,
      );
    });
  };

  return walk(children);
}

function asList(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) return node;
  if (node === null || node === undefined) return [];
  return [node];
}
