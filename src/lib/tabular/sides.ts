import { detectDelim, parseTable, type TabularDelim } from "./csv";
import { patchSides } from "./patch";

export interface TabularSides {
  delim: TabularDelim;
  old: string[][];
  next: string[][];
  hasHeader: boolean;
}

function hasHeaderRow(rows: string[][]): boolean {
  return (
    rows.length > 1 &&
    rows.every((r) => {
      const k = (r[0] ?? "").trim();
      return k !== "" && !Number.isFinite(Number(k));
    })
  );
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
