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

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, T, Shot, ShotItem } from './common'

export const SeparatorShot: ComponentShot = {
  name: 'Separator',
  el: (
    <Shot>
      <Row label="Orientations">
        <ShotItem label="horizontal">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <T>Top</T>
            <Separator />
            <T>Bottom</T>
          </div>
        </ShotItem>
        <ShotItem label="vertical">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <T>Left</T>
            <Separator orientation="vertical" style={{ height: 24 }} />
            <T>Right</T>
          </div>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
