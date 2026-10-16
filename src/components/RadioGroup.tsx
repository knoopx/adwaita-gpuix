import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { T } from './common'

interface RadioGroupContextValue { value: string; onValueChange: (value: string) => void }
const RadioGroupCtx = createContext<RadioGroupContextValue | null>(null)
function useRadioGroup(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupCtx)
  return ctx ?? { value: '', onValueChange: () => {} }
}

export interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  /** Uncontrolled mode: when `value` is undefined, the group starts here. */
  defaultValue?: string
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A vertical group of radio buttons (column, gap 8).
 * Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 */
export function RadioGroup({ value, onValueChange, defaultValue, children, style }: RadioGroupProps) {
  const [internal, setInternal] = useState<string>(defaultValue ?? value ?? '')
  const current = value ?? internal

  const handleValueChange = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }

  return (
    <RadioGroupCtx.Provider value={{ value: current, onValueChange: handleValueChange }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>{children}</div>
    </RadioGroupCtx.Provider>
  )
}

export interface RadioGroupItemProps {
  value: string
  disabled?: boolean
  /**
   * Optional label rendered as a sibling `T` (8px gap). GPUix has no
   * `htmlFor`, so association is structural (the label is a sibling of the
   * circle inside this item).
   */
  label?: string
  style?: Partial<StyleDesc>
}

/**
 * An 18px radio circle. Selected = ring + accent inner dot. An optional
 * `label` renders as a sibling text (flex row, gap 8). Selecting calls the
 * parent RadioGroup's onValueChange via context.
 */
export function RadioGroupItem({ value, disabled, label, style }: RadioGroupItemProps) {
  const t = useAdwaita()
  const { colors } = t
  const group = useRadioGroup()
  const selected = group.value === value

  const circle = (
    <div
      onClick={disabled ? undefined : () => group.onValueChange(value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: colors.accent,
        backgroundColor: colors.view_bg,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        hover: disabled ? undefined : { backgroundColor: hexToRgba(colors.accent, 0.08) },
        flexShrink: 0,
        ...style,
      }}
    >
      {selected ? (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.accent,
          }}
        />
      ) : null}
    </div>
  )

  if (label === undefined) return circle

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1 }}>
      {circle}
      <T size="body" color={colors.fg}>
        {label}
      </T>
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
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

export const RadioGroupShot: ComponentShot = {
  name: 'RadioGroup',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label={'Selection (controlled, value="b")'}>
        <ShotItem label="group">
          <RadioGroup value="b" onValueChange={() => {}}>
            <RadioGroupItem value="a" label="Option A" />
            <RadioGroupItem value="b" label="Option B (selected)" />
            <RadioGroupItem value="c" label="Option C" />
          </RadioGroup>
        </ShotItem>
      </Row>
      <Row label="Disabled item">
        <ShotItem label="group">
          <RadioGroup value="a" onValueChange={() => {}}>
            <RadioGroupItem value="a" label="Selected" />
            <RadioGroupItem value="b" label="Disabled" disabled />
          </RadioGroup>
        </ShotItem>
      </Row>
      <Row label={'Uncontrolled (defaultValue="c")'}>
        <ShotItem label="group">
          <RadioGroup defaultValue="c" onValueChange={() => {}}>
            <RadioGroupItem value="a" label="Option A" />
            <RadioGroupItem value="c" label="Option C (default selected)" />
          </RadioGroup>
        </ShotItem>
      </Row>
    </div>
  ),
}
