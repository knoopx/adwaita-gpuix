import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { type TextSize } from "../text";
import { RowLabel } from "./RowLabel";

export interface DisclosureRowProps {
  icon?: ReactNode;
  label: ReactNode;

  trailing?: ReactNode;

  spacer?: boolean;
  gap?: number;
  labelSize?: TextSize;
  labelWeight?: string | number;
  labelColor?: string;
  labelStyle?: Partial<StyleDesc>;
  style?: Partial<StyleDesc>;
}

export function DisclosureRow({
  icon,
  label,
  trailing,
  spacer = false,
  gap,
  labelSize = "body",
  labelWeight,
  labelColor,
  labelStyle,
  style,
}: DisclosureRowProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: gap ?? t.space.sm,
        minWidth: 0,
        ...style,
      }}
    >
      {icon}
      <RowLabel
        size={labelSize}
        weight={labelWeight}
        color={labelColor}
        style={labelStyle}
      >
        {label}
      </RowLabel>
      {spacer ? <div style={{ flexGrow: 1 }} /> : null}
      {trailing}
    </div>
  );
}
