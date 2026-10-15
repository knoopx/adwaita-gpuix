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
