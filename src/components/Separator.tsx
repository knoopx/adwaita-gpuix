import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  
  inset?: number;
  style?: Partial<StyleDesc>;
}

export function Separator({
  orientation = "horizontal",
  inset,
  style,
}: SeparatorProps) {
  const t = useAdwaita();
  const { colors } = t;

  if (orientation === "vertical") {
    return (
      <div
        style={{
          width: 1,
          height: "100%",
          backgroundColor: colors.border,
          ...(inset ? { marginTop: inset, marginBottom: inset } : {}),
          pointerEvents: "none",
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundColor: colors.border,
        ...(inset ? { marginLeft: inset, marginRight: inset } : {}),
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
