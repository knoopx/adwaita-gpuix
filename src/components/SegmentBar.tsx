import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { type Tone, toneColor } from "../theme/tones";
import { hexToRgba } from "../theme/tokens";

/**
 * One bar split between parts of a whole — the shape a total is made of, rather
 * than one fill against a maximum (`ProgressBar`) or one figure per row (`Bar`).
 *
 * Each part keeps its own colour and its own share of the width, and the tail is
 * the room the whole still has: a bar that says "of this budget" rather than "of
 * its own maximum".
 */

export interface Segment {
  value: number;

  /** The part's own colour. Defaults to the accent, quieter as it goes. */
  color?: string;

  /** ...or ask for a tone and take that colour outright. */
  tone?: Tone;
}

export interface SegmentBarProps {
  segments: Segment[];

  /** The room left over, drawn in the same track. */
  tail?: number;

  height?: number;

  /** The air between two parts — enough to see where one ends, not enough to
   *  read the parts as separate bars. */
  gap?: number;

  style?: Partial<StyleDesc>;
}

const SEGMENT_HEIGHT = 8;
const SEGMENT_GAP = 3;

/** How loud each part is when the caller names no colour: the accent, then two
 *  quieter steps of it, then the chart's series if there are more parts than that. */
const RAMP = [1, 0.55, 0.3];

/** The colours a set of parts takes when the program does not name them. */
export function segmentRamp(t: AdwaitaTheme, count: number): string[] {
  const series = t.color.chart.series;
  return Array.from({ length: count }, (_, index) =>
    index < RAMP.length
      ? hexToRgba(t.color.accent.base, RAMP[index])
      : series[(index - RAMP.length + 1) % series.length],
  );
}

export function SegmentBar({
  segments,
  tail,
  height = SEGMENT_HEIGHT,
  gap = SEGMENT_GAP,
  style,
}: SegmentBarProps) {
  const t = useAdwaita();
  const colors = segmentRamp(t, segments.length);
  const rest = Math.max(0, tail ?? 0);
  const total = segments.reduce((sum, part) => sum + Math.max(0, part.value), 0);
  if (total <= 0 && rest <= 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        gap,
        ...style,
      }}
    >
      {segments.map((part, index) => (
        <div
          key={index}
          style={{
            flexGrow: Math.max(0, part.value),
            flexBasis: 0,
            height,
            minHeight: part.value > 0 ? 3 : 0,
            borderRadius: Math.min(height / 2, 3),
            backgroundColor:
              part.tone !== undefined
                ? toneColor(t, part.tone)
                : (part.color ?? colors[index]),
          }}
        />
      ))}
      {rest > 0 ? (
        <div
          style={{
            flexGrow: rest,
            flexBasis: 0,
            height: Math.max(3, height - 4),
            borderRadius: 2,
            backgroundColor: t.color.border.default,
          }}
        />
      ) : null}
    </div>
  );
}
