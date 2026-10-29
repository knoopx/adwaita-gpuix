import { detectDelim, parseTable, type TabularDelim } from "./csv";
import { patchSides } from "./patch";

export interface TabularSides {
  delim: TabularDelim;
  old: string[][];
  next: string[][];
  hasHeader: boolean;
}

function isNumericCell(value: string): boolean {
  const k = value.trim();
  return k !== "" && Number.isFinite(Number(k));
}




function hasHeaderRow(rows: string[][]): boolean {
  if (rows.length < 2) return false;
  const first = rows[0];
  if (!first || first.length === 0) return false;
  return first.every((v) => v.trim() !== "" && !isNumericCell(v));
}

export function parseTabularSides(
  patch: string,
  path?: string,
): TabularSides | null {
  const sides = patchSides(patch, path);
  if (!sides || (sides.old.length === 0 && sides.next.length === 0))
    return null;

  const nextText = sides.next.join("\n");
  const oldText = sides.old.join("\n");
  const probe = nextText.length >= oldText.length ? nextText : oldText;
  const delim = detectDelim(probe);
  if (!delim) return null;

  const next = nextText === "" ? [] : parseTable(nextText, delim);
  const old = oldText === "" ? [] : parseTable(oldText, delim);
  if (!next || !old) return null;

  const probeRows = nextText.length >= oldText.length ? next : old;
  return { delim, old, next, hasHeader: hasHeaderRow(probeRows) };
}
