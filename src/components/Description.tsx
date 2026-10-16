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
import { Row } from './common'

/** A captioned shot item: a small dim caption above the item. */
function DescriptionShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const DescriptionShot: ComponentShot = {
  name: 'Description',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Plain" col>
        <DescriptionShotItem label="bare description line">
          <Description>A short descriptive line of dim text explaining the value above.</Description>
        </DescriptionShotItem>
      </Row>
      <Row label="Under a label (field context)" col>
        <DescriptionShotItem label="label + description">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <T size="title3" weight={600}>Field label</T>
            <Description>Help text describing what this field controls and its effect.</Description>
          </div>
        </DescriptionShotItem>
      </Row>
    </div>
  ),
}
