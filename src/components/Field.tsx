import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface FieldProps {
  children: ReactNode
  /** `vertical` (default) stacks label/control/description; `horizontal` lays them in a row. */
  orientation?: 'vertical' | 'horizontal'
  style?: Partial<StyleDesc>
}

/**
 * A form field wrapper: label on top, control, description/error below.
 * Column gap 6 by default; `orientation="horizontal"` lays the children in a
 * row (label left, control right).
 */
export function Field({ children, orientation = 'vertical', style }: FieldProps) {
  const horizontal = orientation === 'horizontal'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: horizontal ? 'flex-start' : 'stretch',
        gap: horizontal ? 12 : 6,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface FieldLabelProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Field label: body-size foreground text. */
export function FieldLabel({ children, style }: FieldLabelProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface FieldDescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Field description: dim caption text. */
export function FieldDescription({ children, style }: FieldDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export interface FieldErrorProps {
  children?: ReactNode
  /**
   * A list of validation errors. When `children` is absent and `errors` is
   * provided, a single error renders as plain text and multiple errors render
   * as a bulleted column (`•` via T rows).
   */
  errors?: { message?: string }[]
  style?: Partial<StyleDesc>
}

/** Field error message(s): destructive colour. */
export function FieldError({ children, errors, style }: FieldErrorProps) {
  const t = useAdwaita()
  const { colors } = t

  // Resolve the content: explicit children win; otherwise derive from `errors`.
  let content: ReactNode = null
  if (children) {
    content = children
  } else if (errors && errors.length > 0) {
    const messages = errors.map((e) => e?.message).filter((m): m is string => Boolean(m))
    if (messages.length === 1) {
      content = messages[0]
    } else if (messages.length > 1) {
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
          {messages.map((m, i) => (
            <T key={i} size="caption" color={colors.destructive}>
              {'• ' + m}
            </T>
          ))}
        </div>
      )
    }
  }

  if (content === null) return null

  return (
    <div style={style}>
      {typeof content === 'string' ? (
        <T size="caption" color={colors.destructive}>
          {content}
        </T>
      ) : (
        content
      )}
    </div>
  )
}

export interface FieldContentProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Wrapper for the control area inside a Field. */
export function FieldContent({ children, style }: FieldContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1, ...style }}>{children}</div>
  )
}

export interface FieldSetProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A bordered-less grouping column of related fields (gap 24). */
export function FieldSet({ children, style }: FieldSetProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, ...style }}>{children}</div>
  )
}

export interface FieldLegendProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A title above a FieldSet (title4, medium, 12px bottom margin). */
export function FieldLegend({ children, style }: FieldLegendProps) {
  const t = useAdwaita()
  return (
    <div style={{ marginBottom: 12, ...style }}>
      <T size="title4" weight={600} color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}

export interface FieldGroupProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A column of fields (gap 28, the reference 7×4px). */
export function FieldGroup({ children, style }: FieldGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, ...style }}>{children}</div>
  )
}

export interface FieldTitleProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A field title (body, medium) — distinct from the label. */
export function FieldTitle({ children, style }: FieldTitleProps) {
  const t = useAdwaita()
  return (
    <T size="body" weight={500} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface FieldSeparatorProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A labelled divider row: two 1px border-coloured lines (each flexGrow 1)
 * around an optional caption label.
 */
export function FieldSeparator({ children, style }: FieldSeparatorProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, ...style }}>
      <div style={{ flexGrow: 1, height: 1, backgroundColor: colors.border }} />
      {children ? (
        <T size="caption" color={colors.dim_fg}>
          {children}
        </T>
      ) : null}
      <div style={{ flexGrow: 1, height: 1, backgroundColor: colors.border }} />
    </div>
  )
}
