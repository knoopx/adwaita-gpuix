import { useState } from "react";
import { type EventPayload, type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  shade,
  useAdwaita,
} from "../theme/adwaita";
import { disabledStyle } from "./disabled.ts";

export interface SliderProps {
  value?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number | number[]) => void;

  defaultValue?: number | number[];
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;

  width?: number;

  height?: number;
  style?: Partial<StyleDesc>;
}

interface DragState {
  startCoord: number;
  startValue: number;
  thumbIndex: number;
}

function clampTo(min: number, max: number, n: number): number {
  return Math.max(min, Math.min(max, n));
}

function snapTo(min: number, max: number, step: number, n: number): number {
  return clampTo(min, max, Math.round(n / step) * step);
}

function pctOf(min: number, max: number, trackSize: number, v: number): number {
  return ((v - min) / (max - min)) * trackSize;
}

function knobAlongOf(p: number, span: number, trackSize: number): number {
  return Math.max(0, Math.min(trackSize - span, Math.round(p) - span / 2));
}

function valuesOf(current: number | number[]): number[] {
  return Array.isArray(current)
    ? [...current].sort((a, b) => a - b)
    : [current as number];
}

function nearestThumb(
  values: number[],
  coord: number,
  vertical: boolean,
  pct: (v: number) => number,
  trackSize: number,
): number {
  let nearest = 0;
  let nearestDist = Infinity;
  values.forEach((v, i) => {
    const thumbCoord = vertical ? trackSize - pct(v) : pct(v);
    const dist = Math.abs(coord - thumbCoord);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = i;
    }
  });
  return nearest;
}

function clampAgainstNeighbours(
  values: number[],
  index: number,
  next: number,
): number {
  if (values.length < 2) return next;
  if (index === 0) return Math.min(next, values[1]);
  if (index === values.length - 1) return Math.max(next, values[0]);
  return next;
}

function sliderStep(key: string | undefined, vertical: boolean): number {
  if (key === "ArrowLeft") return -1;
  if (key === "ArrowRight") return 1;
  if (!vertical) return 0;
  if (key === "ArrowUp") return 1;
  if (key === "ArrowDown") return -1;
  return 0;
}

function fillRange(pcts: number[]): { start: number; end: number } {
  const single = pcts.length === 1;
  const start = single ? 0 : pcts[0];
  const end = single ? pcts[0] : pcts[pcts.length - 1];
  return { start, end };
}

function containerStyle(args: {
  t: AdwaitaTheme;
  vertical: boolean;
  trackSize: number;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}): Partial<StyleDesc> {
  const { t, vertical, trackSize, disabled, style } = args;
  return {
    position: "relative",
    display: "flex",
    ...(vertical
      ? {
          width: t.control.sliderKnobHeight + t.control.sliderPadding * 2,
          height: trackSize,
        }
      : {
          width: trackSize,
          height: t.control.sliderKnobHeight + t.control.sliderPadding * 2,
        }),
    ...disabledStyle(disabled, {
      cursor: vertical ? "row-resize" : "grab",
    }),
    ...style,
  };
}

function trackLineStyle(args: {
  t: AdwaitaTheme;
  vertical: boolean;
  trackSize: number;
  trackOffset: number;
}): Partial<StyleDesc> {
  const { t, vertical, trackSize, trackOffset } = args;
  const track = t.control.sliderTroughHeight;
  const base: Partial<StyleDesc> = {
    position: "absolute",
    borderRadius: track / 2,
    backgroundColor: t.color.surface.sunken,
    pointerEvents: "none",
  };
  return vertical
    ? { ...base, left: trackOffset, top: 0, width: track, height: trackSize }
    : {
        ...base,
        top: trackOffset,
        left: 0,
        width: trackSize,
        height: track,
        hover: {
          backgroundColor: t.color.surface.hover,
        },
      };
}

function fillStyle(args: {
  t: AdwaitaTheme;
  vertical: boolean;
  trackOffset: number;
  fillStart: number;
  fillSpan: number;
}): Partial<StyleDesc> {
  const { t, vertical, trackOffset, fillStart, fillSpan } = args;
  const track = t.control.sliderTroughHeight;
  const base: Partial<StyleDesc> = {
    position: "absolute",
    borderRadius: track / 2,
    backgroundColor: t.color.accent.base,
    pointerEvents: "none",
  };
  return vertical
    ? { ...base, left: trackOffset, bottom: 0, width: track, height: fillSpan }
    : {
        ...base,
        top: trackOffset,
        left: fillStart,
        width: fillSpan,
        height: track,
      };
}

