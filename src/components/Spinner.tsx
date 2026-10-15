import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface SpinnerProps {
  size?: 16 | 32 | 64
  /** Render a visually-hidden "Loading" label for a11y (default true). */
  label?: boolean
  style?: Partial<StyleDesc>
}

/**
 * Adwaita spinner. GPUix `motion` only animates a fixed set of properties (no
 * rotation), so this is a **static 270° accent arc** — the documented
 * substitute for a spinning indicator.
 *
 * Rendered as an SVG data-URI `<img>` so it rasterises portably (a CSS
 * border-arc is not rasterised by the static takumi renderer, which made the
 * spinner invisible in PNGs).
 *
 * A visually-hidden sibling `T` "Loading" label is rendered for a11y parity
 * with the reference `role="status" aria-label="Loading"` (GPUix has no
 * `role`/`aria-label` host attributes, so a zero-size, zero-opacity text
 * node is the equivalent). Set `label={false}` to suppress it.
 */
export function Spinner({ size = 32, label = true, style }: SpinnerProps) {
  const t = useAdwaita()
  const { colors } = t
  const r = 45
  const sw = 12
  const circ = 2 * Math.PI * r
  const arc = (circ * 270) / 360
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
    `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${colors.accent}" ` +
    `stroke-width="${sw}" stroke-linecap="round" ` +
    `stroke-dasharray="${arc.toFixed(1)} ${(circ - arc).toFixed(1)}" transform="rotate(-90 50 50)" />` +
    `</svg>`
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...style }}>
      <img src={src} style={{ width: size, height: size, flexShrink: 0 }} />
      {label ? (
        <T size="caption" color={colors.dim_fg} style={{ width: 0, height: 0, opacity: 0 }}>
          Loading
        </T>
      ) : null}
    </div>
  )
}
