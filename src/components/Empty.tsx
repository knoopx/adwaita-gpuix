import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface EmptyProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A centered empty-state column (icon area, title, description, action). */
export function Empty({ children, style }: EmptyProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: 24,
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface EmptyMediaProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** The icon area of an empty state (~48px). */
export function EmptyMedia({ children, style }: EmptyMediaProps) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface EmptyTitleProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Title3 text for empty state headings. */
export function EmptyTitle({ children, style }: EmptyTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title3" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface EmptyDescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Dim body text for empty state descriptions. */
export function EmptyDescription({ children, style }: EmptyDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export interface EmptyContentProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Wrapper for additional content in an empty state. */
export function EmptyContent({ children, style }: EmptyContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...style }}>
      {children}
    </div>
  )
}

export interface EmptyHeaderProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * Groups an empty state's media + title + description in a centred,
 * fit-content column (shadcn `EmptyHeader`).
 */
export function EmptyHeader({ children, style }: EmptyHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: 'fit-content',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface EmptyActionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** The action area (buttons) in an empty state. */
export function EmptyAction({ children, style }: EmptyActionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, ...style }}>{children}</div>
  )
}
