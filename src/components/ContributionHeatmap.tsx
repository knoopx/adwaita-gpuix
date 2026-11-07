import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { hexToRgba } from "../theme/tokens";
import { T } from "./text";
import type { HeatWeek } from "../lib/activity";

export const HEATMAP_GAP = 2;
export const HEATMAP_CELL = 12;
export const HEATMAP_LABEL_WIDTH = 16;

/** A month label is only drawn when the month spans at least this many weeks. */
export const HEATMAP_MONTH_MIN_WEEKS = 3;

export interface MonthRegion {
  label: string;
  n: number;
}

/** Collapse the week list into the month columns the header row shows. */
export function monthRegions(weeks: readonly HeatWeek[]): MonthRegion[] {
  const regions: MonthRegion[] = [];
  for (const w of weeks) {
    if (w.monthLabel) regions.push({ label: w.monthLabel, n: 0 });
    if (regions.length > 0) regions[regions.length - 1].n += 1;
  }
  return regions;
}

/**
 * GitHub-style contribution heatmap: one column per week, one cell per day,
 * shaded on the theme's success ramp by `cell.level` (0..4).
 */
export interface ContributionHeatmapProps {
  weeks: readonly HeatWeek[];
  dayLabels: readonly string[];
  gap?: number;
  cell?: number;
  labelWidth?: number;
  monthMinWeeks?: number;
  style?: StyleDesc;
}

export function ContributionHeatmap({
  weeks,
  dayLabels,
  gap = HEATMAP_GAP,
  cell = HEATMAP_CELL,
  labelWidth = HEATMAP_LABEL_WIDTH,
  monthMinWeeks = HEATMAP_MONTH_MIN_WEEKS,
  style,
}: ContributionHeatmapProps) {
  const t = useAdwaita();
  const { color } = t;

  const regions = monthRegions(weeks);

  const green = color.functional.success;
  const ramp = [
    hexToRgba(color.text.primary, 0.06),
    hexToRgba(green, 0.35),
    hexToRgba(green, 0.6),
    hexToRgba(green, 0.85),
    green,
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap,
          width: "100%",
        }}
      >
        <div style={{ width: labelWidth, flexShrink: 0 }} />
        {regions.map((r, i) => (
          <div key={i} style={{ flexGrow: r.n, flexBasis: 0, minWidth: 0 }}>
            {r.n >= monthMinWeeks ? (
              <T
                size="caption"
                color={color.text.dim}
                style={{ whiteSpace: "nowrap" }}
              >
                {r.label}
              </T>
            ) : null}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap,
            width: labelWidth,
            flexShrink: 0,
          }}
        >
          {dayLabels.map((l, i) => (
            <div
              key={i}
              style={{
                height: cell,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <T size="caption" color={color.text.dim} style={{ fontSize: 9 }}>
                {l}
              </T>
            </div>
          ))}
        </div>
        {weeks.map((w, wi) => (
          <div
            key={wi}
            style={{
              display: "flex",
              flexDirection: "column",
              gap,
              flexGrow: 1,
              flexBasis: 0,
              minWidth: 0,
            }}
          >
            {w.cells.map((c, ci) => (
              <div
                key={ci}
                style={{
                  height: cell,
                  borderRadius: 2,
                  backgroundColor: ramp[c.level],
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