function knobStyle(args: {
  t: AdwaitaTheme;
  vertical: boolean;
  cross: number;
  knobOffset: number;
  trackSize: number;
  along: number;
}): Partial<StyleDesc> {
  const { t, vertical, cross, knobOffset, trackSize, along } = args;
  const knobW = t.control.sliderKnobWidth;
  const knobH = t.control.sliderKnobHeight;
  const base: Partial<StyleDesc> = {
    position: "absolute",
    width: knobW,
    height: knobH,
    borderRadius: knobH / 2,
    backgroundColor: t.color.surface.raised,

    borderWidth: 1,
    borderColor: t.color.divider.default,
    boxShadow: {
      offsetX: 0,
      offsetY: 1,
      blurRadius: 4,
      spreadRadius: 0,
      color: hexToRgba(
        t.color.text.primary,
        isDarkScheme(t.scheme) ? 0.4 : 0.18,
      ),
    },
    hover: { backgroundColor: t.color.surface.raised },
    pointerEvents: "none",
  };
  return vertical
    ? { ...base, left: (cross - knobW) / 2, top: trackSize - along - knobH }
    : { ...base, top: knobOffset, left: along };
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  defaultValue,
  orientation = "horizontal",
  disabled,
  width = 200,
  height = 200,
  style,
}: SliderProps) {
  const t = useAdwaita();
  const vertical = orientation === "vertical";

  const cross = t.control.sliderKnobHeight + t.control.sliderPadding * 2;
  const track = t.control.sliderTroughHeight;
  const knobW = t.control.sliderKnobWidth;
  const knobH = t.control.sliderKnobHeight;
  const trackOffset = (cross - track) / 2;
  const knobOffset = (cross - knobH) / 2;
  const trackSize = vertical ? height : width;

  const [internal, setInternal] = useState<number | number[]>(
    defaultValue ?? value ?? min,
  );
  const current = value ?? internal;
  const isMulti = Array.isArray(current);
  const values = valuesOf(current);

  const clamp = (n: number) => clampTo(min, max, n);
  const snap = (n: number) => snapTo(min, max, step, n);
  const pct = (v: number) => pctOf(min, max, trackSize, v);

  const emit = (next: number | number[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const [drag, setDrag] = useState<DragState | null>(null);

  const coordOf = (event: EventPayload) =>
    vertical ? (event.y ?? 0) : (event.x ?? 0);

  const startDrag = (event: EventPayload) => {
    if (disabled) return;
    const coord = coordOf(event);
    const thumbIndex = nearestThumb(values, coord, vertical, pct, trackSize);
    setDrag({
      startCoord: coord,
      startValue: values[thumbIndex],
      thumbIndex,
    });
  };

  const moveDrag = (event: EventPayload) => {
    if (!drag || disabled) return;
    const coord = coordOf(event);
    const delta =
      ((vertical ? drag.startCoord - coord : coord - drag.startCoord) /
        trackSize) *
      (max - min);
    const next = snap(drag.startValue + delta);
    if (isMulti) {
      const clamped = clampAgainstNeighbours(values, drag.thumbIndex, next);
      emit(values.map((v, i) => (i === drag.thumbIndex ? clamped : v)));
    } else {
      emit(next);
    }
  };

  const endDrag = () => setDrag(null);

  const onKeyDown = (event: EventPayload) => {
    if (disabled) return;
    const dir = sliderStep(event.key, vertical);
    if (dir === 0) return;
    if (isMulti) {
      const arr = values as number[];
      emit(arr.map((v, i) => (i === 0 ? clamp(v + dir * step) : v)));
    } else {
      emit(clamp((values[0] as number) + dir * step));
    }
  };

  const pcts = values.map((v) => Math.round(pct(v)));
  const fill = fillRange(pcts);
  const fillSpan = fill.end - fill.start;

  return (
    <div
      onMouseDown={disabled ? undefined : startDrag}
      onMouseMove={disabled ? undefined : moveDrag}
      onMouseUp={disabled ? undefined : endDrag}
      onKeyDown={onKeyDown}
      tabIndex={disabled ? -1 : 0}
      style={containerStyle({ t, vertical, trackSize, disabled, style })}
    >
      <div style={trackLineStyle({ t, vertical, trackSize, trackOffset })} />
      <div
        style={fillStyle({
          t,
          vertical,
          trackOffset,
          fillStart: fill.start,
          fillSpan,
        })}
      />
      {values.map((v, i) => (
        <div
          key={i}
          style={knobStyle({
            t,
            vertical,
            cross,
            knobOffset,
            trackSize,
            along: knobAlongOf(pct(v), vertical ? knobH : knobW, trackSize),
          })}
        />
      ))}
    </div>
  );
}
