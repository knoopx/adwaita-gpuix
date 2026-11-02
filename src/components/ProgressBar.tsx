import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { type Tone, toneColor } from "../theme/tones";

export type ProgressBarColor = Tone;

export interface ProgressBarProps {
  value: number;

  percent?: boolean;

  color?: ProgressBarColor;

  height?: number;

  style?: Partial<StyleDesc>;
}

export function ProgressBar({
  value,
  percent,
  color = "accent",
  height = 6,
  style,
}: ProgressBarProps) {
  const t = useAdwaita();
  const normalized = percent ? value : value / 100;
  const clamped = Math.min(1, Math.max(0, normalized));
  const pill = t.radius.full;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height,
        borderRadius: pill,
        backgroundColor: t.color.border.default,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          width: `${Math.round(clamped * 100)}%`,
          height,
          borderRadius: pill,
          backgroundColor: toneColor(t, color),
        }}
      />
    </div>
  );
}
