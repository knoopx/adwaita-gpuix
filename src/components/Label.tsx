import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface LabelProps {
  children: ReactNode
  /** Dims the label (opacity 0.5) to match a disabled control. */
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/**
 * A form label: body-size text in the theme foreground colour. GPUix has no
 * `htmlFor`, so association with a control is structural (sibling placement).
 */
export function Label({ children, disabled, style }: LabelProps) {
  const t = useAdwaita()
  return (
    <div style={{ opacity: disabled ? 0.5 : 1, ...style }}>
      <T size="body" color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}
