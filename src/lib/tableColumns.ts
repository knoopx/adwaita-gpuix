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

/** The plain words a cell holds, joined. A cell whose content is an icon, a chip
 *  or an input has no words and contributes nothing to its column's measure. */
export function cellText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(cellText).join("");
  if (isValidElement(node)) return cellText((node.props as CellProps).children);
  return "";
}

/** Whether anything in a cell asks for the mono family and whether anything asks
 *  for a bold weight — the two things that change how wide its words print. */
function cellPaint(node: ReactNode, monoFamily: string): { mono: boolean; bold: boolean } {
  let mono = false;
  let bold = false;
  const walk = (n: ReactNode): void => {
    if (Array.isArray(n)) {
      for (const child of n) walk(child);
      return;
    }
    if (!isValidElement(n)) return;
    const props = n.props as CellProps;
    const style = props.style;
    if (style) {
      if (style.fontFamily === monoFamily) mono = true;
      const weight = style.fontWeight;
      if (weight === "bold" || (typeof weight === "number" && weight >= 600)) bold = true;
    }
    walk(props.children);
  };
  walk(node);
  return { mono, bold };
}

/** How wide one cell's own content prints, at the size the table draws that kind
 *  of cell in. A cell that wrote its own pixel width keeps it: a column of
 *  switches or meters says how wide it is, and that beats a guess from its words.
 *  `extra` is the room a cell's own furniture takes beside its words — the icon
 *  of a lead cell, say. */
export function cellContentWidth(
  cell: ReactElement,
  args: { size: number; monoFamily: string; extra?: number },
): number {
  const props = cell.props as CellProps;
  const declared = typeof props.style?.width === "number" ? props.style.width : 0;
  const paint = cellPaint(cell, args.monoFamily);
  const advance =
    (paint.mono ? MONO_ADVANCE : PROPORTIONAL_ADVANCE) *
    args.size *
    (paint.bold ? BOLD_FACTOR : 1);
  const words = cellText(props.children).length * advance + (args.extra ?? 0);
  return Math.max(declared, words);
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
    const cells = asList((row.props as CellProps).children).map((child) => {
      if (isValidElement(child) && roleOf(child) === "cell") return sized(child, widths[at++]);
      return child;
    });
    return cloneElement(row as ReactElement<CellProps>, {}, ...cells);
  };

  const walk = (node: ReactNode): ReactNode => {
    let at = 0;
    return asList(node).map((child) => {
      if (!isValidElement(child)) return child;
      const role = roleOf(child);
      if (role === "cell") return sized(child, widths[at++]);
      at = 0;
      if (role === "row") return paintRow(child);
      if (role !== "group" && child.type !== "div") return child;
      const inner = walk((child.props as CellProps).children);
      return cloneElement(child as ReactElement<CellProps>, {}, inner);
    });
  };

  return walk(children);
}

function asList(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) return node;
  if (node === null || node === undefined) return [];
  return [node];
}
