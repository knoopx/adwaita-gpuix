const TABULAR_EXTENSIONS = new Set(["csv", "tsv", "tab"]);

export function isTabularPath(path: string): boolean {
  const dot = path.lastIndexOf(".");
  if (dot < 0) return false;
  return TABULAR_EXTENSIONS.has(path.slice(dot + 1).toLowerCase());
}

export type TabularDelim = "\t" | "," | ";" | "|";

const DELIM_CANDIDATES: TabularDelim[] = ["\t", ",", ";", "|"];

function countDelim(line: string, d: string): number {
  let n = 0;
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQ = !inQ;
    else if (!inQ && ch === d) n++;
  }
  return n;
}

export function detectDelim(text: string): TabularDelim | null {
  const lines = text
    .split("\n")
    .slice(0, 200)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return null;
  let best: TabularDelim | null = null;
  let bestScore = 0;
  for (const d of DELIM_CANDIDATES) {
    const counts = lines.map((l) => countDelim(l, d));
    if (counts.every((c) => c === 0)) continue;
    const mode = counts.reduce((m, c) => (c > (m as number) ? c : m), 0);

    if (mode < 1) continue;
    const score = counts.filter((c) => c === mode).length;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  if (best === null) return null;
  if (bestScore < Math.max(2, Math.ceil(lines.length * 0.6))) return null;
  return best;
}

function stepQuoted(
  line: string,
  i: number,
  field: string,
): { field: string; inQ: boolean; i: number } {
  const ch = line[i];
  if (ch === '"') {
    if (line[i + 1] === '"') return { field: field + '"', inQ: true, i: i + 2 };
    return { field, inQ: false, i: i + 1 };
  }
  return { field: field + ch, inQ: true, i: i + 1 };
}

function splitLine(line: string, delim: string): string[] {
  const fields: string[] = [];
  let field = "";
  let inQ = false;
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === "\r") {
      i++;
      continue;
    }
    if (inQ) {
      const r = stepQuoted(line, i, field);
      field = r.field;
      inQ = r.inQ;
      i = r.i;
      continue;
    }
    if (ch === '"' && field === "") {
      inQ = true;
      i++;
      continue;
    }
    if (ch === delim) {
      fields.push(field);
      field = "";
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  fields.push(field);
  return fields;
}

function splitTable(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  for (const line of text.split("\n")) {
    row = splitLine(line, delim);
    rows.push(row);
  }
  return rows;
}

function validateParsedRows(rows: string[][]): string[][] | null {
  if (
    rows.length > 0 &&
    rows[rows.length - 1].length === 1 &&
    rows[rows.length - 1][0] === ""
  )
    rows.pop();
  if (rows.length === 0) return null;

  const counts = rows.map((r) => r.length);
  const mode = counts.reduce((m, c) => (c > (m as number) ? c : m), 0);
  if (mode < 2) return null;
  const ok = rows.filter((r) => Math.abs(r.length - mode) <= 1).length;
  if (ok < Math.ceil(rows.length * 0.6)) return null;
  return rows;
}

export function parseTable(text: string, delim: string): string[][] | null {
  const rows = splitTable(text, delim);
  return validateParsedRows(rows);
}
