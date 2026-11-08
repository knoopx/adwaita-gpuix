import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { type Tone, toneColor } from "../theme/tones";
import { T } from "./text";

/**
 * A trace: one span per row, drawn on a shared time axis so the shape of a run
 * is visible — what waited, what overlapped, which span is the long one.
 *
 * The bar is placed by flex weight, not by absolute offset, so the track is the
 * row whatever width the pane gives it and a span keeps its share of the whole.
 * The figure on the right is the number the eye checks; the bar is the shape it
 * checks it against.
 */

export interface TraceSpan {
  label: ReactNode;

  /** When the span starts, in the same unit as `duration`. */
  offset: number;

  /** How long it runs. */
  duration: number;

  /** How deep it sits: a child span stands in one more step than its parent. */
  depth?: number;

  /** Which span is the story. The rest are drawn in the surface's own grey. */
  tone?: Tone;

  /** What to print on the right. Defaults to `duration`. */
  figure?: string;
}

export interface TraceProps {
  spans: TraceSpan[];

  /** The length of the axis. Defaults to the end of the last span. */
  total?: number;

  /** How wide the label column is. Defaults to the mono budget of `LABEL_CHARS`. */
  labelWidth?: number;

  /** How wide the figure column is. Defaults to the mono budget of `FIGURE_CHARS`. */
  figureWidth?: number;

  style?: Partial<StyleDesc>;
}

/** The mono advance, as `DiffCountColumn` measures it too. */
const MONO_ADVANCE = 0.6;

const LABEL_CHARS = 16;
const FIGURE_CHARS = 6;

/** A span's bar: thicker than a meter's rule, because a whole span hangs on it. */
const SPAN_BAR = 8;

/** How far one level of nesting stands in. */
const INDENT = 12;

/** The least a non-zero span shows, so a fast call is still a mark. */
const MIN_BAR = 3;

export function traceLabelWidth(t: AdwaitaTheme): number {
  return Math.ceil(LABEL_CHARS * t.type.caption * MONO_ADVANCE);
}

export function traceFigureWidth(t: AdwaitaTheme): number {
  return Math.ceil(FIGURE_CHARS * t.type.caption * MONO_ADVANCE);
}

/** The axis a set of spans is drawn against. */
export function traceTotal(spans: readonly TraceSpan[]): number {
  return spans.reduce((end, span) => Math.max(end, span.offset + span.duration), 0);
}

export function Trace({
  spans,
  total,
  labelWidth,
  figureWidth,
  style,
}: TraceProps) {
  const t = useAdwaita();
  const label = labelWidth ?? traceLabelWidth(t);
  const figure = figureWidth ?? traceFigureWidth(t);
  const axis = Math.max(total ?? traceTotal(spans), 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        gap: 6,
        ...style,
      }}
    >
      {spans.map((span, index) => {
        const before = Math.max(0, span.offset);
        const run = Math.max(0, span.duration);
        const after = Math.max(0, axis - before - run);
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              minWidth: 0,
              gap: t.space.sm,
            }}
          >
            <div
              style={{
                width: label,
                flexShrink: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: (span.depth ?? 0) * INDENT,
                minWidth: 0,
              }}
            >
              <T
                size="list"
                color={t.color.text.primary}
                clamp={1}
                style={{ flexShrink: 1, minWidth: 0 }}
              >
                {span.label}
              </T>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
                flexBasis: 0,
                minWidth: 0,
                height: t.type.lineHeight.list,
              }}
            >
              {before > 0 ? (
                <div style={{ flexGrow: before, flexBasis: 0, minHeight: 1 }} />
              ) : null}
              <div
                style={{
                  flexGrow: Math.max(run, MIN_BAR),
                  flexBasis: 0,
                  height: SPAN_BAR,
                  minHeight: run === 0 ? 0 : MIN_BAR,
                  borderRadius: SPAN_BAR / 2,
                  backgroundColor:
                    span.tone === undefined
                      ? t.color.surface.buttonActive
                      : toneColor(t, span.tone),
                }}
              />
              {after > 0 ? (
                <div style={{ flexGrow: after, flexBasis: 0, minHeight: 1 }} />
              ) : null}
            </div>
            <div
              style={{
                width: figure,
                flexShrink: 0,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <T
                size="caption"
                color={t.color.text.dim}
                style={{ fontFamily: t.type.fontFamilyMono, whiteSpace: "nowrap" }}
              >
                {span.figure ?? String(span.duration)}
              </T>
            </div>
          </div>
        );
      })}
    </div>
  );
}
