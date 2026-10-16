import { useState } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface SliderProps {
  value?: number | number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number | number[]) => void
  /** Uncontrolled mode: when `value` is undefined, the slider starts here. */
  defaultValue?: number | number[]
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  /** Track length for the horizontal orientation (default 200). */
  width?: number
  /** Track length for the vertical orientation (default 200). */
  height?: number
  style?: Partial<StyleDesc>
}

/** The short (cross) dimension of the track container, in px. */
const CROSS = 20
/** Thumb diameter, in px. */
const THUMB = 18

/**
 * A slider with a track, filled portion, and thumb(s).
 *
 * Drag is **relative**: on `onMouseDown` the pointer coordinate and the
 * grabbed thumb's value are captured; on move, `delta = (coord - start) /
 * track * (max - min)` is added to the start value (snapped + clamped). This
 * is correct in any layout (the old absolute-coordinate math broke anywhere
 * the slider was not at x=0).
 *
 * All mouse handlers live on the **container** only. The track line, fill,
 * and thumbs are each `position: 'absolute'` + filled, so each would block
 * hits behind it by default and swallow `mousedown`/`mousemove`/`mouseUp`
 * (the drag only worked when the pointer was over the container's bare area).
 * Marking all of them `pointerEvents: 'none'` makes the container the sole
 * hit target in the slider box, so it receives the whole gesture — grabbing a
 * thumb and dragging works identically to dragging the track.
 *
 * `orientation` swaps the axes (vertical uses `row-resize`). `defaultValue`
 * gives an uncontrolled mode. Arrow keys step the value on the focused track.
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  defaultValue,
  orientation = 'horizontal',
  disabled,
  width = 200,
  height = 200,
  style,
}: SliderProps) {
  const t = useAdwaita()
  const { colors } = t
  const vertical = orientation === 'vertical'
  const trackSize = vertical ? height : width

  // ── controlled / uncontrolled duality ──────────────────────────────
  const [internal, setInternal] = useState<number | number[]>(defaultValue ?? value ?? min)
  const current = value ?? internal
  const isMulti = Array.isArray(current)
  const values = isMulti ? [...(current as number[])].sort((a, b) => a - b) : [current as number]

  const clamp = (n: number) => Math.max(min, Math.min(max, n))
  const snap = (n: number) => clamp(Math.round(n / step) * step)

  const emit = (next: number | number[]) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  // ── relative drag state ────────────────────────────────────────────
  interface DragState {
    startCoord: number
    startValue: number
    thumbIndex: number
  }
  const [drag, setDrag] = useState<DragState | null>(null)

  const coordOf = (event: EventPayload) => (vertical ? event.y ?? 0 : event.x ?? 0)

  const startDrag = (event: EventPayload) => {
    if (disabled) return
    const coord = coordOf(event)
    const valAtPointer = min + (coord / trackSize) * (max - min)
    let thumbIndex = 0
    if (isMulti) {
      thumbIndex = values.reduce(
        (best, v, i) => (Math.abs(v - valAtPointer) < Math.abs(values[best] - valAtPointer) ? i : best),
        0,
      )
    }
    setDrag({ startCoord: coord, startValue: values[thumbIndex], thumbIndex })
  }

  const moveDrag = (event: EventPayload) => {
    if (!drag || disabled) return
    const coord = coordOf(event)
    const delta = ((coord - drag.startCoord) / trackSize) * (max - min)
    const next = snap(drag.startValue + delta)
    if (isMulti) {
      emit(values.map((v, i) => (i === drag.thumbIndex ? next : v)))
    } else {
      emit(next)
    }
  }

  const endDrag = () => setDrag(null)

  // ── keyboard stepping ──────────────────────────────────────────────
  const onKeyDown = (event: EventPayload) => {
    if (disabled) return
    const dir =
      event.key === 'ArrowLeft' || (vertical && event.key === 'ArrowDown')
        ? -1
        : event.key === 'ArrowRight' || (vertical && event.key === 'ArrowUp')
          ? 1
          : 0
    if (dir === 0) return
    if (isMulti) {
      const arr = values as number[]
      emit(arr.map((v, i) => (i === 0 ? clamp(v + dir * step) : v)))
    } else {
      emit(clamp((values[0] as number) + dir * step))
    }
  }

  // ── geometry ───────────────────────────────────────────────────────
  const pct = (v: number) => ((v - min) / (max - min)) * trackSize
  const fillPct = Math.round(pct(values[values.length - 1]))

  const containerStyle: Partial<StyleDesc> = {
    position: 'relative',
    display: 'flex',
    ...(vertical
      ? { width: CROSS, height: trackSize }
      : { width: trackSize, height: CROSS }),
    cursor: disabled ? 'default' : vertical ? 'row-resize' : 'grab',
    opacity: disabled ? 0.5 : 1,
    ...style,
  }

  // The track line, fill, and thumbs are all positioned + filled, so each
  // blocks hits behind it by default. Mark them all pointerEvents:'none' so
  // every mouse event in the container falls through to the container itself
  // (the only hit target that owns the drag handlers).
  const trackLineStyle: Partial<StyleDesc> = vertical
    ? { position: 'absolute', left: 8, top: 0, width: 4, height: trackSize, borderRadius: 2, backgroundColor: colors.button_active, pointerEvents: 'none' }
    : { position: 'absolute', top: 8, left: 0, width: trackSize, height: 4, borderRadius: 2, backgroundColor: colors.button_active, pointerEvents: 'none' }

  const fillStyle: Partial<StyleDesc> = vertical
    ? { position: 'absolute', left: 8, top: 0, width: 4, height: fillPct, borderRadius: 2, backgroundColor: colors.accent, pointerEvents: 'none' }
    : { position: 'absolute', top: 8, left: 0, width: fillPct, height: 4, borderRadius: 2, backgroundColor: colors.accent, pointerEvents: 'none' }

  const thumbStyle = (v: number): Partial<StyleDesc> => {
    const p = Math.round(pct(v))
    const base: Partial<StyleDesc> = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: THUMB,
      height: THUMB,
      borderRadius: THUMB / 2,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: '#ffffff',
      boxShadow: { offsetX: 0, offsetY: 1, blurRadius: 2, spreadRadius: 0, color: 'rgba(0,0,0,0.2)' },
      // Never the hit target: let mousedown/mousemove/mouseup fall through to
      // the container so the drag works when the pointer is over a thumb.
      pointerEvents: 'none',
    }
    return vertical ? { ...base, left: 1, top: p - THUMB / 2 } : { ...base, top: 1, left: p - THUMB / 2 }
  }

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
        <div key={i} style={thumbStyle(v)} />
      ))}
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const SliderShot: ComponentShot = {
  name: 'Slider',
  el: (
    <Shot>
      <Row label="Single value" col>
        <ShotItem label="horizontal, value 40">
          <Slider value={40} onValueChange={() => {}} width={300} />
        </ShotItem>
        <ShotItem label="steps (min 0, max 10, step 5)">
          <Slider value={5} min={0} max={10} step={5} onValueChange={() => {}} width={300} />
        </ShotItem>
      </Row>
      <Row label="Range (multiple thumbs)" col>
        <ShotItem label="[20, 70]">
          <Slider value={[20, 70]} onValueChange={() => {}} width={300} />
        </ShotItem>
      </Row>
      <Row label="Orientation & states" col>
        <ShotItem label="vertical">
          <div style={{ display: 'flex', alignItems: 'center', height: 140 }}>
            <Slider orientation="vertical" value={60} onValueChange={() => {}} height={120} />
          </div>
        </ShotItem>
        <ShotItem label="disabled">
          <Slider value={40} disabled onValueChange={() => {}} width={300} />
        </ShotItem>
      </Row>
    </Shot>
  ),
}
