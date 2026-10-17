import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export interface ViewSwitcherItem {
  id: string
  label: string
  icon: IconName
}

export interface ViewSwitcherProps {
  items: ViewSwitcherItem[]
  value: string
  onChange: (id: string) => void

  showLabels?: boolean
  style?: Partial<StyleDesc>
}

export function ViewSwitcher({ items, value, onChange, showLabels = true, style }: ViewSwitcherProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      {items.map((item) => {
        const selected = item.id === value
        return (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              display: 'flex',
              flexDirection: showLabels ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: showLabels ? 2 : 0,
              padding: showLabels ? 10 : 8,
              borderRadius: 10,
              minWidth: showLabels ? 56 : 0,
              backgroundColor: selected ? colors.accentTint : 'transparent',
              cursor: 'pointer',
              hover: selected ? undefined : { backgroundColor: hexToRgba(colors.fg, 0.06) },
            }}
          >
            <Icon name={item.icon} size={18} color={selected ? colors.accent : colors.dim_fg} />
            {showLabels ? (
              <T size="caption" weight={selected ? 600 : 400} color={selected ? colors.fg : colors.dim_fg}>
                {item.label}
              </T>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

const VIEWS: ViewSwitcherItem[] = [
  { id: 'l', label: 'List', icon: 'list' },
  { id: 'g', label: 'Grid', icon: 'grid' },
  { id: 'p', label: 'Panel', icon: 'panel' },
]

export const ViewSwitcherShot: ComponentShot = {
  name: 'ViewSwitcher',
  el: (
    <Shot>
      <Row label="Variants">
        <ShotItem label="labeled (default, value=grid)">
          <ViewSwitcher items={VIEWS} value="g" onChange={() => {}} />
        </ShotItem>
        <ShotItem label="icon-only (showLabels=false)">
          <ViewSwitcher items={VIEWS} value="l" showLabels={false} onChange={() => {}} />
        </ShotItem>
      </Row>
    </Shot>
  ),
}
