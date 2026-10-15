import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'
import { BoxedList } from './BoxedList'

export interface PreferencesGroupProps {
  title: string
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A titled boxed list: a small dimmed section title above a `BoxedList` of
 * rows — the standard preferences page block.
 */
export function PreferencesGroup({ title, children, style }: PreferencesGroupProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      <T size="title4" weight={600} color={colors.dim_fg}>
        {title}
      </T>
      <BoxedList>{children}</BoxedList>
    </div>
  )
}

export interface PreferencesPageProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A scrollable preferences page: a vertical column of `PreferencesGroup`
 * blocks.
 */
export function PreferencesPage({ children, style }: PreferencesPageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
