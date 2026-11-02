import { useAdwaita } from "../../theme/adwaita";
import { ListRow } from "../../lib/panel";
import { DiffHistogram } from "./DiffHistogram";
import { DiffStats } from "./DiffStats";
import { FileIconCell } from "./FileIconCell";
import { FilePathCell } from "./FilePathCell";
import { FileStatusCell } from "./FileStatusCell";
import type { FileRowData, FileRowStats } from "./FileRowData";

const CELL_GAP = 6;

export function FileChangeRow({
  file,
  selected = false,

  focused = true,
  height = 28,
  stats,
  onClick,
}: {
  file: FileRowData;
  selected?: boolean;

  focused?: boolean;
  height?: number;

  stats?: FileRowStats;
  onClick?: () => void;
}) {
  const t = useAdwaita();
  return (
    <ListRow
      selected={selected}
      focused={focused}
      height={height}
      onClick={onClick}
    >
      <FileIconCell path={file.path} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: CELL_GAP,
          minWidth: 0,
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <FilePathCell path={file.path} />
        <FileStatusCell status={file.status} />
        <DiffStats
          insertions={file.insertions}
          deletions={file.deletions}
          stats={stats}
        />
        <DiffHistogram
          insertions={file.insertions}
          deletions={file.deletions}
        />
      </div>
    </ListRow>
  );
}
