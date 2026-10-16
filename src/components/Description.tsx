import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface DescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A descriptive text block: dim, body-size text used to explain a value, field,
 * or section.
 */
export function Description({ children, style }: DescriptionProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <T size="body" color={colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const DescriptionShot: ComponentShot = {
  name: 'Description',
  el: (
    <Shot>
      <Row label="Plain" col>
        <ShotItem label="bare description line">
          <Description>A short descriptive line of dim text explaining the value above.</Description>
        </ShotItem>
      </Row>
      <Row label="Under a label (field context)" col>
        <ShotItem label="label + description">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <T size="title3" weight={600}>Field label</T>
            <Description>Help text describing what this field controls and its effect.</Description>
          </div>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
