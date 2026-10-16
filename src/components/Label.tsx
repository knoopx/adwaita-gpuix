import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface LabelProps {
  children: ReactNode
  /** Dims the label (opacity 0.5) to match a disabled control. */
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/**
 * A form label: body-size text in the theme foreground colour. GPUix has no
 * `htmlFor`, so association with a control is structural (sibling placement).
 */
export function Label({ children, disabled, style }: LabelProps) {
  const t = useAdwaita()
  return (
    <div style={{ opacity: disabled ? 0.5 : 1, ...style }}>
      <T size="body" color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'

/** A captioned shot item: a small dim caption above the item. */
function ShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const LabelShot: ComponentShot = {
  name: 'Label',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="States">
        <ShotItem label="default"><Label>Email</Label></ShotItem>
        <ShotItem label="disabled (dimmed, matches a disabled control)"><Label disabled>Email</Label></ShotItem>
      </Row>
    </div>
  ),
}
