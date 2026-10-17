import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { Icon } from "../../components/icons";

export interface RowChevronProps {
  open: boolean;
  color?: string;
  style?: Partial<StyleDesc>;
}

export function RowChevron({ open, color, style }: RowChevronProps) {
  const t = useAdwaita();
  return (
    <Icon
      name={open ? "chevronDown" : "chevronRight"}
      size={14}
      color={color ?? t.colors.dim_fg}
      style={{ flexShrink: 0, ...style }}
    />
  );
}
