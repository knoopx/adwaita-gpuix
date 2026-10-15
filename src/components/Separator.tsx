import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  style?: Partial<StyleDesc>
}

/** A 1px separator line in the theme border colour. */
export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  const t = useAdwaita()
  const { colors } = t

  if (orientation === 'vertical') {
    return (
      <div
        style={{
          width: 1,
          height: '100%',
          backgroundColor: colors.border,
          ...style,
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: 1,
        backgroundColor: colors.border,
        ...style,
      }}
    />
  )
}
