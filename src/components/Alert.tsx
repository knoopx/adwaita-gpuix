import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, type AdwaitaColors } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export type AlertVariant = 'default' | 'success' | 'warning' | 'destructive'

export interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Tint, accent and icon for an alert variant. */
interface AlertVariantTheme {
  bg: string
  accent: string
  icon: IconName
}

/** Resolve the tint, accent colour and icon for an alert variant. */
function resolveVariantTheme(variant: AlertVariant, colors: AdwaitaColors): AlertVariantTheme {
  switch (variant) {
    case 'success':
      return { bg: colors.successTint, accent: colors.success, icon: 'success' }
    case 'warning':
      return { bg: colors.warningTint, accent: colors.warning, icon: 'warning' }
    case 'destructive':
      return { bg: colors.destructiveTint, accent: colors.destructive, icon: 'close' }
    default:
      return { bg: colors.accentTint, accent: colors.accent, icon: 'info' }
  }
}

/**
 * Adwaita alert banner: tinted background, 3px left accent border,
 * icon + title + description in a flex row.
 */
export function Alert({ variant = 'default', children, style }: AlertProps) {
  const t = useAdwaita()
  const { radii } = t
  const theme = resolveVariantTheme(variant, t.colors)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 12,
        borderRadius: radii.card,
        backgroundColor: theme.bg,
        borderLeftWidth: 3,
        borderColor: theme.accent,
        ...style,
      }}
    >
      <Icon name={theme.icon} size={18} color={theme.accent} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}

export interface AlertTitleProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Bold title4 text for alert headers. */
export function AlertTitle({ children, style }: AlertTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title4" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface AlertDescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Dim caption text for alert descriptions. */
export function AlertDescription({ children, style }: AlertDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}
