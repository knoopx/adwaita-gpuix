import { useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, selectTriggerStyle, listPanelStyle } from './common'
import { Icon } from './icons'

export interface NativeSelectOption {
  value: string
  label: string
}

export interface NativeSelectGroup {
  label: string
  options: NativeSelectOption[]
}

export interface NativeSelectProps {
  value: string
  options: NativeSelectOption[]
  /**
   * Optional grouped options. When provided, group headers are rendered
   * between option blocks (each option still 36px). Takes precedence over
   * the flat `options` list.
   */
  groups?: NativeSelectGroup[]
  onChange?: (value: string) => void
  style?: Partial<StyleDesc>
}

/**
 * A **custom dropdown** — GPUix has no native `<select>` host element, so this
 * is a pill trigger + an anchored, scrollable option list (a `<virtual-list>`
 * with 36px rows, so long lists scroll per the GPUix scroller constraint).
 *
 * `groups` renders `MenuLabel`-style headers between option blocks.
 */
export function NativeSelect({ value, options, groups, onChange, style }: NativeSelectProps) {
  const t = useAdwaita()
  const { colors } = t
  const [open, setOpen] = useState(false)

  const allOptions = groups ? groups.flatMap((g) => g.options) : options
  const selected = allOptions.find((o) => o.value === value)

  // Build a flat list of 36px rows (options + optional group headers).
  const optionRow = (option: NativeSelectOption): ReactNode => {
    const isSelected = option.value === value
    return (
      <div
        key={option.value}
        onClick={() => {
          onChange?.(option.value)
          setOpen(false)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 36,
          padding: 8,
          cursor: 'pointer',
          backgroundColor: isSelected ? colors.accentTint : 'transparent',
          hover: { backgroundColor: colors.accentTint },
        }}
      >
        <T size="body" color={isSelected ? colors.accent : colors.fg}>
          {option.label}
        </T>
      </div>
    )
  }

  const groupHeader = (label: string): ReactNode => (
    <div key={'group-' + label} style={{ display: 'flex', alignItems: 'center', height: 36, padding: 8 }}>
      <T size="caption" color={colors.dim_fg}>
        {label}
      </T>
    </div>
  )

  const rows: ReactNode[] = []
  if (groups) {
    for (const g of groups) {
      rows.push(groupHeader(g.label))
      for (const o of g.options) rows.push(optionRow(o))
    }
  } else {
    for (const o of options) rows.push(optionRow(o))
  }

  return (
    <div style={style}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        style={selectTriggerStyle(t)}
      >
        <T size="body" color={selected ? colors.fg : colors.dim_fg}>
          {selected?.label ?? 'Select…'}
        </T>
        <Icon name="chevronDown" size={14} color={colors.dim_fg} />
      </div>

      {/* Anchored, scrollable options list (virtual-list = the only scroller) */}
      {open ? (
        <anchored side="bottom" align="start" gap={4}>
          <div style={listPanelStyle(t, { display: 'flex', flexDirection: 'column', padding: 2 })}>
            <virtual-list estimatedItemHeight={36} style={{ maxHeight: 200, width: '100%' }}>
              {rows}
            </virtual-list>
          </div>
        </anchored>
      ) : null}
    </div>
  )
}
