import { useMemo } from "react";
import { type StyleDesc } from "@gpuix/react";
import { hexToRgba } from "../theme/tokens";

export const SPARKLINE_WIDTH = 84;
export const SPARKLINE_HEIGHT = 22;

/**
 * Build the smoothed sparkline SVG (area fill + stroke) as a data URL.
 * Returns null when there is nothing to draw, so callers can skip the node.
 */
export function sparklineSource(
  values: number[] | null | undefined,
  color: string,
  width: number = SPARKLINE_WIDTH,
  height: number = SPARKLINE_HEIGHT,
): string | null {
  if (!values || values.length === 0) return null;
  const max = Math.max(...values, 1);
  const pad = 2;
  const n = values.length;
  const stepX = n > 1 ? (width - pad * 2) / (n - 1) : 0;

  const pts = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = height - pad - (v / max) * (height - pad * 2);
    return [x, y] as const;
  });
  const f = (v: number): string => v.toFixed(2);

  let line = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    line += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(
      p2[0],
    )} ${f(p2[1])}`;
  }

  const baseline = f(height - pad);
  const area = `${line} L ${f(pts[n - 1][0])} ${baseline} L ${f(
    pts[0][0],
  )} ${baseline} Z`;

  const fill = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)
    ? hexToRgba(color, 0.25)
    : color;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<path d="${area}" fill="${fill}" stroke="none"/>` +
    `<path d="${line}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * A tiny fixed-size trend line: an area-filled, smoothed polyline rendered as
 * an SVG image. Returns nothing when `values` is empty or missing.
 */
export interface SparklineProps {
  values: number[] | null | undefined;
  color?: string;
  width?: number;
  height?: number;
  style?: StyleDesc;
}

export function Sparkline({
  values,
  color = "#888888",
  width = SPARKLINE_WIDTH,
  height = SPARKLINE_HEIGHT,
  style,
}: SparklineProps) {
  const src = useMemo(
    () => sparklineSource(values, color, width, height),
    [values, color, width, height],
  );

  if (src === null) return null;
  return (
    <img
      src={src}
      style={{ width, height, flexShrink: 0, ...style }}
    />
  );
}
