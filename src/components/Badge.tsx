import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * Adwaita pill badge. Variants map to theme colours:
 * default=accent, secondary=button_bg, destructive=destructive,
 * success=success, warning=warning, outline=transparent+border.
 */
export function Badge({ variant = 'default', children, style }: BadgeProps) {
  const t = useAdwaita()
  const { colors, radii } = t

  let bg: string
  let fg: string
  let border = 0
  let borderColor = 'transparent'

  switch (variant) {
    case 'default':
      bg = colors.accent
      fg = colors.accent_fg
      break
    case 'secondary':
      bg = colors.button_bg
      fg = colors.fg
      break
    case 'destructive':
      bg = colors.destructive
      fg = '#ffffff'
      break
    case 'success':
      bg = colors.success
      fg = '#ffffff'
      break
    case 'warning':
      bg = colors.warning
      fg = '#2e2e2e'
      break
    case 'outline':
      bg = 'transparent'
      fg = colors.fg
      border = 1
      borderColor = colors.dim_fg
      break
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 6,
        borderRadius: radii.pill,
        borderWidth: border,
        borderColor: borderColor,
        backgroundColor: bg,
        ...style,
      }}
    >
      <T size="caption" color={fg}>
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

export const BadgeShot: ComponentShot = {
  name: 'Badge',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Variants">
        <ShotItem label="default"><Badge>New</Badge></ShotItem>
        <ShotItem label="secondary"><Badge variant="secondary">Secondary</Badge></ShotItem>
        <ShotItem label="destructive"><Badge variant="destructive">Destructive</Badge></ShotItem>
        <ShotItem label="success"><Badge variant="success">Success</Badge></ShotItem>
        <ShotItem label="warning"><Badge variant="warning">Warning</Badge></ShotItem>
        <ShotItem label="outline"><Badge variant="outline">Outline</Badge></ShotItem>
      </Row>
    </div>
  ),
}
