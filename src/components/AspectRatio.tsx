import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'

export interface AspectRatioProps {
  /**
   * Width-to-height ratio (e.g. 16/9 ≈ 1.78). The container's height is
   * derived from its width as `height = width / ratio`.
   */
  ratio: number
  /**
   * Fixed width in px. When given, the height is computed as
   * `width / ratio`. When omitted, the parent must supply a fixed width
   * (the container fills it with `width: '100%'`); GPUix has no CSS
   * `aspect-ratio`, so a numeric width (or a `height` axis, below) is the
   * only way to constrain the box.
   */
  width?: number
  /**
   * Fixed height in px as the primary axis. When `width` is omitted and
   * `height` is set, the width is computed as `height * ratio`.
   */
  height?: number
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A container that emulates a fixed aspect ratio (GPUix has no CSS
 * `aspect-ratio`). Given a numeric `width`, the height is `width / ratio`;
 * given only a `height`, the width is `height * ratio`. With neither, the
 * container fills its parent's width and has no height constraint, so a
 * fixed-size parent is required.
 */
export function AspectRatio({ ratio, width, height, children, style }: AspectRatioProps) {
  let w: number | '100%' = '100%'
  let h: number | undefined
  if (width !== undefined && height !== undefined) {
    w = width
    h = height
  } else if (width !== undefined) {
    w = width
    h = Math.round(width / ratio)
  } else if (height !== undefined) {
    w = Math.round(height * ratio)
    h = height
  }
  return (
    <div
      style={{
        width: w,
        height: h,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { buildTheme } from '../theme/adwaita'
import { T, Row, Shot, ShotItem } from './common'

/** A tinted fill box with a centred ratio label. */
function FillBox({ label, height }: { label: string; height?: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: height ?? '100%',
        backgroundColor: buildTheme('dark', 'blue').colors.accentTint,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T>{label}</T>
    </div>
  )
}

export const AspectRatioShot: ComponentShot = {
  name: 'AspectRatio',
  el: (
    <Shot>
      <Row label="By width (16:9, width=400)" col>
        <AspectRatio ratio={16 / 9} width={400}>
          <FillBox label="16 : 9" />
        </AspectRatio>
      </Row>
      <Row label="By height · fixed · fills parent" col>
        <ShotItem label="By height (16:9, height=90 → width 160)">
          <AspectRatio ratio={16 / 9} height={90}>
            <FillBox label="16 : 9" />
          </AspectRatio>
        </ShotItem>
        <ShotItem label="Fixed width+height (120×68)">
          <AspectRatio ratio={16 / 9} width={120} height={68}>
            <FillBox label="120×68" />
          </AspectRatio>
        </ShotItem>
        <ShotItem label="Fills parent (width 100%, parent 180px)">
          <div style={{ width: 180 }}>
            <AspectRatio ratio={16 / 9}>
              <FillBox label="16 : 9" height={100} />
            </AspectRatio>
          </div>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
