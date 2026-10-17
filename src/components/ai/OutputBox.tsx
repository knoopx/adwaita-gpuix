import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";

export interface OutputBoxProps {
  text: string;
  tone?: "default" | "error";
  style?: Partial<StyleDesc>;
}

export function OutputBox({ text, tone = "default", style }: OutputBoxProps) {
  const t = useAdwaita();
  const { colors, radii, typography } = t;
  const bg = tone === "error" ? colors.destructiveTint : colors.button_bg;
  const fg = tone === "error" ? colors.destructive : colors.fg;
  const lines = text.split("\n");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        padding: 10,
        borderRadius: radii.row,
        borderLeftWidth: 2,
        borderColor: tone === "error" ? colors.destructive : colors.border,
        backgroundColor: bg,
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <T
          key={i}
          size="caption"
          color={line.length > 0 ? fg : colors.dim_fg}
          style={{
            fontFamily: typography.fontFamilyMono,
            flexShrink: 1,
          }}
        >
          {line.length > 0 ? line : " "}
        </T>
      ))}
    </div>
  );
}
