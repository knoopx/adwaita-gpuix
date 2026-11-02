import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T, type TextSize } from "../text";

export interface RowLabelProps {
  children: ReactNode;
  size?: TextSize;
  weight?: string | number;
  color?: string;
  style?: Partial<StyleDesc>;
}

export function RowLabel({
  children,
  size = "body",
  weight,
  color,
  style,
}: RowLabelProps) {
  const t = useAdwaita();
  return (
    <T
      size={size}
      weight={weight}
      color={color ?? t.color.text.primary}
      style={{ flexShrink: 1, textOverflow: "ellipsis", ...style }}
    >
      {children}
    </T>
  );
}
