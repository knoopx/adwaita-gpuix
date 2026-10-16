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
  /** Show the text label under each icon (default). Set false for a compact icon-only row. */
  showLabels?: boolean
  style?: Partial<StyleDesc>
}

/**
 * Adwaita view switcher: a row of icon-over-label pills. The selected pill is
 * tinted with the accent; the rest are flat and dimmed. With `showLabels`
 * false it renders a compact icon-only row.
 */
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

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ReactNode } from 'react'
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'

/** A captioned shot item: a small dim caption above the item. */
function ShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const ViewSwitcherShot: ComponentShot = {
  name: 'ViewSwitcher',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Variants">
        <ShotItem label="labeled (default, value=grid)">
          <ViewSwitcher
            items={[
              { id: 'l', label: 'List', icon: 'list' },
              { id: 'g', label: 'Grid', icon: 'grid' },
              { id: 'p', label: 'Panel', icon: 'panel' },
            ]}
            value="g"
            onChange={() => {}}
          />
        </ShotItem>
        <ShotItem label="icon-only (showLabels=false)">
          <ViewSwitcher
            items={[
              { id: 'l', label: 'List', icon: 'list' },
              { id: 'g', label: 'Grid', icon: 'grid' },
              { id: 'p', label: 'Panel', icon: 'panel' },
            ]}
            value="l"
            showLabels={false}
            onChange={() => {}}
          />
        </ShotItem>
      </Row>
    </div>
  ),
}
