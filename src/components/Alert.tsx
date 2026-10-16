import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, type AdwaitaColors } from '../theme/adwaita'
import { TextPart } from './common'
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
  return (
    <TextPart size="title4" weight={700} style={style}>
      {children}
    </TextPart>
  )
}

export interface AlertDescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Dim caption text for alert descriptions. */
export function AlertDescription({ children, style }: AlertDescriptionProps) {
  return (
    <TextPart dim style={style}>
      {children}
    </TextPart>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const AlertShot: ComponentShot = {
  name: 'Alert',
  el: (
    <Shot>
      <Row label="Variants (icon + title + description)" col>
        <ShotItem label="default (accent tint, info icon)">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>A standard informational alert.</AlertDescription>
          </Alert>
        </ShotItem>
        <ShotItem label="success (success tint)">
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Everything worked as expected.</AlertDescription>
          </Alert>
        </ShotItem>
        <ShotItem label="warning (warning tint)">
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Something needs your attention.</AlertDescription>
          </Alert>
        </ShotItem>
        <ShotItem label="destructive (destructive tint)">
          <Alert variant="destructive">
            <AlertTitle>Danger</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
