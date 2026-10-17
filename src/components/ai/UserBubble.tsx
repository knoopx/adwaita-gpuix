import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";

export interface UserBubbleProps {
  text: ReactNode;
  width?: number;
  lines?: number;
  style?: Partial<StyleDesc>;
}

export function UserBubble({ text, width = 300, lines = 1, style }: UserBubbleProps) {
  const t = useAdwaita();
  const { colors, radii, typography } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        minWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: width,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          borderRadius: radii.pill,
          backgroundColor: colors.button_bg,
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        <T
          size="body"
          color={colors.fg}
          style={{ height: lines * typography.body * 2 }}
        >
          {text}
        </T>
      </div>
    </div>
  );
}
