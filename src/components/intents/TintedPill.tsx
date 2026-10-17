import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";

export interface TintedPillProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TintedPill({ children, style }: TintedPillProps) {
  const a = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: a.radii.pill,
        backgroundColor: a.colors.accentTint,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
