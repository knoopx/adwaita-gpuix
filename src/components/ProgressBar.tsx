import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface ProgressBarProps {
  /**
   * Progress. By default the value is in the range **0..100** (shadcn
   * reference parity). Set `percent` to interpret `value` on the legacy
   **0..1** scale instead.
   */
  value: number
  /**
   * When true, `value` is interpreted on the 0..1 scale (the pre-existing
   * adwaita scale) rather than 0..100.
   */
  percent?: boolean
  height?: number
  style?: Partial<StyleDesc>
}

/**
 * Adwaita progress bar: a pill track with an accent fill (the indicator)
 * whose width tracks `value`.
 *
 * `value` is **0..100** by default (reference parity). Pass `percent` to use
 * the legacy **0..1** scale.
 */
export function ProgressBar({ value, percent, height = 6, style }: ProgressBarProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const normalized = percent ? value : value / 100
  const clamped = Math.min(1, Math.max(0, normalized))
  const pill = radii.pill
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height,
        borderRadius: pill,
        backgroundColor: colors.button_active,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${Math.round(clamped * 100)}%`,
          height,
          borderRadius: pill,
          backgroundColor: colors.accent,
        }}
      />
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import type { ReactNode } from 'react'
import { Row, T } from './common'

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

export const ProgressBarShot: ComponentShot = {
  name: 'ProgressBar',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Values (0–100 scale)" col>
        <ShotItem label="0%"><ProgressBar value={0} /></ShotItem>
        <ShotItem label="25%"><ProgressBar value={25} /></ShotItem>
        <ShotItem label="50%"><ProgressBar value={50} /></ShotItem>
        <ShotItem label="75%"><ProgressBar value={75} /></ShotItem>
        <ShotItem label="100%"><ProgressBar value={100} /></ShotItem>
      </Row>
      <Row label="Legacy percent scale (0–1)" col>
        <ShotItem label="percent 0.5"><ProgressBar value={0.5} percent /></ShotItem>
        <ShotItem label="percent 1"><ProgressBar value={1} percent /></ShotItem>
      </Row>
      <Row label="Heights">
        <ShotItem label="6"><ProgressBar value={40} height={6} /></ShotItem>
        <ShotItem label="12"><ProgressBar value={40} height={12} /></ShotItem>
        <ShotItem label="20"><ProgressBar value={40} height={20} /></ShotItem>
      </Row>
    </div>
  ),
}
