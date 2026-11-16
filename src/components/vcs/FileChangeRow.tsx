import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { ListRow } from "../../lib/panel";
import { DiffCountColumn, diffCountColumnWidth } from "./DiffCountColumn";
import { DiffHistogram } from "./DiffHistogram";
import { DiffStats } from "./DiffStats";
import { FileIconCell } from "./FileIconCell";
import { FilePathCell } from "./FilePathCell";
import { FileStatusCell } from "./FileStatusCell";
import {
  fileRowHasFigures,
  type FileRowData,
  type FileRowStats,
} from "./FileRowData";

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
  const figures = fileRowHasFigures(file);
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
        {figures ? figureGroup(file, stats, t) : null}
      </div>
    </ListRow>
  );
}

/**
 * What a file's share of the change amounts to, in the one column its source stated.
 *
 * A patch counts both sides, and both counts stand. A diff stat's own column states one
 * total and draws the split as a bar, and a bar of 31 `+` glyphs beside 35 `-` is not 31
 * insertions and 35 deletions — the terminal's width, not the change, set those numbers.
 * So the total is printed bare, in the row's own ink, and the histogram is drawn from the
 * bar's own glyphs: the same picture the program drew, in the app's own marks.
 */
function figureGroup(
  file: FileRowData,
  stats: FileRowStats | undefined,
  t: AdwaitaTheme,
) {
  if (file.stat === undefined) {
    return (
      <>
        <DiffStats
          insertions={file.insertions}
          deletions={file.deletions}
          stats={stats}
        />
        <DiffHistogram
          insertions={file.insertions}
          deletions={file.deletions}
        />
      </>
    );
  }
  return (
    <>
      <DiffCountColumn
        lines={file.stat.changed}
        sign="changed"
        width={diffCountColumnWidth(
          t,
          Math.max(file.stat.changed, stats?.changed ?? 0),
          "changed",
        )}
      />
      <DiffHistogram
        insertions={file.stat.additions}
        deletions={file.stat.deletions}
      />
    </>
  );
}
