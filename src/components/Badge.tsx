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
