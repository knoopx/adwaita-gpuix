import { useAdwaita } from "../../theme/adwaita";
import { DiffCountColumn, diffCountColumnWidth } from "./DiffCountColumn";
import type { FileRowStats } from "./FileRowData";

const STATS_GROUP_GAP = 4;

export function DiffStats({
  insertions,
  deletions,
  stats,
  gap = STATS_GROUP_GAP,
  hideZero = false,
}: {
  insertions: number;
  deletions: number;

  stats?: FileRowStats;
  gap?: number;

  /** Say nothing about the side that did not move. A list of files that only grew
   *  reads as a list of additions rather than as a column of `-0`s. */
  hideZero?: boolean;
}) {
  const t = useAdwaita();
  if (hideZero && insertions === 0 && deletions === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        flexShrink: 0,
      }}
    >
      {hideZero && insertions === 0 ? null : (
        <DiffCountColumn
          lines={insertions}
          sign="add"
          width={diffCountColumnWidth(
            t,
            Math.max(insertions, stats?.insertions ?? 0),
          )}
        />
      )}
      {hideZero && deletions === 0 ? null : (
        <DiffCountColumn
          lines={deletions}
          sign="del"
          width={diffCountColumnWidth(
            t,
            Math.max(deletions, stats?.deletions ?? 0),
          )}
        />
      )}
    </div>
  );
}
