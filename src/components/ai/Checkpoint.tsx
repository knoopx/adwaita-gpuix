import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon, type IconName } from "../../components/icons";
import { Button } from "../../components/Button";

export type CheckpointStatus = "success" | "warning" | "destructive";

const STATUS_COLORS: Record<CheckpointStatus, keyof AdwaitaColors> = {
  success: "success",
  warning: "warning",
  destructive: "destructive",
};

const STATUS_ICONS: Record<CheckpointStatus, IconName> = {
  success: "success",
  warning: "warning",
  destructive: "alert",
};

export interface CheckpointProps {
  label?: string;

  status?: CheckpointStatus;

  icon?: IconName;

  timestamp?: string;

  onRestore?: () => void;

  onResume?: () => void;

  disabled?: boolean;

  style?: Partial<StyleDesc>;
}

export function Checkpoint({
  label = "Checkpoint",
  status,
  icon = "refresh",
  timestamp,
  onRestore,
  onResume,
  disabled,
  style,
}: CheckpointProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const iconColor = status ? colors[STATUS_COLORS[status]] : colors.dim_fg;
  const iconName = status ? STATUS_ICONS[status] : icon;
  const hasActions = onRestore !== undefined || onResume !== undefined;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        minHeight: spacing.rowHeight,
        padding: spacing.paddingTight,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Icon name={iconName} size={16} color={iconColor} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 2,
          minWidth: 0,
        }}
      >
        <T
          size="body"
          color={colors.fg}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {label}
        </T>
        {timestamp ? (
          <T size="caption" color={colors.dim_fg}>
            {timestamp}
          </T>
        ) : null}
      </div>
      {hasActions ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.gap,
            flexShrink: 0,
          }}
        >
          {onResume ? (
            <Button
              variant="secondary"
              size="sm"
              label="Resume"
              icon="play"
              disabled={disabled}
              onClick={disabled ? undefined : onResume}
            />
          ) : null}
          {onRestore ? (
            <Button
              variant="secondary"
              size="sm"
              label="Restore"
              icon="rotateCcw"
              disabled={disabled}
              onClick={disabled ? undefined : onRestore}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
