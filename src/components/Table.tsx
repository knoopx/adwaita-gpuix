import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { T } from './common'

export interface TableProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** An Adwaita table container: outer card radius, border. */
export function Table({ children, style }: TableProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableHeaderProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** The header row area of a table. */
export function TableHeader({ children, style }: TableHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableBodyProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** The body rows of a table. */
export function TableBody({ children, style }: TableBodyProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>{children}</div>
  )
}

export interface TableFooterProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A table footer row area: a top hairline + a muted wash
 * (`fg` @ 4%) with medium-weight cells (shadcn `TableFooter`).
 */
export function TableFooter({ children, style }: TableFooterProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderTopWidth: 1,
        borderColor: colors.border,
        backgroundColor: hexToRgba(colors.fg, 0.04),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableFootCellProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A footer cell: body text at weight 500, 8px padding. */
export function TableFootCell({ children, style }: TableFootCellProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      <T size="body" weight={500} color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}

export interface TableRowProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A table row: flex row with 1px bottom border and hover accentTint. */
export function TableRow({ children, style }: TableRowProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: colors.border,
        hover: { backgroundColor: colors.accentTint },
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableHeadProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A header cell: caption dim bold, 8px padding. */
export function TableHead({ children, style }: TableHeadProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      <T size="caption" weight={700} color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}

export interface TableCellProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A body cell: body text, 8px padding. */
export function TableCell({ children, style }: TableCellProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      <T size="body" color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}

export interface TableCaptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A table caption below the table: dim caption text. */
export function TableCaption({ children, style }: TableCaptionProps) {
  const t = useAdwaita()
  return (
    <div style={{ padding: 8, ...style }}>
      <T size="caption" color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}
