import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";

export interface OutputBoxProps {
  text: string;
  tone?: "default" | "error";

  filled?: boolean;

  color?: string;
  padding?: number;
  style?: Partial<StyleDesc>;
}

export function OutputBox({
  text,
  tone = "default",
  filled = false,
  color,
  padding = 10,
  style,
}: OutputBoxProps) {
  const t = useAdwaita();
  const bg =
    tone === "error"
      ? t.color.functional.destructiveTint
      : filled
        ? t.color.surface.button
        : t.color.surface.card;
  const fg =
    color ??
    (tone === "error"
      ? t.color.functional.destructive
      : t.color.text.secondary);
  const lines = text.split("\n");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        padding,
        borderRadius: t.radius.sm,
        borderLeftWidth: 0,
        borderColor:
          tone === "error"
            ? t.color.functional.destructive
            : t.color.border.default,
        backgroundColor: bg,
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <T
          key={i}
          size="caption"
          color={line.length > 0 ? fg : t.color.text.dim}
          style={{
            fontFamily: t.type.fontFamilyMono,
            flexShrink: 1,
          }}
        >
          {line.length > 0 ? line : " "}
        </T>
      ))}
    </div>
  );
}
