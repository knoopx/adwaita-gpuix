import { useAdwaita } from "../../theme/adwaita";
import { DiffCountColumn, diffCountColumnWidth } from "./DiffCountColumn";
import type { FileRowStats } from "./FileRowData";

const STATS_GROUP_GAP = 4;

export function DiffStats({
  insertions,
  deletions,
  stats,
  gap = STATS_GROUP_GAP,
}: {
  insertions: number;
  deletions: number;

  stats?: FileRowStats;
  gap?: number;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        flexShrink: 0,
      }}
    >
      <DiffCountColumn
        lines={insertions}
        sign="add"
        width={diffCountColumnWidth(
          t,
          Math.max(insertions, stats?.insertions ?? 0),
        )}
      />
      <DiffCountColumn
        lines={deletions}
        sign="del"
        width={diffCountColumnWidth(
          t,
          Math.max(deletions, stats?.deletions ?? 0),
        )}
      />
    </div>
  );
}
