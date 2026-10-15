import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface HeaderBarProps {
  /** Centre slot. A string renders as bold title3; a ReactNode (e.g. a ViewSwitcher) is placed as-is. */
  title?: ReactNode
  left?: ReactNode
  right?: ReactNode
  style?: Partial<StyleDesc>
}

/** Flat Adwaita header bar: centred title (string or node) with left/right slots. */
export function HeaderBar({ title, left, right, style }: HeaderBarProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 46,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: colors.headerbar_bg,
        borderBottomWidth: 1,
        borderColor: colors.border,
        ...style,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 80 }}>
        {left}
      </div>
      <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {typeof title === 'string' ? (
          <T size="title3" weight={700} color={colors.fg}>
            {title}
          </T>
        ) : (
          title
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          minWidth: 80,
        }}
      >
        {right}
      </div>
    </div>
  )
}
