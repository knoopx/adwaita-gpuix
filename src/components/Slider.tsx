import { useState } from "react";
import type { StyleDesc, EventPayload } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";

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

const CROSS = 20;

const TRACK = 4;

const THUMB = 18;

const THUMB_DOT = 6;

const TRACK_OFFSET = (CROSS - TRACK) / 2;

const THUMB_OFFSET = (CROSS - THUMB) / 2;

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
  const { colors } = t;
  const vertical = orientation === "vertical";
  const trackSize = vertical ? height : width;

  const [internal, setInternal] = useState<number | number[]>(
    defaultValue ?? value ?? min,
  );
  const current = value ?? internal;
  const isMulti = Array.isArray(current);
  const values = isMulti
    ? [...(current as number[])].sort((a, b) => a - b)
    : [current as number];

  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const snap = (n: number) => clamp(Math.round(n / step) * step);

  const emit = (next: number | number[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  interface DragState {
    startCoord: number;
    startValue: number;
    thumbIndex: number;
  }
  const [drag, setDrag] = useState<DragState | null>(null);

  const coordOf = (event: EventPayload) =>
    vertical ? (event.y ?? 0) : (event.x ?? 0);

  const startDrag = (event: EventPayload) => {
    if (disabled) return;
    
    
    
    
    const coord = coordOf(event);
    
    let nearest = 0;
    let nearestDist = Infinity;
    values.forEach((v, i) => {
      const thumbCoord = vertical ? trackSize - pct(v) : pct(v);
      const d = Math.abs(coord - thumbCoord);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setDrag({ startCoord: coord, startValue: values[nearest], thumbIndex: nearest });
  };

  const moveDrag = (event: EventPayload) => {
    if (!drag || disabled) return;
    const coord = coordOf(event);
    
    const delta = (
      (vertical ? drag.startCoord - coord : coord - drag.startCoord) /
      trackSize
    ) *
      (max - min);
    let next = snap(drag.startValue + delta);
    if (isMulti) {
      
      if (drag.thumbIndex === 0 && values.length > 1) {
        next = Math.min(next, values[1]);
      } else if (drag.thumbIndex === values.length - 1 && values.length > 1) {
        next = Math.max(next, values[0]);
      }
      emit(values.map((v, i) => (i === drag.thumbIndex ? next : v)));
    } else {
      emit(next);
    }
  };

  const endDrag = () => setDrag(null);

  const onKeyDown = (event: EventPayload) => {
    if (disabled) return;
    const dir =
      event.key === "ArrowLeft" || (vertical && event.key === "ArrowDown")
        ? -1
        : event.key === "ArrowRight" || (vertical && event.key === "ArrowUp")
          ? 1
          : 0;
    if (dir === 0) return;
    if (isMulti) {
      const arr = values as number[];
      emit(arr.map((v, i) => (i === 0 ? clamp(v + dir * step) : v)));
    } else {
      emit(clamp((values[0] as number) + dir * step));
    }
  };

  const pct = (v: number) => ((v - min) / (max - min)) * trackSize;
  const firstPct = Math.round(pct(values[0]));
  const lastPct = Math.round(pct(values[values.length - 1]));
  const isSingle = values.length === 1;
  const fillStart = isSingle ? 0 : firstPct;
  const fillEnd = isSingle ? firstPct : lastPct;
  const fillSpan = fillEnd - fillStart;

  const containerStyle: Partial<StyleDesc> = {
    position: "relative",
    display: "flex",
    ...(vertical
      ? { width: CROSS, height: trackSize }
      : { width: trackSize, height: CROSS }),
    cursor: disabled ? "default" : vertical ? "row-resize" : "grab",
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const trackLineStyle: Partial<StyleDesc> = vertical
    ? {
        position: "absolute",
        left: TRACK_OFFSET,
        top: 0,
        width: TRACK,
        height: trackSize,
        borderRadius: TRACK / 2,
        backgroundColor: colors.border,
        pointerEvents: "none",
      }
    : {
        position: "absolute",
        top: TRACK_OFFSET,
        left: 0,
        width: trackSize,
        height: TRACK,
        borderRadius: TRACK / 2,
        backgroundColor: colors.border,
        pointerEvents: "none",
      };

  
  
  
  const fillStyle: Partial<StyleDesc> = vertical
    ? {
        position: "absolute",
        left: TRACK_OFFSET,
        bottom: 0,
        width: TRACK,
        height: fillSpan,
        borderRadius: TRACK / 2,
        backgroundColor: colors.accent,
        pointerEvents: "none",
      }
    : {
        position: "absolute",
        top: TRACK_OFFSET,
        left: fillStart,
        width: fillSpan,
        height: TRACK,
        borderRadius: TRACK / 2,
        backgroundColor: colors.accent,
        pointerEvents: "none",
      };

  const thumbStyle = (v: number): Partial<StyleDesc> => {
    const p = Math.round(pct(v));
    const base: Partial<StyleDesc> = {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: THUMB,
      height: THUMB,
      borderRadius: THUMB / 2,
      backgroundColor: colors.accent,
      pointerEvents: "none",
    };
    return vertical
      ? { ...base, left: THUMB_OFFSET, top: trackSize - p - THUMB / 2 }
      : { ...base, top: THUMB_OFFSET, left: p - THUMB / 2 };
  };

  return (
    <div
      onMouseDown={disabled ? undefined : startDrag}
      onMouseMove={disabled ? undefined : moveDrag}
      onMouseUp={disabled ? undefined : endDrag}
      onKeyDown={onKeyDown}
      tabIndex={disabled ? -1 : 0}
      style={containerStyle}
    >
      <div style={trackLineStyle} />
      <div style={fillStyle} />
      {values.map((v, i) => (
        <div key={i} style={thumbStyle(v)}>
          <div
            style={{
              width: THUMB_DOT,
              height: THUMB_DOT,
              borderRadius: THUMB_DOT / 2,
              backgroundColor: colors.accent_fg,
              pointerEvents: "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
