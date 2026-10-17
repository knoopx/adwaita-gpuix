import { T } from "../common";
import { hexToRgba, useAdwaita, type AdwaitaColors } from "../../theme/adwaita";
import { ListRow } from "../../lib/panel";
import { Icon } from "../icons";
import { getFileIcon, getFileStatusIcon, getFileIconColor } from "../FileIcons";

export interface FileRowData {
  status: string;
  path: string;
  insertions: number;
  deletions: number;
}

const SEGMENTS = 6;

const SEG_W = 3;
const SEG_H = 12;
const SEG_GAP = 1;

const ICON_COL_W = 24;
const ICON_SIZE = 18;
const STATUS_COL_W = 14;
const STATUS_ICON_SIZE = 14;
const COUNT_COL_MIN_W = 14;
const STATS_GROUP_GAP = 4;
const MONO_ADVANCE = 0.6;

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

export function DiffHistogram({
  insertions,
  deletions,
  colors,
}: {
  insertions: number;
  deletions: number;
  colors: AdwaitaColors;
}) {
  const total = insertions + deletions;
  const green = total === 0 ? 0 : Math.round((insertions / total) * SEGMENTS);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: SEG_GAP,
        width: SEGMENTS * SEG_W + (SEGMENTS - 1) * SEG_GAP,
        height: SEG_H,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <div
          key={i}
          style={{
            width: SEG_W,
            height: SEG_H,
            backgroundColor:
              total === 0
                ? hexToRgba(colors.dim_fg, 0.2)
                : i < green
                  ? colors.success
                  : colors.destructive,
          }}
        />
      ))}
    </div>
  );
}

function statusColorOf(status: string, colors: AdwaitaColors): string {
  if (status === "A") return colors.success;
  if (status === "D") return colors.destructive;
  return colors.warning;
}

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
  const { colors, typography, spacing } = useAdwaita();

  const icon = getFileIcon(file.path);
  const iconColor = getFileIconColor(file.path) ?? colors.dim_fg;

  const statusIcon = getFileStatusIcon(file.status);
  const statusColor = statusColorOf(file.status, colors);

  const advance = typography.caption * MONO_ADVANCE;
  const countColW = (lines: number) =>
    Math.max(
      COUNT_COL_MIN_W,
      Math.ceil((String(lines).length + 1) * advance) + 2,
    );
  const countColumn = (color: string, text: string, width: number) => (
    <div
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <T
        size="caption"
        color={color}
        style={{
          whiteSpace: "nowrap",
          fontFamily: typography.fontFamilyMono,
        }}
      >
        {text}
      </T>
    </div>
  );
  return (
    <ListRow
      selected={selected}
      focused={focused}
      height={height}
      onClick={onClick}
    >
      <div
        style={{
          width: ICON_COL_W,
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={ICON_SIZE} color={iconColor} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing.gap,
          minWidth: 0,
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <T
          size="caption"
          color={colors.fg}
          style={{
            flexGrow: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {file.path}
        </T>
        <div
          style={{
            width: STATUS_COL_W,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Icon
            name={statusIcon}
            size={STATUS_ICON_SIZE}
            color={statusColor}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: STATS_GROUP_GAP,
            flexShrink: 0,
          }}
        >
          {countColumn(
            colors.success,
            `+${file.insertions}`,
            countColW(Math.max(file.insertions, stats?.insertions ?? 0)),
          )}
          {countColumn(
            colors.destructive,
            `-${file.deletions}`,
            countColW(Math.max(file.deletions, stats?.deletions ?? 0)),
          )}
        </div>
        <DiffHistogram
          insertions={file.insertions}
          deletions={file.deletions}
          colors={colors}
        />
      </div>
    </ListRow>
  );
}
