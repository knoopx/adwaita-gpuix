export interface FileRowData {
  status: string;
  path: string;
  insertions: number;
  deletions: number;
}

export interface FileRowStats {
  insertions: number;
  deletions: number;
}

export function fileRowStats(files: FileRowData[]): FileRowStats {
  return files.reduce(
    (max, f) => ({
      insertions: Math.max(max.insertions, f.insertions),
      deletions: Math.max(max.deletions, f.deletions),
    }),
    { insertions: 0, deletions: 0 },
  );
}
