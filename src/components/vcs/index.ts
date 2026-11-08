export { BookmarkPill, type BookmarkPillVariant } from "./BookmarkPill";
export {
  DiffPanel,
  DiffSummary,
  summarizePatch,
  type DiffPanelProps,
  type DiffSummaryData,
} from "./DiffPanel";
export { DiffText, type DiffTextProps } from "./DiffText";
export { makeDiffScroller } from "./DiffScroll";
export { ToolDiff, type ToolDiffProps } from "./ToolDiff";
export {
  diffRowsOf,
  diffRowsShown,
  diffHunkRows,
  type DiffRow,
  type DiffRowKind,
  type DiffShown,
  type DiffVisibility,
} from "../../lib/vcs/rows";
export type { DiffToken, DiffTokenKind } from "../../lib/vcs/tokens";
export { DiffCountColumn, diffCountColumnWidth } from "./DiffCountColumn";
export { DiffHistogram } from "./DiffHistogram";
export { DiffStats } from "./DiffStats";
export { FileChangeRow } from "./FileChangeRow";
export { FileIconCell } from "./FileIconCell";
export { FilePathCell } from "./FilePathCell";
export { FileStatusCell, fileStatusColor } from "./FileStatusCell";
export {
  fileRowStats,
  type FileRowData,
  type FileRowStats,
} from "./FileRowData";
export { FILE_STATUS_ICONS } from "./FileStatusIcons";

export { MONO, FILE_HEADER_ROW_HEIGHT, nativeDiffTheme } from "../../theme/vcs";
