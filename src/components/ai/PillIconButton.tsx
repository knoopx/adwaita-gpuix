import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { Icon, type IconName } from "../../components/icons";

export interface PillIconButtonProps {
  icon: IconName;
  label?: string;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

export function PillIconButton({
  icon,
  label,
  onClick,
  style,
}: PillIconButtonProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div
      onClick={onClick}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: radii.pill,
        backgroundColor: colors.button_bg,
        cursor: "pointer",
        flexShrink: 0,
        hover: { backgroundColor: colors.button_hover },
        ...style,
      }}
    >
      <Icon name={icon} size={14} color={colors.dim_fg} />
    </div>
  );
}
