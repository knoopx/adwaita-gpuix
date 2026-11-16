/**
 * The one figure a diff stat states for a file, when it never split it.
 *
 * A patch counts both sides. A diff stat's own column — `src/a.ts | 66 ++++----` — prints
 * one total and draws the split as a bar whose width the terminal picked: 31 `+` glyphs
 * beside 35 `-` are a picture of the split, not 31 insertions and 35 deletions. So a row
 * that was read from a stat prints its total on its own and draws the histogram from the
 * glyphs, which says what the program's bar said and invents no line count.
 */
export interface FileRowStat {
  /** changed lines — the number the stat's column printed */
  changed: number;

  /** the bar's `+` glyphs: where the program drew the additions */
  additions: number;

  /** the bar's `-` glyphs: where it drew the deletions */
  deletions: number;
}

export interface FileRowData {
  status: string;
  path: string;
  insertions: number;
  deletions: number;

  /** set instead of counting both sides: what a diff stat stated for this file */
  stat?: FileRowStat;
}

export interface FileRowStats {
  insertions: number;
  deletions: number;

  /** the widest total in the list, so a column of stat totals stands aligned too.
   *  A list measured from patches alone has no totals to align, and says so by absence. */
  changed?: number;
}

export function fileRowStats(files: FileRowData[]): FileRowStats {
  return files.reduce(
    (max, f) => ({
      insertions: Math.max(max.insertions, f.insertions),
      deletions: Math.max(max.deletions, f.deletions),
      changed: Math.max(max.changed, f.stat?.changed ?? 0),
    }),
    { insertions: 0, deletions: 0, changed: 0 },
  );
}

/** Whether a file states any figure at all. A file the patch carries no lines for — an
 *  image, a mode change — has nothing to measure, and `+0 −0` beside an empty histogram is
 *  a pair of marks that say nothing while the numbers beside them read as noise. */
export function fileRowHasFigures(file: FileRowData): boolean {
  return file.stat !== undefined || file.insertions + file.deletions > 0;
}
