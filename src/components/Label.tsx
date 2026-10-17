import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface LabelProps {
  children: ReactNode

  disabled?: boolean
  style?: Partial<StyleDesc>
}

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

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const LabelShot: ComponentShot = {
  name: 'Label',
  el: (
    <Shot>
      <Row label="States">
        <ShotItem label="default"><Label>Email</Label></ShotItem>
        <ShotItem label="disabled (dimmed, matches a disabled control)"><Label disabled>Email</Label></ShotItem>
      </Row>
    </Shot>
  ),
}
