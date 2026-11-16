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
export {
  DiffCountColumn,
  diffCountColumnWidth,
  type DiffCountSign,
} from "./DiffCountColumn";
export { DiffHistogram } from "./DiffHistogram";
export { DiffStats } from "./DiffStats";
export { FileChangeRow } from "./FileChangeRow";
export { FileIconCell } from "./FileIconCell";
export { FilePathCell } from "./FilePathCell";
export {
  FileStatusCell,
  fileStatusColor,
  fileStatusNamed,
} from "./FileStatusCell";
export {
  fileRowStats,
  fileRowHasFigures,
  type FileRowData,
  type FileRowStats,
  type FileRowStat,
} from "./FileRowData";
export { FILE_STATUS_ICONS } from "./FileStatusIcons";
export {
  ChangeRow,
  CHANGE_ROW_HEIGHT,
  type ChangeRowData,
  type ChangeRowProps,
} from "./ChangeRow";

export {
  MONO,
  FILE_HEADER_ROW_HEIGHT,
  diffHeaderFill,
  nativeDiffTheme,
} from "../../theme/vcs";
