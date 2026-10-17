import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../theme/adwaita";
import { T } from "./common";

export type SpinnerColor =
  | "accent"
  | "success"
  | "destructive"
  | "warning";

export interface SpinnerProps {
  size?: 16 | 32 | 64;

  color?: SpinnerColor;

  label?: boolean;
  style?: Partial<StyleDesc>;
}

const RING_TOKEN: Record<SpinnerColor, keyof AdwaitaColors> = {
  accent: "accent",
  success: "success",
  destructive: "destructive",
  warning: "warning",
};

export function Spinner({
  size = 32,
  color = "accent",
  label = true,
  style,
}: SpinnerProps) {
  const t = useAdwaita();
  const { colors } = t;
  const r = 42;
  const sw = 12;
  const circ = 2 * Math.PI * r;
  const arc = (circ * 270) / 360;
  const ring = colors[RING_TOKEN[color]];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
    `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${colors.border}" stroke-width="${sw}" />` +
    `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${ring}" ` +
    `stroke-width="${sw}" stroke-linecap="round" ` +
    `stroke-dasharray="${arc.toFixed(1)} ${(circ - arc).toFixed(1)}" transform="rotate(-90 50 50)" />` +
    `</svg>`;
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        pointerEvents: "none",
        ...style,
      }}
    >
      <img
        src={src}
        style={{ width: size, height: size, flexShrink: 0, pointerEvents: "none" }}
      />
      {label ? (
        <T
          size="caption"
          color={colors.dim_fg}
          style={{ width: 0, height: 0, opacity: 0 }}
        >
          Loading
        </T>
      ) : null}
    </div>
  );
}
