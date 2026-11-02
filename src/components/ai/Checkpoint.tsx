import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { disabledStyle } from "../disabled.ts";
import { Icon, type IconName } from "../../components/icons";
import { Button } from "../../components/Button";
import { textToneColor } from "../../theme/tones";

export type CheckpointStatus = "success" | "warning" | "destructive";

const STATUS_ICONS: Record<CheckpointStatus, IconName> = {
  success: "success",
  warning: "warning",
  destructive: "alert",
};

function CheckpointActions({
  onResume,
  onRestore,
  disabled,
}: {
  onResume?: () => void;
  onRestore?: () => void;
  disabled?: boolean;
}) {
  const t = useAdwaita();
  const actions: Array<{
    key: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [];
  if (onResume)
    actions.push({
      key: "resume",
      label: "Resume",
      icon: "playArrow",
      onPress: onResume,
    });
  if (onRestore)
    actions.push({
      key: "restore",
      label: "Restore",
      icon: "rotateLeft",
      onPress: onRestore,
    });
  if (actions.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        flexShrink: 0,
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.key}
          variant="secondary"
          size="sm"
          label={action.label}
          icon={action.icon}
          disabled={disabled}
          onClick={disabled ? undefined : action.onPress}
        />
      ))}
    </div>
  );
}

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
  const iconColor = status ? textToneColor(t, status) : t.color.text.dim;
  const iconName = status ? STATUS_ICONS[status] : icon;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        minHeight: t.control.rowHeight,
        padding: t.space.md,
        opacity: disabledStyle(disabled).opacity,
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
          color={t.color.text.primary}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {label}
        </T>
        {timestamp ? (
          <T size="caption" color={t.color.text.dim}>
            {timestamp}
          </T>
        ) : null}
      </div>
      <CheckpointActions
        onResume={onResume}
        onRestore={onRestore}
        disabled={disabled}
      />
    </div>
  );
}
