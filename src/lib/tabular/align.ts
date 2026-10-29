export interface AlignedCell {
  old: string;
  next: string;
  changed: boolean;
}

export type AlignedRow =
  | { kind: "pair"; oldNo: number; nextNo: number; cells: AlignedCell[] }
  | { kind: "added"; oldNo: number | null; nextNo: number; cells: string[] }
  | { kind: "removed"; oldNo: number; nextNo: number | null; cells: string[] };

export interface AlignedTable {
  header: string[];
  hasHeader: boolean;
  rows: AlignedRow[];
  cols: number;
}

function rowKey(row: string[]): string {
  const k = (row[0] ?? "").trim();
  if (k !== "") return k;
  return row.join("\u0000");
}

function padRow(row: string[], cols: number): string[] {
  const out = row.slice(0, cols);
  while (out.length < cols) out.push("");
  return out;
}




function pickHeaderSrc(
  oldRows: string[][],
  nextRows: string[][],
  hasHeader: boolean,
): string[] {
  if (!hasHeader) return [];
  if (nextRows.length > 0) return nextRows[0] as string[];
  if (oldRows.length > 0) return oldRows[0] as string[];
  return [];
}

function computeCols(
  headerSrc: string[],
  oldData: string[][],
  nextData: string[][],
): number {
  return Math.max(
    headerSrc.length,
    ...oldData.map((r) => r.length),
    ...nextData.map((r) => r.length),
    0,
  );
}

function buildHeader(headerSrc: string[], cols: number): string[] {
  const header: string[] = [];
  for (let c = 0; c < cols; c++) {
    header.push(
      (headerSrc[c] ?? "").trim() !== ""
        ? (headerSrc[c] as string)
        : `col ${c + 1}`,
    );
  }
  return header;
}

function buildRowKeyQueues(oldData: string[][]): Map<string, number[]> {
  const queues = new Map<string, number[]>();
  oldData.forEach((r, i) => {
    const k = rowKey(r);
    const q = queues.get(k);
    if (q) q.push(i);
    else queues.set(k, [i]);
  });
  return queues;
}

interface RowLinks {
  links: Map<number, number>;
  linkedOld: Set<number>;
}

function buildRowLinks(
  queues: Map<string, number[]>,
  nextData: string[][],
): RowLinks {
  const links = new Map<number, number>();
  const linkedOld = new Set<number>();
  let lastOld = -1;
  nextData.forEach((r, i) => {
    const q = queues.get(rowKey(r));
    if (!q) return;
    while (q.length > 0 && (q[0] as number) <= lastOld) q.shift();
    const o = q.shift();
    if (o !== undefined) {
      links.set(i, o);
      linkedOld.add(o);
      lastOld = o;
    }
  });
  return { links, linkedOld };
}

function pairCells(
  oldRow: string[],
  nextRow: string[],
  cols: number,
): AlignedCell[] {
  const cells: AlignedCell[] = [];
  for (let c = 0; c < cols; c++) {
    const ov = oldRow[c] ?? "";
    const nv = nextRow[c] ?? "";
    cells.push({ old: ov, next: nv, changed: ov !== nv });
  }
  return cells;
}

function buildAlignedRows(
  links: Map<number, number>,
  linkedOld: Set<number>,
  oldData: string[][],
  nextData: string[][],
  cols: number,
  hasHeader: boolean,
): AlignedRow[] {
  const no = (idx: number): number => idx + (hasHeader ? 2 : 1);
  const rows: AlignedRow[] = [];
  const emitRemoved = (k: number): void => {
    if (!linkedOld.has(k))
      rows.push({
        kind: "removed",
        oldNo: no(k),
        nextNo: null,
        cells: padRow(oldData[k] as string[], cols),
      });
  };
  const flushGap = (from: number, to: number): void => {
    for (let k = from; k < to; k++) emitRemoved(k);
  };
  let prevOld = -1;
  for (let i = 0; i < nextData.length; i++) {
    const L = links.get(i);
    if (L !== undefined) {
      if (prevOld >= 0) flushGap(prevOld + 1, L);
      rows.push({
        kind: "pair",
        oldNo: no(L),
        nextNo: no(i),
        cells: pairCells(oldData[L] as string[], nextData[i] as string[], cols),
      });
      if (prevOld < 0) flushGap(0, L);
      prevOld = L;
    } else {
      rows.push({
        kind: "added",
        oldNo: null,
        nextNo: no(i),
        cells: padRow(nextData[i] as string[], cols),
      });
    }
  }
  for (let k = prevOld + 1; k < oldData.length; k++) emitRemoved(k);
  return rows;
}

export function alignTables(
  oldRows: string[][],
  nextRows: string[][],
  hasHeader: boolean,
): AlignedTable {
  const oldData = hasHeader ? oldRows.slice(1) : oldRows;
  const nextData = hasHeader ? nextRows.slice(1) : nextRows;
  const headerSrc = pickHeaderSrc(oldRows, nextRows, hasHeader);
  const cols = computeCols(headerSrc, oldData, nextData);
  const header = buildHeader(headerSrc, cols);
  const queues = buildRowKeyQueues(oldData);
  const { links, linkedOld } = buildRowLinks(queues, nextData);
  const rows = buildAlignedRows(
    links,
    linkedOld,
    oldData,
    nextData,
    cols,
    hasHeader,
  );
  return { header, hasHeader, rows, cols };
}
