import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../theme/adwaita";

export type ProgressBarColor =
  | "accent"
  | "success"
  | "destructive"
  | "warning";

export interface ProgressBarProps {
  value: number;

  percent?: boolean;

  color?: ProgressBarColor;

  height?: number;

  style?: Partial<StyleDesc>;
}

const FILL_TOKEN: Record<ProgressBarColor, keyof AdwaitaColors> = {
  accent: "accent",
  success: "success",
  destructive: "destructive",
  warning: "warning",
};

export function ProgressBar({
  value,
  percent,
  color = "accent",
  height = 6,
  style,
}: ProgressBarProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const normalized = percent ? value : value / 100;
  const clamped = Math.min(1, Math.max(0, normalized));
  const pill = radii.pill;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height,
        borderRadius: pill,
        backgroundColor: colors.border,
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
          backgroundColor: colors[FILL_TOKEN[color]],
        }}
      />
    </div>
  );
}
